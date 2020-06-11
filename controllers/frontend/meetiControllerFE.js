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

    const { accion } = req.body

    if (accion === 'confirmar') {
        //agregar el usuario
        const interesados = Interesados;
        //buscar id del meeti por slug
        slug = req.params.slug;
        meeti = await Meeti.findOne({where: {slug}});
        //guardar en tabla de interesados
        interesados.usuarioId = req.user.id
        interesados.meetiId = meeti.id
    
        await Interesados.create(interesados);
        
        return res.send('Has confirmado tu asistencia')
    } else {
        //borrar el usuario
        const interesados = Interesados;
        //buscar id del meeti por slug
        slug = req.params.slug;
        meeti = await Meeti.findOne({where: {slug}});
        //guardar en tabla de interesados
        interesados.usuarioId = req.user.id
        interesados.meetiId = meeti.id
    
        await Interesados.destroy({where: {usuarioId: req.user.id, meetiId: meeti.id}});
        return res.send('Has quitado la confirmacion a tu asistencia')
        
    }

}

exports.mostrarAsistentes = async (req, res) => {
    //consultar a bd para capturar id del meeti
    const meeti = await Meeti.findOne({where: {slug: req.params.slug}, attributes: ['id']})
    //consultas a bd tabla de asistentes para mostrar los de ese meeti
    const interesados = await Interesados.findAll({where: {meetiId: meeti.id}})
    console.log(interesados);
    //mandar vista
}