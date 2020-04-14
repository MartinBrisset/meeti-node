const passport = require('passport')
const localStrategi = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios')

passport.use(new localStrategi({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, next) => {
        //esto se ejecuta al llenar el formulario
        const usuario = await Usuarios.findOne({where: {email}})

        //revisar si existe
        if (!usuario) {
            return next(null, false, {
                message: 'Ese usuario no existe'
            })
        }
        //si el user existe, compara la password
        const verificarPassword = usuario.validarPassword(password, this.password)
        //si no coincide...
        if (!verificarPassword) {
            return next(null, false, {
                message: 'Password Incorrecto'
            })
        }
       //pero si coincide, pasa sl siguiente 
        return next(null, usuario)
    }    
))

passport.serializeUser(function(usuario, cb) {
    cb(null, usuario)
});
passport.deserializeUser(function(usuario, cb){
    cb(null, usuario)
})

module.exports = passport;