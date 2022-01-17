const Sequelize = require('sequelize');

const sequelize = new Sequelize('express-tut', 'root', '', { dialect: 'mysql' });

module.exports = sequelize;