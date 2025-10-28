//EJEMPLO USUARIO ADMINISTRADOR, SOLO PARA MOSTRAR DATA!!!
const administrador = {
    nombre: "Usuario Prueba",
    avatar: "../administrador/images/perrito-avatar.jpg"
}

let cuestionario = null;
let versiones = [];
//EJEMPLO LISTA DE USUARIOS, FALTA DEFINIR CAMPOS!!!
let usuariosTotales = []
//varible para manejar id seleccionado
let idCuestionarioActual = null;
//varible para manejar action de modal versiones
let actionVersionesModal = '';

async function onloadPage(){
    const idCuestionario = new URLSearchParams(window.location.search).get('cuestionario');
    if(!idCuestionario){
        //redireccionar a pantalla administrador si no hay cuestionario seleccionado
        window.location.href = "../administrador/administrador.php";
    } else {
        try {
            const response = await fetch(`../BaseDeDatos/controladores/getCuestionario.php?cuestionario=${idCuestionario}`);
            const result = await response.json();
            if(result.status === 'success' && result.data.id){
                //cargar datos cuestionario
                cuestionario = result.data;
                document.getElementById("titulo_cuestionario").innerText = cuestionario.nombre;
                if(cuestionario.descripcion){
                    document.getElementById("descripcion_cuestionario").innerText = cuestionario.descripcion;
                } else {
                    document.getElementById("descripcion_cuestionario").innerText = 'Sin descripción';
                }
                if(cuestionario.imagen){
                    document.getElementById("image_cuest").src = cuestionario.imagen;
                }
                if(cuestionario.id_moderador){
                    const responseUsuario = await fetch(`../BaseDeDatos/controladores/getUsuario.php?id=${cuestionario.id_moderador}`);
                    const resultUsuario = await responseUsuario.json();
                    if(resultUsuario.status === 'success' && resultUsuario.data.id){
                        mostrarModerador(resultUsuario.data.nombre, resultUsuario.data.avatar);
                    }
                }
            } else {
                //redireccionamos a pantalla administrador si el cuestionario no existe o no pertenece al admin
                window.location.href = "../administrador/administrador.php";
            } 
            //versiones
            const responseVersiones = await fetch(`../BaseDeDatos/controladores/getVersiones.php?cuestionario=${idCuestionario}`);
            const resultVersiones = await responseVersiones.json();
            if(resultVersiones.status === 'success' && resultVersiones.data.length){
                versiones = resultVersiones.data;
                //cargar versiones
                if(versiones.length > 0){
                    cargarVersiones();
                }
            }else {
                versiones = [];
                document.getElementById("version-list").innerHTML = '<h3 class="text-center">No hay versiones disponibles. Crea una nueva versión para comenzar.</h3>';
            }         
        } catch (error) {
            console.error('Error al obtener el cuestionario:', error);
        }

        //Cargar usuarios
        try {
            const responseUsuarios = await fetch('../BaseDeDatos/controladores/getAllUsuarios.php');
            const resultUsuarios = await responseUsuarios.json();
            if(resultUsuarios.status === 'success' && resultUsuarios.data.length){
                usuariosTotales = resultUsuarios.data;
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
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
            option.value = version.num_version;
            option.text = `Versión ${version.num_version}`;
            selectVersion.appendChild(option);
        })
        const formularioVersiones = document.getElementById("form-version");
        formularioVersiones.addEventListener("submit", (e) => {
            e.preventDefault();
            const selectVersion = document.getElementById("select-version").value;
            if (selectVersion && actionVersionesModal){
                if(actionVersionesModal === 'habilitar'){
                    activarVersion(selectVersion);
                } else if(actionVersionesModal === 'nueva'){
                    //Cambiar a crear con plantilla
                    editar(selectVersion);
                }
            }
        })
    }

    //botones modal versiones
    // document.getElementById("seleccionar_versiones");
    document.getElementById("seleccionar_activar").addEventListener("click", () => {
        const selectVersion = document.getElementById("select-version").value;
        if(selectVersion){
            activarVersion(selectVersion);
        }
    });
}

window.onload = onloadPage;

