const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root', 'tda1515abc',{
    host: 'localhost', 
    dialect: 'mysql'
});

module.exports = connection;