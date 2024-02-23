const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');

//REQ AUTH - Get Reviews of Current User
router.get('/current', requireAuth, stub,
    (req, res) => {}
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
