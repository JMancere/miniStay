'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId'});
      Review.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      );
      Review.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      );
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      validate: {}
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {}
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {}
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {}
    },
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      attributes: {
        //exclude: ["createdAt", "updatedAt"]
      }
    },
    // scopes: {
    //   isOwner: {
    //     attributes: {
    //       //exclude: ["createdAt", "updatedAt"]
    //     }
    //   },
    // }
  });
  return Review;
};
