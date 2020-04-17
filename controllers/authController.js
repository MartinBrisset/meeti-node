const passport = require('passport')


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Llena el formulario'
})

//ver si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next) => {
    //esto es una funcion que trae passport
    if(req.isAuthenticated()) { //si retorna true, existe la sesion
        return next()
    } 

    //si no tiene la sesion
    return res.redirect('/iniciar-sesion')
}