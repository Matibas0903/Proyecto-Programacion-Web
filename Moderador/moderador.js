let modalModeracionInstance = null;
let userPermisos = {
    roles: [],
    permisos: []
};

window.onload = async function () {
  await obtenerPermisosUsuario();
  obtenerCuestionarios();

  const inputBusqueda = document.getElementById("inputBusqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", () => {
      FiltrarPorBusqueda();
    });
  }
};

function FiltrarPorBusqueda() {
  const input = document.getElementById("inputBusqueda");
  if (!input) return;
  const searchTerm = input.value.toLowerCase().trim();
  const container = document.getElementById("custionarios");
  if (!container) return;
  const cardColumns = container.querySelectorAll(".col-md-4");

  cardColumns.forEach((col) => {
    const card = col.querySelector(".carta-cuestionario");
    if (!card) return;
    const titleElement = card.querySelector(".card-title");
    if (!titleElement) return;
    const title = titleElement.textContent.toLowerCase().trim();

    if (searchTerm === "" || title.includes(searchTerm)) {
      col.classList.remove("d-none");
    } else {
      col.classList.add("d-none");
    }
  });
}

async function cargarComentariosPorVersion(idVersion) {
  try {
    const response = await fetch(`../BaseDeDatos/controladores/getComentariosVersion.php?version=${idVersion}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    if (data.status === "error") {
      console.error("Error al cargar comentarios:", data.message);
      return [];
    }

    return data.data || [];
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return [];
  }
}

async function abrirModalModeracion(nombreCuestionario, idVersion) {

    // Guardar para usos posteriores
    window._nombreCuestionarioActual = nombreCuestionario;
    window._idVersionActual = idVersion;

    const modalEl = document.getElementById("modalModeracion");
    const contenedor = document.getElementById("contenedorComentarios");
    const tituloModal = document.getElementById("tituloModal");

    // Crear instancia del modal si no existe
    if (!modalModeracionInstance) {
        modalModeracionInstance = new bootstrap.Modal(modalEl);
    }

    // Actualizar título
    tituloModal.textContent = `Comentarios de: ${nombreCuestionario}`;

    // Mostrar loading
    contenedor.innerHTML = `
        <p class="text-center">
        <i class="bi bi-hourglass-split"></i> Cargando comentarios...
        </p>
    `;

    // Mostrar modal inmediatamente
    modalModeracionInstance.show();

    // Cargar comentarios desde la BD
    const comentarios = await cargarComentariosPorVersion(idVersion);

    // Limpiar contenedor
    contenedor.innerHTML = "";

    // Si no hay comentarios
    if (comentarios.length === 0) {
        contenedor.innerHTML = `
            <p class="text-center text-muted">No hay comentarios para este cuestionario</p>
        `;
        return;
    }

    // Renderizar comentarios
    comentarios.forEach((c) => {
        const fecha = new Date(c.FECHA_PARTICIPACION).toLocaleDateString();
        const valoracion = c.VALORACION_CUESTIONARIO
            ? "★".repeat(c.VALORACION_CUESTIONARIO) +
              "☆".repeat(5 - c.VALORACION_CUESTIONARIO)
            : "Sin valoración";

        const div = document.createElement("div");
        div.classList.add("comentario", "mb-3", "p-3", "border", "rounded");

        div.innerHTML = `
          <div class="d-flex justify-content-between align-items-start mb-2">
              <p class="mb-0"><strong>${c.NOMBRE}:</strong> ${c.COMENTARIO}</p>
              <small class="text-muted">${fecha}</small>
          </div>

          <div class="mb-2">
              <small class="text-warning">${valoracion}</small>
          </div>

          <div class="d-flex gap-2">
              ${tienePermiso('eliminar_comentario') ? `
                <button class="btn btn-danger btn-sm" 
                  onclick="eliminarComentario(${c.ID_PARTICIPACION})">
                  <i class="bi bi-trash"></i> Eliminar
               </button> ` : ""}

              ${
                !c.INVITADO
                  ? `

              ${tienePermiso('silenciar_usuario') ? `
                <button class="btn btn-warning btn-sm" 
                    onclick="silenciarUsuario(${c.ID_USUARIO}, '${c.NOMBRE}')">
                    <i class="bi bi-volume-mute-fill"></i> Silenciar
                </button> ` : ""
              }
               ${tienePermiso('banear_usuario') ? `
                <button class="btn btn-dark btn-sm" 
                    onclick="banearUsuario(${c.ID_USUARIO}, '${c.NOMBRE}')">
                    <i class="bi bi-slash-circle"></i> Banear
                </button> ` : ""
              }
                `
                  : ""
              }

          </div>
        `;

        contenedor.appendChild(div);
    });
}

function advertirComentario(index, nombreUsuario) {
  if (confirm(`¿Desea enviar una advertencia a ${nombreUsuario}?`)) {
    alert(`Advertencia enviada a ${nombreUsuario}`);
    // TODO: Implementar lógica de advertencia en BD
  }
}

function expulsarUsuario(idUsuario, nombreUsuario) {
  if (confirm(`¿Está seguro de expulsar al usuario ${nombreUsuario}?`)) {
    alert(`Usuario ${nombreUsuario} expulsado`);
    // TODO: Implementar expulsión en BD
  }
}

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
  titulo.textContent = cuestionario.NOMBRE_CUESTIONARIO;

  // Determinar estado y clase
  let estadoTexto = cuestionario.ACTIVO === "Activo" ? "Activo" : "Inactivo";
  let estadoClase = cuestionario.ACTIVO === "Activo" ? "activo" : "finalizado";

  // Texto del admin, fecha y preguntas
  const texto = document.createElement("p");
  texto.className = "card-text";
  texto.innerHTML = `
    <small class="text-muted">
      <i class="bi bi-person-fill"></i> Admin: Usuario ${cuestionario.ID_USUARIO}<br>
      <i class="bi bi-calendar-date"></i> Fecha: ${new Date(cuestionario.FECHA_CREACION).toLocaleDateString()}<br>
      Preguntas: ${cuestionario.cantidad_preguntas || 0}
    </small>
  `;

  // Estado
  const estado = document.createElement("span");
  estado.className = `state ${estadoClase}`;
  estado.textContent = estadoTexto;

  // Valoración
  const valoracion = document.createElement("div");
  valoracion.className = "rating";
  const estrellas = generarEstrellas(parseFloat(cuestionario.promedio_calificacion) || 0);
  valoracion.innerHTML = `
    <i class="bi bi-star-fill"></i>
    ${estrellas}
  `;

  // Botones
  const botones = document.createElement("div");
  botones.className = "d-flex flex-wrap gap-2";
  botones.innerHTML = `
    <button class="btn btn-moderar" 
      data-cuestionario="${cuestionario.NOMBRE_CUESTIONARIO}"
      data-version="${cuestionario.ID_VERSION}">
      <i class="bi bi-incognito"></i> Moderar
    </button>
    <button class="btn btn-detalles"
      data-titulo="${cuestionario.NOMBRE_CUESTIONARIO}"
      data-estado="${estadoTexto}"
      data-descripcion="${cuestionario.DESCRIPCION || 'Sin descripción'}"
      data-fecha="${new Date(cuestionario.FECHA_CREACION).toLocaleDateString()}">
      <i class="bi bi-list-columns"></i> Detalles
    </button>
    ${
      tienePermiso('reportar_cuestionario') ? `
      <button class="btn btn-reportes"<button class="btn btn-reportes" data-id="${cuestionario.ID_CUESTIONARIO}">
        <i class="bi bi-exclamation-diamond-fill"></i> Reportar
      </button>` : ""
    }
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

  // Event listeners para los botones
  const botonModerar = col.querySelector(".btn-moderar");
  botonModerar.addEventListener("click", () => {
    const nombreCuest = botonModerar.dataset.cuestionario;
    const idVersion = botonModerar.dataset.version;
    abrirModalModeracion(nombreCuest, idVersion);
  });

  const botonDetalles = col.querySelector(".btn-detalles");
  botonDetalles.addEventListener("click", () => {
    llenarModalDetalles(botonDetalles);
  });

  const botonReportar = col.querySelector(".btn-reportes");
  botonReportar.addEventListener("click", () => {
    abrirModalReportes(cuestionario.ID_CUESTIONARIO);
  });
}

function generarEstrellas(promedio) {
  const estrellasLlenas = Math.floor(promedio);
  const tieneMedia = promedio % 1 >= 0.5;
  let html = "";

  for (let i = 0; i < estrellasLlenas; i++) {
    html += "★";
  }
  if (tieneMedia) {
    html += "★";
  }
  const estrellasVacias = 5 - Math.ceil(promedio);
  for (let i = 0; i < estrellasVacias; i++) {
    html += "☆";
  }

  return html || "Sin valoraciones";
}

function llenarModalDetalles(boton) {
  const modal = new bootstrap.Modal(document.getElementById("modalDetalles"));

  const titulo = boton.getAttribute("data-titulo");
  const estado = boton.getAttribute("data-estado");
  const descripcion = boton.getAttribute("data-descripcion");
  const fecha = boton.getAttribute("data-fecha");

  document.getElementById("detalleTitulo").textContent = titulo;
  document.getElementById("detalleEstado").textContent = estado;
  document.getElementById("detalleDescripcion").textContent = descripcion;
  document.getElementById("detalleFecha").textContent = fecha;

  modal.show();
}

function ValidarReporte() {
  const listaCheckboxes = document.getElementById("checkboxes");
  const btnReportar = document.getElementById("btnReportar");
  
  if (!btnReportar) return;
  
  btnReportar.addEventListener("click", async function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const seleccionados = Array.from(checkboxes).map((cb) => cb.value);

    if (seleccionados.length === 0) {
      listaCheckboxes.classList.remove("is-valid");
      listaCheckboxes.classList.add("is-invalid");
      return;
    } else {
      listaCheckboxes.classList.remove("is-invalid");
      listaCheckboxes.classList.add("is-valid");
    }

    await cargarReportes(seleccionados);
  });
}

async function cargarReportes(motivos) {
  if (!cuestionarioId) {
    alert("Error: No se ha seleccionado un cuestionario");
    return;
  }

  try {
    const response = await fetch("reportarCuestionario.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID_CUESTIONARIO: cuestionarioId,
        MOTIVOS: motivos,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert(data.message);
      
      // Cerrar modal y limpiar checkboxes
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalReportes"));
      modal.hide();
      
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      cuestionarioId = null;
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Error al enviar reporte:", error);
    alert("Error al enviar el reporte");
  }
}

let cuestionarioId = null;

function abrirModalReportes(id) {
  cuestionarioId = id;
  
  // Limpiar checkboxes anteriores
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById("checkboxes").classList.remove("is-invalid", "is-valid");
  
  const modalReporte = new bootstrap.Modal(document.getElementById("modalReportes"));
  modalReporte.show();
  
  // Inicializar validación cuando se abre el modal
  ValidarReporte();
}

async function obtenerCuestionarios() {
  try {
    const response = await fetch("./obtenerCuestionariosModerados.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    if (data.status === "error") {
      console.error("Error: ", data.message);
      mostrarMensajeError(data.message);
      return;
    }

    console.log("Datos recibidos:", data);

    // Limpiar el contenedor antes de agregar
    const contenedor = document.getElementById("custionarios");
    contenedor.innerHTML = "";

    // Verificar si hay cuestionarios
    if (data.data && data.data.length > 0) {
      data.data.forEach((cuestionario) => {
        agregarCuestionario(cuestionario);
      });
    } else {
      // Mostrar mensaje si no hay cuestionarios
      contenedor.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center" role="alert">
            <i class="bi bi-info-circle"></i> No tienes cuestionarios para moderar
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error al obtener los cuestionarios:", error);
    mostrarMensajeError("Error al cargar los cuestionarios");
  }
}

function mostrarMensajeError(mensaje) {
  const contenedor = document.getElementById("custionarios");
  contenedor.innerHTML = `
    <div class="col-12">
      <div class="alert alert-danger text-center" role="alert">
        <i class="bi bi-exclamation-triangle"></i> ${mensaje}
      </div>
    </div>
  `;
}

async function eliminarComentario(idParticipacion) {
    if (!confirm("¿Eliminar comentario?")) return;

    const res = await fetch("../BaseDeDatos/controladores/moderarEliminarComentario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idParticipacion })
    });

    const data = await res.json();
    alert(data.message);

    if (modalModeracionInstance) {
        modalModeracionInstance.hide();
    }
    obtenerCuestionarios();
}

async function silenciarUsuario(idUsuario, nombre) {
    if (!confirm(`¿Silenciar a ${nombre}?`)) return;

    const res = await fetch("../BaseDeDatos/controladores/moderarSilenciarUsuario.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ idUsuario })
    });

    const data = await res.json();
    alert(data.message);

    if (modalModeracionInstance) {
        modalModeracionInstance.hide();
    }
    obtenerCuestionarios();
}

async function echarUsuario(idUsuario, idVersion, nombre) {
    if (!confirm(`¿Echar a ${nombre} de este cuestionario?`)) return;

    const res = await fetch("../BaseDeDatos/controladores/moderarEcharUsuario.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ idUsuario, idVersion })
    });

    const data = await res.json();
    alert(data.message);

        if (modalModeracionInstance) {
        modalModeracionInstance.hide();
    }
    obtenerCuestionarios();
}
async function banearUsuario(idUsuario, nombre) {
    if (!confirm(`¿BANEAR permanentemente a ${nombre}?`)) return;

    const res = await fetch("../BaseDeDatos/controladores/moderarBanearUsuario.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ idUsuario })
    });

    const data = await res.json();
    alert(data.message);

        if (modalModeracionInstance) {
        modalModeracionInstance.hide();
    }
    obtenerCuestionarios();
}

async function obtenerPermisosUsuario() {
    try {
        const respuesta = await fetch('../BaseDeDatos/controladores/getPermisosUsuario.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const datos = await respuesta.json();
        if (datos.status === 'success') {
            userPermisos.roles = datos.roles;
            userPermisos.permisos = datos.permisos;
        }
    } catch (error) {
        mostrarMensajeError('Error al obtener permisos');
    }
}

function tienePermiso(permiso) {
    return userPermisos.permisos.includes(permiso);
}

function tieneAlgunPermiso(permisos) {
    return permisos.some(p => userPermisos.permisos.includes(p));
}

function esRol(rol) {
    return userPermisos.roles.includes(rol);
}