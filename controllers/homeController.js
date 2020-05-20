const Categorias = require('../models/Categorias')

exports.home = async (req, res) => {

    //crear promesa para hacer muchas consultas al mismo tiempo ya que no tienen que esperarse entre ellas por no estar relacionadas
    const consultas = []
    consultas.push(Categorias.findAll({}))

    //extraer y pasar a la vista
    const [categorias] = await Promise.all(consultas)

    res.render('home', {
        nombrePagina: 'Inicio',
        categorias
    })
}