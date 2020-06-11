import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const asistencia = document.querySelector('#confirmar-asistencia');

    if (asistencia) {
        asistencia.addEventListener('submit', confirmarAsistencia);
    }

});

function confirmarAsistencia(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirmar-asistencia input[type="submit"]');
    let accion = document.querySelector('#accion').value;
    const mensaje = document.querySelector('#mensaje');

    //limpia respuesta anterior
    while(mensaje.firstChild) {
        mensaje.removeChild(mensaje.firstChild);
    }

    //obtiene el valor cancelar o confirmar
    const datos = {
        accion
    }

    axios.post(this.action, datos)
        .then(respuesta => {
            if (accion === 'confirmar') {
                //modificar los elementos del boton
                document.querySelector('#accion').value = 'cancelar';
                btn.value = 'No ir';
                btn.classList.remove('btn-azul');
                btn.classList.add('btn-rojo');
            } else {
                //modificar los elementos del boton
                document.querySelector('#accion').value = 'confirmar';
                btn.value = 'Si';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');               
            }
            mensaje.appendChild(document.createTextNode(respuesta.data));
        })
}