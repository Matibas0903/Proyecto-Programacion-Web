window.onload = function()
{
  obtenerCuestionarios();
EnlazarComentariosACuestionarios();
const btnReportar = document.querySelectorAll(".btn-reportes");

  btnReportar.forEach((boton) => {
    boton.addEventListener("click", () => {
      AbrirMenuReportes();
    });
  });

  ValidarReporte();

  const btnAgregar = document.getElementById("btnAgregarCuestionario");
  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      AbrirModalAgregar();
    });
  }
  const btnEnviarSolicitud = this.document.getElementById("btnEnviarSolicitud");
  btnEnviarSolicitud.addEventListener("click", ValidarSolicitudCuestionario);

  const inputBusqueda = document.getElementById("inputBusqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", () => {
      FiltrarPorBusqueda();
    });
  }
  llenarYmostrarDetalles();
};

function AbrirMenuReportes() {
  const modalReportes = new bootstrap.Modal("#modalReportes");
  modalReportes.show();
}

function ValidarReporte() {
  const listaCheckboxes = document.getElementById("checkboxes");
  document.getElementById("btnReportar").addEventListener("click", function () {
    // Obtener los checkboxes seleccionados
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const seleccionados = Array.from(checkboxes).map((cb) => cb.value);

    if (seleccionados.length === 0) {
      listaCheckboxes.classList.remove("is-valid");
      listaCheckboxes.classList.add("is-invalid");
      return;
    } else {
      listaCheckboxes.classList.remove("is-invalid");
      listaCheckboxes.classList.add("is-valid");
    }
    // muestro los reportes por consola
    console.log("Reportes seleccionados:", seleccionados);

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalReportes")
    );
    modal.hide();
  });
}

function AbrirModalAgregar() {
  const modalAgregar = new bootstrap.Modal("#modalAgregarCuestionario");
  modalAgregar.show();

  // Limpiar el input al abrir el modal
  const inputCodigo = document.getElementById("inputCodigo");
  if (inputCodigo) {
    inputCodigo.value = "";
  }
}

function ValidarSolicitudCuestionario() {
  const inputCodigo = document.getElementById("inputCodigo");
  if (!inputCodigo) return;

  const codigo = inputCodigo.value.trim();

  if (codigo === "") {
    inputCodigo.classList.remove("is-valid");
    inputCodigo.classList.add("is-invalid");
    return;
  } else {
    inputCodigo.classList.remove("is-invalid");
    inputCodigo.classList.add("is-valid");
  }
}

function FiltrarPorBusqueda() {
  const input = document.getElementById("inputBusqueda");
  if (!input) return;
  const searchTerm = input.value.toLowerCase().trim();
  const container = document.getElementById("custionarios");
  if (!container) return;
  const cardColumns = container.querySelectorAll(".col-md-4"); // Las columnas que contienen las cards (col-md-4 mb-4)
  cardColumns.forEach((col) => {
    const card = col.querySelector(".carta-cuestionario");
    if (!card) return; // Saltar si no hay card
    const titleElement = card.querySelector(".card-title");
    if (!titleElement) return; // Saltar si no hay título
    const title = titleElement.textContent.toLowerCase().trim();
    if (searchTerm === "" || title.includes(searchTerm)) {
      // Mostrar la columna si la busqueda está vacia o coincide
      col.classList.remove("d-none");
    } else {
      // Ocultar la columna si no coincide
      col.classList.add("d-none");
    }
  });
}

function llenarYmostrarDetalles() {
  const botonesDetalles = document.querySelectorAll(".btn-detalles");
  const modal = new bootstrap.Modal(document.getElementById("modalDetalles"));

  botonesDetalles.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Obtener los datos del boton
      const titulo = boton.getAttribute("data-titulo");
      const estado = boton.getAttribute("data-estado");
      const descripcion = boton.getAttribute("data-descripcion");
      const fecha = boton.getAttribute("data-fecha");

      // Insertar en el modal
      document.getElementById("detalleTitulo").textContent = titulo;
      document.getElementById("detalleEstado").textContent = estado;
      document.getElementById("detalleDescripcion").textContent = descripcion;
      document.getElementById("detalleFecha").textContent = fecha;

      // Mostrar el modal
      modal.show();
    });
  });
}

