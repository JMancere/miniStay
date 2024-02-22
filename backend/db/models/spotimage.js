'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      );
    }
  }
  SpotImage.init({
    url: {
      type: DataTypes.STRING,
      validate: {}
    },
    preview: {
      type: DataTypes.BOOLEAN,
      validate: {}
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {}
    },
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
  });
  return SpotImage;
};
