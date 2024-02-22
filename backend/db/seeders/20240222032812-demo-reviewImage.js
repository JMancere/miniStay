'use strict';

const { ReviewImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        url: 'http://demo.io/Fake1',
        reviewId: 1
      },
      {
        url: 'http://demo.io/Fake2',
        reviewId: 2
      },
      {
        url: 'http://demo.io/Fake3',
        reviewId: 3
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
