window.onload = function() {
    const botonIngresar = document.getElementById("btingresar");
    const spinnerContainer = document.getElementById("spinnerContainer");

<<<<<<< Updated upstream
    // cuando se ingresa el codigo,y si es valido, muestro el cargando...
    botonIngresar.addEventListener("click", function() {
=======
    // cuando se ingresa el codigo,y si es valido, muestro el cargando
    botonIngresar.addEventListener("click", async function() {
>>>>>>> Stashed changes
        if (validarCodigo()) { 
            mostrarSpinner();
            setTimeout(() => {
                ocultarSpinner();  //muestro el spiner por 2 seg y lo oculto 
                // Redirigir a la página de preguntas
                window.location.href = "../Cuestionario invitado/preguntasInvitado.html";
            }, 2000); 
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






