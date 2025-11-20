window.onload = function () {
  const btnGuardar = document.getElementById("btnGuardar");
  btnGuardar.addEventListener("click", guardarCuestionario);
  let cantidadPreguntas = 0;

  abrirPanelDerecho();
  abrirPanelTemas();
  seleccionarTema();
  salirDeCreacion();
  mostrarConfiguracion();
  ponerNombre();
  validarTitulo();
  añadirPregunta(cantidadPreguntas);
};

function abrirPanelDerecho() {
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

function mostrarAlertaGuardado() {}

function salirDeCreacion() {
  const btnSalir = document.getElementById("btnSalir");

  btnSalir.addEventListener("click", function () {
    const modalSalirSinGuardar = new bootstrap.Modal(
      document.getElementById("modalSalirSinGuardar")
    );
    modalSalirSinGuardar.show();
  });
}

function mostrarConfiguracion() {
  const btnConfig = document.getElementById("btnConfig");

  btnConfig.addEventListener("click", () => {
    const modalConfig = new bootstrap.Modal(
      document.getElementById("modalConfiguracion")
    );
    modalConfig.show();
  });
}

function validarTitulo() {
  const btnGuardar = document.getElementById("btnGuardar");
  const titulo = document.getElementById("tituloCuestionario");
  const inputTitulo = document.getElementById("inputIngresarTitulo");

  btnGuardar.addEventListener("click", () => {
    if (titulo.innerText.trim() === "") {
      inputTitulo.classList.add("is-invalid");
      inputTitulo.classList.remove("is-valid");
      titulo.innerHTML = "cuestionario";
    } else {
      inputTitulo.classList.add("is-valid");
      inputTitulo.classList.remove("is-invalid");
    }
  });
}

function ponerNombre() {
  const inputTitulo = document.getElementById("inputIngresarTitulo");
  const titulo = document.getElementById("tituloCuestionario");
  const inputTituloconfig = document.getElementById("inputTitulo");
  const btnListo = document.getElementById("btnListo");

  inputTitulo.addEventListener("input", () => {
    titulo.innerHTML = inputTitulo.value;
  });
  /*btnListo.addEventListener("click", () => {
    titulo.innerHTML = inputTituloconfig.value;
    if (titulo.innerText.trim() === "") {
      titulo.innerHTML = "cuestionario";
    }
  });*/
}

function añadirPregunta(cantidadPreguntas) {
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

  for (let i = 1; i <= 4; i++) {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6");
    const cardRespuesta = document.createElement("div");
    cardRespuesta.classList.add("card-body", "d-flex", "flex-row", "mb-3");
    cardRespuesta.classList.add("OpcionRespuesta");

    const btnOpcion = document.createElement("button");
    btnOpcion.classList.add("btn", "w-100", "btnOpciones");
    btnOpcion.contentEditable = true;
    btnOpcion.textContent = `Opción ${i}`;
    const radioCorrecta = document.createElement("input");
    radioCorrecta.type = "radio";
    radioCorrecta.name = "radioCorrecto-${preguntaId}";
    radioCorrecta.classList.add("form-check-input");

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

//API
// ========== UNSPLASH API ==========
const UNSPLASH_ACCESS_KEY = "lDb4UKPmw_gnTXieod-jR_pWtDpRszsGNSuPlOpyudc";

async function buscarImagenesUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// Mostrar la imagen seleccionada en la tarjeta
function mostrarImagenSeleccionada(cardBody, url) {
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
  try {
    const form = document.getElementById("cuestionarioData");
    const formData = new FormData(form);

    //envio la info del cuestionario
    const response = await fetch("guardarCuestionario.php", {
      method: "POST",
      body: formData,
    });
    const raw = await response.text();
    console.log("Respuesta cruda del servidor:", raw);
    const data = JSON.parse(raw);
    //const data = await response.json();
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
  console.log("enviando preguntas...");
  const preguntas = recolectarPreguntas();
  console.log("preguntas contruidas", preguntas);
  const idVersionGlobal = version;
  try {
    //este codigo es para pasar el json a guardarCuestionario.php funciona pero todavia esta complciado el idVersion(comentario viejo)
    //veremos dijo el ciego
    const response = await fetch("guardarCuestionario2.php", {
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
    console.log("Respuesta cruda", responseText);// Mensaje de PHP

    const data = JSON.parse(responseText);
    alert(data.message);
    console.log("llenando campos");
    llenarCampos();
  } catch (error) {
    console.error("Error al enviar las preguntas:", error);
  }
}
//NUEVO RECOLECTAR PREGUNTAS
function recolectarPreguntas() {
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

    opcionesDiv.forEach((div) => {
      const texto = div.querySelector(".btnOpciones").textContent.trim();
      const esCorrecta = div.querySelector("input[type='radio']").checked
        ? 1
        : 0;

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
    });
  });

  return preguntas;
}

async function llenarCampos() {
  const inputTitulo = document.getElementById("inputTitulo").value;
  const inputDescripcion = document.getElementById("descripcion").value;
  const inputCodAcceso = document.getElementById("inputCodigoAcceso").value;
  const selectCategoria = document.getElementById("selectCategoria").value;
  const publico = document.getElementById("radiopublico");
  const privado = document.getElementById("radioPrivado");
  try {
    const response = await fetch("obtenerDatosCuestionario.php");
    const data = await response.json();

    data.cuestionario.forEach((dato) => {
      inputTitulo.textContent = dato.NOMBRE_CUESTIONARIO;
      selectCategoria.value = dato.ID_CATEGORIA;
      if (dato.VISIBILIDAD === "Publico") {
        publico.checked = true;
      } else {
        privado.checked = true;
      }
    });

    data.version.forEach((dato) => {
      inputDescripcion.value = dato.DESCRIPCION;
      inputCodAcceso.value = dato.COD_ACCESO;
    });
    console.log("campos llenos");
  } catch (error) {
    console.error("Error al cargar el cuestionario:", error);
  }
}
