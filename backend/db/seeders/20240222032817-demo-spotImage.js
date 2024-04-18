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
        url: 'https://mp-cache-assets-production.izea.com/ai/pxmarx7hgp5bxyvy76jhl5wiw303_watermark.png',
        preview: true,
        spotId: 1
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/gst8hkn7ab501xnz133w3zs2khhc_watermark.png',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/0vsilkfei4f1qb7udm3wcze7kt6c_watermark.png',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/hu3irp9a5935yrj8mrpklljufabz_watermark.png',
        preview: true,
        spotId: 2
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/xi7yz9rthwlb21gqdxkwail8839o_watermark.png',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/1v7h7sob4ftxmynjh7v149kzr64a_watermark.png',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/ma6wbdqivqwudu3llwfhmf3o413q_watermark.png',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://mp-cache-assets-production.izea.com/ai/cb4jcd2koh0uf6l50k12hl8ke74w_watermark.png',
        preview: true,
        spotId: 5
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
