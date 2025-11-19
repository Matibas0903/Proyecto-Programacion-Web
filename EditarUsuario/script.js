// Vista previa de la imagen seleccionada
function vistaPrevia() {
  const fotoSelect = document.getElementById("fotoSelect");
  const preview = document.getElementById("vistaPreviaFoto");
  if (!fotoSelect || !preview) return;

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
  const valor = input.value.trim();
  const valido = valor === "" || /^[A-Za-z0-9._%+-]+@gmail\.com$/.test(valor);
  input.classList.toggle("is-invalid", !valido && valor !== "");
  input.classList.toggle("is-valid", valido && valor !== "");
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
  const valido = valor === "" || valor.length === 10;
  input.classList.toggle("is-invalid", !valido && valor !== "");
  input.classList.toggle("is-valid", valido && valor !== "");
  return valido;
}
function validarFoto(select) {
  const valor = select.value;
  const valido = valor !== "";
  select.classList.toggle("is-invalid", !valido);
  select.classList.toggle("is-valid", valido);
  return valido;
}

// Cargar datos actuales del usuario
function cargarDatosInput() {
  const nombre = document.getElementById("nombreNuevo");
  const mail = document.getElementById("emailNuevo");
  const fechaNacimiento = document.getElementById("fechaNueva");
  const fotoPerfil = document.getElementById("icono");

  fetch("traerDatos.php")
    .then(res => res.json())
    .then(data => {
      console.log("Datos recibidos:", data);
      if (data.NOMBRE) nombre.value = data.NOMBRE;
      if (data.EMAIL) mail.value = data.EMAIL;
      if (data.FECHA_NACIMIENTO)
        fechaNacimiento.value = data.FECHA_NACIMIENTO.split(" ")[0];
      if (data.FOTO_PERFIL && data.FOTO_PERFIL.trim() !== "") {
             fotoPerfil.src = data.FOTO_PERFIL; }
    })
    .catch(err => console.error("Error al cargar datos:", err));
}

// Guardar cambios
function guardarCambios() {
  const nombreInput = document.getElementById("nombreNuevo");
  const emailInput = document.getElementById("emailNuevo");
  const contrasena1 = document.getElementById("contrasenaNueva");
  const contrasena2 = document.getElementById("contrasenaNueva2");
  const fechaInput = document.getElementById("fechaNueva");
  const fotoSelect = document.getElementById("fotoSelect");
  const validarBtn = document.getElementById("validarBoton");

  validarBtn.addEventListener("click", async () => {
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

    // Validar solo campos llenos
    const nombreValido = validarNombre(nombreInput);
    const emailValido = validarEmail(emailInput);
    const fechaValida = validarFecha(fechaInput);
    const fotoValida = validarFoto(fotoSelect);

    if (!nombreValido || !emailValido || !fechaValida || !fotoValida || !contrasenaValida) {
   
      return;
    }

    // Armar objeto con los campos modificados
    const datos = {};
    if (nombre) datos.nombre = nombre;
    if (email) datos.mail = email;
    if (pass1) datos.contrasena = pass1;
    if (fecha) datos.fechaNacimiento = fecha;
    if (foto) datos.fotoPerfil = foto;

    try {
      const res = await fetch("GuardarDatosNuevos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const result = await res.json();
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
