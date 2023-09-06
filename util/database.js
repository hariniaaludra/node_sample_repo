
const Sequelize=require('sequelize');

const sequelize = new Sequelize('test', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports =sequelize;

