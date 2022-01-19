const { DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

// "cartItem" is the name of the magic method and the name of the table in lowercase
const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = CartItem;