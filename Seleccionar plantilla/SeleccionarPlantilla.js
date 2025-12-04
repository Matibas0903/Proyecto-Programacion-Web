let cantidadPreguntas = 0;

window.onload = function () {
  obtenerPlantilla();
  abrirPanelDerecho();
  abrirPanelTemas();
  seleccionarTema();
  salirDeCreacion();
  mostrarConfiguracion();
  ponerNombre();
  añadirPregunta();

  const btnGuardar = document.getElementById("btnGuardar");
  btnGuardar.addEventListener("click", () => {
    const idVersion = document.body.dataset.idversion;
    if (idVersion) {
      actualizarPlantilla();
    } else {
      console.log("algo falló en el envio de id version");
    }
  });

  const btnSalirSinGuardar = document.getElementById("btnSalirSinGuardar");
  btnSalirSinGuardar.addEventListener("click", () => {
    window.location.href = "../administrador/administrador.php";
  });

  const btnGuardarYSalir = document.getElementById("btnGuardarYSalir");
  btnGuardarYSalir.addEventListener("click", () => {
    actualizarPlantilla();
    window.location.href = "../administrador/administrador.php";
  });
};

function abrirPanelDerecho() {
  const panelDer = document.getElementById("panelDer");
  const btnPanelDer = document.getElementById("btnPanelDer");
  const main = document.getElementById("panelPrincipal");

  btnPanelDer.addEventListener("click", () => {
    panelDer.classList.toggle("active");
    btnPanelDer.classList.toggle("open");

    if (panelDer.classList.contains("active") && main.classList.contains("col-9")) {
      main.classList.remove("col-9");
      main.classList.add("col-7");
    } else {
      main.classList.remove("col-7");
      main.classList.add("col-9");
    }
  });
}

function abrirPanelTemas() {
  const panelTemas = document.getElementById("panelTemas");
  const btnCerrarTemas = document.getElementById("btnCerrarTemas");
  const btnTemas = document.getElementById("btnTemas");
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
  });

  btnCerrarTemas.addEventListener("click", () => {
    if (panelDer.classList.contains("active")) {
      panelTemas.style.visibility = "hidden";
    } else {
      panelTemas.style.visibility = "hidden";
      main.classList.remove("col-7");
      main.classList.add("col-9");
    }
  });
}

function seleccionarTema() {
  const btntema1 = document.getElementById("tema1");
  const btntema2 = document.getElementById("tema2");
  const btntema3 = document.getElementById("tema3");
  const fondo = document.getElementById("panelPrincipal");
  const tema1 = "url(./Recursos/temaHistoria.jpg)";
  const tema2 = "url(./Recursos/temaHistoria2.jpg)";

  fondo.style.backgroundImage = tema2;

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

function ponerNombre() {
  const titulo = document.getElementById("tituloCuestionario");
  const inputTituloconfig = document.getElementById("inputTitulo");
  
  inputTituloconfig.addEventListener("change", () => {
    titulo.innerHTML = inputTituloconfig.value;
    if (titulo.innerText.trim() === "") {
      titulo.innerHTML = "cuestionario";
    }
  });
}

function crearBotonPregunta(preguntaId, titulo = "Pregunta") {
  const div = document.createElement("div");
  div.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "mb-2",
    "btn",
    "btn-light",
    "btnPregunta"
  );
  div.id = preguntaId;

  const pTitulo = document.createElement("p");
  pTitulo.classList.add("text-center", "text-muted", "mb-0", "fs-6", "fs-md-5", "fs-lg-4");
  pTitulo.textContent = titulo;
  pTitulo.id = `tituloPregunta-${preguntaId}`;

  const btnEliminar = document.createElement("button");
  btnEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
  const icono = document.createElement("i");
  icono.classList.add("bi", "bi-trash-fill");
  btnEliminar.appendChild(icono);

  btnEliminar.addEventListener("click", (e) => {
    e.stopPropagation();
    div.remove();
    document.getElementById(`form-${preguntaId}`)?.remove();
  });

  div.addEventListener("click", () => {
    document.querySelectorAll(".form-pregunta").forEach((f) => (f.style.display = "none"));
    const form = document.getElementById(`form-${preguntaId}`);
    if (form) form.style.display = "block";
  });

  div.appendChild(pTitulo);
  div.appendChild(btnEliminar);
  return div;
}

