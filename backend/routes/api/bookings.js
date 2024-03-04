const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');

const { body } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { stub } = require('../../utils/utils');
const { Booking } = require('../../db/models');
const { SpotImage } = require('../../db/models');

//REQ AUTH - Get All Current User's Bookings
router.get('/current', requireAuth,
  async (req, res) => {
    let bookings = await Booking.scope('isOwner').findAll(
      {
          where: {userId: req.user.id},
          include: ['Spot']
      }
    );

    let count = 0;
    //forEach does not allow await calls. must use regular loop.
    for (let i = 0; i < bookings.length ; i++){
      const booking = bookings[i];

      delete booking.dataValues.Spot.dataValues.description
      delete booking.dataValues.Spot.dataValues.createdAt
      delete booking.dataValues.Spot.dataValues.updatedAt

      //get previewimage.
      let pi = await SpotImage.findAll(
        {
            where: {
              spotId: booking.dataValues.Spot.dataValues.id,
              preview: true,
            },
        }
      );
      if (pi.length > 0){
        booking.dataValues.Spot.dataValues.previewImage = pi[0].dataValues.url
      } else
        booking.dataValues.Spot.dataValues.previewImage = ''
    }

    const Bookings = bookings;
    return res.json({
        Bookings
    });
  }
);

const validateEditBooking = [
  body('startDate')
    .optional()
    .exists({ checkFalsy: true })
    .isISO8601().toDate()
    .withMessage('startDate is required'),
  body('endDate')
    .optional()
    .exists({ checkFalsy: true })
    .isISO8601().toDate()
    .withMessage('endDate is required'),
  handleValidationErrors
];
//REQ AUTH - Edit a Booking
router.put('/:bookingId', requireAuth, validateEditBooking,
  async (req, res) => {
    const {bookingId} = req.params;
    if (bookingId === undefined){
      const err = new Error("Booking couldn't be found");
      err.title = "Resource Not Found";
      err.status = 404;
      throw err;
    }

    let bookings = await Booking.scope('isOwner').findAll(
        {
            where: {id: bookingId},
        }
    );

    if (!bookings || bookings.length === 0){
        const err = new Error("Booking couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }
    const booking = bookings[0]

    if (booking.dataValues.userId !== req.user.id) {
      const err = new Error("Forbidden.");
      err.title = "Resource Not Found";
      err.status = 403;
      throw err;
    }

    let newStart = booking.dataValues.startDate
    let newEnd = booking.dataValues.endDate
    const spotId = booking.dataValues.spotId;

    //Error response: Can't edit a booking that's past the end date
    //Status Code: 403
    if (new Date() >newEnd){
      const err = new Error("Past bookings can't be modified");
      //err.title = "Resource Not Found";
      err.status = 403;
      throw err;
    }

    const {startDate, endDate} = req.body

    if (startDate) {
      newStart = startDate;
    }
    if (endDate) {
      newEnd = endDate;
    }

    let booking_ = await Booking.findAll({
      where: {
        id: {
          [Op.not]: booking.dataValues.id
        },
        spotId,
        startDate:{
          [Op.lte]: new Date(newStart)
        },
        endDate:{
          [Op.gte]: new Date(newStart),
        }
      }
    });

    const errors = {};
    let hasErrors = false;

    /* Error response: Body validation errors
       tatus Code: 400
    */

    if (new Date(newStart) < new Date()) {
      hasErrors = true;
      errors["startDate"] = "startDate cannot be in the past";
    }

    if (new Date(newStart) >= new Date(newEnd)) {
      hasErrors = true;
      errors["endDate"] = "endDate cannot be on or before startDate";
    }

    if (hasErrors){
      res.statusCode = 400;
      return res.json({
        //message: "Sorry, this spot is already booked for the specified dates",
        message: "Bad Request",
        errors: errors,
        });
    }

    /* Error response: Booking conflict
       tatus Code: 403
    */
    if (booking_.length > 0){
      hasErrors = true;
      errors["startDate"] = "Start date conflicts with an existing booking";
    }

    booking_ = await Booking.findAll({
      where: {
        id: {
          [Op.not]: booking.dataValues.id
        },
        spotId,
        startDate:{
          [Op.lte]: new Date(newEnd)
        },
        endDate:{
          [Op.gte]: new Date(newEnd),
        }
      }
    });

    if (booking_.length > 0){
      hasErrors = true;
      errors["endDate"] = "End date conflicts with an existing booking";
    }

    booking_ = await Booking.findAll({
      where: {
        id: {
          [Op.not]: booking.dataValues.id
        },
        spotId,
        startDate:{
          [Op.between]: [new Date(newStart), new Date(newEnd)]
        },
      }
    });

    if (booking_.length > 0){
      hasErrors = true;
      errors["startDate"] = "Start date conflicts with an existing booking";
    }

    if (hasErrors){
      res.statusCode = 403;
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: errors,
        });
    }



    if (startDate) booking.startDate = startDate;
    if (endDate) booking.endDate = endDate;

    await booking.save();

    return res.json(booking);
  }
);

//REQ AUTH - Delete a Booking
router.delete('/:bookingId', requireAuth,
  async (req, res) => {
    const {bookingId} = req.params

    if (bookingId === undefined){
        const err = new Error("Booking couldn't be found");
        err.title = "Resource Not Found";
        err.status = 404;
        throw err;
    }

    let bookings = await Booking.scope('isOwner').findAll(
      {
        where: {id: bookingId},
      }
    );

    if (bookings.length === 0){
      res.statusCode = 404
      return res.json({
        "message": "Booking couldn't be found"
      })
    }

    const booking = bookings[0]

    if (booking.dataValues.userId !== req.user.id) {
      const err = new Error("Forbidden.");
      err.title = "Resource Not Found";
      err.status = 403;
      throw err;
    }

    let start = booking.dataValues.startDate;
    if (new Date() > start){
      res.statusCode = 403
      return res.json({
        "message": "Bookings that have been started can't be deleted"
      })
    }
    await booking.destroy();

    return res.json(
      {
        message: "Successfully deleted"
    });
  }
);

module.exports = router;
