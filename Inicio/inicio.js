window.onload = function(){
    //verifico si se redirije con error
    const mensaje = sessionStorage.getItem('mensajeError');
    if (mensaje) {
        mostrarMensajeError(mensaje);
        sessionStorage.removeItem('mensajeError');
    }
}

function mostrarMensajeError(mensaje){
    const toastEl = document.getElementById('toast_mensaje_error');
    const toastBody = document.getElementById('mensaje_error');
    toastBody.innerText = mensaje || 'Ups, ocurrio un error inesperado';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}