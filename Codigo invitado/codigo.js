window.onload = function() {
    const botonIngresar = document.getElementById("btingresar");
    const spinnerContainer = document.getElementById("spinnerContainer");
    const miForm = document.getElementById("miform");

    // cuando se ingresa el codigo,y si es valido, muestro el cargando...
    botonIngresar.addEventListener("click", async function() {
        if (validarCodigo()) { 
            mostrarSpinner();
            //Consultar a base de datos
            const inputCodigo = document.getElementById("codigoIngresado");
            const codigo = inputCodigo.value.trim();
            try {
                const response = await fetch(`../BaseDeDatos/controladores/getVersionByCode.php?codigo=${codigo}`);
                const result = await response.json();
                if(result.status === 'success'){
                    ocultarSpinner();
                    // Redirigir a la página de preguntas
                    sessionStorage.setItem('codigoVersion', codigo);
                    window.location.href = `../Cuestionario invitado/preguntasInvitado.php?version=${result.data.ID_VERSION}`;
                }
                else if(result.status === 'error'){
                  redirigirConError(result.message || 'Error al obtener el cuestionario');
                }
            } catch (error) {
              redirigirConError('Error al obtener el cuestionario')
            }
        }
    });
}

// Mostrar spinner y deshabilitar botón
function mostrarSpinner() {
    const spinner =document.getElementById("spinnerContainer");
    spinner.classList.remove("d-none");
    const btn =document.getElementById("btingresar");  
    btn.disabled = true;
}

// Ocultar spinner y habilitar botón 
function ocultarSpinner() {
    const spinner =document.getElementById("spinnerContainer")
    spinner.classList.add("d-none");
    const btn=document.getElementById("btingresar")
    btn.disabled = false;
}

// Validacion del código del juego
function validarCodigo() {   
  const inputCodigo = document.getElementById("codigoIngresado");
  const codigo = inputCodigo.value.trim();
  const regex = /^\d{6,10}$/; // Verificar que tenga al menos 6 dígitos y solo números
    
  if (!regex.test(codigo)) {
      inputCodigo.classList.add("is-invalid");
      inputCodigo.classList.remove("is-valid");
      return false;
 } else {
      inputCodigo.classList.remove("is-invalid");
      inputCodigo.classList.add("is-valid");
      return true;
 }
}

function redirigirConError(errorMensaje){
      sessionStorage.setItem('mensajeError', errorMensaje);
      window.location.href = "../Inicio/inicio.php";
}






