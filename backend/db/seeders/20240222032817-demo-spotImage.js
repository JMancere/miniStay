'use strict';

const { SpotImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        url: 'http://demo.io/Fake1',
        preview: false,
        spotId: 1
      },
      {
        url: 'http://demo.io/Fake1P',
        preview: false,
        spotId: 1
      },
      {
        url: 'http://demo.io/Fake2',
        preview: false,
        spotId: 2
      },
      {
        url: 'http://demo.io/Fake2P',
        preview: true,
        spotId: 2
      },
      {
        url: 'http://demo.io/Fake3',
        preview: false,
        spotId: 3
      },
      {
        url: 'http://demo.io/Fake3P',
        preview: true,
        spotId: 3
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
