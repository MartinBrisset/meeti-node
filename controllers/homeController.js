const Categorias = require('../models/Categorias')
const Meeti = require('../models/Meeti')
const Grupos = require('../models/Grupos')
const Usuarios = require('../models/Usuarios')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.home = async (req, res) => {

    //crear promesa para hacer muchas consultas al mismo tiempo ya que no tienen que esperarse entre ellas por no estar relacionadas
    const consultas = []
    consultas.push(Categorias.findAll({}))
    //consulta a bd, campos concretos de la tabla, solo de fecha actual en adelante, solo 3 registros, ordenados de forma ascendente, relacionado con los grupo y el usuario
    consultas.push(Meeti.findAll({attributes: ['slug', 'titulo', 'fecha', 'hora'], where: { fecha: {[Op.gte] : moment(new Date()).format("YYYY-MM-DD")}}, limit:3, order: [['fecha','ASC']], include: [ {model: Grupos, attributes: ['imagen']},{ model: Usuarios, attributes: ['nombre', 'imagen']}]}))

    //extraer y pasar a la vista
    const [categorias, meetis] = await Promise.all(consultas)

    res.render('home', {
        nombrePagina: 'Inicio',
        categorias,
        meetis,
        moment
    })
}