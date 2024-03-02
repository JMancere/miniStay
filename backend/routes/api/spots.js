const express = require('express');
const router = express.Router();
 const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');
const { Booking } = require('../../db/models');
const {ReviewImage} = require('../../db/models');
const {SpotImage} = require('../../db/models');
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
router.get('/:spotId', //(req, res, next) => {req.temp = 'WOW'; next();},
  async (req, res) => {

    //console.log('yytytytytytyt', req.temp)
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
    bookings.forEach(booking => {
        //Are we the owner of this spot?
        //const isOwner = req.user.id === booking.dataValues.Spot.dataValues.ownerId;

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
    const spot = await Spot.create({
      address, city, state, country, lat, lng, name, description, price, ownerId: req.user.id,
      });

    //Created.
    res.statusCode = 201;
    return res.json({
        spot
    });
   }
);

const validateSpotImg = [
  //const {, , , , , name, description, price} = req.body
  body('url')
      .exists({ checkFalsy: true })
      .withMessage('URL is required'),
  body('url')
      .isLength({ max: 255 })
      .withMessage('Street address is required'),
  body('preview')
      //.exists({ checkFalsy: true })
      .isBoolean()
      .withMessage('Preview is required'),
  handleValidationErrors
];

//REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', requireAuth, validateSpotImg,
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
    const spot = spots[0]

    if (spot.dataValues.ownerId !== req.user.id) {
      const err = new Error("User not authorized.");
      err.title = "Resource Not Found";
      err.status = 401;
      throw err;
    }

    const {url, preview} = req.body

    const ri = await SpotImage.create({
      url, preview, spotId
      });

    delete ri.dataValues.spotId
    delete ri.dataValues.updatedAt
    delete ri.dataValues.createdAt

    return res.json({
      ri
  });

  }
);

const validateCreateBooking = [
  body('startDate')
      .exists({ checkFalsy: true })
      .isISO8601().toDate()
      .withMessage('startDate is required'),
  body('endDate')
      .exists({ checkFalsy: true })
      .isISO8601().toDate()
      .withMessage('endDate is required'),
  handleValidationErrors
];
//REQ AUTH - Create a Booking
router.post('/:spotId/bookings', requireAuth, validateCreateBooking,
  async (req, res, next) => {
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
    const spot = spots[0]

    if (spot.dataValues.ownerId === req.user.id) {
      const err = new Error("User not authorized.");
      err.title = "Resource Not Found";
      err.status = 401;
      throw err;
    }

    const {startDate, endDate} = req.body
    //We've already validated that start and end exist.

    const errors = {};
    let hasErrors = false;
    if (new Date(startDate) < new Date()) {
      hasErrors = true;
      errors["startDate"] = "startDate cannot be in the past";
    }

    if (new Date(startDate) >= new Date(endDate)) {
      hasErrors = true;
      errors["endDate"] = "endDate cannot be on or before startDate";
    }

    if (hasErrors){
      res.statusCode = 400;
      return res.json({
        message: "Bad request",
        errors: errors,
        });
      }

    // Error response with status 403 is given when a booking already exists for
    // the spot on the specified dates

    let booking = await Booking.findAll({
      where: {
        spotId,
        startDate:{
          [Op.lte]: new Date(startDate)
        },
        endDate:{
          [Op.gte]: new Date(startDate),
        }
      }
    });
    console.log(booking, booking.length)

    if (booking.length > 0){
      hasErrors = true;
      errors["startDate"] = "Start date conflicts with an existing booking";
    }

    booking = await Booking.findAll({
      where: {
        spotId,
        startDate:{
          [Op.lte]: new Date(endDate)
        },
        endDate:{
          [Op.gte]: new Date(endDate),
        }
      }
    });

    if (booking.length > 0){
      hasErrors = true;
      errors["endDate"] = "End date conflicts with an existing booking";
    }

    if (hasErrors){
      res.statusCode = 403;
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: errors,
        });
    }

    booking = await Booking.create({
      spotId, userId: req.user.id, startDate, endDate
    });
    return res.json({
      booking
    });
  }
);

const validateReviewCreate = [
  //const {, , , , , name, description, price} = req.body
  body('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  body('review')
      .isLength({ max: 255 })
      .withMessage('Review text is required'),
  body('stars')
      .isInt()
      .custom(i => {
      return (i > 0 && i < 6)
  })
  .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];
//REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', requireAuth, validateReviewCreate,
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
  //const spot = spots[0]

  let reviews = await Review.findAll(
    {
      where: {spotId: spotId, userId: req.user.id},
      //include: ['ReviewImages', 'User']
    }
  );
  if (reviews.length > 0) {
    const err = new Error("User already has a review for this spot");
    err.title = "Resource Not Found";
    err.status = 403;
    throw err;
  }

  const {review, stars} = req.body

  const review_ = await Review.create({userId: req.user.id, spotId, review, stars})

  res.statusCode = 201;
  return res.json({
    review_
  });

  }
);

const validateEdit = [
  //const {, , , , , name, description, price} = req.body
  body('address')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
  body('address')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Street address is required'),
  body('city')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
  body('city')
      .optional()
      .isLength({ max: 255 })
      .withMessage('City is required'),
  body('state')
  .optional()
  .exists({ checkFalsy: true })
      .withMessage('State is required'),
  body('state')
  .optional()
  .isLength({ max: 255 })
      .withMessage('State is required'),
  body('country')
  .optional()
  .exists({ checkFalsy: true })
      .withMessage('Country is required'),
  body('lat')
  .optional()
  .isNumeric()
      .custom(lat => {
          return (lat >= -90 && lat <= 90)
  })
  .withMessage('Latitude must be within -90 and 90'),
  body('lng')
  .optional()
  .isNumeric()
      .custom(lng => {
      return (lng >= -180 && lng <= 180)
  })
  .withMessage('Longitude must be within -180 and 180'),
  body('name')
  .optional()
  .exists({ checkFalsy: true })
      .withMessage('Name is required'),
  body('name')
  .optional()
  .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
  body('description')
  .optional()
  .exists({ checkFalsy: true })
      .withMessage('Description is required'),
  body('price')
  .optional()
  .isNumeric()
      .custom(lng => {
      return (lng >= 0)
  })
  .withMessage("Price per day must be a positive number"),
  handleValidationErrors
];
//REQ AUTH - Edit a Spot
router.put('/:spotId', requireAuth, validateEdit,
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
    const spot = spots[0]

    if (spot.dataValues.ownerId !== req.user.id) {
      const err = new Error("User not authorized.");
      err.title = "Resource Not Found";
      err.status = 401;
      throw err;
    }

    const {address, city, state, country, lat, lng, name, description, price} = req.body
    if (address) spot.address = address;
    if (city) spot.city = city;
    if (state) spot.state = state;
    if (country) spot.country = country;
    if (lat) spot.lat = lat;
    if (lng) spot.lng = lng;
    if (name) spot.name = name;
    if (description) spot.description = description;
    if (price) spot.price = price;
    await spot.save();

    return res.json({
      spot
    });
  }
);

//REQ AUTH - Delete a Spot
router.delete('/:spotId', requireAuth,
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
    const spot = spots[0]

    if (spot.dataValues.ownerId !== req.user.id) {
      const err = new Error("User not authorized.");
      err.title = "Resource Not Found";
      err.status = 401;
      throw err;
    }

    await spot.destroy();

    return res.json(
      {
        message: "Successfully deleted"
    });
  }
);

module.exports = router;
