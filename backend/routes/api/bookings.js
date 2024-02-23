const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');

//REQ AUTH - Get All Current User's Bookings
router.get('/current', requireAuth, stub,
    (req, res) => {}
);

//REQ AUTH - Edit a Booking
router.put('/:bookingId', requireAuth, stub,
    (req, res) => {}
);

//REQ AUTH - Delete a Booking
router.delete('/:bookingId', requireAuth, stub,
    (req, res) => {}
);

module.exports = router;
