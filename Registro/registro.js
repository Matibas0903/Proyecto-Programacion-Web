window.onload = function(){
  vistaPrevia();
  const botonValidar = document.getElementById("validar");
  

  botonValidar.addEventListener('submit', validarForm);
}

function validarForm(e){
   //Modal
  if (!validarNombre() && !validarEmail() && !validarContrasena() && !validarFecha()) {
    e.preventDefault();
    }
}

// Vista previa dinámica de la imagen
function vistaPrevia() {
  const fotoSelect = document.getElementById("fotoSelect");
  const preview = document.getElementById("vistaPreviaFoto");

  if (!fotoSelect || !preview) return;

  fotoSelect.addEventListener("change", (e) => {
    const nuevaFoto = e.target.value;
    preview.src = nuevaFoto;
  });
}

function validarNombre(){
    const inputNombre = document.getElementById('nombre');
    const valorNombre = inputNombre.value.trim();

    if (valorNombre.length < 5 || valorNombre.length > 14) {
        inputNombre.classList.add('is-invalid');
        return false;
    } else {
        inputNombre.classList.remove('is-invalid');
        inputNombre.classList.add('is-valid');
        return true;
    }
};

function validarEmail(){
  const inputEmail = document.getElementById('email');
  const valorEmail= inputEmail.value.trim();
  const condicionEmail= /^[A-Za-z0-9._%+-]+@gmail\.com$/;

  if (!condicionEmail.test(valorEmail)) {
    inputEmail.classList.add('is-invalid');
    return false;
  } else {
    inputEmail.classList.remove('is-invalid');
    inputEmail.classList.add('is-valid');
    return true;
  }
}

function validarContrasena(){
  const inputContrasena = document.getElementById('contrasena');
  const valorContrasena= inputContrasena.value.trim();
  const condicionContrasena= /^[A-Za-z0-9_]{6,8}$/;

  if (!condicionContrasena.test(valorContrasena)) {
    inputContrasena.classList.add('is-invalid');
    return false;
  } else {
    inputContrasena.classList.remove('is-invalid');
    inputContrasena.classList.add('is-valid');
    return true;
  }
}

function validarFecha(){
    const inputFecha= document.getElementById('fecha');
    const valorFecha = inputFecha.value;

    if (!valorFecha) {
        inputFecha.classList.add('is-invalid');
        return false;
        }
        else{
        inputFecha.classList.remove('is-invalid');
        inputFecha.classList.add('is-valid');
        return true;
      }
}




