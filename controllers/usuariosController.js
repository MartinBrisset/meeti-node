const Usuarios = require('../models/Usuarios')

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    })
}

exports.crearCuenta = async (req, res) => {
    const info = req.body

    try {
        const usuario = await Usuarios.create(info);
        console.log(usuario);
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message) //mapear objeto de errores y hace retunr de un array
        
        req.flash('error', erroresSequelize);
        res.redirect('/crear-cuenta')
    }

    // pendinete - enviar mensaje con flash y redireccionar

}