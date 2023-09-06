const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const CartItem = require('../models/cart-item');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});

module.exports = Cart;