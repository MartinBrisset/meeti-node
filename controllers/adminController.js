const Sequelize = require('sequelize')
const moment = require('moment')
const Grupos = require('../models/Grupos')
const Meeti = require('../models/Meeti')
const Interesados = require('../models/Interesados')
const Op = Sequelize.Op;

exports.panelAdministracion = async (req, res) => {
    //como mostramos datos de tablas diferentes, ponemos las consultas en un array y ejecutamos las consultas al mismo tiempo con una promesa. Ya que ninguna consulta necesita esperar por la otra
    //consultas
    const consultas = []
    consultas.push( Grupos.findAll({where: {usuarioId: req.user.id }}) ) //grupos
    consultas.push( Meeti.findAll({where: {usuarioId: req.user.id, fecha: { [Op.gte] : moment(new Date()).format("YYYY-MM-DD")} }, order: [['fecha', 'DESC']]}) ) //mmetis proximos
    consultas.push( Meeti.findAll({where: {usuarioId: req.user.id, fecha: { [Op.lt] : moment(new Date()).format("YYYY-MM-DD")} }}) ) //meetis pasados

    const [grupos, meeti, meetiAnt] = await Promise.all(consultas); //aca el mismo tiempo ejectura las promesas y las guarda en las constantes el resultado
    // const interesados = await Interesados.findAll({where: {meetiId: meeti.id}})

    // if(!interesados) {
    //     interesados = 0
    // }



    res.render('administracion', {

        nombrePagina: 'Panel de Administracion',
        moment,
        grupos,
        meeti,
        meetiAnt,
        // interesados
    })
}