let cuestionarios = [];
let cuestionariosInvitado = [];
//paginado
let paginaActual = 1;
const cuestionariosPorPagina = 20;

let userPermisos = {
    roles: [],
    permisos: []
};

async function onloadParticipante(){
    await obtenerPermisosUsuario();
    
    const mensaje = sessionStorage.getItem('mensajeError');
    if (mensaje) {
        mostrarMensajeError(mensaje);
        sessionStorage.removeItem('mensajeError');
    }
    
    //Buscador cuestionarios - solo si tiene permiso de jugar
    if(tienePermiso('jugar_cuestionario')){
        const formCuestionarios = document.getElementById("formId");
        formCuestionarios.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombreCuest = document.getElementById("nombreCuest");
            const inputValid = nombreCuest.value && nombreCuest.value.length <= 50;
            if (inputValid){
                nombreCuest.classList.remove('is-invalid')
                const cuestFiltrados = cuestionarios.filter(c => c.NOMBRE_CUESTIONARIO.toLowerCase().includes(nombreCuest.value.toLowerCase()) && c.VISIBILIDAD ==='Publico' && c.ACTIVO === "Activo");
                if(cuestFiltrados.length){
                    listaCuestionarios(cuestFiltrados);
                } else {
                    document.getElementById("list_title").innerHTML = 'CUESTIONARIOS';
                    const contenedor = document.getElementById("listado_total");
                    contenedor.innerHTML = '<p class="text-center fs-4">No se encontraron cuestionarios</p>';
                    contenedor.scrollIntoView();
                }
                formCuestionarios.reset();
            } else {
                nombreCuest.classList.add('is-invalid')
            }
        })
    } else {
        document.getElementById("formId").style.display = 'none';
    }

    //cargamos los cuestionarios publicos - solo si tiene permiso de jugar
    if(tienePermiso('jugar_cuestionario')){
        try {
            const respuesta = await fetch('../BaseDeDatos/controladores/getCuestionariosPublicos.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(respuesta){
                const datos = await respuesta.json();
                if(datos.status === 'success'){
                    if(datos.data.length){
                        cuestionarios = datos.data;
                    }
                } else {
                    mostrarMensajeError(datos.message || 'Error al obtener los cuestionarios');
                }
            }    
        } catch (error) {
             mostrarMensajeError('Error al obtener los cuestionarios');
        }

        //cargamos los cuestionarios de invitado
        try {
            const respuestaInv = await fetch('../BaseDeDatos/controladores/getCuestionarioInvitado.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(respuestaInv){
                const datosInv = await respuestaInv.json();
                if(datosInv.status === 'success'){
                    if(datosInv.data.length){
                        cuestionariosInvitado = datosInv.data;
                    }
                } else {
                    mostrarMensajeError(datosInv.message || 'Error al obtener los cuestionarios INV');
                }
            }    
        } catch (error) {
             mostrarMensajeError('Error al obtener los cuestionarios INV');
        }
    }

    //FILTROS CUESTIONARIOS - solo si tiene permiso de jugar
    if(tienePermiso('jugar_cuestionario')){
        //cargamos filtro categorias
        try {
            const respuestaCat = await fetch('../BaseDeDatos/controladores/getCategorias.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(respuestaCat){
                const datosCat = await respuestaCat.json();
                if(datosCat.status === 'success'){
                    if(datosCat.data.length){
                        const selectCategoria = document.getElementById("select-categoria");
                        datosCat.data.forEach((categoria) => {
                            const option = document.createElement("option");
                            option.value = categoria.NOMBRE;
                            option.text = categoria.NOMBRE;
                            selectCategoria.appendChild(option);
                        });
                        const option = document.createElement("option");
                        option.value = 'Todas';
                        option.text = 'Todas';
                        selectCategoria.appendChild(option);
                    }
                } else {
                    mostrarMensajeError(datosCat.message || 'Error al obtener las categorias');
                }
            }
        } catch (error) {
            mostrarMensajeError('Error al obtener las categorias');
        }
        
        const filtros = document.getElementById('form_filtros');
        filtros.addEventListener('submit', (e) => {
            e.preventDefault();
            const categoria = document.getElementById("select-categoria").value;
            const calificacion = document.getElementById("select-calificacion").value;
            const errorFiltros = document.getElementById("filtro-error");
            if(!categoria && !calificacion){
                errorFiltros.classList.remove('d-none');
                setTimeout(() => {
                    errorFiltros.classList.add('d-none');
                }, 3000);
            } else {
                errorFiltros.classList.add('d-none');
                const cuestFiltrados = cuestionarios.filter((c) => {
                      const coincideCategoria = !categoria || categoria === 'Todas' || c.CATEGORIA_NOMBRE === categoria;
                      const coincideCalificacion = !calificacion || Math.floor(c.promedio_calificacion) === parseInt(calificacion);
                      return coincideCategoria && coincideCalificacion && c.VISIBILIDAD === 'Publico' && c.ACTIVO === "Activo";
                    });
                if(cuestFiltrados.length){
                    listaCuestionarios(cuestFiltrados);
                } else {
                    document.getElementById("list_title").innerHTML = 'CUESTIONARIOS';
                    const contenedor = document.getElementById("listado_total");
                    contenedor.innerHTML = '<p class="text-center fs-4">No se encontraron cuestionarios</p>';
                    contenedor.scrollIntoView();
                }
                filtros.reset();
            }
        })
    } else {
        document.getElementById('form_filtros').style.display = 'none';
    }

    //Cuestionarios que le han compartido al participante
    if(tienePermiso('jugar_cuestionario')){
        if(cuestionariosInvitado.length){
            cuestionarioInvitado();
        } else {
            document.getElementById("contenedor_cuest_invitado").classList.add("d-none");
        }

        listaCuestionarios(null, false);
        
        const btnTodos = document.getElementById("button_todos");
        if(btnTodos){
            btnTodos.addEventListener("click", () => listaCuestionarios());
        }
    } else {
        document.getElementById("contenedor_cuest_invitado").classList.add("d-none");
        document.getElementById("listado_total").innerHTML = '<h3 class="text-center">No tienes permisos para jugar cuestionarios</h3>';
    }

    // Botón moderador - solo si es moderador
    const btnModerar = document.getElementById("button-moderador");
    if(btnModerar){
        if(esRol('Moderador')){
            moderarCuestionario();
        } else {
            btnModerar.style.display = 'none';
        }
    }
}

