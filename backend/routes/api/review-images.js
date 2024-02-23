const express = require('express');
const router = express.Router();
// const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');


//REQ AUTH - Delete a Review Image
router.delete('/:imageId', requireAuth, stub,
    (req, res) => {}
);

module.exports = router;
