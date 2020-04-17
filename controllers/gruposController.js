const Categorias = require('../models/Categorias')
const Grupos = require('../models/Grupos')
const multer = require('multer')
const shortid = require('shortid')

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
    const grupo = await Grupos.findByPk(req.params.grupoId)
    console.log(grupo);

    res.render('editar-grupo',{
        nombrePagina:`Editar grupo: ${grupo.nombre}`,
        grupo
    }
    )
}