window.onload = onloadParticipante;

function cuestionarioInvitado() {
    if(!tienePermiso('jugar_cuestionario')){
        document.getElementById("contenedor_cuest_invitado").classList.add("d-none");
        return;
    }
    
    const contenedor = document.getElementById("lista_cuest_invitado");
    contenedor.innerHTML = '';
    if(cuestionariosInvitado.length){
        document.getElementById("contenedor_cuest_invitado").classList.remove("d-none");
        cuestionariosInvitado.forEach((cuestionario) => {
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-12", "col-md-4", "col-xxl-3");
            const card = document.createElement("div");
            card.classList.add("card", "border_cuest", "overflow-hidden", "h-100", "card_cuest");

            const calificacion = cuestionario.promedio_calificacion || 0;
            let estrellas = "";
            for (let i = 1; i <= 5; i++) {
                estrellas += i <= calificacion ? "★" : "☆";
            }
            card.innerHTML = `
              <img src="${cuestionario.IMAGEN || '../images/fondo_default.jpg'}" class="imagen_card img-fluid mx-auto d-block" alt="imagen cuestionario">
              <div class="card-header">
                  <h5 class="card-title text-center card_titulo">${
                    cuestionario.NOMBRE_CUESTIONARIO
                  }</h5>
              </div>
              <div class="card-body">
                <p class="text-center"><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${
                  cuestionario.cantidad_preguntas
                }</p>
                <p class="text-center"><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${
                  cuestionario.TIEMPO_TOTAL
                    ? cuestionario.TIEMPO_TOTAL + " minutos"
                    : "Libre"
                }</p>
                <div class="rating text-center">
                    <i class="bi bi-star-fill"></i> Valoración: ${estrellas}
                </div>
            </div>
            `;

            card.addEventListener("click", () => participarCuest(cuestionario.ID_VERSION, true));

      colDiv.appendChild(card);
      contenedor.appendChild(colDiv);
    });
  } else {
    document
      .getElementById("contenedor_cuest_invitado")
      .classList.add("d-none");
  }
}

function participarCuest(idVersion, invitacion = false) {
    if(!tienePermiso('jugar_cuestionario')){
        mostrarMensajeError('No tienes permisos para jugar cuestionarios');
        return;
    }
    window.location.href = `../Lobby/lobby.php?version=${idVersion}&invitacion=${invitacion}`;
}

