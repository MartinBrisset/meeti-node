const Categorias = require('../models/Categorias')
const Grupos = require('../models/Grupos')

exports.formNuevoGrupo = async (req, res) => {
    const categorias = await Categorias.findAll()
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}

exports.nuevoGrupo = async (req, res) => {
    const grupo = req.body

    try {
        await Grupos.create(grupo)
        req.flash('exito', 'Se creo un nuevo grupo')
        res.redirect('administracion')
    } catch (error) {
        console.log(error);
        req.flash('error', error)
        res.redirect('/nuevo-grupo')
    }
}