const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');
const { SpotImage } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

//REQ AUTH - Delete a Spot Image
router.delete('/:imageId', requireAuth,
  async (req, res) => {
    const {imageId} = req.params

    if (imageId === undefined){
        const err = new Error("Spot Image couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let imgs = await SpotImage.findAll(
      {
          where: {id: imageId},
          include: ['Spot']
      }
    );

    if (imgs.length === 0){
      res.statusCode = 404
      return res.json({
        "message": "Spot Image couldn't be found"
      })
    }
    const img = imgs[0]

    if (img.dataValues.Spot.dataValues.ownerId != req.user.id){
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
