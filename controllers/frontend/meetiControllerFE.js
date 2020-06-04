const Meeti = require('../../models/Meeti')
const Grupos = require('../../models/Grupos')
const Usuarios = require('../../models/Usuarios')
const Interesados = require('../../models/Interesados')
const moment = require('moment')

exports.mostrarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({where: {
        slug: req.params.slug
    }, include : [ {
        model: Grupos
    },{
        model: Usuarios,
        attributes: ['id','nombre','imagen']
    }]})

    //si no existe
    if(!meeti) {
        return res.redirect('/')
    }

    meetiIdActual = meeti.id;

    const interesados = await Interesados.findAll({where: {meetiId : meetiIdActual}})

    //pasar resultado a la vista

    return res.render('mostrar-meeti',{
        nombrePagina: meeti.titulo,
        meeti,
        moment,
        interesados    
    })
}

exports.confirmarAsistencia = async (req, res) => {
    return;
    const interesados = Interesados;
    //buscar id del meeti por slug
    slug = req.params.slug;
    meeti = await Meeti.findOne({where: {slug}});
    //guardar en tabla de interesados
    interesados.usuarioId = req.user.id
    interesados.meetiId = meeti.id

    await Interesados.create(interesados);

    res.send('Has confirmado tu asistencia')

}