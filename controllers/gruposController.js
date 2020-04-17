const Categorias = require('../models/Categorias')
const Grupos = require('../models/Grupos')
const multer = require('multer')
const shortid = require('shortid')

const configMulter = {
    storage: fileStorage = multer.diskStorage({
        destination:(req, file, next) => {
            next(null, __dirname+'/../public/uploads/grupos');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null,`${shortid.generate()}.${extension}`) //generar nombre del archivo con el id y la extension
        }
    })
}

const upload = multer(configMulter).single('imagen') //imagen es el nombre del input


exports.subirImagen = (req, res, next) => {
    upload(req, res, (error) => {
        if(error) {
            //manejar error - pendiente
            console.log(error);
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
