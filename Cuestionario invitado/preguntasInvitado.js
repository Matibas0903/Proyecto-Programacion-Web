window.onload = function()
{

    const botonNombre = document.getElementById("btnJugar");
    const cardNombre = document.getElementById("micardNombre");

    botonNombre.addEventListener("click", async function(){
        const input = document.getElementById("nombreIngresado"); 
        const nombre = input.value.trim();
        const valido = await validarNombre(nombre);
        const version = new URLSearchParams(window.location.search).get('version');
        console.log('version recibida: '+version);
        //si el nombre es valido, voy a jugar
        if(valido && version){
          sessionStorage.setItem('nombreInvitado', nombre);
          window.location.href = `../jugar plantilla/jugarPlantilla.php?version=${version}&invitado=true`;
        }
    })

}

//valido el nombre ingresado
async function validarNombre(nombre) {
    const input = document.getElementById("nombreIngresado"); 
    const mensajeError = document.getElementById("mensajeError");
    const regex = /^[A-Za-z0-9_]+$/;
    if (!regex.test(nombre) || nombre.length < 5 || nombre.length > 14) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        mensajeError.textContent = 'El nombre debe tener entre 5 y 14 caracteres y solo puede contener letras, números y guiones bajos.';
        return false;
    } else {
        try {
            const response = await fetch(`../BaseDeDatos/controladores/verificarNombreInvitado.php?nombre=${nombre}`);
            const result = await response.json();

            if (result.status === 'success' && result.disponible) {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
                mensajeError.textContent = '';
                return true;
            } else {
                input.classList.add("is-invalid");
                input.classList.remove("is-valid");
                mensajeError.textContent = 'El nombre ya está en uso. Por favor, elija otro.';
                return false;
            }
        } catch (error) {
            mostrarMensajeError('Error al verificar el nombre');
            return false;
        }
    }
}

function mostrarMensajeError(mensaje){
    const toastEl = document.getElementById('toast_mensaje_error');
    const toastBody = document.getElementById('mensaje_error');
    toastBody.innerText = mensaje || 'Ups, ocurrió un error inesperado';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
