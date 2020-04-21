const Sequelize = require('sequelize');
const db = require('../config/db');
const Meetis = require('./Meeti');

const Interesados = db.define('interesados', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    }, 
    nombre: Sequelize.STRING(100),
});
Interesados.belongsTo(Meetis); //relaciona las tablas

module.exports = Interesados;