function crearFormularioPregunta(preguntaId, titulo = "Pregunta", opciones = []) {
  const panelPrincipal = document.getElementById("panelPrincipal");

  const container = document.createElement("div");
  container.classList.add("container", "mt-4", "form-pregunta");
  container.id = `form-${preguntaId}`;
  container.style.display = "none";

  const card = document.createElement("div");
  card.classList.add("card", "mb-4", "cardPregunta");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "text-center", "cardBodyPregun");

  // Buscador de imagen Unsplash
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
  contenedorImagenes.classList.add("d-flex", "flex-wrap", "justify-content-center", "gap-2");

  divBusqueda.appendChild(inputBusqueda);
  divBusqueda.appendChild(btnBuscar);
  divBusqueda.appendChild(contenedorImagenes);
  cardBody.appendChild(divBusqueda);

  // Escuchar búsqueda
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

  const inputPregunta = document.createElement("input");
  inputPregunta.type = "text";
  inputPregunta.classList.add("form-control", "text-center", "fw-bold", "input-pregunta");
  inputPregunta.value = titulo;
  inputPregunta.placeholder = "Escribe aquí la pregunta...";
  inputPregunta.id = `inputPregunta-${preguntaId}`;

  inputPregunta.addEventListener("input", () => {
    const tituloPregunta = document.getElementById(`tituloPregunta-${preguntaId}`);
    tituloPregunta.innerText = inputPregunta.value.trim() === "" ? "Pregunta" : inputPregunta.value;
  });

  cardBody.appendChild(inputPregunta);

  // Opciones
  const row = document.createElement("div");
  row.classList.add("row", "g-3");

  opciones = Array.isArray(opciones) ? opciones : [];
  const opcionesDef = opciones.length ? opciones : ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];
  
  opcionesDef.forEach((opcionTexto, index) => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6");

    const btnOpcion = document.createElement("div");
    btnOpcion.classList.add("btn", "w-100", "btnOpciones");
    btnOpcion.contentEditable = true;
    btnOpcion.textContent = opcionTexto;

    const cardRespuesta = document.createElement("div");
    cardRespuesta.classList.add("card-body", "d-flex", "flex-row", "mb-3", "opcionRespuesta");

    const radioCorrecta = document.createElement("input");
    radioCorrecta.type = "radio";
    radioCorrecta.name = `radioCorrecto-${preguntaId}`;
    radioCorrecta.id = `radio-${preguntaId}-${index}`;
    radioCorrecta.classList.add("form-check-input");

    cardRespuesta.appendChild(radioCorrecta);
    cardRespuesta.appendChild(btnOpcion);
    col.appendChild(cardRespuesta);
    row.appendChild(col);
  });

  card.appendChild(cardBody);
  card.appendChild(row);
  container.appendChild(card);
  panelPrincipal.appendChild(container);
}

function añadirPregunta() {
  const btn = document.getElementById("btnAñadirPregunta");
  const contenedor = document.getElementById("divPreguntas");

  btn.addEventListener("click", () => {
    cantidadPreguntas++;
    const id = `pregunta-${cantidadPreguntas}`;
    contenedor.appendChild(crearBotonPregunta(id));
    crearFormularioPregunta(id);
  });

  return cantidadPreguntas;
}

// API UNSPLASH
const UNSPLASH_ACCESS_KEY = "lDb4UKPmw_gnTXieod-jR_pWtDpRszsGNSuPlOpyudc";

async function buscarImagenesUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

function mostrarImagenSeleccionada(cardBody, url) {
  let imgPreview = cardBody.querySelector(".img-preview");
  if (!imgPreview) {
    imgPreview = document.createElement("img");
    imgPreview.classList.add("img-preview", "mb-3", "imagen-seleccionada");
    imgPreview.style.maxWidth = "300px";
    imgPreview.style.borderRadius = "10px";
    cardBody.insertBefore(imgPreview, cardBody.firstChild);
  }
  imgPreview.src = url;
}

async function obtenerPlantilla() {
  const idVersion = document.body.dataset.idversion;
  const version = idVersion;

  if (version === null) {
    console.error("No se proporcionó ID de versión");
    return;
  }

  try {
    const response2 = await fetch("obtenerPlantillas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idVersion: version }),
    });

    const data = await response2.json();
    
    if (data.status === "error") {
      alert(data.message);
      return;
    }

    if (data.status === "warning") {
      console.warn(data.message);
      alert(data.message);
      window.location.href = "../administrador/administrador.php";
      return;
    }

    if (data === null) {
      console.error("No se recibieron datos");
      return;
    }

    console.log(data);
    llenarCampos(data);
  } catch (error) {
    console.error("Error al enviar id version:", error);
  }
}

async function llenarCampos(data) {
  const inputTitulo = document.getElementById("inputTitulo");
  const inputDescripcion = document.getElementById("descripcion");
  const inputCodAcceso = document.getElementById("inputCodigoAcceso");
  const selectCategoria = document.getElementById("selectCategoria");
  const publico = document.getElementById("radiopublico");
  const privado = document.getElementById("radioPrivado");

  const c = data.cuestionario;

  inputTitulo.value = c.NOMBRE_CUESTIONARIO;
  selectCategoria.value = c.ID_CATEGORIA;

  if (c.VISIBILIDAD === "Publico") {
    publico.checked = true;
  } else {
    privado.checked = true;
  }

  const v = data.version;
  inputDescripcion.value = v.DESCRIPCION;
  inputCodAcceso.value = v.COD_ACCESO;

  console.log("campos llenos");
  cargarPreguntasDesdeBD(v);
}

