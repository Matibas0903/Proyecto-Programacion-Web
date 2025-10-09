

const inputNombre = document.getElementById('nombre');
const errorNombre = document.getElementById('errorNombre');

const inputEmail = document.getElementById('email');
const errorEmail = document.getElementById('errorEmail');

const inputContrasena = document.getElementById('contrasena');
const errorContrasena = document.getElementById('errorContrasena');

const inputFecha= document.getElementById('fecha');
const errorFecha= document.getElementById('errorFecha');


const botonValidar = document.getElementById('validar');

function validarNombre(){
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



validar.addEventListener('click', () => {
  const nombreValido= validarNombre();
  const emailValido= validarEmail();
  const contrasenaValida= validarContrasena();
  const fechaValida= validarFecha();

  //Modal
  if (nombreValido && emailValido && contrasenaValida && fechaValida) {
    const modal = new bootstrap.Modal(document.getElementById('registroExitoso'));
    modal.show();
    
    
   
    document.getElementById('registroForm').reset();

    //Para que se borren los is-valid
    [inputNombre, inputEmail, inputContrasena, inputFecha].forEach(input => {
      input.classList.remove('is-valid');
    });
  }

})
