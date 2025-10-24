//EJEMPLO USUARIO, SOLO PARA MOSTRAR DATA!!!
const usuario = {
    nombre: "Usuario Prueba",
    avatar: "../administrador/images/perrito-avatar.jpg",
    cuestionariosParticipante: [6, 10]
}
//EJEMPLO LISTA DE CUESTIONARIOS, SOLO PARA MOSTRAR DATA!!!
let cuestionarios = [
    {
        nombre: "Cuestionario Historia",
        id: 3,
        codigo: "HIST123",
        habilitado: true,
        tipo: 'publico',
        preguntas: 10,
        tiempo: 15,
        categoria: 'historia',
        calificacion: 3,
        imagen: 'https://i.pinimg.com/736x/06/d2/cf/06d2cfa5cd7f8fbe8e94ef5d75496a75.jpg'
    },
    {
        nombre: "Cuestionario Cine",
        id: 5,
        codigo: "CINE456",
        habilitado: true,
        tipo: 'publico',
        preguntas: 5,
        tiempo: null,
        categoria: 'varios',
        calificacion: 3,
        imagen: 'https://i.pinimg.com/1200x/31/81/2b/31812b668760eb3bba7fb1ec63177d47.jpg'
    },
    {
        nombre: "Cuestionario Clase Front-End",
        id: 6,
        codigo: "FRONT789",
        habilitado: true,
        tipo: 'privado',
        preguntas: 15,
        tiempo: 30,
        categoria: 'programación',
        calificacion: 4,
        imagen: 'https://i.pinimg.com/736x/7f/e1/85/7fe1858030393b64f7467e5a90761b66.jpg'
    },
    {
        nombre: "Cuestionario Clase Programación 1",
        id: 10,
        codigo: "PROG101",
        habilitado: true,
        tipo: 'privado',
        preguntas: 7,
        tiempo: null,
        categoria: 'programación',
        calificacion: 5,
        imagen: 'https://i.pinimg.com/1200x/0e/4f/dc/0e4fdce8ac22e09688c580e5bc4dcd7d.jpg'
    },
    {
        nombre: "Cuestionario Matemática 2",
        id: 2,
        codigo: "MATE202",
        habilitado: true,
        tipo: 'publico',
        preguntas: 5,
        tiempo: 20,
        categoria: 'matemática',
        calificacion: 4,
        imagen: 'https://i.pinimg.com/736x/ae/69/d0/ae69d02a7332a6efa533951431c94c12.jpg'
    },
    {
        nombre: "Cuestionario Historia Argentina",
        id: 13,
        codigo: "HISTARG1",
        habilitado: true,
        tipo: 'publico',
        preguntas: 12,
        tiempo: 30,
        categoria: 'historia',
        calificacion: 2,
        imagen: 'https://i.pinimg.com/736x/06/d2/cf/06d2cfa5cd7f8fbe8e94ef5d75496a75.jpg'
    },
    {
        nombre: "Cuestionario Series",
        id: 50,
        codigo: "SERIES222",
        habilitado: true,
        tipo: 'publico',
        preguntas: 8,
        tiempo: null,
        categoria: 'varios',
        calificacion: 4,
        imagen: 'https://i.pinimg.com/1200x/31/81/2b/31812b668760eb3bba7fb1ec63177d47.jpg'
    },
    {
        nombre: "Logica de Programación",
        id: 26,
        codigo: "PROG111",
        habilitado: true,
        tipo: 'publico',
        preguntas: 20,
        tiempo: null,
        categoria: 'programación',
        calificacion: 3,
        imagen: 'https://i.pinimg.com/736x/7f/e1/85/7fe1858030393b64f7467e5a90761b66.jpg'
    },
    {
        nombre: "Cuestionario Matemática 3",
        id: 20,
        codigo: "MATE300",
        habilitado: true,
        tipo: 'publico',
        preguntas: 10,
        tiempo: 40,
        categoria: 'matemática',
        calificacion: 4,
        imagen: 'https://i.pinimg.com/736x/ae/69/d0/ae69d02a7332a6efa533951431c94c12.jpg'
    }
]

