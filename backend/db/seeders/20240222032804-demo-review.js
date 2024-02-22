'use strict';

const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 4,
        spotId: 1,
        review: 'spot1great',
        stars: 4
      },
      {
        userId: 4,
        spotId: 2,
        review: 'spot2great',
        stars: 4
      },
      {
        userId: 4,
        spotId: 3,
        review: 'spot3great',
        stars: 4
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
