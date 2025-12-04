let cuestionarios = [];

let plantillas = [];

//varible para manejar id seleccionado
let idCuestionarioActual = null;

let userPermisos = {
    roles: [],
    permisos: []
};

 async function onloadAdministrador(){
    await obtenerPermisosUsuario();
    //Traemos los cuestionarios
    try {
        const respuesta = await fetch('../BaseDeDatos/controladores/getCuestionariosAdministrador.php', {
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
                }else{
                    document.getElementById("lista_cuestionarios").innerHTML = '<h4 class="text-center">Aun no tienes cuestionarios creados</h4>';
                }
            }else{
                mostrarMensajeError(datos.message || 'Error al obtener los cuestionarios');
            }
        }
    } catch (error) {
        mostrarMensajeError('Error al obtener los cuestionarios');
    }
    //Traemos las plantillas
    try {
        const respPlantillas = await fetch('../BaseDeDatos/controladores/getPlantillas.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(respPlantillas){
            const datosPlantillas = await respPlantillas.json();
            if(datosPlantillas.status === 'success'){
                if(datosPlantillas.data.length){
                    plantillas = datosPlantillas.data;
                }else{
                    document.getElementById("lista_plantillas").innerHTML = '<h4 class="text-center">No hay plantillas disponibles</h4>';
                }  
            }else{
                mostrarMensajeError(datosPlantillas.message || 'Error al obtener las plantillas');
            }
        }
        
    } catch (error) {
        mostrarMensajeError('Error al obtener las plantillas');
    }

    //cargar lista cuestionarios
    const lista_cuestionarios = document.getElementById("lista_cuestionarios");
    if(cuestionarios.length){
        cuestionarios.forEach((cuestionario, i) => {
            if(i >= 3) return;
            const divCuestionario = document.createElement("div");
            divCuestionario.classList.add("p-2");

            //permisos para mostrar botones
            const puedeVerVersiones = tienePermiso('ver_versiones');
            const puedeCompartir = tienePermiso('compartir_link');

            divCuestionario.innerHTML = `
              <div class="d-flex justify-content-between">
                  <h3>${cuestionario.NOMBRE_CUESTIONARIO}</h3> 
                  <h2 class="id_cuestionario">${cuestionario.ID_CUESTIONARIO}</h2>
              </div>
              <div class="row row-cols-auto">
                ${puedeVerVersiones ? `
                    <div class="col">
                    <button class="card_orange no_border button_orange" id="button_ver"><i class="bi bi-list-columns"></i> Gestionar</button>
                    </div>
                    ` : ''
                }
                ${puedeCompartir ? `
                    <div class="col">
                    ${cuestionario.ACTIVO === 'Activo' && cuestionario.COD_ACCESO ?
                        '<button class="card_orange no_border button_orange" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>'
                        : '<p>Sin versión activa</p>'
                    } 
                    </div>
                    ` : ''
                }
              </div>
              <hr class="divider">
            `;
            lista_cuestionarios.appendChild(divCuestionario);
            if (puedeVerVersiones) {
                const btnVer = divCuestionario.querySelector("#button_ver");
                if (btnVer) {
                    btnVer.addEventListener("click", () => {
                        ver('cuestionario', cuestionario.ID_CUESTIONARIO)
                    });
                }
            }
            
            if (puedeCompartir && cuestionario.ACTIVO === 'Activo' && cuestionario.COD_ACCESO) {
                const btnCompartir = divCuestionario.querySelector("#button_compartir");
                if (btnCompartir) {
                    btnCompartir.addEventListener("click", () => {
                        compartir('cuestionario', cuestionario.COD_ACCESO)
                    });
                }
            }
        });
        if(cuestionarios.length > 3){
            const masCuestionarios = document.getElementById("mas_cuestionarios");
            masCuestionarios.addEventListener("click", () => verMasCuestionarios());
            masCuestionarios.classList.remove("d-none")
        }
    }

    //cargar lista plantillas
    const lista_plantillas = document.getElementById("lista_plantillas");
    if(plantillas.length){
        plantillas.forEach((plantilla, i) => {
            if(i >= 4) return; //mostrar solo los primeros 4 plantillas
            const divPlantilla = document.createElement("div");
            divPlantilla.classList.add("p-2");

            const crearCuestionarioPermiso = tienePermiso('crear_cuestionario');
            const puedeJugar = tienePermiso('jugar_cuestionario');
            const puedeCompartir = tienePermiso('compartir_link');
            divPlantilla.innerHTML = `
              <div class="d-flex justify-content-between">
                  <h3>${plantilla.NOMBRE_CUESTIONARIO}</h3> 
                  <h2 class="id_plantilla">${plantilla.ID_CUESTIONARIO}.${plantilla.NUM_VERSION}</h2>
              </div>
              <div class="row row-cols-auto">
                ${crearCuestionarioPermiso ? `
                    <div class="col">
                      <button class="card_yellow no_border button_yellow" id="button_usar"><i class="bi bi-check-circle-fill"></i> Usar</button>
                    </div>
                    ` : ''
                }
                ${puedeCompartir ? `
                    <div class="col">
                        <button class="card_yellow no_border button_yellow" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>
                    </div>
                    ` : ''
                }
                ${puedeJugar && plantilla.ACTIVO === 'Activo' && !plantilla.isOwner ? `
                    <div class="col">
                        <button class="card_yellow no_border button_yellow" id="button_jugarPlantilla"><i class="bi bi-rocket-takeoff-fill"></i> Jugar</button>
                    </div>
                    ` : ''
                }
              </div>
              <hr class="divider">
            `;
            lista_plantillas.appendChild(divPlantilla);
            if(crearCuestionarioPermiso){
                divPlantilla.querySelector("#button_usar").addEventListener("click", () => {
                    usarPlantilla(plantilla.ID_VERSION)
                });
            }
            if (puedeCompartir) {
                const btnCompartir = divPlantilla.querySelector("#button_compartir");
                if (btnCompartir) {
                    btnCompartir.addEventListener("click", () => {
                        compartir('plantilla', plantilla.COD_ACCESO)
                    });
                }
            }
            
            if (puedeJugar && plantilla.ACTIVO === 'Activo' && !plantilla.isOwner) {
                const btnJugar = divPlantilla.querySelector("#button_jugarPlantilla");
                if (btnJugar) {
                    btnJugar.addEventListener("click", () => {
                        jugarPlantilla(plantilla.ID_VERSION);
                    });
                }
            }
        });
        if(plantillas.length > 4){
            const masPlantillas = document.getElementById("mas_plantillas");
            masPlantillas.addEventListener("click", () => verMasPlantillas());
            masPlantillas.classList.remove("d-none")
        }
    }

    //botones
    if(!tienePermiso('crear_cuestionario')){
        document.getElementById("button_crear").style.display = 'none';
    } else {
        document.getElementById("button_crear").addEventListener("click", () => crearCuestionario());
    }
    if(!esRol('Participante')){
        document.getElementById("button_unirme").style.display = 'none';
    } else {
        document.getElementById("button_unirme").addEventListener("click", () => unirmeCuestionario());
    }

    //Buscador cuestionarios
    const formCuestionarios = document.getElementById("formId");
    formCuestionarios.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreCuest = document.getElementById("nombreCuest");
        const inputValid = nombreCuest.value && nombreCuest.value.length <= 300;
        if (inputValid){
            nombreCuest.classList.remove('is-invalid')
            const cuestFiltrados = cuestionarios.filter(c => c.NOMBRE_CUESTIONARIO.toLowerCase().includes(nombreCuest.value.toLowerCase()));
            if(cuestFiltrados.length){
                verMasCuestionarios(cuestFiltrados);
                formCuestionarios.reset();
            } else {
                document.getElementById("list_title").innerHTML = 'CUESTIONARIOS';
                const contenedor = document.getElementById("listado_total");
                contenedor.innerHTML = '<p class="text-center fs-4">No se encontraron cuestionarios</p>';
                contenedor.scrollIntoView();
            }
        } else {
            nombreCuest.classList.add('is-invalid')
        }
    })

}

