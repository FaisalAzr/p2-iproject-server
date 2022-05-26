'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Food.init({
   name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name cannot be empty"
        },
        notEmpty: {
          msg: "Name cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description cannot be empty"
        },
        notEmpty: {
          msg: "Description cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price cannot be empty"
        },
        notEmpty: {
          msg: "Price cannot be empty"
        },
        min: {
          args: 1000,
          msg: "Minimum price is Rp.1000"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};