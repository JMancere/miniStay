const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');



const helper = async (spotId) => {
  let pi = await SpotImage.findAll(
      {
          where: {
            spotId,
            preview: true
          },
      }
    );
  if (pi.length > 0){
      console.log('11111111', pi[0].dataValues.url)
      return pi[0].dataValues.url;
  } else
    return ""
}

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');

//REQ AUTH - Get Reviews of Current User
router.get('/current', requireAuth,
  async(req, res) => {

    let reviews = await Review.findAll(
      {
          where: {userId: req.user.id},
          //include: ['Reviews', 'SpotImages', 'User']
          include: ['Spot', 'ReviewImages']
      }
  );

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
    //review.dataValues.Spot.dataValues.pi = 'asdasdasfbnoidfsgodihgldfsgsdfgop'
    //filter out spot stuff.
    //console.log('adasdasdasdasd',  review.dataValues.Spot)
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
    //let pi = helper(review.dataValues.Spot.dataValues.id)
    console.log(pi)
    if (pi.length > 0){
      review.dataValues.Spot.dataValues.preview = pi[0].dataValues.url
    } else
      review.dataValues.Spot.dataValues.preview = ''
  }


  // reviews.forEach(review => {
  //   review.dataValues.ReviewImages.forEach(s => {
  //         delete s.dataValues.reviewId
  //   })

  //   review.dataValues.User = {
  //     id:req.user.id,
  //     firstName:req.user.firstName,
  //     lastName:req.user.lastName
  //   };
  //   //review.dataValues.Spot.dataValues.pi = 'asdasdasfbnoidfsgodihgldfsgsdfgop'
  //   //filter out spot stuff.
  //   //console.log('adasdasdasdasd',  review.dataValues.Spot)
  //   delete review.dataValues.Spot.dataValues.description
  //   delete review.dataValues.Spot.dataValues.createdAt
  //   delete review.dataValues.Spot.dataValues.updatedAt

  //   //get previewimage.

  //   // let pi = await SpotImage.findAll(
  //   //   {
  //   //       where: {
  //   //         spotId: review.dataValues.Spot.dataValues.id,
  //   //         preview: true
  //   //       },
  //   //   }
  //   // );
  //   let pi = helper(review.dataValues.Spot.dataValues.id)
  //   //console.log(pi)
  //   review.dataValues.Spot.dataValues.pi = pi//'asdasdasfbnoidfsgodihgldfsgsdfgop'

  // });

// if (spots){
  //     const options = {previewImage: true, avgRating: true};
  //     calcPreviewAndAvgReview(spots, options);

  //     //Remove spotimages and reviews from resultset.
  //     spots.forEach(spot => {
  //         delete spot.dataValues.SpotImages
  //         delete spot.dataValues.Reviews
  //     });
  // }
  return res.json({
      reviews
  });


  }
);

//REQ AUTH - Create an Image for a Review
router.post('/:reviewId/images', requireAuth, stub,
  (req, res) => {}
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