function listaCuestionarios(arrCuest = null, scroll = true) {
    if(!tienePermiso('jugar_cuestionario')){
        document.getElementById("listado_total").innerHTML = '<h3 class="text-center">No tienes permisos para ver cuestionarios</h3>';
        return;
    }
    
    const cuest = arrCuest ? arrCuest : cuestionarios;

  //paginado
  const totalPaginas = Math.ceil(cuest.length / cuestionariosPorPagina);
  const inicio = (paginaActual - 1) * cuestionariosPorPagina;
  const fin = inicio + cuestionariosPorPagina;
  const cuestionariosPagina = cuest.slice(inicio, fin);

    const contenedor = document.getElementById("listado_total");
    contenedor.innerHTML = '';
    if(cuestionariosPagina.length){
        cuestionariosPagina.forEach((cuestionario) => {
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-12", "col-md-4", "col-xxl-3");
            const card = document.createElement("div");
            card.classList.add("card", "border_cuest", "overflow-hidden", "h-100", "card_cuest");
            const calificacion = cuestionario.promedio_calificacion || 0;
            let estrellas = "";
            for (let i = 1; i <= 5; i++) {
                estrellas += i <= calificacion ? "★" : "☆";
            }
            card.innerHTML = `
              <img src="${cuestionario.IMAGEN || '../images/fondo_default.jpg'}" class="imagen_card img-fluid mx-auto d-block" alt="imagen cuestionario">
              <div class="card-header">
                  <h5 class="card-title text-center card_titulo">${
                    cuestionario.NOMBRE_CUESTIONARIO
                  }</h5>
              </div>
              <div class="card-body">
                <p class="text-center"><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${
                  cuestionario.cantidad_preguntas
                }</p>
                <p class="text-center"><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${
                  cuestionario.TIEMPO_TOTAL
                    ? cuestionario.TIEMPO_TOTAL + " minutos"
                    : "Libre"
                }</p>
                <div class="rating text-center">
                    <i class="bi bi-star-fill"></i> Valoración: ${estrellas}
                </div>
              </div>
            `;

      card.addEventListener("click", () =>
        participarCuest(cuestionario.ID_VERSION)
      );

            colDiv.appendChild(card);
            contenedor.appendChild(colDiv);
        });
        if(scroll) {
            contenedor.scrollIntoView()
        };
    }
    if(totalPaginas > 1){
        agregarControlesPaginado(totalPaginas, cuest);
    }
}

function moderarCuestionario(){
    if(!esRol('Moderador')){
        return;
    }
    
    const btnModerar = document.getElementById("button-moderador");
    if(btnModerar){
        btnModerar.addEventListener("click", function(){
            window.location.href = "../Moderador/moderador.php";
        });
    }
}

function moderarCuestionario() {
  const btnModerar = document.getElementById("button-moderador");

  btnModerar.addEventListener("click", function () {
    window.location.href = "../Moderador/moderador.php";
  });
}

function mostrarMensajeError(mensaje) {
  const toastEl = document.getElementById("toast_mensaje_error");
  const toastBody = document.getElementById("mensaje_error");
  toastBody.innerText = mensaje || "Ups, ocurrio un error inesperado";
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function agregarControlesPaginado(totalPaginas, cuestionariosMostrar) {
    const paginador = document.getElementById("paginador");
    if (!paginador) return;

  paginador.innerHTML = "";

    const btnAnterior = document.createElement("button");
    btnAnterior.classList.add("btn", "btn-sm", "me-2", "btn_paginado_color");
    btnAnterior.innerHTML = `<i class="bi bi-arrow-left-circle-fill"></i>`;
    btnAnterior.disabled = (paginaActual === 1);
    btnAnterior.addEventListener("click", () => {
        paginaActual--;
        listaCuestionarios(cuestionariosMostrar);
    });
    paginador.appendChild(btnAnterior);

    const span = document.createElement("span");
    span.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    paginador.appendChild(span);

    const btnSiguiente = document.createElement("button");
    btnSiguiente.classList.add("btn", "btn-sm", "ms-2", "btn_paginado_color");
    btnSiguiente.innerHTML = `<i class="bi bi-arrow-right-circle-fill"></i>`;
    btnSiguiente.disabled = (paginaActual === totalPaginas);
    btnSiguiente.addEventListener("click", () => {
        paginaActual++;
        listaCuestionarios(cuestionariosMostrar);
    });
    paginador.appendChild(btnSiguiente);
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