'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(models.Review, { foreignKey: 'spotId'});
      Spot.hasMany(models.Booking, { foreignKey: 'spotId'});
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId'});
      Spot.belongsTo(
        models.User,
        { foreignKey: 'ownerId',
        }
      );
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {}
    },
    address: {
      type: DataTypes.STRING,
      validate: {}
    },
    city: {
      type: DataTypes.STRING,
      validate: {}
    },
    state: {
      type: DataTypes.STRING,
      validate: {}
    },
    country: {
      type: DataTypes.STRING,
      validate: {}
    },
    lat: {
      type: DataTypes.FLOAT,
      validate: {}
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {}
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {}
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {}
    },
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        //exclude: ["createdAt", "updatedAt"]
      }
    },
  });
  return Spot;
};
