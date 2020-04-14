const nodemailer = require('nodemailer')
const fs = require('fs')
const util = require('util')
const ejs = require('ejs')

let transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

exports.enviarEmail = async (opciones) => {
    //leer el archivo para el mail
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`

    //compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'))

    //crear el html
    const html = compilado({url:opciones.url})

    //configurar las opciones
    const opcionesEmail = {
        from: 'Meeti <correo@martinbrisset.com>',
        to: opciones.info.email,
        subject: opciones.subject,
        html
    }

    //enviar el correo
    const enviarCorreo = util.promisify(transport.sendMail, transport)
    return enviarCorreo.call(transport, opcionesEmail)
}