/* fragmento de codigo html para los select de filtros, por ahora borrado
"
                            <div class="col-md-3">
                                <div class="input-group mb-3">
                                    
                                        <span class="input-group-text" >
                                            <i class="bi bi-filter"></i>
                                        </span>
                                        <select class="form-select" id="selectEstado">
                                            <option>Filtrar por estado</option>
                                            <option>Activo</option>
                                            <option>Finalizado</option>
                                            <option>Esperando</option>
                                        </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="input-group mb-3">
                                        <span class="input-group-text" id="Buscador">
                                            <i class="bi bi-filter"></i>
                                        </span>
                                       <select class="form-select">
                                            <option>Filtrar por categoría</option>
                                            <option></option>
                                            <option></option>
                                         </select>
                               </div>
                            </div>"
 */

function EnlazarComentariosACuestionarios() {
  const comentariosHistoria = [
    { usuario: "Invitado 1", texto: "No entiendo esta pregunta 😕" },
    { usuario: "Matias", texto: "La respuesta está mal marcada!" },
    { usuario: "invitado 5", texto: "Buenísima esta categoría 👏" },
  ];
  const comentariosProgramacion = [
    { usuario: "Hannahbeel", texto: "Pregunta mal formulada 😠" },
    { usuario: "Marco", texto: "Muy fácil, hagan algo más desafiante" },
    { usuario: "Cusi7", texto: "Excelente práctica, gracias!" },
  ];
  const comentariosGeografia = [
    { usuario: "Ara", texto: "Esto no es correcto, revisen!" },
    { usuario: "Tezoro887", texto: "Muy bueno el cuestionario" },
  ];

  document.querySelectorAll(".btn-moderar").forEach((boton) => {
    boton.addEventListener("click", () => {
      const tipo = boton.dataset.cuestionario;
      if (tipo === "Historia") abrirModal("Historia", comentariosHistoria);
      else if (tipo === "Programacion")
        abrirModal("Programación", comentariosProgramacion);
      else if (tipo === "Geografia")
        abrirModal("Geografía", comentariosGeografia);
    });
  });
}

function abrirModal(cuestionario, comentarios) {
  const modal = new bootstrap.Modal(document.getElementById("modalModeracion"));
  const contenedor = document.getElementById("contenedorComentarios");

  contenedor.innerHTML = "";

  comentarios.forEach((c, index) => {
    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `
            <p><strong>${c.usuario}:</strong> ${c.texto}</p>
            <button class="btn btn-warning btn-sm" onclick="advertirComentario(${index})">Advertir</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarComentario(${index})">Eliminar</button>
            <button class="btn btn-secondary btn-sm" onclick="expulsarComentario(${index})">Expulsar</button>
        `;
    contenedor.appendChild(div);
  });

  modal.show();
}

// Funciones para las acciones
function advertirComentario(index) {
  alert(`Advertencia para comentario en índice ${index}`);
  //agregar funcionalidad cuando este conectado con bbdd
}


function eliminarComentario(index) {
  const contenedor = document.getElementById("contenedorComentarios");
  const comentarioAEliminar = contenedor.children[index]; // Obtén el elemento en ese índice

  if (comentarioAEliminar) {
    contenedor.removeChild(comentarioAEliminar); // Elimina el nodo real
  }
}

