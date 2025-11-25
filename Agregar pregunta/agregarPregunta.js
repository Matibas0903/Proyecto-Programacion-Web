let cantidadPreguntas = 0;
window.onload = function () {
  const btnGuardar = document.getElementById("btnGuardar");
  btnGuardar.addEventListener("click", guardarCuestionario);
  
  const btnConfig = document.getElementById("btnConfig");

  btnConfig.addEventListener("click", mostrarConfiguracion);

<<<<<<< Updated upstream
=======
  const btnSalirSinGuardar = document.getElementById("btnSalirSinGuardar");
  btnSalirSinGuardar.addEventListener("click", () => {
    window.location.href = "../administrador/administrador.php";
  });

  const btnGuardarYSalir = this.document.getElementById("btnGuardarYSalir");
  btnGuardarYSalir.addEventListener("click", guardarCuestionario);

>>>>>>> Stashed changes
  abrirPanelDerecho();
  abrirPanelTemas();
  seleccionarTema();
  salirDeCreacion();
  ponerNombre();
  añadirPregunta();
};

function abrirPanelDerecho() {
  //Abre el panel derecho(sin muchas opciones)
  const panelDer = document.getElementById("panelDer");
  const btnPanelDer = document.getElementById("btnPanelDer");
  const main = document.getElementById("panelPrincipal");

  // Toggle al presionar la flecha
  btnPanelDer.addEventListener("click", () => {
    panelDer.classList.toggle("active");
    btnPanelDer.classList.toggle("open");

    if (
      panelDer.classList.contains("active") &&
      main.classList.contains("col-9")
    ) {
      main.classList.remove("col-9");
      main.classList.add("col-7");
    } else {
      main.classList.remove("col-7");
      main.classList.add("col-9");
    }
  });
}

function abrirPanelTemas() {
  //muestra el panel para seleccionar temas
  const btnTemas = document.getElementById("btnTemas");
  const panelTemas = document.getElementById("panelTemas");
  const btnCerrarTemas = document.getElementById("btnCerrarTemas");
  const panelDer = document.getElementById("panelDer");
  const main = document.getElementById("panelPrincipal");

  btnTemas.addEventListener("click", () => {
    const esVisible = panelTemas.style.visibility === "visible";
    if (!esVisible) {
      if (panelDer.classList.contains("active")) {
        panelTemas.style.visibility = "visible";
      } else {
        panelTemas.style.visibility = "visible";
        main.classList.remove("col-9");
        main.classList.add("col-7");
      }
    } else {
      if (panelDer.classList.contains("active")) {
        panelTemas.style.visibility = "hidden";
      } else {
        panelTemas.style.visibility = "hidden";
        main.classList.remove("col-7");
        main.classList.add("col-9");
      }
    }

    btnCerrarTemas.addEventListener("click", () => {
      if (panelDer.classList.contains("active")) {
        panelTemas.style.visibility = "hidden";
      } else {
        panelTemas.style.visibility = "hidden";
        main.classList.remove("col-7");
        main.classList.add("col-9");
      }
    });
  });
}

function seleccionarTema() {
  //Pone en el fondo el tema seleccionado
  const btntema1 = document.getElementById("tema1");
  const btntema2 = document.getElementById("tema2");
  const btntema3 = document.getElementById("tema3");
  const fondo = document.getElementById("panelPrincipal");
  const tema1 = "url(./Recursos/tema1.jpeg)";
  const tema2 = "url(./Recursos/tema2.jpg)";
  btntema1.addEventListener("click", () => {
    fondo.style.backgroundImage = tema1;
  });
  btntema2.addEventListener("click", () => {
    fondo.style.backgroundImage = tema2;
  });
  btntema3.addEventListener("click", () => {
    fondo.style.backgroundImage = "none";
  });
}

function salirDeCreacion() {
  //Muestra el modal para salir sin guardar
  const btnSalir = document.getElementById("btnSalir");

  btnSalir.addEventListener("click", function () {
    const modalSalirSinGuardar = new bootstrap.Modal(
      document.getElementById("modalSalirSinGuardar")
    );
    modalSalirSinGuardar.show();
  });
}

function mostrarConfiguracion() {
  //Abre el modal de configuracion
  const modalConfig = new bootstrap.Modal(
    document.getElementById("modalConfiguracion")
  );
  modalConfig.show();
}

