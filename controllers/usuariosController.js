const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')


const configMulter = {
    limits : {fileSize:100000},
    storage: fileStorage = multer.diskStorage({
        destination:(req, file, next) => {
            next(null, __dirname+'/../public/uploads/perfiles');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null,`${shortid.generate()}.${extension}`) //generar nombre del archivo con el id y la extension
        }
    }),
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //el formato es valido
            next(null, true);
        } else {
            // el formato no es valido
            next(new Error('Formato no válido'), false);
            return
        }
    }
}

const upload = multer(configMulter).single('imagen') //imagen es el nombre del input


exports.subirImagen = (req, res, next) => {
    upload(req, res, (error) => {
        if(error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande, maximo 100kb')
                } else {
                    req.flash('error', error.message)
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message)
            }
            res.redirect('back')
            return
        } else {
            next()
        }
    })
}

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    })
}

exports.crearCuenta = async (req, res) => {
    const info = req.body
    //checkear si la password son iguales
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

exports.formEditarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id)

    return res.render('editar-perfil', {
        nombrePagina:'Editar Perfil',
        usuario
    })
}

exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id)

    const {nombre, descripcion, email} = req.body;

    usuario.nombre = nombre;
    usuario.descripcion = descripcion;
    usuario.email = email;

    await usuario.save()
    req.flash('exito', 'Usuario actualizado')
    return res.redirect('/administracion')
}

exports.formSubirImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id)

    return res.render('imagen-perfil', {
        nombrePagina: 'Subir imagen de perfil',
        usuario
    })
}

exports.subirImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id)

    if (!usuario) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    //si hay imagen vieja e imagen nueva, borrar la vieja
    if (req.file && usuario.imagen) {
        const imagenAnteriorPath = __dirname+`/../public/uploads/perfiles/${usuario.imagen}`;

        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return
        })
    }

    //si hay una nueva imagen, la guardamos
    if (req.file) {
        usuario.imagen = req.file.filename
        await usuario.save()
        req.flash('exito', 'Imagen actualizada')
    }

    return res.redirect('/administracion')
}