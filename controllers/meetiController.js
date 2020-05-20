const Grupos = require('../models/Grupos')
const Meeti = require('../models/Meeti')
const moment = require('moment')

exports.formNuevoMeeti = async (req, res) => {

    const grupos = await Grupos.findAll({where: { usuarioId: req.user.id}})

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear un Nuevo Meeti',
        grupos
    })
}

exports.nuevoMeeti = async (req, res) => {
    //objetener los datos del front - datos ya sanitizados por el mdwr
    const meeti = req.body

    meeti.usuarioId = req.user.id;

    if(req.body.cupo === ''){
        meeti.cupo = 0
    }

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

exports.sanitizarMeeti = (req, res, next) => {
    //capturar datos
    const datos = req.body;

    //sanitizar datos - pendiente

    next()
}

exports.formEditarMeeti = async (req, res) => {
    const consultas = []
    consultas.push( Grupos.findAll({ where: { usuarioId : req.user.id } }) )
    consultas.push( Meeti.findByPk(req.params.id) )

    const [grupos, meeti] = await Promise.all(consultas)

    if (!grupos || !meeti) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    res.render('editar-meeti', {
        nombrePagina: `Editar Meeti: ${meeti.titulo}`,
        grupos,
        meeti
    })
}

exports.editarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({ where: {id: req.params.id, usuarioId: req.user.id }})

    if (!meeti) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }
    
    //asiganar los valores
    const {grupoId, titulo, invitado, fecha, hora, cupo, descripcion, direccion, ciudad, pais} = req.body;

    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.fecha = fecha;
    meeti.hora = hora;
    meeti.cupo = cupo;
    meeti.descripcion = descripcion;
    meeti.direccion = direccion;
    meeti.ciudad = ciudad;
    meeti.pais = pais;


    //almacenar en bd
    await meeti.save();

    req.flash('exito','Cambios guardados correctamente')
    return res.redirect('/administracion')
}

exports.formEliminarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({where: { id: req.params.id, usuarioId: req.user.id}})

    if (!meeti) {
        req.flash('error', 'Operacion no valida')
        return res.redirect('/administracion')
    }

    //mostrar vista
    return res.render('eliminar-meeti', {
        nombrePagina: `Eliminar Meeti: ${meeti.titulo}`
    })
}

exports.eliminarMeeti = async (req, res) => {
    await Meeti.destroy({where:{id: req.params.id}});

    req.flash('exito', 'Meeti eliminado');
    return res.redirect('/administracion');
}