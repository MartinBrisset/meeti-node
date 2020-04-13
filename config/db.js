const Sequelize = require('sequelize');

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
  host: process.env.BD_HOST,
  dialect: 'mysql',
  port: process.env.BD_PORT,
  operatorsAliases: 0,
  define: {
      timestamps: true //agrega la columba de fecha creacion y fecha modificacion
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging:false //oculta la consulta sql en la consola
});

module.exports = db;