window.onload = onloadAdministrador;

function crearCuestionario(){
    if (!tienePermiso('crear_cuestionario')) {
        mostrarMensajeError('No tienes permisos para crear cuestionarios');
        return;
    }
    window.location.href = "../Agregar pregunta/agregarPregunta.php";
}

function unirmeCuestionario(){
     if (!tienePermiso('jugar_cuestionario')) {
        mostrarMensajeError('No tienes permisos para unirte a cuestionarios');
        return;
    }
    window.location.href = "../participante/participante.php";
}

function usarPlantilla(idVersion){
    if (!tienePermiso('crear_cuestionario')) {
        mostrarMensajeError('No tienes permisos para crear cuestionarios');
        return;
    }
    window.location.href = `../Seleccionar Plantilla/SeleccionarPlantilla.php?id_version=${idVersion}`;
}
function jugarPlantilla(idVersion){
    if (!tienePermiso('jugar_cuestionario')) {
        mostrarMensajeError('No tienes permisos para jugar cuestionarios');
        return;
    }
    window.location.href = `../Lobby/lobby.php?version=${idVersion}`;
}
function ver(type, id){
    if(type === 'cuestionario'){
        if (!tienePermiso('ver_versiones')) {
            mostrarMensajeError('No tienes permisos para ver versiones');
            return;
        }
        window.location.href = `../versiones/versiones.php?cuestionario=${id}`;
    }
}

function compartir(type, cod_acceso){ 
    if (!tienePermiso('compartir_link')) {
        mostrarMensajeError('No tienes permisos para compartir');
        return;
    }
    const modalCompartir = new bootstrap.Modal(document.getElementById('modalCompartir'));
    document.getElementById("modalTitulo").innerText = `Compartir ${type === 'cuestionario' ? 'Cuestionario' : 'Plantilla'}`;
    document.getElementById("enlace").innerText = cod_acceso;
    modalCompartir.show();  
}