function onloadParticipante(){
    //Buscador cuestionarios
    const formCuestionarios = document.getElementById("formId");
    formCuestionarios.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreCuest = document.getElementById("nombreCuest");
        const inputValid = nombreCuest.value && nombreCuest.value.length <= 50;
        if (inputValid){
            nombreCuest.classList.remove('is-invalid')
            const cuestFiltrados = cuestionarios.filter(c => c.nombre.toLowerCase().includes(nombreCuest.value.toLowerCase()) && c.tipo ==='publico' && c.habilitado);
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

    //FILTROS CUESTIONARIOS
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
                  const coincideCategoria = !categoria || c.categoria === categoria;
                  const coincideCalificacion = !calificacion || c.calificacion === parseInt(calificacion);
                  return coincideCategoria && coincideCalificacion && c.tipo === 'publico' && c.habilitado;
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

    //Cuestionarios que le han compartido al participante
    if(usuario.cuestionariosParticipante && usuario.cuestionariosParticipante.length){
        cuestionarioInvitado(usuario.cuestionariosParticipante);
    } else {
        document.getElementById("contenedor_cuest_invitado").classList.add("d-none");
    }

    listaCuestionarios(null, false);
    document.getElementById("button_todos").addEventListener("click", () => listaCuestionarios());

    moderarCuestionario();
}

window.onload = onloadParticipante;

function cuestionarioInvitado(cuestionarioIds) {
    const contenedor = document.getElementById("lista_cuest_invitado");
    contenedor.innerHTML = '';
    const cuestInvitados = cuestionarios.filter(c => cuestionarioIds.includes(c.id) && c.habilitado);
    if(cuestInvitados.length){
        document.getElementById("contenedor_cuest_invitado").classList.remove("d-none");
        cuestInvitados.forEach((cuestionario) => {
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-12", "col-md-4", "col-xxl-3");
            const card = document.createElement("div");
            card.classList.add("card", "border_cuest", "overflow-hidden", "h-100", "card_cuest");

            const calificacion = cuestionario.calificacion || 0;
            let estrellas = "";
            for (let i = 1; i <= 5; i++) {
                estrellas += i <= calificacion ? "★" : "☆";
            }
            card.innerHTML = `
              <img src="${cuestionario.imagen}" class="imagen_card img-fluid mx-auto d-block" alt="imagen cuestionario">
              <div class="card-header">
                  <h5 class="card-title text-center card_titulo">${cuestionario.nombre}</h5>
              </div>
              <div class="card-body">
                <p class="text-center"><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${cuestionario.preguntas}</p>
                <p class="text-center"><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${cuestionario.tiempo? cuestionario.tiempo + ' minutos' : 'Libre'}</p>
                <div class="rating text-center">
                    <i class="bi bi-star-fill"></i> Valoración: ${estrellas}
                </div>
            </div>
            `;

            card.addEventListener("click", () => participarCuest(cuestionario.id));

            colDiv.appendChild(card);
            contenedor.appendChild(colDiv);
        });
    } else {
        document.getElementById("contenedor_cuest_invitado").classList.add("d-none");
    }
            
}

function participarCuest(id) {
    console.log("participar cuestionario id: ", id);
    //Agregar enlace para redirigir a pagina cuestionario de usuario registrado
    window.location.href = '../Lobby/lobby.html';
}

function listaCuestionarios(arrCuest = null, scroll = true) {
    const cuest = arrCuest ? arrCuest : cuestionarios;
    const contenedor = document.getElementById("listado_total");
    contenedor.innerHTML = '';
    const cuestHabilitados = cuest.filter(c => c.tipo ==='publico' && c.habilitado);
    if(cuestHabilitados.length){
        cuestHabilitados.forEach((cuestionario) => {
            const colDiv = document.createElement("div");
            colDiv.classList.add("col-12", "col-md-4", "col-xxl-3");
            const card = document.createElement("div");
            card.classList.add("card", "border_cuest", "overflow-hidden", "h-100", "card_cuest");
            const calificacion = cuestionario.calificacion || 0;
            let estrellas = "";
            for (let i = 1; i <= 5; i++) {
                estrellas += i <= calificacion ? "★" : "☆";
            }
            card.innerHTML = `
              <img src="${cuestionario.imagen}" class="imagen_card img-fluid mx-auto d-block" alt="imagen cuestionario">
              <div class="card-header">
                  <h5 class="card-title text-center card_titulo">${cuestionario.nombre}</h5>
              </div>
              <div class="card-body">
                <p class="text-center"><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${cuestionario.preguntas}</p>
                <p class="text-center"><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${cuestionario.tiempo? cuestionario.tiempo + ' minutos' : 'Libre'}</p>
                <div class="rating text-center">
                    <i class="bi bi-star-fill"></i> Valoración: ${estrellas}
                </div>
              </div>
            `;

            card.addEventListener("click", () => participarCuest(cuestionario.id));

            colDiv.appendChild(card);
            contenedor.appendChild(colDiv);
        });
        if(scroll) {
            contenedor.scrollIntoView()
        };
    }
}

function moderarCuestionario(){
    const btnModerar = document.getElementById("button-moderador");

    btnModerar.addEventListener("click", function(){
        window.location.href = "../Moderador/moderador.html";
    });
}