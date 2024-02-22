'use strict';

const { Spot } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: 'add1',
        city: 'city1',
        state: 'state1',
        country: 'country1',
        lat: 1,
        lng: 1,
        name: 'Spot1',
        price: '100.01'
      },
      {
        ownerId: 2,
        address: 'add2',
        city: 'city2',
        state: 'state2',
        country: 'country2',
        lat: 2,
        lng: 2,
        name: 'Spot2',
        price: '200.02'
      },
      {
        ownerId: 3,
        address: 'add3',
        city: 'city3',
        state: 'state3',
        country: 'country3',
        lat: 3,
        lng: 3,
        name: 'Spot3',
        price: '300.03'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
