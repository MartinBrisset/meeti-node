const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const usuariosController = require('../controllers/usuariosController')

module.exports = () => {
    router.get('/', homeController.home);

    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)

    return router
}