async function cargarPreguntasDesdeBD(version) {
  const idVersionCuestionario = version.ID_VERSION;

  try {
    const response2 = await fetch("obtenerPreguntas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idVersion: idVersionCuestionario }),
    });

    const data = await response2.json();
    console.log("Preguntas recibidas:", data.preguntas);

    if (data === null) {
      console.error("No se recibieron preguntas");
      return;
    }

    console.log(data);

    data.preguntas.forEach((p, idxPregunta) => {
      cantidadPreguntas++;
      const id = `pregunta-${cantidadPreguntas}`;
      console.log(`--- Procesando pregunta #${idxPregunta + 1} ---`);
      console.log("ID formulario:", id);
      console.log("Enunciado:", p.ENUNCIADO);
      console.log("Opciones recibidas:", p.opciones);

      const btn = crearBotonPregunta(id, p.ENUNCIADO);
      document.getElementById("divPreguntas").appendChild(btn);

      // Convertir opciones a texto
      const opcionesTexto = p.opciones.map((opt) => opt.TEXTO);
      console.log("OpcionesTexto:", opcionesTexto);

      // Crear formulario
      crearFormularioPregunta(id, p.ENUNCIADO, opcionesTexto);

      // Seleccionar el formulario recién creado
      const form = document.getElementById(`form-${id}`);
      console.log("Formulario creado:", form);

      if (!form) {
        console.warn("No se encontró el formulario recién creado");
        return;
      }

      const opcionesDivs = form.querySelectorAll(".btnOpciones");
      const radios = form.querySelectorAll('input[type="radio"]');

      p.opciones.forEach((opcion, index) => {
        console.log(`Opción ${index}:`, opcion.TEXTO, "Correcta?", opcion.ES_CORRECTA);

        if (opcionesDivs[index]) {
          opcionesDivs[index].textContent = opcion.TEXTO;
        } else {
          console.warn(`No existe div para opción ${index}`);
        }

        if (opcion.ES_CORRECTA == 1) {
          if (radios[index]) {
            radios[index].checked = true;
            console.log(`Marcada como correcta la opción ${index}`);
          } else {
            console.warn(`No existe radio para opción ${index}`);
          }
        }
      });

      console.log(`--- Fin pregunta #${idxPregunta + 1} ---`);
    });
  } catch (error) {
    console.error("Error al cargar preguntas:", error);
  }
}

function recolectarPreguntas() {
  const preguntas = [];
  const formularios = document.querySelectorAll(".form-pregunta");

  formularios.forEach((form, index) => {
    const enunciado = form.querySelector(".input-pregunta").value.trim();
    const imagenSeleccionada = form.querySelector(".imagen-seleccionada")?.src || null;

    const opciones = [];
    const opcionesDiv = form.querySelectorAll(".opcionRespuesta");
    let opcionCorrecta = null;

    opcionesDiv.forEach((div, indexOpcion) => {
      const texto = div.querySelector(".btnOpciones").textContent.trim();
      const esCorrecta = div.querySelector("input[type='radio']").checked;

      if (esCorrecta) {
        opcionCorrecta = indexOpcion;
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
      opcionCorrecta: opcionCorrecta !== null ? 1 : 0,
    });
  });

  console.log(preguntas);
  return preguntas;
}

async function actualizarPlantilla() {
  const idVersion = document.body.dataset.idversion;
  if (!idVersion) {
    alert("No hay una plantilla cargada para actualizar.");
    return;
  }

  const esValido = await ValidarForm();
  if (!esValido) {
    console.log("Hay errores, no actualizo nada");
    return;
  }

  const form = document.getElementById("cuestionarioData");
  const formData = new FormData(form);
  const cuestionario = {};
  for (let [key, value] of formData.entries()) {
    cuestionario[key] = value;
  }

  const preguntas = recolectarPreguntas();

  try {
    const response = await fetch("actualizarPreguntas2.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idVersion: idVersion,
        preguntas: preguntas,
        cuestionario: cuestionario,
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error al actualizar la plantilla:", error);
  }
}

async function ValidarForm() {
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
      mostrarErrores(data);
      return false;
    } else {
      console.log("form validado");
      return true;
    }
  } catch (error) {
    console.error("Error al validar formulario:", error);
    return false;
  }
}

function mostrarErrores(data) {
  const miForm = document.getElementById("cuestionarioData");

  miForm.querySelectorAll(".form-control, .form-select").forEach((input) => {
    input.classList.remove("is-invalid");
  });

  miForm.querySelectorAll(".invalid-feedback").forEach((div) => {
    div.classList.add("d-none");
    div.textContent = "";
  });

  Object.keys(data.errors).forEach((campo) => {
    const input = document.getElementById(campo);
    const divError = input.parentElement.querySelector(".invalid-feedback");

    if (input && divError) {
      input.classList.add("is-invalid");
      divError.textContent = data.errors[campo];
      divError.classList.remove("d-none");
    }
  });
}