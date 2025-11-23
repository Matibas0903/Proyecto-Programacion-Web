window.onload = function () {
  let cantidadPreguntas = 0;

  const btnGuardar = document.getElementById("btnGuardar");
  btnGuardar.addEventListener("click", () => {
    const idVersion = document.body.dataset.idversion;
    if (idVersion) {
      actualizarPlantilla();
    } else {
      //guardarCuestionario(); // Para nuevos cuestionarios
      console.log(
        "algo fallo en el envio de id version y la llamda a actualizar no se actualizo nada"
      );
    }
  });
  const btnConfig = document.getElementById("btnConfig");

  btnConfig.addEventListener("click", mostrarConfiguracion);

  const inputTituloconfig = document.getElementById("inputTitulo");
  inputTituloconfig.addEventListener("change", ponerNombre);

  const btnSalirSinGuardar = document.getElementById("btnSalirSinGuardar");
  btnSalirSinGuardar.addEventListener("click", () => {
    window.location.href = "../administrador/administrador.php";
  });
  /*
  const btnGuardarYSalir = this.document.getElementById("btnGuardarYSalir");
  btnGuardarYSalir.addEventListener("click", guardarCuestionario);
*/
  obtenerPlantilla(cantidadPreguntas);
  abrirPanelDerecho();
  abrirPanelTemas();
  seleccionarTema();
  salirDeCreacion();

  ponerNombre();

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

function mostrarConfiguracion()
{
    const btnConfig = document.getElementById("btnConfig");

    btnConfig.addEventListener("click", ()=>
        {
            const modalConfig = new bootstrap.Modal(document.getElementById('modalConfiguracion'))
            modalConfig.show();
        })
}

function validarTitulo() 
{
    const btnGuardar = document.getElementById("btnGuardar");
    const titulo = document.getElementById("tituloCuestionario");
    const inputTitulo = document.getElementById("inputIngresarTitulo");

    btnGuardar.addEventListener("click", ()=>
        {
            if(titulo.innerText.trim() === "")
                {
                    inputTitulo.classList.add("is-invalid");
                    inputTitulo.classList.remove("is-valid");
                    titulo.innerHTML = "cuestionario";
                }
            else
                {
                    inputTitulo.classList.add("is-valid");
                    inputTitulo.classList.remove("is-invalid")
                }

        });
<<<<<<< Updated upstream
}

function ponerNombre()
{
    const inputTitulo = document.getElementById("inputIngresarTitulo");
    const titulo = document.getElementById("tituloCuestionario");
    const inputTituloconfig = document.getElementById("inputTitulo")
    const btnListo = document.getElementById("btnListo");

    inputTitulo.addEventListener("input", ()=>
        {
            titulo.innerHTML= inputTitulo.value;
        })
    btnListo.addEventListener("click", ()=>
        {
            titulo.innerHTML = inputTituloconfig.value;
            if(titulo.innerText.trim() === "")
                {
                    titulo.innerHTML = "cuestionario";
                }
        })
}

function crearBotonPregunta(preguntaId, titulo = "Pregunta") {
    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2", "btn", "btn-light", "btnPregunta");
    div.id = preguntaId;


        const pTitulo = document.createElement("p");
        pTitulo.classList.add("text-center", "text-muted", "mb-0","fs-6", "fs-md-5", "fs-lg-4"); /*responsive al texto de los btn*/
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
        
        document.querySelectorAll(".form-pregunta").forEach(f => f.style.display = "none");
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
    card.classList.add("card", "mb-4","cardPregunta"); //card que contiene las preguntas/respuestas

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-center","cardBodyPregun");//le puse una clase para darle estilo

    const inputPregunta = document.createElement("input");

    
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
contenedorImagenes.classList.add("d-flex", "flex-wrap", "justify-content-center", "gap-2");

divBusqueda.appendChild(inputBusqueda);
divBusqueda.appendChild(btnBuscar);
divBusqueda.appendChild(contenedorImagenes);
cardBody.appendChild(divBusqueda);
//


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

    const opcionesDef = opciones.length ? opciones : ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];
    opcionesDef.forEach((opciones) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-md-6"); //le puse lo del responsive

        const btnOpcion = document.createElement("button");
        btnOpcion.classList.add("btn", "w-100","btnOpciones");//le clase clase de btrp y puse uno  nuevo
        btnOpcion.contentEditable = true;
        btnOpcion.textContent = opciones;

        const cardRespuesta = document.createElement("div");
        cardRespuesta.classList.add("card-body", "d-flex", "flex-row", "mb-3");
        cardRespuesta.id = "OpcionRespuesta";


        const radioCorrecta = document.createElement("input");
        radioCorrecta.type="radio";
        radioCorrecta.name= "radioCorrecto";
        radioCorrecta.classList.add("form-check-input");

        cardRespuesta.appendChild(radioCorrecta);
        cardRespuesta.appendChild(btnOpcion);
        col.appendChild(cardRespuesta);
        row.appendChild(col);
    });

    // Escuchar busquedad 
