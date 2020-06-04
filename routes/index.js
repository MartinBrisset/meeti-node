const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const gruposController = require('../controllers/gruposController')
const meetiController = require('../controllers/meetiController')
const meetiControllerFE = require('../controllers/frontend/meetiControllerFE')

module.exports = () => {
    router.get('/', homeController.home);

    //muestra un meeti
    router.get('/meeti/:slug', meetiControllerFE.mostrarMeeti)

    //asistencia a meeti
    router.post('/confirmar-asistencia/:slug', meetiControllerFE.confirmarAsistencia)

    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario, usuariosController.iniciarSesion)

    //cerrar sesion
    router.get('/cerrar-sesion', authController.usuarioAutenticado, authController.cerrarSesion)

    //administracion
    router.get('/administracion',authController.usuarioAutenticado, adminController.panelAdministracion)

    //nuevo grupo
    router.get('/nuevo-grupo', authController.usuarioAutenticado, gruposController.formNuevoGrupo)
    router.post('/nuevo-grupo', authController.usuarioAutenticado, gruposController.subirImagen, gruposController.nuevoGrupo)

    //editar grupos
    router.get('/editar-grupo/:grupoId', authController.usuarioAutenticado, gruposController.formEditarGrupo)
    router.post('/editar-grupo/:grupoId', authController.usuarioAutenticado, gruposController.editarGrupo)
    router.get('/imagen-grupo/:grupoId', authController.usuarioAutenticado, gruposController.formEditarImagen)
    router.post('/imagen-grupo/:grupoId', authController.usuarioAutenticado, gruposController.subirImagen, gruposController.editarImagen)

    //borrar grupos
    router.get('/eliminar-grupo/:grupoId', authController.usuarioAutenticado, gruposController.formEliminarGrupo)
    router.post('/eliminar-grupo/:grupoId', authController.usuarioAutenticado, gruposController.eliminarGrupo)

    //nuevo meeti
    router.get('/nuevo-meeti', authController.usuarioAutenticado, meetiController.formNuevoMeeti)
    router.post('/nuevo-meeti', authController.usuarioAutenticado, meetiController.sanitizarMeeti, meetiController.nuevoMeeti)

    //editar meeti
    router.get('/editar-meeti/:id', authController.usuarioAutenticado, meetiController.formEditarMeeti)
    router.post('/editar-meeti/:id', authController.usuarioAutenticado, meetiController.editarMeeti)

    //elminar meeti
    router.get('/eliminar-meeti/:id', authController.usuarioAutenticado, meetiController.formEliminarMeeti)
    router.post('/eliminar-meeti/:id', authController.usuarioAutenticado, meetiController.eliminarMeeti)

    //editar perfil
    router.get('/editar-perfil', authController.usuarioAutenticado, usuariosController.formEditarPerfil)
    router.post('/editar-perfil', authController.usuarioAutenticado, usuariosController.editarPerfil)

    //imagenes de perfil
    router.get('/imagen-perfil', authController.usuarioAutenticado, usuariosController.formSubirImagenPerfil)
    router.post('/imagen-perfil', authController.usuarioAutenticado, usuariosController.subirImagen, usuariosController.subirImagenPerfil)

    return router
}