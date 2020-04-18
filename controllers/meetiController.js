const Grupos = require('../models/Grupos')

exports.formNuevoMeeti = async (req, res) => {

    const grupos = await Grupos.findAll({where: { usuarioId: req.user.id}})

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear un Nuevo Meeti',
        grupos
    })
}

exports.nuevoMeeti = async (req, res) => {

}