btnBuscar.addEventListener("click", async () => {
  contenedorImagenes.innerHTML = "Cargando...";
  const imagenes = await buscarImagenesUnsplash(inputBusqueda.value);
  contenedorImagenes.innerHTML = "";

  imagenes.forEach(img => {
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

    inputPregunta.addEventListener("input", ()=>
    {
        const tituloPregunta = document.getElementById(`tituloPregunta-${preguntaId}`);
        tituloPregunta.innerText = inputPregunta.value;
        if(tituloPregunta.innerText.trim() === "")
                {
                    tituloPregunta.innerText = "Pregunta";
                }
    })
}

=======
}*/

function ponerNombre() {
  //Escribo en el titulo el nombre ingresado en el modal
  const titulo = document.getElementById("tituloCuestionario");
  const inputTituloconfig = document.getElementById("inputTitulo");
  titulo.innerHTML = inputTituloconfig.value;
  if (titulo.innerText.trim() === "") {
    titulo.innerHTML = "cuestionario";
  }
}

function crearBotonPregunta(preguntaId, titulo) {
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
  pTitulo.classList.add(
    "text-center",
    "text-muted",
    "mb-0",
    "fs-6",
    "fs-md-5",
    "fs-lg-4"
  ); /*responsive al texto de los btn*/
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
    document
      .querySelectorAll(".form-pregunta")
      .forEach((f) => (f.style.display = "none"));
    const form = document.getElementById(`form-${preguntaId}`);
    if (form) form.style.display = "block";
  });

  div.appendChild(pTitulo);
  div.appendChild(btnEliminar);
  return div;
}

function crearFormularioPregunta(preguntaId, titulo, opciones) {
  const panelPrincipal = document.getElementById("panelPrincipal");

  const container = document.createElement("div");
  container.classList.add("container", "mt-4", "form-pregunta");
  container.id = `form-${preguntaId}`;
  container.style.display = "none";

  const card = document.createElement("div");
  card.classList.add("card", "mb-4", "cardPregunta"); //card que contiene las preguntas/respuestas

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "text-center", "cardBodyPregun"); //le puse una clase para darle estilo

  const inputPregunta = document.createElement("input");

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
  inputPregunta.value = titulo;
  inputPregunta.placeholder = "Escribe aquí la pregunta...";
  inputPregunta.id = `inputPregunta-${preguntaId}`;

  inputPregunta.addEventListener("input", () => {
    const tituloPregunta = document.getElementById(
      `tituloPregunta-${preguntaId}`
    );
    tituloPregunta.innerText =
      inputPregunta.value.trim() === "" ? "Pregunta" : inputPregunta.value;
  });

  cardBody.appendChild(inputPregunta);

  // Opciones
  const row = document.createElement("div");
  row.classList.add("row", "g-3");

  const opcionesDef = opciones.length
    ? opciones
    : ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];
  opcionesDef.forEach((opciones) => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6"); //le puse lo del responsive

    const btnOpcion = document.createElement("div");
    btnOpcion.classList.add("btn", "w-100", "btnOpciones"); //le clase clase de btrp y puse uno  nuevo
    btnOpcion.contentEditable = true;
    btnOpcion.textContent = opciones;

    const cardRespuesta = document.createElement("div");
    cardRespuesta.classList.add(
      "card-body",
      "d-flex",
      "flex-row",
      "mb-3",
      "opcionRespuesta"
    );

    const radioCorrecta = document.createElement("input");
    radioCorrecta.type = "radio";
    radioCorrecta.name = `radioCorrecto-${preguntaId}`;
    radioCorrecta.classList.add("form-check-input");

    cardRespuesta.appendChild(radioCorrecta);
    cardRespuesta.appendChild(btnOpcion);
    col.appendChild(cardRespuesta);
    row.appendChild(col);
  });

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

