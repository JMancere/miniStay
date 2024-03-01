'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      );
      Booking.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      );
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {}
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {}
    },
    startDate: {
      type: DataTypes.DATE,
      validate: {}
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {}
    },
  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        exclude: ["userId", "id", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      isOwner: {
        attributes: {
          //exclude: ["createdAt", "updatedAt"]
        }
      },
    }
});
  return Booking;
};
