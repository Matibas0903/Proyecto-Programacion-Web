//EJEMPLO USUARIO ADMINISTRADOR, SOLO PARA MOSTRAR DATA!!!
const administrador = {
    nombre: "Usuario Prueba",
    avatar: "../administrador/images/perrito-avatar.jpg"
}
//EJEMPLO USUARIO MODERADOR, SOLO PARA MOSTRAR DATA!!!
const moderador = {
    nombre: "Usuario Moderador",
    avatar: "../administrador/images/perrito-avatar.jpg"
}

//EJEMPLO LISTA DE VERSIONES, SOLO PARA MOSTRAR DATA!!!
const versiones = [
    {
        id: 1,
        version: 1,
        descripcion: "lorem ipsum dolor sit amet",
        codigo: "PROG-V01",
        creacion: "01/01/2024",
        preguntas: 10,
        tiempo: null,
        habilitado: false
    },
    {
        id: 2,
        version: 2,
        descripcion: "lorem ipsum dolor sit amet",
        codigo: "PROG-V02",
        creacion: "12/03/2025",
        preguntas: 15,
        tiempo: 30,
        habilitado: true
    },
    {
        id: 3,
        version: 3,
        descripcion: "lorem ipsum dolor sit amet",
        codigo: "PROG-V03",
        creacion: "20/08/2025",
        preguntas: 12,
        tiempo: 40,
        habilitado: false
    }
]
//EJEMPLO LISTA DE USUARIOS, FALTA DEFINIR CAMPOS!!!
const usuariosTotales = [
    {
        nombre: "Usuario Prueba",
        avatar: "../administrador/images/perrito-avatar.jpg",
        id: 1
    },
    {
        nombre: "Pepe Argento",
        avatar: "../administrador/images/perrito-avatar.jpg",
        id: 2
    },
    {
        nombre: "Fantasmita",
        avatar: "../administrador/images/invitado.png",
        id: 3
    }
]
//varible para manejar id seleccionado
let idCuestionarioActual = null;
//varible para manejar action de modal versiones
let actionVersionesModal = '';

function onloadAdministrador(){
    //cargar datos usuario
    if(administrador.avatar){
        document.getElementById("navbarImg").src = administrador.avatar;
    }

    //cargar versiones
    if(versiones.length > 0){
        cargarVersiones();
    }

    //Botones
    document.getElementById("button-nueva-version").addEventListener("click", () => seleccionarVersion('nueva'));
    document.getElementById("button-habilitar").addEventListener("click", () => seleccionarVersion('habilitar'));
    document.getElementById("button-moderador").addEventListener("click", () => seleccionarUsuario(null, 'moderador'));


    //buscador participantes
    const formularioParticipantes = document.getElementById("formParticipante");
    formularioParticipantes.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombrePart = document.getElementById("nombrePart");
        const participanteValid = nombrePart.value && nombrePart.value.length <= 20;
        if (participanteValid){
            nombrePart.classList.remove('is-invalid')
            const participantesFiltrados = usuariosTotales.filter(p => p.nombre.toLowerCase().includes(nombrePart.value.toLowerCase()));
            if(participantesFiltrados.length){
                document.getElementById("no_participantes").classList.add('d-none');
                mostrarParticipantes(participantesFiltrados); 
                document.getElementById("participantes_container").classList.remove('d-none');
                formularioParticipantes.reset();
            } else {
                document.getElementById("lista_participantes").innerHTML = '';
                document.getElementById("no_participantes").classList.remove('d-none');
                document.getElementById("participantes_container").classList.remove('d-none');
            }
        } else {
            nombrePart.classList.add('is-invalid')
        }
    })

    //form de versiones
    const selectVersion = document.getElementById("select-version");
    versiones.forEach(version => {
        const option = document.createElement("option");
        option.value = version.id;
        option.text = `Versión ${version.version}`;
        selectVersion.appendChild(option);
    })
    const formularioVersiones = document.getElementById("form-version");
    formularioVersiones.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectVersion = document.getElementById("select-version").value;
        if (selectVersion && actionVersionesModal){
            if(actionVersionesModal === 'habilitar'){
                //llamado a backend para habilitar version
                versiones.forEach(version => {
                    if(version.id == selectVersion){
                        version.habilitado = true;
                    } else {
                        version.habilitado = false;
                    }
                });
                cargarVersiones();
                // cierro el modal
                const modalVersionesEl = document.getElementById('modalVersiones');
                const modalVersiones = bootstrap.Modal.getInstance(modalVersionesEl);
                if (modalVersiones) {
                    modalVersiones.hide();
                }
                const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                modalConfirmacion.show();
            } else if(actionVersionesModal === 'nueva'){
                //Cambiar a crear con plantilla
                editar(selectVersion);
            }
        }
    })
}

window.onload = onloadAdministrador;

