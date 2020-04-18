const Categorias = require('../models/Categorias')
const Grupos = require('../models/Grupos')
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

const configMulter = {
    limits : {fileSize:100000},
    storage: fileStorage = multer.diskStorage({
        destination:(req, file, next) => {
            next(null, __dirname+'/../public/uploads/grupos');
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

exports.formNuevoGrupo = async (req, res) => {
    const categorias = await Categorias.findAll()
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}

exports.nuevoGrupo = async (req, res) => {
    //validar campos

    const grupo = req.body
    grupo.usuarioId = req.user.id
    //leer imagen del mdlwr
    if (req.file) {
        grupo.imagen = req.file.filename;
    }
    
    try {
        await Grupos.create(grupo)
        req.flash('exito', 'Se creo un nuevo grupo')
        res.redirect('administracion')
    } catch (error) {
        console.log(error);
        const errores = error.errors.map(err => err.message) //es un array por eso hay que mapearla
        req.flash('error', errores)
        res.redirect('/nuevo-grupo')
    }
}

exports.formEditarGrupo = async (req, res) => {
    // const grupo = await Grupos.findByPk(req.params.grupoId)
    // const categorias = await Categorias.findAll()

    const consultas = [];
    consultas.push( Grupos.findByPk(req.params.grupoId) )
    consultas.push( Categorias.findAll() )

    //se juntan las consultas a la bd para que las haga el mismo tiempo y asi ganar tiempo
    //si las dejas con await, la segunda consulta va a esperar a la primera. Y en este caso la segunda consulta no depende de la primera, pueden ejecutarse a la vez

    const[grupo, categorias] = await Promise.all(consultas) //ejectuta la promer con await y guarda en las variables los resultados. Poner las variables en el mismo orden que las consultas

    res.render('editar-grupo',{
        nombrePagina:`Editar grupo: ${grupo.nombre}`,
        grupo,
        categorias
    })
}

exports.editarGrupo = async (req, res) => {
    const grupo = await Grupos.findOne({where: { id: req.params.grupoId, usuarioId: req.user.id }})

    if(!grupo){
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    const {nombre, descripcion, categoriaId, url} = req.body;

    //asignar los valores y guardarlos
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    await grupo.save();
    req.flash('exito','Cambios guardados')
    return res.redirect('/administracion')
}

exports.formEditarImagen = async (req, res) => {
    const grupo = await Grupos.findOne({where: { id: req.params.grupoId, usuarioId: req.user.id }})

    res.render('imagen-grupo',{
        nombrePagina: `Editar imagen del grupo: ${grupo.nombre}`,
        grupo
    })
}

exports.editarImagen = async (req, res) => {
    const grupo = await Grupos.findOne({where: { id: req.params.grupoId, usuarioId: req.user.id }})

    if (!grupo) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    //si hay imagen vieja e imagen nueva, borrar la vieja
    if (req.file && grupo.imagen) {
        const imagenAnteriorPath = __dirname+`/../public/uploads/grupos/${grupo.imagen}`;

        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return
        })
    }

    //si hay una nueva imagen, la guardamos
    if (req.file) {
        grupo.imagen = req.file.filename
        await grupo.save()
        req.flash('exito', 'Imagen actualizada')
    }

    return res.redirect(`/imagen-grupo/${grupo.id}`)
}

exports.formEliminarGrupo = async (req, res) => {
    const grupo = await Grupos.findOne({where: { id: req.params.grupoId, usuarioId: req.user.id }})

    if (!grupo) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    res.render('eliminar-grupo', {
        nombrePagina: `Eliminar Grupo: ${grupo.nombre}`
    })
}

exports.eliminarGrupo = async (req, res) => {
    const grupo = await Grupos.findOne({where: { id: req.params.grupoId, usuarioId: req.user.id }})
    if (!grupo) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    //si hay imagen la borra
    if (grupo.imagen) {
        const imagenAnteriorPath = __dirname+`/../public/uploads/grupos/${grupo.imagen}`;

        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return
        })
    }

    await Grupos.destroy({
        where: { id: req.params.grupoId }
    })

    req.flash('exito', 'Grupo eliminado')
    return res.redirect('/administracion')

}