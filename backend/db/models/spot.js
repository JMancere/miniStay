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
      Spot.hasMany(models.Review);
      Spot.hasMany(models.Booking);
      Spot.belongsTo(
        models.User,
        { foreignKey: 'ownerId'
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
      validate: {}
    },
    price: {
      type: DataTypes.FLOAT,
      validate: {}
    },
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
  });
  return Spot;
};