function verMasCuestionarios(arrCuest = null){
    const cuest = arrCuest ? arrCuest : cuestionarios;
    document.getElementById("list_title").innerHTML = 'CUESTIONARIOS';
    const contenedor = document.getElementById("listado_total");
    contenedor.innerHTML = '';

    const puedeVerVersiones = tienePermiso('ver_versiones');
    const puedeCompartir = tienePermiso('compartir_link');
    cuest.forEach((cuestionario) => {
        const divCuestionario = document.createElement("div");
        divCuestionario.classList.add("card", "border_cuest", "card_orange", "my-2");
        divCuestionario.innerHTML = `
         <div class="card-body">
          <div class="d-flex justify-content-between">
              <h3>${cuestionario.NOMBRE_CUESTIONARIO}</h3> 
              <h2 class="id_cuestionario">${cuestionario.ID_CUESTIONARIO}</h2>
          </div>
          <div class="row row-cols-auto">
            ${puedeVerVersiones ? `
                <div class="col">
                <button class="card_orange no_border button_orange" id="button_ver"><i class="bi bi-list-columns"></i> Gestionar</button>
                </div>
                ` : ''
            }
            ${puedeCompartir ? `
                <div class="col">
                ${cuestionario.ACTIVO === 'Activo' && cuestionario.COD_ACCESO ?
                    '<button class="card_orange no_border button_orange" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>'
                    : '<p>Sin versión activa</p>'
                } 
                </div>
                ` : ''
            }
          </div>
         </div>
        `;
        contenedor.appendChild(divCuestionario);
        if (puedeVerVersiones) {
            const btnVer = divCuestionario.querySelector("#button_ver");
            if (btnVer) {
                btnVer.addEventListener("click", () => {
                    ver('cuestionario', cuestionario.ID_CUESTIONARIO)
                });
            }
        }
        
        if (puedeCompartir && cuestionario.ACTIVO === 'Activo' && cuestionario.COD_ACCESO) {
            const btnCompartir = divCuestionario.querySelector("#button_compartir");
            if (btnCompartir) {
                btnCompartir.addEventListener("click", () => {
                    compartir('cuestionario', cuestionario.COD_ACCESO)
                });
            }
        }
    });
    contenedor.scrollIntoView();
}

function verMasPlantillas(){
    document.getElementById("list_title").innerHTML = 'PLANTILLAS';
    const contenedor = document.getElementById("listado_total");
    contenedor.innerHTML = '';

    const crearCuestionarioPermiso = tienePermiso('crear_cuestionario');
    const puedeJugar = tienePermiso('jugar_cuestionario');
    const puedeCompartir = tienePermiso('compartir_link');
    plantillas.forEach((plantilla) => {
        const divPlantilla = document.createElement("div");
        divPlantilla.classList.add("card", "border_cuest", "card_yellow", "my-2");
        divPlantilla.innerHTML = `
         <div class="card-body">
            <div class="d-flex justify-content-between">
                <h3>${plantilla.NOMBRE_CUESTIONARIO}</h3> 
                <h2 class="id_plantilla">${plantilla.ID_CUESTIONARIO}.${plantilla.NUM_VERSION}</h2>
            </div>
            <div class="row row-cols-auto">
                ${crearCuestionarioPermiso ? `
                    <div class="col">
                      <button class="card_yellow no_border button_yellow" id="button_usar"><i class="bi bi-check-circle-fill"></i> Usar</button>
                    </div>
                    ` : ''
                }
                ${puedeCompartir ? `
                    <div class="col">
                        <button class="card_yellow no_border button_yellow" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>
                    </div>
                    ` : ''
                }
                ${puedeJugar && plantilla.ACTIVO === 'Activo' && !plantilla.isOwner ? `
                    <div class="col">
                        <button class="card_yellow no_border button_yellow" id="button_jugarPlantilla"><i class="bi bi-rocket-takeoff-fill"></i> Jugar</button>
                    </div>
                    ` : ''
                }
            </div>
         </div>
        `;
        contenedor.appendChild(divPlantilla);
        if(crearCuestionarioPermiso){
            divPlantilla.querySelector("#button_usar").addEventListener("click", () => {
                usarPlantilla(plantilla.ID_VERSION)
            });
        }
        if (puedeCompartir) {
            const btnCompartir = divPlantilla.querySelector("#button_compartir");
            if (btnCompartir) {
                btnCompartir.addEventListener("click", () => {
                    compartir('plantilla', plantilla.COD_ACCESO)
                });
            }
        }
        
        if (puedeJugar && plantilla.ACTIVO === 'Activo' && !plantilla.isOwner) {
            const btnJugar = divPlantilla.querySelector("#button_jugarPlantilla");
            if (btnJugar) {
                btnJugar.addEventListener("click", () => {
                    jugarPlantilla(plantilla.ID_VERSION);
                });
            }
        }
    });
    contenedor.scrollIntoView();
}

function mostrarMensajeError(mensaje){
    const toastEl = document.getElementById('toast_mensaje_error');
    const toastBody = document.getElementById('mensaje_error');
    toastBody.innerText = mensaje || 'Ups, ocurrio un error inesperado';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
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
