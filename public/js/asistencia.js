import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const asistencia = document.querySelector('#confirmar-asistencia');

    if (asistencia) {
        asistencia.addEventListener('submit', confirmarAsistencia);
    }

});

function confirmarAsistencia(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirmar-asistencia input[type="subrmit"]');

    axios.post(this.action)
        .then(respuesta => {
            console.log(respuesta);
        })
}