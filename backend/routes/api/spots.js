const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');

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

//REQ AUTH - Get Spots of Current User
router.get('/current', requireAuth, stub,
    (req, res) => {}
);

//REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', requireAuth, stub,
    (req, res) => {}
);

//REQ AUTH - Delete a Spot
router.delete('/:spotId', requireAuth, stub,
    (req, res) => {}
);


module.exports = router;
