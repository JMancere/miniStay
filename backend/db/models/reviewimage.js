'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImage.belongsTo(
        models.Review,
        { foreignKey: 'reviewId' }
      );
    }
  }
  ReviewImage.init({
    url: {
      type: DataTypes.STRING,
      validate: {}
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {}
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
  });
  return ReviewImage;
};
