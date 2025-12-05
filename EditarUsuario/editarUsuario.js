// Vista previa de la imagen seleccionada
function vistaPrevia() {
  const fotoSelect = document.getElementById("fotoSelect");
  const preview = document.getElementById("vistaPreviaFoto");
  if (!fotoSelect || !preview) return;
  preview.src = fotoSelect.value;
  fotoSelect.addEventListener("change", (e) => {
    preview.src = e.target.value;
  });
}
// Validaciones
function validarNombre(input) {
  const valor = input.value.trim();
  const valido = valor === "" || (valor.length >= 5 && valor.length <= 14);
  input.classList.toggle("is-invalid", !valido && valor !== "");
  input.classList.toggle("is-valid", valido && valor !== "");
  return valido;
}
function validarEmail(input) {
  const valorEmail = input.value.trim();

  const valido =
    valorEmail === "" ||
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(valorEmail);

  input.classList.toggle("is-invalid", !valido && valorEmail !== "");
  input.classList.toggle("is-valid", valido && valorEmail !== "");

  return valido;
}

function validarContrasena(input) {

  const valor = input.value.trim();
  const valido = valor === "" || /^[A-Za-z0-9_]{6,8}$/.test(valor);
  input.classList.toggle("is-invalid", !valido && valor !== "");
  input.classList.toggle("is-valid", valido && valor !== "");
  return valido;
}
function validarFecha(input) {
  const valor = input.value.trim();

  if (valor === "") {
    input.classList.remove("is-invalid", "is-valid");
    return true;
  }

  // Convertir a fecha sin validar formato
  const fechaIngresada = new Date(valor);
  const hoy = new Date();

  const valido = fechaIngresada <= hoy;

  input.classList.toggle("is-invalid", !valido);
  input.classList.toggle("is-valid", valido);

  return valido;
}

function validarFoto(select) {
  const valor = select.value;
  const valido = valor !== "";
  select.classList.toggle("is-invalid", !valido);
  select.classList.toggle("is-valid", valido);


  return valido;

  fetch("traerDatos.php")
    .then(res => res.json())
    .then(data => {
      if (data.NOMBRE) nombre.value = data.NOMBRE;
      if (data.EMAIL) mail.value = data.EMAIL;
      if (data.FECHA_NACIMIENTO)
        fechaNacimiento.value = data.FECHA_NACIMIENTO.split(" ")[0];

      if (data.FOTO_PERFIL && data.FOTO_PERFIL.trim() !== "") {
        fotoPerfil.src = data.FOTO_PERFIL;
        fotoSelect.value = data.FOTO_PERFIL;  // selecciona la opción correcta
        if (preview) preview.src = data.FOTO_PERFIL;

        fotoInicial = data.FOTO_PERFIL; // guardamos la foto inicial
          console.log("FOTO_PERFIL recibido:", data.FOTO_PERFIL);
      } else {
        fotoInicial = fotoSelect.value; // si no hay foto guardada
      }
    })
    .catch(err => console.error("Error al cargar datos:", err));

}



function guardarCambios() {
  const form = document.getElementById("editarForm");
  const nombreInput = document.getElementById("nombreNuevo");
  const emailInput = document.getElementById("emailNuevo");
  const contrasena1 = document.getElementById("contrasenaNueva");
  const contrasena2 = document.getElementById("contrasenaNueva2");
  const fechaInput = document.getElementById("fechaNueva");
  const fotoSelect = document.getElementById("fotoSelect");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el form se envíe solo

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const pass1 = contrasena1.value.trim();
    const pass2 = contrasena2.value.trim();
    const fecha = fechaInput.value.trim();
    const foto = fotoSelect.value;

    // Validar contraseñas (solo si se completan)
    let contrasenaValida = true;
    if (pass1 || pass2) {
      contrasenaValida = validarContrasena(contrasena1) && pass1 === pass2;
      if (!contrasenaValida) {
        contrasena2.classList.add("is-invalid");
        return;
      }
    }

    const nombreValido = validarNombre(nombreInput);
    const emailValido = validarEmail(emailInput);
    const fechaValida = validarFecha(fechaInput);
    const fotoValida = validarFoto(fotoSelect);

    if (!nombreValido || !emailValido || !fechaValida || !fotoValida || !contrasenaValida) {
      return;
    }

    // Armar objeto con los campos modificados
    const datos = {};
   if (nombre !== "") datos.nombre = nombre;
    if (email !== "") datos.mail = email;
    if (pass1 !== "") datos.contrasena = pass1;
    if (fecha !== "") datos.fechaNacimiento = fecha;

    // SIEMPRE ENVIAR LA FOTO:
    datos.fotoPerfil = fotoSelect.value;


    try {
      const res = await fetch("GuardarDatosNuevos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

        const result = await res.json();

  // contenedor del mensaje del backend
    const contenedorErrores = document.getElementById("mensajeBackend");
    contenedorErrores.innerHTML = ""; // limpio primero
    if (!result.exito) {
        contenedorErrores.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${result.mensaje}
            </div>
        `;
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");


        return;
    }

    //sii salió bien, muestro el modal
    const modal = new bootstrap.Modal(document.getElementById('edicionExitosa'));
    modal.show();

    // Resetear formulario y limpiar
    form.reset();
    [nombreInput, emailInput, contrasenaInput, fechaInput, fotoSelect].forEach(input => {
      input.classList.remove("is-valid");
    });
     } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  });
}


// Inicializar todo
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosInput();
  vistaPrevia();
  guardarCambios();
});