//EJEMPLO USUARIO ADMINISTRADOR, FALTA DEFINIR CAMPOS!!!
const administrador = {
    nombre: "",
    avatar: ""
}
//EJEMPLO LISTA DE CUESTIONARIOS, FALTA DEFINIR CAMPOS!!!
let cuestionarios = [
    {
        nombre: "Cuestionario Historia",
        id: 3,
        codigo: "HIST123",
        habilitado: true
    },
    {
        nombre: "Cuestionario Cine",
        id: 5,
        codigo: "CINE456",
        habilitado: false
    },
    {
        nombre: "Cuestionario Clase Front-End",
        id: 6,
        codigo: "FRONT789",
        habilitado: true
    },
    {
        nombre: "Cuestionario Clase Programación 1",
        id: 10,
        codigo: "PROG101",
        habilitado: false
    },
    {
        nombre: "Cuestionario Matemática 2",
        id: 2,
        codigo: "MATE202",
        habilitado: true
    }
]
//EJEMPLO LISTA DE PLANTILLAS, FALTA DEFINIR CAMPOS!!!
const plantillas = [
    {
        nombre: "Historia",
        id: 3,
        enlace: "historia.com"
    },
    {
        nombre: "Geografía",
        id: 5,
        enlace: "geografia.com"
    },
    {
        nombre: "Matemáticas",
        id: 6,
        enlace: "matematicas.com"
    },
    {
        nombre: "Programación",
        id: 10,
        enlace: "programacion.com"
    },
    {
        nombre: "Cine",
        id: 2,
        enlace: "cine.com"
    },
    {
        nombre: "Deportes",
        id: 4,
        enlace: "deportes.com"
    }
]
//EJEMPLO LISTA DE USUARIOS, FALTA DEFINIR CAMPOS!!!
const usuariosTotales = [
    {
        nombre: "",
        avatar: "",
        id: 1
    },
    {
        nombre: "Pepe Argento",
        avatar: "./images/perrito-avatar.jpg",
        id: 2
    },
    {
        nombre: "Fantasmita",
        avatar: "./images/invitado.png",
        id: 3
    }
]
//varible para manejar id seleccionado
let idCuestionarioActual = null;

function onloadAdministrador(){
    //cargar datos usuario
    /*if(administrador.avatar){
        document.getElementById("img_usuario").src = administrador.avatar;
        document.getElementById("navbarImg").src = administrador.avatar;
    }*/
    if(administrador.nombre){
        document.getElementById("name_usuario").innerText = administrador.nombre;
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
                  <button class="card_orange no_border button_orange" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>
                </div>
              </div>
              <hr class="divider">
            `;
            lista_cuestionarios.appendChild(divCuestionario);

            divCuestionario.querySelector("#button_ver").addEventListener("click", () => {
                ver('cuestionario', cuestionario.id)
            });
            divCuestionario.querySelector("#button_compartir").addEventListener("click", () => {
                compartir('cuestionario', cuestionario.id)
            });
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
            if(i >= 4) return; //mostrar solo los primeros 4 plantillas (Luego cambiar a favoritos??)
            const divPlantilla = document.createElement("div");
            divPlantilla.classList.add("p-2");
            divPlantilla.innerHTML = `
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
                <div class="col">
                  <button class="card_yellow no_border button_yellow" id="button_jugarPlantilla">Jugar</button>
                </div>
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
            divPlantilla.querySelector("#button_jugarPlantilla").addEventListener("click", () => {
                jugarPlantilla();
            });
        });
        if(plantillas.length > 3){
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
        const inputValid = nombreCuest.value && nombreCuest.value.length <= 50;
        if (inputValid){
            nombreCuest.classList.remove('is-invalid')
            nombreCuest.classList.add('is-valid')
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
            nombreCuest.classList.remove('is-valid')
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
    window.location.href = "../Seleccionar Plantilla/SeleccionarPlantilla.php";
}
function jugarPlantilla(){
    window.location.href = "../Lobby/lobby.php";
}
function ver(type, id){
    if(type === 'cuestionario'){
        window.location.href = "../versiones/versiones.php";
    }else if(type === 'plantilla'){
        //AGREGAR ENLACE A PANTALLA PLANTILLA
    }
    console.log("Ver " + type + " con id: " + id);
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
                enlaceCuestionario = cuestionario.codigo;
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
              <button class="card_orange no_border button_orange" id="button_compartir"><i class="bi bi-key-fill"></i> Compartir</button>
            </div>
          </div>
         </div>
        `;
        contenedor.appendChild(divCuestionario);
        divCuestionario.querySelector("#button_ver").addEventListener("click", () => {
            ver('cuestionario', cuestionario.id)
        });
        divCuestionario.querySelector("#button_compartir").addEventListener("click", () => {
            compartir('cuestionario', cuestionario.id)
        });
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
    });
    contenedor.scrollIntoView();
}
