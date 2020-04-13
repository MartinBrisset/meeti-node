require('./config/config');
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const router = require('./routes/index')
const db = require('./config/db')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')

//cargar modelos
require('./models/Usuarios')

//conectarse a bd
db.sync()
    .then(() => console.log('Conectado a la bd'))
    .catch(error => console.log(error));

//arrancar express
const app = express();

app.use(morgan('dev')); //muestra la ruta en la consola
app.use(express.json()); //recibir datos json
app.use(express.urlencoded({extended:true})); //recibe datos, archivos, etc

//agregar template engine
app.set('view engine', 'ejs')

//ubicacion de las vistas
app.use(expressLayouts)
app.set('views', path.join(__dirname, './views'))

//archivos publicos y estaticos
app.use(express.static('public'))

//habilitar cookie parser
app.use(cookieParser())

//crear sesiones
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

//agrega los mensajes flash
app.use(flash())

//middlewares propios
//usuario logeado, mensajes flash, fecha actual
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear()
    
    next()
})

//rutas
app.use('/', router())

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})
