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
        url: 'https://mp-cache-assets-production.izea.com/ai/p6mbarvope6o2a28fixx0c44nwql_watermark.png',
        reviewId: 1
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/ek7flfg5sm51lwfi3knx42tva1ht_watermark.png',
        reviewId: 2
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/g394hugywp3fa6bhtejw8keuhy27_watermark.png',
        reviewId: 3
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/p9nbv2bf0gmcvl97odbdi6iryyyo_watermark.png',
        reviewId: 3
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/be1qso49ej2wv9tbpsfrkxzq3vf4_watermark.png',
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
