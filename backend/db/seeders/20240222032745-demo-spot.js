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
        description: 'spot1Descrip',
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
        description: 'spot2Descrip',
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
        description: 'spot3Descrip',
        price: '300.03'
      },
      {
        ownerId: 4,
        address: 'add4',
        city: 'city4',
        state: 'state4',
        country: 'country4',
        lat: 4,
        lng: 4,
        name: 'Spot4',
        description: 'spot4Descrip',
        price: '400.04'
      },
      {
        ownerId: 1,
        address: 'add1',
        city: 'city1',
        state: 'state1',
        country: 'country1',
        lat: 1,
        lng: 1,
        name: 'Spot1.1',
        description: 'spot1.1Descrip',
        price: '100.01'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
