const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Products = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  img_url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price:Sequelize.DOUBLE
});

module.exports=Products;