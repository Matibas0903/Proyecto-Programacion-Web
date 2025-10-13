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

// Funciones de validación


// Nombre
function validarNombre(input) {
  const valor = input.value.trim();
  const valido = valor.length >= 5 && valor.length <= 14;

  input.classList.toggle("is-invalid", !valido);
  input.classList.toggle("is-valid", valido);

  return valido;
}
//Email
function validarEmail(input){
  const valorEmail = input.value.trim();
  const condicionEmail = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

  const valido = condicionEmail.test(valorEmail);
  input.classList.toggle("is-invalid", !valido);
  input.classList.toggle("is-valid", valido);

  return valido;
}
//Contraseña
function validarContrasena(input){
  const valor = input.value.trim();
  const re = /^[A-Za-z0-9_]{6,8}$/;
  const valido = re.test(valor);

  input.classList.toggle("is-invalid", !valido);
  input.classList.toggle("is-valid", valido);

  return valido;
}

//Nacimiento
function validarFecha(input){
  const valor = input.value;
  const valido = valor !== "";

  input.classList.toggle("is-invalid", !valido);
  input.classList.toggle("is-valid", valido);

  return valido;
}

//Foto
function validarFoto(select) {
  const valor = select.value;
  const valido = valor !== "";

  select.classList.toggle("is-invalid", !valido);
  select.classList.toggle("is-valid", valido);

  return valido;
}



function guardarCambios() {
  const form = document.getElementById("editarForm");
  const fotoSelect = document.getElementById("fotoSelect");
  const nombreInput = document.getElementById("nombreNuevo");
  const emailInput = document.getElementById("emailNuevo");
  const contrasenaInput = document.getElementById("contrasenaNueva");
  const fechaInput = document.getElementById("fechaNueva");
  const preview = document.getElementById("vistaPreviaFoto");
  const validarBtn = document.getElementById("validarBoton");

  if (!form) return;
   

  //Validar en el momento
  nombreInput.addEventListener("input", () => validarNombre(nombreInput));
  emailInput.addEventListener("input", () => validarEmail(emailInput));
  contrasenaInput.addEventListener("input", () => validarContrasena(contrasenaInput));
  fechaInput.addEventListener("input", () => validarFecha(fechaInput));
  fotoSelect.addEventListener("change", () => validarFoto(fotoSelect));

  // Boto Guardar cambios
  validarBtn.addEventListener("click", () => {
    const nombreValido = validarNombre(nombreInput);
    const emailValido = validarEmail(emailInput);
    const contrasenaValida = validarContrasena(contrasenaInput);
    const fechaValida = validarFecha(fechaInput);
    const fotoValida = validarFoto(fotoSelect);

    if (!nombreValido || !emailValido || !contrasenaValida || !fechaValida || !fotoValida) return;

    // Actualizar datos visualmente
    preview.src = fotoSelect.value;

    // Mostrar modal Bootstrap
    const modal = new bootstrap.Modal(document.getElementById("edicionExitosa"));
    modal.show();

    // Resetear formulario y limpiar
    form.reset();
    [nombreInput, emailInput, contrasenaInput, fechaInput, fotoSelect].forEach(input => {
      input.classList.remove("is-valid");
    });
  });
}



document.addEventListener("DOMContentLoaded", () => {
  vistaPrevia();
  guardarCambios();
});