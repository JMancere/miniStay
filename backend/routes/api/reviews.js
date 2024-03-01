const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { body } = require('express-validator');

const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { ReviewImage } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');

//REQ AUTH - Get Reviews of Current User
router.get('/current', requireAuth,
  async(req, res) => {

    let reviews = await Review.findAll(
      {
          where: {userId: req.user.id},
          include: ['Spot', 'ReviewImages']
      }
    );

    //forEach does not allow await calls. must use regular loop.
    for (let i = 0; i < reviews.length - 1; i++){
      const review = reviews[i];
      review.dataValues.ReviewImages.forEach(s => {
        delete s.dataValues.reviewId
      })

      review.dataValues.User = {
        id:req.user.id,
        firstName:req.user.firstName,
        lastName:req.user.lastName
      };
      delete review.dataValues.Spot.dataValues.description
      delete review.dataValues.Spot.dataValues.createdAt
      delete review.dataValues.Spot.dataValues.updatedAt

      //get previewimage.

      let pi = await SpotImage.findAll(
        {
            where: {
              spotId: review.dataValues.Spot.dataValues.id,
              preview: true
            },
        }
      );
      if (pi.length > 0){
        review.dataValues.Spot.dataValues.preview = pi[0].dataValues.url
      } else
        review.dataValues.Spot.dataValues.preview = ''
    }

    return res.json({
        reviews
    });
  }
);

const validateReviewImg = [
  body('url')
      .exists({ checkFalsy: true })
      .withMessage('URL is required'),
  body('url')
      .isLength({ max: 255 })
      .withMessage('Street address is required'),
  handleValidationErrors
];
//1 created spot 16
//user4 added review 9 for spot 16.

//REQ AUTH - Create an Image for a Review
router.post('/:reviewId/images', requireAuth, validateReviewImg,
  async (req, res) => {
    const {reviewId, url} = req.body

    let reviews = await Review.findAll(
      {
          where: {userId: req.user.id, id: reviewId},
          include: ['Spot', 'ReviewImages']
      }
    );

    if (reviews.length === 0){
      res.statusCode = 404
      return res.json({
        "message": "Review couldn't be found"
      })
    }
    if (reviews[0].dataValues.ReviewImages.length >= 10){
      res.statusCode = 403
      return res.json({
        "message": "Maximum number of images for this resource was reached"
      })
    }

    const ri = await ReviewImage.create({reviewId, url})

    res.statusCode = 200;
    return res.json({
      id: ri.id,
      url
    });

  }
);

//REQ AUTH - Edit a Review
router.put('/:reviewId', requireAuth, stub,
  (req, res) => {}
);

//REQ AUTH - Delete a Review
router.delete('/:reviewId', requireAuth, stub,
  (req, res) => {}
);

module.exports = router;
