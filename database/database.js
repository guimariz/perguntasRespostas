const Sequelize = require('sequelize');

const connection = new Sequelize('pergrespostas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = connection;
