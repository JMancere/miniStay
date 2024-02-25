const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
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
                where: {OwnerId: req.user.id},
                include: ['Reviews', 'SpotImages', 'Users']
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
    let spots = await Spot.findAll(
        {
            where: {id: spotId},
            include: ['Reviews', 'SpotImages']
        }
    );

    if (!spots || spots.length === 0){
        const err = new Error(`Spot does not exist with id ${spotId}.`);
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
router.get('/:spotId/reviews', stub,
    (req, res) => {}
);


//REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', requireAuth, stub,
    (req, res) => {}
);

//REQ AUTH - Edit a Spot
router.put('/:spotId', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Create a Spot
router.post('/', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Create a Booking
router.post('/:spotId/bookings', requireAuth, stub,
     (req, res) => {}
);

//REQ AUTH - Delete a Spot
router.delete('/:spotId', requireAuth, stub,
    (req, res) => {}
);


module.exports = router;
