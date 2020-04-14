const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')

module.exports = () => {
    router.get('/', homeController.home);

    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario, usuariosController.iniciarSesion)

    return router
}