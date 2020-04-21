const Grupos = require('../models/Grupos')
const Meeti = require('../models/Meeti')

exports.formNuevoMeeti = async (req, res) => {

    const grupos = await Grupos.findAll({where: { usuarioId: req.user.id}})

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear un Nuevo Meeti',
        grupos
    })
}

exports.nuevoMeeti = async (req, res) => {
    //objetener los datos del front
    const meeti = req.body

    meeti.usuarioId = req.user.id;

    if(req.body.cupo === ''){
        meeti.cupo = 0
    }


    // pendient - limpiar o sanitizar los datos antes de guardarlos

    //guardar en bd
    try {
       await Meeti.create(meeti);
       req.flash('exito', 'Se creo el meeti correctamente')
       return res.redirect('/administracion')
    } catch (error) {
        console.log(error);
        const errores = error.errors.map(err => err.message) //es un array por eso hay que mapearla
        req.flash('error', errores)
        return res.redirect('/nuevo-meeti')
    }
}