function cargarVersiones(){
    const versionesOrdenadas = versiones.slice().sort((a, b) => b.activo - a.activo);
    let listaVersiones = document.getElementById("version-list");
    listaVersiones.innerHTML = "";
    versionesOrdenadas.forEach(version => {
        let div = document.createElement("div");
        div.classList.add("col-12", "align-self-start");
        div.innerHTML = `
            <div class="card border_cuest my-3 ${version.activo?'version-habilitada':'bg_cuest'}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h3>Version ${version.num_version}</h3>
                        ${version.activo?'<p class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> HABILITADO</p>':''}
                    </div>
                    <div>
                        <p><strong>Descripción: </strong> ${version.descripcion? version.descripcion : 'Sin descripción'}</p>
                        <p><i class="bi bi-calendar-date"></i> <strong>Fecha de creación:</strong> ${version.fecha_creacion}</p>
                        <p><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${version.preguntas}</p>
                        <p><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${version.tiempo_total?version.tiempo_total + ' minutos' : 'Libre'}</p>
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
                      ${
                        version.activo ? '<div class="col"><button type="button" id="button_invitar" class="btn bg-btn3"><i class="bi bi-person-fill-add"></i> Invitar</button></div>' 
                            : ''
                      }
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
        if(version.activo){
            div.querySelector("#button_invitar").addEventListener("click", () => {
                seleccionarUsuario(version.id)
            });
        }
        div.querySelector("#button_compartir").addEventListener("click", () => {
            compartir(version.id)
        });
    });
        
}

function mostrarModerador(nombre, avatar=null){
    document.getElementById("moderador_nombre").innerText = nombre;
    const imagenAvatar = document.getElementById("moderador_avatar");
    if(avatar){
        imagenAvatar.src = avatar;
    }else{
        //ESTABLECER UNA IMAGEN POR DEFECTO
        imagenAvatar.src = "../administrador/images/invitado.png";
    }
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

    const modalUsuarios = document.getElementById('modalParticipantes');
    modalUsuarios.dataset.tipoUsuario = user;
    const modal = new bootstrap.Modal(modalUsuarios);
    modal.show();
    idCuestionarioActual = id;
}

function mostrarParticipantes(participantes){
    //agregar logica para verificar que el participante no este ya agregado
    const lista_participantes = document.getElementById("lista_participantes");
    lista_participantes.innerHTML = '';

    const modalUsuarios = document.getElementById('modalParticipantes');
    const tipoUsuario = modalUsuarios.dataset.tipoUsuario;
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
                if(tipoUsuario === 'moderador'){
                    cambiarModerador(participante.id);
                } else {
                    agregarParticipante(participante.id);
                }
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

async function cambiarModerador(idUsuario){
    const body = {
        idCuestionario: cuestionario.id,
        idModerador: idUsuario
    };
    try {
        const response = await fetch('../BaseDeDatos/controladores/putModerador.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        const result = await response.json();
        if(result.status === 'success'){
            const usuario = usuariosTotales.find(usuario => usuario.id === idUsuario);
            mostrarModerador(usuario.nombre, usuario.avatar);
            const modalParticipantesEl = document.getElementById('modalParticipantes');
            const modalParticipantes = bootstrap.Modal.getInstance(modalParticipantesEl);
            if (modalParticipantes) {
                modalParticipantes.hide();
            }
            const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
            modalConfirmacion.show();
        }
    } catch (error) {
        
    }
}

function seleccionarVersion(action){
    document.getElementById("tituloVersiones").innerHTML = action==='habilitar'? 'Habilitar Versión': 'Nueva Versión';
    document.getElementById("texto_versiones").innerHTML = action==='habilitar'? 'Selecciona la version a habilitar': 'Selecciona una version de plantilla';
    document.getElementById("seleccionar_versiones").innerHTML = action==='habilitar'? 'Habilitar': 'Crear nueva versión';
    const modal = new bootstrap.Modal(document.getElementById('modalVersiones'));
    modal.show();
    actionVersionesModal = action;
}

async function activarVersion(idVersion){
    const body = {
        idCuestionario: cuestionario.id,
        numVersion: idVersion
    }
    try {
        const response = await fetch('../BaseDeDatos/controladores/putVersionActiva.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        if(result.status === 'success'){
            versiones.forEach(version => {
                if(version.num_version == idVersion){
                    version.activo = true;
                } else {
                    version.activo = false;
                }
            });
            cargarVersiones();
            const modalVersiones = document.getElementById('modalVersiones');
            const modalCerrar = bootstrap.Modal.getInstance(modalVersiones);
            if (modalCerrar) {
                modalCerrar.hide();
            }
            const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
            modalConfirmacion.show();
        }
    } catch (error) {
        console.error('Error al activar la versión:', error);
    }
}