function expulsarComentario(index) {
  alert(`Expulsando usuario del comentario en índice ${index}`);
  //agregar funcionalidad cuando este conectado con bbdd
}
// Función para agregar un cuestionario dinámicamente
function agregarCuestionario(cuestionario) {
  const contenedor = document.getElementById("custionarios");

  // Crear columna
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";

  // Crear card
  const card = document.createElement("div");
  card.className = "card carta-cuestionario h-100";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  // Título
  const titulo = document.createElement("h5");
  titulo.className = "card-title";
  titulo.textContent = cuestionario.titulo;

  // Texto del admin, fecha y jugadores
  const texto = document.createElement("p");
  texto.className = "card-text";
  texto.innerHTML = `
        <small class="text-muted">
            <i class="bi bi-person-fill"></i> Admin: ${cuestionario.admin}<br>
            <i class="bi bi-calendar-date"></i> Fecha: ${cuestionario.fecha}<br>
            Jugadores: ${cuestionario.jugadores}
        </small>
    `;

  // Estado
  const estado = document.createElement("span");
  estado.className = `state ${cuestionario.estadoClase}`; // activo, finalizado, esperando
  estado.textContent = cuestionario.estado;

  // Valoración
  const valoracion = document.createElement("div");
  valoracion.className = "rating";
  valoracion.innerHTML = `
        <i class="bi bi-star-fill"></i>
        ${cuestionario.valoracion}
    `;

  // Botones
  const botones = document.createElement("div");
  botones.className = "d-flex flex-wrap gap-2";
  botones.innerHTML = `
        <button class="btn btn-moderar" data-cuestionario="${cuestionario.NOMBRE_CUESTIONARIO}">
            <i class="bi bi-incognito"></i> Modera
        </button>
        <button class="btn btn-detalles"
            data-titulo="${cuestionario.NOMBRE_CUESTIONARIO}"
            data-admin="${cuestionario.ID_USUARIO}"
            data-fecha="${cuestionario.FECHA}"
            data-jugadores="${cuestionario.JUGADORES}"
            data-estado="${cuestionario.ESTADO}"
            data-valoracion="${cuestionario.VALORACION}"
            data-descripcion="${cuestionario.DESCRIPCION}">
            <i class="bi bi-list-columns"></i> Detalles
        </button>
        <button id="btnReportes${cuestionario.ID_CUESTIONARIO}" class="btn btn-reportes">
            <i class="bi bi-exclamation-diamond-fill"></i> Reportar
        </button>
    `;

  // Armar card
  cardBody.appendChild(titulo);
  cardBody.appendChild(texto);
  cardBody.appendChild(estado);
  cardBody.appendChild(valoracion);
  cardBody.appendChild(botones);
  card.appendChild(cardBody);
  col.appendChild(card);

  // Agregar al contenedor
  contenedor.appendChild(col);

  const botonReportar = col.querySelector(".btn-reportes");

  botonReportar.addEventListener("click", () => {
      abrirModalReportes(cuestionario.ID_CUESTIONARIO);
  });
}

//toda esta funcion y su php la hice pensando qeu duncionaba con los cuestionarios que habia pero nho sabia que estaban hardcodeados
async function cargarReportes(){
  const checkboxs = document.querySelectorAll("input[type='checkbox']");
    let motivos = [];

    checkboxs.forEach(check => {
      if(check.checked) motivos.push(check.value);
    });

    if (motivos.length === 0) {
        document.querySelector("input[type='checkbox'] .invalid-feedback").style.display = "block";
        return;
    }

    const response = await fetch("reportarCuestionario.php", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ID_CUESTIONARIO: id_cuestionario,
        MOTIVOS: motivos
      })
    })

    const data = await response.json();

    data.forEach(reporte => {
      if (data.status === "ok") {
            alert("Reporte enviado con éxito");
            location.reload();
        } else {
            alert("Error: " + data.message);
        }
    });
}
let cuestionarioId = null;

function abrirModalReportes(id){
  cuestionarioId = id;
  const modalReporte = new bootstrap.Modal(document.getElementById("modalReportes"));
  modalReporte.show();
}


//tengo problemas para cargar los cuestionarios moderados, porque no puedo mandar "dinamicamente" las cards cargaadas 
async function obtenerCuestionarios(){
  try{
    const response = await fetch("obtenerCuestionariosMederados.php",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({})
    });

    const data = await response.json();

    if(data.status === "error"){
      console.error("Error: ", data.message);
    }

    console.log("Datos enviados", data);

  }catch(error){
    console.log("error al enviar los cuestionarios", error);
  }
}