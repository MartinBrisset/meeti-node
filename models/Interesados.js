const Sequelize = require('sequelize');
const db = require('../config/db');
const Meetis = require('./Meeti');
const Usuarios = require('./Usuarios');

const Interesados = db.define('interesados', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
});
Interesados.belongsTo(Usuarios); //relaciona las tablas
Interesados.belongsTo(Meetis); //relaciona las tablas

module.exports = Interesados;