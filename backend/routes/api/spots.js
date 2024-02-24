const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');
 const { Spot } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');

//Get all Spots
router.get('/',
  async (req, res) => {
    let spots = await Spot.findAll();


    return res.json({
        spots
    });
  }
);

//Get details of a Spot from an id
router.get('/:spotId', stub,
  (req, res) => {
  }
);

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', stub,
    (req, res) => {}
);

//REQ AUTH - Get Spots of Current User
router.get('/current', requireAuth, stub,
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
