const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    })
}

exports.crearCuenta = async (req, res) => {
    const info = req.body
    //checkear si la password son iguales - pendiente
    if (info.password !== info.repetir) {
        req.flash('error', 'Las claves no son iguales');
        //si ocurre el error, enviar datos ya puestos y llenar el formulario - pendiente
        return res.redirect('/crear-cuenta')
    } else {
        try {
            await Usuarios.create(info); //crear usuario - devuelve error con el objeto o devuelve el usuario
            //generar url de confirmacion de correo
            const url = `http://${req.headers.host}/confirmar-cuenta/${info.email}`;
            //enviar el correo para confirmar el usuario
            await enviarEmail.enviarEmail({
                info,
                url,
                subject: 'Confirma tu cuenta de Meeti',
                archivo: 'confirmar-cuenta'
            })
            //como no devuelve ningun error, sigue aca. Manda mensaje de exito y redirecciona a iniciar sesion
            req.flash('exito', 'Debes confirmar tu cuenta por correo')
            return res.redirect('/iniciar-sesion')
        } catch (error) {
            const erroresSequelize = error.errors.map(error => error.message) //mapear objeto de errores y hace retunr de un array
            //si ocurre el error, enviar datos ya puestos y llenar el formulario - pendiente
            req.flash('error', erroresSequelize);
            return res.redirect('/crear-cuenta')
        }
    }
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({where:{email:req.params.correo}})
    //verificar que el correo existe
    if (!usuario) {
        req.flash('error','No existe esa cuenta')
        return res.redirect('/crear-cuenta')
    }
    //cambiar el estado del usuario a activo
    usuario.activo = 1;
    await usuario.save();
    //mandarlo a iniciar sesion
    req.flash('exito', 'Correo confirmado, inicia sesion')
    return res.redirect('/iniciar-sesion')
}

exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion'
    })
}

exports.iniciarSesion = async (req, res) => {
    const info = req.body;
    console.log(info);
}