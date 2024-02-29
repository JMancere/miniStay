const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');
const { Booking } = require('../../db/models');

 const { check, body } = require('express-validator');
 const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');


const calcPreviewAndAvgReview = (spots, option) => {
    spots.forEach(spot => {
        if (option.previewImage){
            const filter = spot.SpotImages.filter(si => {
                return si.preview;
            });
            if (filter.length > 0)
            spot.dataValues.previewImage = filter[0].url
            else
            spot.dataValues.previewImage = '';
        }

        let count = 0;
        let sum = 0;
        for (const review of spot.Reviews) {
            count++;
            sum += review.stars;
        }

        if (option.avgRating){
            if (count > 0)
                spot.dataValues.avgRating = sum/count
            else
                spot.dataValues.avgRating = 'none';
        }
        if (option.avgStarRating){
            if (count > 0)
                spot.dataValues.avgStarRating = sum/count
            else
                spot.dataValues.avgStarRating = 'none';
        }
    })

};

//Get all Spots
router.get('/',
  async (req, res) => {
    let spots = await Spot.findAll(
        {
            include: ['Reviews', 'SpotImages']
            //If you include the where clause it will only return spots that have preview.
            //So, if a spot does not have preview, it wont list. Which is not what we want.
            //include: ['Reviews', { model: SpotImage, where: {preview: true}}],
        }
    );
    if (spots){
        const options = {previewImage: true, avgRating: true};
        calcPreviewAndAvgReview(spots, options);

        //Remove spotimages and reviews from resultset.
        spots.forEach(spot => {
            delete spot.dataValues.SpotImages
            delete spot.dataValues.Reviews
        });
    }
    return res.json({
        spots
    });
  }
)

//REQ AUTH - Get Spots of Current User
router.get('/current', requireAuth,
    async (req, res) => {
        let spots = await Spot.findAll(
            {
                where: {ownerId: req.user.id},
                //include: ['Reviews', 'SpotImages', 'User']
                include: ['Reviews', 'SpotImages']
            }
        );

        if (spots){
            const options = {previewImage: true, avgRating: true};
            calcPreviewAndAvgReview(spots, options);

            //Remove spotimages and reviews from resultset.
            spots.forEach(spot => {
                delete spot.dataValues.SpotImages
                delete spot.dataValues.Reviews
            });
        }
        return res.json({
            spots
        });
    }
);

//Get details of a Spot from an id
router.get('/:spotId',
  async (req, res) => {
    const {spotId} = req.body
    if (spotId === undefined){
        const err = new Error("Spot couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }


    let spots = await Spot.findAll(
        {
            where: {id: spotId},
            include: ['Reviews', 'SpotImages']
        }
    );

    if (!spots || spots.length === 0){
        const err = new Error("Spot couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }
    spots[0].dataValues.numReviews = spots[0].Reviews.length;

    calcPreviewAndAvgReview(spots, {avgStarRating: true});

    spots.forEach(spot => {
        spot.dataValues.SpotImages.forEach(s => {
            delete s.dataValues.spotId
        })
        delete spot.dataValues.Reviews
    });
    spots[0].dataValues.Owner = {
        id:req.user.id,
        firstName:req.user.firstName,
        lastName:req.user.lastName
    };

    return res.json({
        spots
    });
  }
);

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews',
  async (req, res) => {
    const {spotId} = req.body

    if (spotId === undefined){
        const err = new Error("Spot couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let spots = await Spot.findAll(
        {
            where: {id: spotId},
        }
    );

    if (!spots || spots.length === 0){
        const err = new Error("Spot couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let reviews = await Review.findAll(
        {
            where: {spotId: spotId},
            include: ['ReviewImages', 'User']
        }
    );

    if (!reviews || reviews.length === 0){
        const err = new Error(`Reviews do not exist for spot ${spotId}.`);
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    //const NeededUsers = {};
    reviews.forEach(review => {
        review.dataValues.ReviewImages.forEach(s => {
            delete s.dataValues.reviewId
        })
        delete review.dataValues.User.dataValues.username;
    });

    return res.json({
        reviews
    });
  }
);


//REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', requireAuth,
  async (req, res) => {
    const {spotId} = req.body

    if (spotId === undefined){
        const err = new Error("Spot couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let spots = await Spot.findAll(
        {
            where: {id: spotId},
        }
    );

    if (!spots || spots.length === 0){
        const err = new Error("Spot couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    //console.log('111111', spots[0].dataValues.ownerId)
    const isOwner = req.user.id === spots[0].dataValues.ownerId;

    let bookings;

    if (isOwner)
        bookings = await Booking.scope('isOwner').findAll(
            {
                where: {spotId},
                //include: ['Spot', 'User']
                include: ['User']
            }
        );
    else {
        bookings = await Booking.findAll(
            {
                where: {spotId},
                //include: ['Spot', 'User']
                include: ['User']
            }
        );
    }
    //console.log('sdsdsdsdsds', bookings)
    bookings.forEach(booking => {
        //Are we the owner of this spot?
        //const isOwner = req.user.id === booking.dataValues.Spot.dataValues.ownerId;
        //console.log('111111', booking.dataValues.Spot.dataValues.ownerId)

        if (isOwner){
            delete booking.dataValues.User.dataValues.username;
        } else {
            delete booking.dataValues.User;
        }
    });


    return res.json({
        bookings
    });
   }
);

const validateCreate = [
    //const {, , , , , name, description, price} = req.body
    body('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    body('address')
        .isLength({ max: 255 })
        .withMessage('Street address is required'),
    body('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    body('city')
        .isLength({ max: 255 })
        .withMessage('City is required'),
    body('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    body('state')
        .isLength({ max: 255 })
        .withMessage('State is required'),
    body('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    body('lat')
        .isNumeric()
        .custom(lat => {
            return (lat >= -90 && lat <= 90)
    })
    .withMessage('Latitude must be within -90 and 90'),
    body('lng')
        .isNumeric()
        .custom(lng => {
        return (lng >= -180 && lng <= 180)
    })
    .withMessage('Longitude must be within -180 and 180'),
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required'),
    body('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    body('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    body('price')
        .isNumeric()
        .custom(lng => {
        return (lng >= 0)
    })
    .withMessage("Price per day must be a positive number"),
    handleValidationErrors
  ];
//REQ AUTH - Create a Spot
router.post('/', requireAuth, validateCreate,
  async (req, res) => {


    const {address, city, state, country, lat, lng, name, description, price} = req.body
    const s = await Spot.create({
      address, city, state, country, lat, lng, name, description, price, ownerId: req.user.id,
      });

    return res.json({
        s
    });
   }
);

//REQ AUTH - Create a Booking
router.post('/:spotId/bookings', requireAuth, stub,
     (req, res) => {}

);

//REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Edit a Spot
router.put('/:spotId', requireAuth, stub,
     (req, res) => {}
);


//REQ AUTH - Delete a Spot
router.delete('/:spotId', requireAuth, stub,
    (req, res) => {}
);


module.exports = router;
