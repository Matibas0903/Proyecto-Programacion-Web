let cuestionarios = [];

let plantillas = [];

//varible para manejar id seleccionado
let idCuestionarioActual = null;

 async function onloadAdministrador(){
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
            if(datos.status === 'success' && datos.data.length){
                cuestionarios = datos.data;
            }else{
                document.getElementById("lista_cuestionarios").innerHTML = '<h4 class="text-center">Aun no tienes cuestionarios creados</h4>';
            }
        }
    } catch (error) {
        console.error('Error al cargar los cuestionarios: ', error);
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
            if(datosPlantillas.status === 'success' && datosPlantillas.data.length){
                plantillas = datosPlantillas.data;
            }else{
                document.getElementById("lista_plantillas").innerHTML = '<h4 class="text-center">No hay plantillas disponibles</h4>';
            }
        }
        
    } catch (error) {
        console.error('Error al cargar las plantillas: ', error);
    }

    //cargar lista cuestionarios
    const lista_cuestionarios = document.getElementById("lista_cuestionarios");
    if(cuestionarios.length){
        cuestionarios.forEach((cuestionario, i) => {
            if(i >= 3) return; //mostrar solo los primeros 3 cuestionarios (Luego cambiar a favoritos??)
            const divCuestionario = document.createElement("div");
            divCuestionario.classList.add("p-2");
            divCuestionario.innerHTML = `
              <div class="d-flex justify-content-between">
                  <h3>${cuestionario.nombre}</h3> 
                  <h2 class="id_cuestionario">${cuestionario.id}</h2>
              </div>
              <div class="row row-cols-auto">
                <div class="col">
                  <button class="card_orange no_border button_orange" id="button_ver"><i class="bi bi-list-columns"></i> Gestionar</button>
                </div>
                <div class="col">
                  ${cuestionario.activo && cuestionario.cod_acceso? 
                    '<button class="card_orange no_border button_orange" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>'
                    : '<p>Sin versión activa</p>'
                  } 
                </div>
              </div>
              <hr class="divider">
            `;
            lista_cuestionarios.appendChild(divCuestionario);

            divCuestionario.querySelector("#button_ver").addEventListener("click", () => {
                ver('cuestionario', cuestionario.id)
            });
            if(cuestionario.activo && cuestionario.cod_acceso){
                divCuestionario.querySelector("#button_compartir").addEventListener("click", () => {
                    compartir('cuestionario', cuestionario.id)
                });
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
            divPlantilla.innerHTML = `
              <div class="d-flex justify-content-between">
                  <h3>${plantilla.nombre}</h3> 
                  <h2 class="id_plantilla">${plantilla.id}.${plantilla.num_version}</h2>
              </div>
              <div class="row row-cols-auto">
                <div class="col">
                  <button class="card_yellow no_border button_yellow" id="button_usar"><i class="bi bi-check-circle-fill"></i> Usar</button>
                </div>
                <div class="col">
                  <button class="card_yellow no_border button_yellow" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>
                </div>
                ${
                    plantilla.activo && !plantilla.isOwner ?'<div class="col"><button class="card_yellow no_border button_yellow" id="button_jugarPlantilla"><i class="bi bi-rocket-takeoff-fill"></i> Jugar</button></div>'
                        : ''
                }
              </div>
              <hr class="divider">
            `;
            lista_plantillas.appendChild(divPlantilla);

            divPlantilla.querySelector("#button_usar").addEventListener("click", () => {
                usarPlantilla(plantilla.id)
            });
            divPlantilla.querySelector("#button_compartir").addEventListener("click", () => {
                compartir('plantilla', plantilla.id)
            });
            if(plantilla.activo && !plantilla.isOwner){
                divPlantilla.querySelector("#button_jugarPlantilla").addEventListener("click", () => {
                    jugarPlantilla();
                });
            }
        });
        if(plantillas.length > 4){
            const masPlantillas = document.getElementById("mas_plantillas");
            masPlantillas.addEventListener("click", () => verMasPlantillas());
            masPlantillas.classList.remove("d-none")
        }
    }

    //botones
    document.getElementById("button_crear").addEventListener("click", () => crearCuestionario());
    document.getElementById("button_unirme").addEventListener("click", () => unirmeCuestionario());

    //Buscador cuestionarios
    const formCuestionarios = document.getElementById("formId");
    formCuestionarios.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreCuest = document.getElementById("nombreCuest");
        const inputValid = nombreCuest.value && nombreCuest.value.length <= 300;
        if (inputValid){
            nombreCuest.classList.remove('is-invalid')
            const cuestFiltrados = cuestionarios.filter(c => c.nombre.toLowerCase().includes(nombreCuest.value.toLowerCase()));
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
    window.location.href = "../Agregar pregunta/agregarPregunta.php";
}

function unirmeCuestionario(){
    window.location.href = "../participante/participante.php";
}

function usarPlantilla(id){
    //ENVIO PARAMETRO DE CUESTIONARIO Y VERSION
    window.location.href = "../Seleccionar Plantilla/SeleccionarPlantilla.php";
}
function jugarPlantilla(){
    //ENVIO PARAMETRO DE CUESTIONARIO Y VERSION
    window.location.href = "../Lobby/lobby.php";
}
function ver(type, id){
    if(type === 'cuestionario'){
        window.location.href = `../versiones/versiones.php?cuestionario=${id}`;
    }
}
function editar(type, id){
    if(type === 'cuestionario'){
        //AGREGAR ENLACE A PANTALLA CUESTIONARIO
    }else if(type === 'plantilla'){
        //AGREGAR ENLACE A PANTALLA PLANTILLA
    }
    console.log("Editar " + type + " con id: " + id);
}
function compartir(type, id){
    let enlaceCuestionario = '';
    if(type === 'cuestionario'){
        cuestionarios.forEach(cuestionario => {
            if(cuestionario.id === id){
                enlaceCuestionario = cuestionario.cod_acceso;
            }
        })
    } else if(type === 'plantilla'){
        plantillas.forEach(plantilla => {
            if(plantilla.id === id){
                enlaceCuestionario = plantilla.enlace;
            }
        })
    }
    if(enlaceCuestionario){
        const modalCompartir = new bootstrap.Modal(document.getElementById('modalCompartir'));
        document.getElementById("modalTitulo").innerText = `Compartir ${type === 'cuestionario' ? 'Cuestionario' : 'Plantilla'}`;
        document.getElementById("enlace").innerText = enlaceCuestionario;
        modalCompartir.show();
    }
}

function verMasCuestionarios(arrCuest = null){
    const cuest = arrCuest ? arrCuest : cuestionarios;
    document.getElementById("list_title").innerHTML = 'CUESTIONARIOS';
    const contenedor = document.getElementById("listado_total");
    contenedor.innerHTML = '';
    cuest.forEach((cuestionario) => {
        const divCuestionario = document.createElement("div");
        divCuestionario.classList.add("card", "border_cuest", "card_orange", "my-2");
        divCuestionario.innerHTML = `
         <div class="card-body">
          <div class="d-flex justify-content-between">
              <h3>${cuestionario.nombre}</h3> 
              <h2 class="id_cuestionario">${cuestionario.id}</h2>
          </div>
          <div class="row row-cols-auto">
            <div class="col">
              <button class="card_orange no_border button_orange" id="button_ver"><i class="bi bi-list-columns"></i> Gestionar</button>
            </div>
            <div class="col">
              ${cuestionario.activo && cuestionario.cod_acceso? 
                '<button class="card_orange no_border button_orange" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>'
                : '<p>Sin versión activa</p>'
              } 
            </div>
          </div>
         </div>
        `;
        contenedor.appendChild(divCuestionario);
        divCuestionario.querySelector("#button_ver").addEventListener("click", () => {
            ver('cuestionario', cuestionario.id)
        });
        if(cuestionario.activo && cuestionario.cod_acceso){
            divCuestionario.querySelector("#button_compartir").addEventListener("click", () => {
                compartir('cuestionario', cuestionario.id)
            });
        }
    });
    contenedor.scrollIntoView();
}

function verMasPlantillas(){
    document.getElementById("list_title").innerHTML = 'PLANTILLAS';
    const contenedor = document.getElementById("listado_total");
    contenedor.innerHTML = '';
    plantillas.forEach((plantilla) => {
        const divPlantilla = document.createElement("div");
        divPlantilla.classList.add("card", "border_cuest", "card_yellow", "my-2");
        divPlantilla.innerHTML = `
         <div class="card-body">
            <div class="d-flex justify-content-between">
                <h3>${plantilla.nombre}</h3> 
                <h2 class="id_plantilla">${plantilla.id}</h2>
            </div>
            <div class="row row-cols-auto">
              <div class="col">
                <button class="card_yellow no_border button_yellow" id="button_usar"><i class="bi bi-check-circle-fill"></i> Usar</button>
              </div>
              <div class="col">
                <button class="card_yellow no_border button_yellow" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>
              </div>
                ${
                    plantilla.activo && !plantilla.isOwner ?'<div class="col"><button class="card_yellow no_border button_yellow" id="button_jugarPlantilla"><i class="bi bi-rocket-takeoff-fill"></i> Jugar</button></div>'
                        : ''
                }
            </div>
         </div>
        `;
        contenedor.appendChild(divPlantilla);
        divPlantilla.querySelector("#button_usar").addEventListener("click", () => {
            usarPlantilla(plantilla.id)
        });
        divPlantilla.querySelector("#button_compartir").addEventListener("click", () => {
            compartir('plantilla', plantilla.id)
        });
        if(plantilla.activo && !plantilla.isOwner){
            divPlantilla.querySelector("#button_jugarPlantilla").addEventListener("click", () => {
                jugarPlantilla();
            });
        }
    });
    contenedor.scrollIntoView();
}
