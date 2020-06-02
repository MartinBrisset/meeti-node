const Meeti = require('../../models/Meeti')
const Grupos = require('../../models/Grupos')
const Usuarios = require('../../models/Usuarios')
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

    //pasar resultado a la vista

    return res.render('mostrar-meeti',{
        nombrePagina: meeti.titulo,
        meeti,
        moment    
    })

}