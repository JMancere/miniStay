const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');
const { ReviewImage } = require('../../db/models');


//REQ AUTH - Delete a Review Image
router.delete('/:imageId', requireAuth,
  async (req, res) => {
    const {imageId} = req.params

    if (imageId === undefined){
        const err = new Error("Review Image couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let imgs = await ReviewImage.findAll(
      {
          where: {id: imageId},
          include: ['Review']
      }
    );

    if (imgs.length === 0){
      res.statusCode = 404
      return res.json({
        "message": "Review  Image couldn't be found"
      })
    }
    const img = imgs[0]

    if (img.dataValues.Review.dataValues.userId != req.user.id){
      res.statusCode = 403
      return res.json({
        "message": "Forbidden"
      })
    }

    await img.destroy();

    return res.json(
      {
        message: "Successfully deleted"
    });
  }
);

module.exports = router;
