const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utils/database');

const CartItem = sequelize.define('cart-item', {
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