function ponerNombre() {
  //Escribo en el titulo el nombre ingresado en el modal
  const titulo = document.getElementById("tituloCuestionario");
  const inputTituloconfig = document.getElementById("inputTitulo");
  inputTituloconfig.addEventListener("change", () => {
    titulo.innerHTML = inputTituloconfig.value;
    if (titulo.innerText.trim() === "") {
      titulo.innerHTML = "cuestionario";
    }
  });
}

function añadirPregunta() {
  //Agrega una diapositiva en el panel izquierdo
  const btnAñadirPregunta = document.getElementById("btnAñadirPregunta");
  const divContenedor = document.getElementById("divPreguntas");

  btnAñadirPregunta.addEventListener("click", () => {
    cantidadPreguntas++;
    const preguntaId = `pregunta-${cantidadPreguntas}`;

    // Botón lateral
    const preguntaDiv = document.createElement("div");
    preguntaDiv.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2",
      "btn",
      "btn-light",
      "btnPregunta"
    );
    preguntaDiv.id = preguntaId;

    const p = document.createElement("p");
    p.classList.add("text-center", "text-muted", "mb-0");
    p.textContent = `Pregunta`;
    p.id = `tituloPregunta-${preguntaId}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

    const icono = document.createElement("i");
    icono.classList.add("bi", "bi-trash-fill");
    btnEliminar.appendChild(icono);

    btnEliminar.addEventListener("click", (e) => {
      e.stopPropagation(); // evitar que se muestre al eliminar
      preguntaDiv.remove();
      document.getElementById(`form-${preguntaId}`)?.remove(); // borrar el formulario también
    });

    // Al hacer clic en el botón lateral, mostrar el formulario correspondiente
    preguntaDiv.addEventListener("click", () => {
      // ocultar todos los formularios
      document
        .querySelectorAll(".form-pregunta")
        .forEach((f) => (f.style.display = "none"));
      const form = document.getElementById(`form-${preguntaId}`);
      if (form) form.style.display = "block";
    });

    preguntaDiv.appendChild(p);
    preguntaDiv.appendChild(btnEliminar);
    divContenedor.appendChild(preguntaDiv);

    // Crear el formulario asociado
    crearPregunta(preguntaId);
  });
}

function crearPregunta(preguntaId) {
  //Crea el cuerpo de la pregunta editable
  const panelPrincipal = document.getElementById("panelPrincipal");

  const container = document.createElement("div");
  container.classList.add("container", "mt-4", "form-pregunta");
  container.id = `form-${preguntaId}`;
  container.style.display = "none"; // inicialmente oculto

  const card = document.createElement("div");
  card.classList.add("card", "mb-4", "cardPregunta");

  // Card body con input
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "text-center", "cardBodyPregun");

  const inputPregunta = document.createElement("input");
  //

  // --- buscador de imagen Unsplash ---
  const divBusqueda = document.createElement("div");
  divBusqueda.classList.add("mb-3", "card-pregunta");

  const inputBusqueda = document.createElement("input");
  inputBusqueda.type = "text";
  inputBusqueda.placeholder = "Buscar imagen (ej: guerra, ciencia...)";
  inputBusqueda.classList.add("form-control", "mb-2");

  const btnBuscar = document.createElement("button");
  btnBuscar.textContent = "Buscar imagen";
  btnBuscar.classList.add("btn", "btn-secondary", "mb-3");

  const contenedorImagenes = document.createElement("div");
  contenedorImagenes.classList.add(
    "d-flex",
    "flex-wrap",
    "justify-content-center",
    "gap-2"
  );

  divBusqueda.appendChild(inputBusqueda);
  divBusqueda.appendChild(btnBuscar);
  divBusqueda.appendChild(contenedorImagenes);
  cardBody.appendChild(divBusqueda);
  //

  inputPregunta.type = "text";
  inputPregunta.classList.add(
    "form-control",
    "text-center",
    "fw-bold",
    "input-pregunta"
  );
  inputPregunta.placeholder = "Escribe aquí la pregunta...";
  inputPregunta.id = `pregunta-${preguntaId}`;

  cardBody.appendChild(inputPregunta);

  // Opciones 2x2
  const row = document.createElement("div");
  row.classList.add("row", "g-3");

  //Creo las 4 opciones con sus respectivas cards
  for (let i = 1; i <= 4; i++) {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6");
    const cardRespuesta = document.createElement("div");
    cardRespuesta.classList.add("card-body", "d-flex", "flex-row", "mb-3");
    cardRespuesta.classList.add("OpcionRespuesta");

    const btnOpcion = document.createElement("div");
    btnOpcion.classList.add("btn", "w-100", "btnOpciones");
    btnOpcion.contentEditable = true;
    btnOpcion.textContent = `Opción ${i}`;
    const radioCorrecta = document.createElement("input");
    radioCorrecta.type = "radio";
    radioCorrecta.name = `radioCorrecto-${preguntaId}`;
    radioCorrecta.classList.add("form-check-input");

    //asigno la opcion correcta a opciones
    cardRespuesta.appendChild(radioCorrecta);
    cardRespuesta.appendChild(btnOpcion);
    col.appendChild(cardRespuesta);
    row.appendChild(col);
  }
  // Escuchar busquedad
  btnBuscar.addEventListener("click", async () => {
    contenedorImagenes.innerHTML = "Cargando...";
    const imagenes = await buscarImagenesUnsplash(inputBusqueda.value);
    contenedorImagenes.innerHTML = "";

    imagenes.forEach((img) => {
      const imgEl = document.createElement("img");
      imgEl.src = img.urls.thumb;
      imgEl.alt = img.alt_description;
      imgEl.style.cursor = "pointer";
      imgEl.style.borderRadius = "10px";
      imgEl.width = 100;
      imgEl.height = 100;

      imgEl.addEventListener("click", () => {
        mostrarImagenSeleccionada(cardBody, img.urls.small);
      });

      contenedorImagenes.appendChild(imgEl);
    });
  });
  //
  card.appendChild(cardBody);
  card.appendChild(row);
  container.appendChild(card);
  panelPrincipal.appendChild(container);

  inputPregunta.addEventListener("input", () => {
    const tituloPregunta = document.getElementById(
      `tituloPregunta-${preguntaId}`
    );
    tituloPregunta.innerText = inputPregunta.value;
    if (tituloPregunta.innerText.trim() === "") {
      tituloPregunta.innerText = "Pregunta";
    }
  });
}

//Consume la API
//API
// ========== UNSPLASH API ==========
const UNSPLASH_ACCESS_KEY = "lDb4UKPmw_gnTXieod-jR_pWtDpRszsGNSuPlOpyudc";

async function buscarImagenesUnsplash(query) {
  // buscaen la API una imagen de acuerdo a la palabra ingresada
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// Mostrar la imagen seleccionada en la tarjeta
function mostrarImagenSeleccionada(cardBody, url) {
  //Muestra el resultado de la busqueda
  let imgPreview = cardBody.querySelector(".img-preview");
  if (!imgPreview) {
    imgPreview = document.createElement("img");
    imgPreview.classList.add("img-preview", "mb-3");
    imgPreview.style.maxWidth = "300px";
    imgPreview.style.borderRadius = "10px";
    cardBody.insertBefore(imgPreview, cardBody.firstChild);
  }
  imgPreview.src = url;
}

async function guardarCuestionario() {
  //Se conecta con los php para guardar la informacion y las preguntas del cuestionario
  const esValido = await ValidarForm();

  if (!esValido) {
    console.log("Hay errores, no guardo nada");
    return;
  }

  try {
    const form = document.getElementById("cuestionarioData");
    const formData = new FormData(form);

    //envio la info del cuestionario
    const response = await fetch("InsertDatosCuestionario.php", {
      method: "POST",
      body: formData,
    });
    //const raw = await response.text();
    //console.log("Respuesta cruda del servidor:", raw);
    //const data = JSON.parse(raw);
    const data = await response.json();
    //se guardo la info del cuestionario y me trajo el id de la version
    const idVersionGlobal = data.idVersion;
    console.log("ID VERSION RECIBIDO:", idVersionGlobal);
    //procedo a enviar las preguntas para guardarlas
    EnviarPreguntas(idVersionGlobal);
  } catch (error) {
    console.error("Error al guardar el cuestionario:", error);
  }
}

async function EnviarPreguntas(version) {
  //Envia las preguntas al PHP, las inserta y llena el form nuevamente con el contenido
  console.log("enviando preguntas...");
  const preguntas = recolectarPreguntas();
  console.log("preguntas contruidas", preguntas);
  const idVersionGlobal = version;
  try {
    const response = await fetch("InsertPreguntas.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idVersion: idVersionGlobal,
        preguntas: preguntas,
      }),
    });

    const responseText = await response.text();

    const data = JSON.parse(responseText);
    alert(data.message);
    console.log("llenando campos");
    llenarCampos(idVersionGlobal);
  } catch (error) {
    console.error("Error al enviar las preguntas:", error);
  }
}

function recolectarPreguntas() {
  //Junta todas la Preguntas y opciones creadas en un array para enviar al PHP
  const preguntas = [];
  const formularios = document.querySelectorAll(".form-pregunta");

  formularios.forEach((form, index) => {
    const enunciado = form.querySelector(".input-pregunta").value.trim();

    // Intentar obtener imagen seleccionada (si existe)
    const imagenSeleccionada =
      form.querySelector(".imagen-seleccionada")?.src || null;

    // Recolectar las opciones
    const opciones = [];
    const opcionesDiv = form.querySelectorAll(".OpcionRespuesta");
    const opcionesCorrectas = [];

    opcionesDiv.forEach((div) => {
      const texto = div.querySelector(".btnOpciones").textContent.trim();
      const esCorrecta = div.querySelector("input[type='radio']").checked
        ? 1
        : 0;

      if (esCorrecta === 1) {
        opcionesCorrectas.push(esCorrecta);
      }

      opciones.push({
        texto: texto,
        esCorrecta: esCorrecta,
      });
    });

    preguntas.push({
      nro_orden: index + 1,
      enunciado: enunciado,
      imagen: imagenSeleccionada,
      opciones: opciones,
      opcionesCorrectas: opcionesCorrectas,
    });
  });

  return preguntas;
}

async function llenarCampos(idVersionGlobal) {
  //Llena los campos con los datos del cuestionario ya insertado

  //Declaro todos los inputs
  const inputTitulo = document.getElementById("inputTitulo");
  const inputDescripcion = document.getElementById("descripcion");
  const inputCodAcceso = document.getElementById("inputCodigoAcceso");
  const selectCategoria = document.getElementById("selectCategoria").value;
  const publico = document.getElementById("radiopublico");
  const privado = document.getElementById("radioPrivado");
  try {
    //obtengo los datos
    const response = await fetch("obtenerDatosCuestionario.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idVersion: idVersionGlobal,
      }),
    });

    const data = await response.json();

    //lleno los inputs con la informacion de la tabla cuestionario
    const c = data.cuestionario;

    inputTitulo.value = c.NOMBRE_CUESTIONARIO;
    selectCategoria.value = c.ID_CATEGORIA;

    if (c.VISIBILIDAD === "Publico") {
      publico.checked = true;
    } else {
      privado.checked = true;
    }
    //lleno los inputs con la informacion de la tabla version_cuestionario
    const v = data.version;
    inputDescripcion.value = v.DESCRIPCION;
    inputCodAcceso.value = v.COD_ACCESO;

    console.log("campos llenos");
  } catch (error) {
    console.error("Error al cargar el cuestionario:", error);
  }
}

async function ValidarForm() {
  //Valida los campos del formulario si hay errores los muestra
  const formData = new FormData(document.getElementById("cuestionarioData"));

  try {
    const response = await fetch("validarForm.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);

    if (data.status === "error") {
      mostrarConfiguracion();
      mostrarErrores(data); // Si hay errores, los muestro
      return false;
    } else {
      console.log("form validado");
      return true;
    }
  } catch (error) {
    console.log("oh no");
    console.error("Error al registrar inscripción:", error);
    return false;
  }
}

function mostrarErrores(data) {
  //Recorre el form y agrega la clazase is-invalid en lo campos que dieron error
  const miForm = document.getElementById("cuestionarioData");

  //selecciono todos los inpust con esas clases y lo limpio
  miForm.querySelectorAll(".form-control, .form-select").forEach((input) => {
    input.classList.remove("is-invalid");
  });

  //selecciono todos los div con class invalid-feedback
  miForm.querySelectorAll(".invalid-feedback").forEach((div) => {
    //los escondo y los limpio
    div.classList.add("d-none");
    div.textContent = "";
  });

  Object.keys(data.errors).forEach((campo) => {
    const input = document.getElementById(campo);
    //seleciono todos los divs para mostrar el mensaje de error
    const divError = input.parentElement.querySelector(".invalid-feedback");

    if (input && divError) {
      //le pongo class invlaid a mis input
      input.classList.add("is-invalid");
      //pongo el mensaje de error que traigo desde php
      divError.textContent = data.errors[campo];
      //lo mustro el div con los mensajes
      divError.classList.remove("d-none");
    }
  });
}
