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
    for (let i = 0; i < reviews.length; i++){
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

    const Reviews = reviews;
    return res.json({
        Reviews
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
    const {reviewId} = req.params
    const {url} = req.body

    let reviews = await Review.findAll(
      {
        //where: {userId: req.user.id, id: reviewId},
        where: {id: reviewId},
        include: ['Spot', 'ReviewImages']
      }
    );

    if (reviews.length === 0){
      res.statusCode = 404
      return res.json({
        "message": "Review couldn't be found"
      })
    }

    if (reviews[0].dataValues.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.title = "Resource Not Found";
      err.status = 403;
      throw err;
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

const validateReviewEdit = [
  //const {, , , , , name, description, price} = req.body
  body('review')
    .optional()
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  body('review')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Review text is required'),
  body('stars')
    .optional()
    .isInt()
    .custom(i => {
    return (i > 0 && i < 6)
  })
  .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];
//REQ AUTH - Edit a Review
router.put('/:reviewId', requireAuth, validateReviewEdit,
  async (req, res) => {
    const {reviewId} = req.params
    if (reviewId === undefined){
      const err = new Error("Review couldn't be found");
      err.title = "Resource Not Found";
      err.status = 404;
      throw err;
    }

    let reviews = await Review.findAll(
        {
            where: {id: reviewId},
        }
    );

    if (!reviews || reviews.length === 0){
        const err = new Error("Review couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }
    const review_ = reviews[0]

    if (review_.dataValues.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.title = "Resource Not Found";
      err.status = 403;
      throw err;
    }

    const {review, stars} = req.body
    if (review) review_.review = review;
    if (stars) review_.stars = stars;
    await review_.save();

    return res.json(review_);
  }

);

//REQ AUTH - Delete a Review
router.delete('/:reviewId', requireAuth,
  async (req, res) => {
    const {reviewId} = req.params

    if (reviewId === undefined){
        const err = new Error("Review couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let reviews = await Review.findAll(
      {
          where: {id: reviewId},
          include: ['Spot', 'ReviewImages']
      }
    );

    if (reviews.length === 0){
      res.statusCode = 404
      return res.json({
        "message": "Review couldn't be found"
      })
    }

    const review = reviews[0]

    if (review.dataValues.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.title = "Resource Not Found";
      err.status = 403;
      throw err;
    }

    await review.destroy();

    return res.json(
      {
        message: "Successfully deleted"
    });
  }
);

module.exports = router;