function cargarVersiones(){
    const versionesOrdenadas = versiones.slice().sort((a, b) => b.habilitado - a.habilitado);
    let listaVersiones = document.getElementById("version-list");
    listaVersiones.innerHTML = "";
    versionesOrdenadas.forEach(version => {
        let div = document.createElement("div");
        div.classList.add("col-12", "align-self-start");
        div.innerHTML = `
            <div class="card border_cuest my-3 ${version.habilitado?'version-habilitada':'bg_cuest'}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h3>Version ${version.version}</h3>
                        ${version.habilitado?'<p class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> HABILITADO</p>':''}
                    </div>
                    <div>
                        <p><strong>Descripcion: </strong> ${version.descripcion}</p>
                        <p><i class="bi bi-calendar-date"></i> <strong>Fecha de creación:</strong> ${version.creacion}</p>
                        <p><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${version.preguntas}</p>
                        <p><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${version.tiempo?version.tiempo + ' minutos' : 'Libre'}</p>
                        <p class="rating">
                            <i class="bi bi-star-fill"></i>
                            Valoración: ★★★★☆
                        </p>
                    </div>
                    <div class="row row-cols-auto g-3">
                      <div class="col">
                        <button type="button" id="button_ver" class="btn bg-btn1"><i class="bi bi-list-columns"></i> Ver</button>
                      </div>
                      <div class="col">
                        <button type="button" id="button_editar" class="btn bg-btn2"><i class="bi bi-pencil-fill"></i> Editar</button>
                      </div>
                      <div class="col">
                        <button type="button" id="button_invitar" class="btn bg-btn3"><i class="bi bi-person-fill-add"></i> Invitar</button>
                      </div>
                      <div class="col">
                        <button type="button" id="button_compartir" class="btn bg-btn4"><i class="bi bi-key-fill"></i> Compartir</button>
                      </div>
                    </div>
                </div> 
            </div>
            `;
        listaVersiones.appendChild(div);
        div.querySelector("#button_ver").addEventListener("click", () => {
            ver(version.id)
        });
        div.querySelector("#button_editar").addEventListener("click", () => {
            editar(version.id)
        });
        div.querySelector("#button_invitar").addEventListener("click", () => {
            seleccionarUsuario(version.id)
        });
        div.querySelector("#button_compartir").addEventListener("click", () => {
            compartir(version.id)
        });
    });
        
}

function ver(id){
    window.location.href = "../Vista previa/verCuestionario.html";
}

function editar(id){
    window.location.href = "../Seleccionar Plantilla/SeleccionarPlantilla.html";
}

function compartir(id){
    let enlaceVersion = '';
    versiones.forEach(version => {
        if(version.id === id){
            enlaceVersion = version.codigo;
        }
    })
    if(enlaceVersion){
        const modalCompartir = new bootstrap.Modal(document.getElementById('modalCompartir'));
        document.getElementById("modalTitulo").innerText = `Programación web - Versión ${id}`;
        document.getElementById("enlace").innerText = enlaceVersion;
        modalCompartir.show();
    }
}

function seleccionarUsuario(id =null, user = 'participante'){
    document.getElementById("participantes_container").classList.add('d-none');
    document.getElementById("modal-user-title").innerHTML = user==='participante'? 'Agregar Participante': 'Seleccionar Moderador';
    document.getElementById("nombrePart").placeholder = `Buscar ${user==='participante'?'participante': 'Moderador'}`;
    const modal = new bootstrap.Modal(document.getElementById('modalParticipantes'));
    modal.show();
    idCuestionarioActual = id;
}

function mostrarParticipantes(participantes){
    //agregar logica para verificar que el participante no este ya agregado
    const lista_participantes = document.getElementById("lista_participantes");
    lista_participantes.innerHTML = '';
    if(participantes.length){
        participantes.forEach((participante) => {
            const divParticipante = document.createElement("div");
            divParticipante.classList.add("card", "border_cuest", "my-2", "button_principal");
            divParticipante.id = 'addParticipante_'+participante.id;
            divParticipante.innerHTML = `
              <div class="card-body row">
                <div class="col-3 align-self-center">
                  <img src=${participante.avatar} alt="imagen usuario" class="navbar_usuario">
                </div>
                <div class="col-9 align-self-center">
                  <h3 class="mb-0">${participante.nombre}</h3>
                </div> 
              </div>
            `;
            lista_participantes.appendChild(divParticipante);
            document.getElementById('addParticipante_'+participante.id).addEventListener("click", () => {
                agregarParticipante(participante.id);
            });
        })
    }
}

function agregarParticipante(idUsuario){
    //AGREGAR LLAMADO A BACKEND
    const modalParticipantesEl = document.getElementById('modalParticipantes');
    const modalParticipantes = bootstrap.Modal.getInstance(modalParticipantesEl);
    if (modalParticipantes) {
        modalParticipantes.hide();
    }

    const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modalConfirmacion.show();

}

function seleccionarVersion(action){
    document.getElementById("tituloVersiones").innerHTML = action==='habilitar'? 'Habilitar Versión': 'Nueva Versión';
    document.getElementById("texto_versiones").innerHTML = action==='habilitar'? 'Selecciona la version a habilitar': 'Selecciona una version de plantilla';
    document.getElementById("seleccionar_versiones").innerHTML = action==='habilitar'? 'Habilitar': 'Crear nueva versión';
    const modal = new bootstrap.Modal(document.getElementById('modalVersiones'));
    modal.show();
    actionVersionesModal = action;
}