>>>>>>> Stashed changes
function añadirPregunta(cantidadPreguntas) {
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

function inicializarPreguntasHardcodeadas() {
    const preguntas = [
        { titulo: "¿En qué año comenzó la Segunda Guerra Mundial?", opciones: ["1914", "1939", "1945", "1929"] },
        { titulo: "¿Quién fue el líder del movimiento de independencia de la India?", opciones: ["Mahatma Gandhi", "Nelson Mandela", "Simón Bolívar", "Martin Luther King Jr."] },
        { titulo: "La caída del Imperio Romano de Occidente fue en:", opciones: ["476 d.C.", "1453 d.C.", "1492 d.C.", "395 d.C."] }
    ];

    const contenedor = document.getElementById("divPreguntas");
    preguntas.forEach((p, i) => {
        const id = `pregunta-${i + 1}`;
        contenedor.appendChild(crearBotonPregunta(id, p.titulo));
        crearFormularioPregunta(id, p.titulo, p.opciones);
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

<<<<<<< Updated upstream
function leerRespuestaCorrecta()
{
    const respuestaCorrecta = document.querySelectorAll('input[name="radioCorrecto"]:checked');
    if(!respuestaCorrecta) return null;

    const cardSeleccionada = radioSeleccionado.closest(".card-body"); //obtiene la card que contiene el boton y el radio, y lo devuelve
    return cardSeleccionada;

}
=======
async function obtenerPlantilla(cantidadPreguntas) {
  const idVersion = document.body.dataset.idversion;

  const version = idVersion;
  console.log("ID version obtenido:", version);

  if (version === null) {
    return error;
  }
  try {
    const response2 = await fetch("obtenerPlantillas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idVersion: version,
      }),
    });

    const data = await response2.json();
    if (data.status === "error") {
      alert(data.message);
      return;
    }

    if (data.status === "warning") {
      console.warn(data.message);
      alert(data.message);
      //si el cuestionario no esta disponible para plantilla redirige a administrador
      window.location.href = "../administrador/administrador.php";
      // igual puedes mostrar los datos si quieres
    }
    if (data === null) {
      return error;
    } else {
      console.log(data);
      llenarCampos(data, cantidadPreguntas);
    }
  } catch (error) {
    console.error("Error al enviar id version:", error);
  }
}

async function llenarCampos(data, cantidadPreguntas) {
  //Llena los campos con los datos del cuestionario ya insertado

  //Declaro todos los inputs
  const inputTitulo = document.getElementById("inputTitulo");
  const inputDescripcion = document.getElementById("descripcion");
  const inputCodAcceso = document.getElementById("inputCodigoAcceso");
  const selectCategoria = document.getElementById("selectCategoria").value;
  const publico = document.getElementById("radiopublico");
  const privado = document.getElementById("radioPrivado");

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
  cargarPreguntasDesdeBD(v, cantidadPreguntas);
}

async function cargarPreguntasDesdeBD(version, cantidadPreguntas) {
  const idVersionCuestionario = version.ID_VERSION;

  try {
    const response2 = await fetch("obtenerPreguntas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idVersion: idVersionCuestionario,
      }),
    });

    const data = await response2.json();

    if (data === null) {
      return error;
    } else {
      console.log(data);
    }

    data.preguntas.forEach((p) => {
      cantidadPreguntas++;
      const id = `pregunta-${cantidadPreguntas}`;

      const btn = crearBotonPregunta(id, p.ENUNCIADO);
      document.getElementById("divPreguntas").appendChild(btn);

      // OJO: opciones puede venir vacío
      crearFormularioPregunta(id, p.ENUNCIADO, p.opciones ?? []);

      const radios = document.querySelectorAll(
        `#form-${id} input[type="radio"]`
      );

      if (radios.length && p.correcta !== undefined && radios[p.correcta]) {
        radios[p.correcta].checked = true;
      }
    });
  } catch (error) {
    console.error("Error al enviar id version:", error);
  }
}
/*
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
    const response = await fetch(
      "../AgregarPregunta/InsertDatosCuestionario.php",
      {
        method: "POST",
        body: formData,
      }
    );
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
}*/

async function EnviarPreguntas(version) {
  //Envia las preguntas al PHP, las inserta y llena el form nuevamente con el contenido
  console.log("enviando preguntas...");
  const preguntas = recolectarPreguntas();
  console.log("preguntas contruidas", preguntas);
  const idVersionGlobal = version;
  try {
    const response = await fetch("../AgregarPregunta/InsertPreguntas.php", {
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

// Función para actualizar la plantilla (envía datos a actualizarPreguntas.php)
// Esta función asume que se llama cuando hay un idVersion existente (plantilla cargada)
// Puedes integrarla en guardarCuestionario() o llamarla condicionalmente.

async function actualizarPlantilla() {
  // Verificar si hay idVersion (indica que es una plantilla existente)
  const idVersion = document.body.dataset.idversion;
  if (!idVersion) {
    alert("No hay una plantilla cargada para actualizar.");
    return;
  }

  // Validar el formulario (reutilizar ValidarForm si existe)
  const esValido = await ValidarForm(); // Asumiendo que tienes esta función
  if (!esValido) {
    console.log("Hay errores, no actualizo nada");
    return;
  }

  // Recolectar datos del cuestionario del formulario
  const form = document.getElementById("cuestionarioData");
  const formData = new FormData(form);
  const cuestionario = {};
  for (let [key, value] of formData.entries()) {
    cuestionario[key] = value;
  }

  // Recolectar preguntas (reutilizar recolectarPreguntas)
  const preguntas = recolectarPreguntas();

  try {
    // Enviar a actualizarPreguntas.php
    const response = await fetch("actualizarPreguntas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idVersion: idVersion,
        preguntas: preguntas,
        cuestionario: cuestionario, // Opcional, si necesitas actualizar metadatos
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      alert(data.message);
      // Opcional: Recargar o redirigir
      // window.location.reload(); o similar
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error al actualizar la plantilla:", error);
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

// Ejemplo de cómo integrarlo en el botón de guardar:
// En lugar de guardarCuestionario(), puedes condicionar:
// const btnGuardar = document.getElementById("btnGuardar");
// btnGuardar.addEventListener("click", () => {
//   const idVersion = document.body.dataset.idversion;
//   if (idVersion) {
//     actualizarPlantilla();
//   } else {
//     guardarCuestionario(); // Para nuevos cuestionarios
//   }
// });

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
>>>>>>> Stashed changes
