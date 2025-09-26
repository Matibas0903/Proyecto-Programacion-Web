//EJEMPLO USUARIO ADMINISTRADOR
const administrador = {
    nombre: "Usuario Prueba",
    avatar: "./images/perrito-avatar.jpg"
}
//EJEMPLO LISTA DE CUESTIONARIOS
const cuestionarios = [
    {
        nombre: "Cuestionario Historia",
        id: 3,
        codigo: "HIST123",
        habilitado: true
    },
    {
        nombre: "Cuestionario Cine",
        id: 5,
        codigo: "CINE456"
    },
    {
        nombre: "Cuestionario Clase Front-End",
        id: 6,
        codigo: "FRONT789"
    },
    {
        nombre: "Cuestionario Clase Programación 1",
        id: 10,
        codigo: "PROG101"
    },
    {
        nombre: "Cuestionario Matemática 2",
        id: 2,
        codigo: "MATE202"
    }
]
//EJEMPLO LISTA DE PLANTILLAS
const plantillas = [
    {
        nombre: "Historia",
        id: 3,
        enlace: "historia.html"
    },
    {
        nombre: "Geografía",
        id: 5,
        enlace: "geografia.html"
    },
    {
        nombre: "Matemáticas",
        id: 6,
        enlace: "matematicas.html"
    },
    {
        nombre: "Programación",
        id: 10,
        enlace: "programacion.html"
    },
    {
        nombre: "Cine",
        id: 2,
        enlace: "cine.html"
    },
    {
        nombre: "Deportes",
        id: 4,
        enlace: "deportes.html"
    }
]

function onloadAdministrador(){
    //cargar datos usuario
    if(administrador.avatar){
        document.getElementById("img_usuario").src = administrador.avatar;
    }
    if(administrador.nombre){
        document.getElementById("name_usuario").innerText = administrador.nombre;
    }
    //cargar lista cuestionarios
    const lista_cuestionarios = document.getElementById("lista_cuestionarios");
    if(cuestionarios.length){
        cuestionarios.forEach(cuestionario => {
            const divCuestionario = document.createElement("div");
            divCuestionario.classList.add("p-2");
            divCuestionario.innerHTML = `
              <div class="d-flex justify-content-between">
                  <h3>${cuestionario.nombre}</h3> 
                  <h2>${cuestionario.id}</h2>
              </div>
              <div class="row row-cols-auto">
                <div class="col">
                  <button class="card_orange no_border button_orange" id="button_ver">Ver</button>
                </div>
                <div class="col">
                  <button class="card_orange no_border button_orange" id="button_editar">Editar</button>
                </div>
                <div class="col">
                  <button class="card_orange no_border button_orange" id="button_compartir">Compartir</button>
                </div>
              </div>
              <hr class="divider">
            `;
            lista_cuestionarios.appendChild(divCuestionario);

            const botonesVer = divCuestionario.querySelector("#button_ver").addEventListener("click", () => {
                ver('cuestionario', cuestionario.id)
            });
            const botonesEditar = divCuestionario.querySelector("#button_editar").addEventListener("click", () => {
                editar('cuestionario', cuestionario.id)
            });
            const botonesCompartir = divCuestionario.querySelector("#button_compartir").addEventListener("click", () => {
                editar('cuestionario', cuestionario.id)
            });
        });
    }

    //cargar lista plantillas
    const lista_plantillas = document.getElementById("lista_plantillas");
    if(plantillas.length){
        plantillas.forEach(plantilla => {
            const divPlantilla = document.createElement("div");
            divPlantilla.classList.add("p-2");
            divPlantilla.innerHTML = `
              <div class="d-flex justify-content-between">
                  <h3>${plantilla.nombre}</h3> 
                  <h2>${plantilla.id}</h2>
              </div>
              <div class="row row-cols-auto">
                <div class="col">
                  <button class="card_yellow no_border button_yellow">Usar</button>
                </div>
                <div class="col">
                  <button class="card_yellow no_border button_yellow">Ver</button>
                </div>
                <div class="col">
                  <button class="card_yellow no_border button_yellow">Compartir</button>
                </div>
              </div>
              <hr class="divider">
            `;
            lista_plantillas.appendChild(divPlantilla);
        });
    }

}

function usar(type, id){

}
function ver(type, id){
    if(type === 'cuestionario'){
        //AGREGAR ENLACE A PANTALLA CUESTIONARIO
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

}

function elementEvents(){

}

window.onload = onloadAdministrador;




