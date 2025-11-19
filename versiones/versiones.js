let cuestionario = null;
let versiones = [];

let usuariosTotales = []
//varible para manejar id seleccionado
let idCuestionarioActual = null;
//varible para manejar action de modal versiones
let actionVersionesModal = '';
//paginado participantes
let paginaActual = 1;
const participantesPorPagina = 5;

async function onloadPage(){
    const idCuestionario = new URLSearchParams(window.location.search).get('cuestionario');
    if(!idCuestionario){
        //redireccionar a pantalla administrador si no hay cuestionario seleccionado
        window.location.href = "../administrador/administrador.php";
    } else {
        try {
            const response = await fetch(`../BaseDeDatos/controladores/getCuestionario.php?cuestionario=${idCuestionario}`);
            const result = await response.json();
            if(result.status === 'success' && result.data.ID_CUESTIONARIO){
                //cargar datos cuestionario
                cuestionario = result.data;
                document.getElementById("titulo_cuestionario").innerText = cuestionario.NOMBRE_CUESTIONARIO;
                if(cuestionario.ID_MODERADOR){
                    const responseUsuario = await fetch(`../BaseDeDatos/controladores/getUsuario.php?id=${cuestionario.ID_MODERADOR}`);
                    const resultUsuario = await responseUsuario.json();
                    if(resultUsuario.status === 'success' && resultUsuario.data.ID_USUARIO){
                        mostrarModerador(resultUsuario.data.NOMBRE, resultUsuario.data.FOTO_PERFIL);
                    }
                }
            } else {
                mostrarMensajeError(result.message || 'Error al obtener el cuestionario');
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
                    document.getElementById("habilitar_container").classList.remove('d-none');
                }
            }else {
                versiones = [];
                document.getElementById("habilitar_container").classList.add('d-none');
                document.getElementById("version-list").innerHTML = '<h3 class="text-center">No hay versiones disponibles. Crea una nueva versión para comenzar.</h3>';
            }         
        } catch (error) {
            mostrarMensajeError('Error al obtener el cuestionario');
        }

        //Cargar usuarios
        try {
            const responseUsuarios = await fetch('../BaseDeDatos/controladores/getAllUsuarios.php');
            const resultUsuarios = await responseUsuarios.json();
            if(resultUsuarios.status === 'success' && resultUsuarios.data.length){
                usuariosTotales = resultUsuarios.data;
            }else if(resultUsuarios.status === 'error'){
                mostrarMensajeError(resultUsuarios.message || 'Error al obtener los usuarios');
            }
        } catch (error) {
            mostrarMensajeError('Error al obtener los usuarios');
        }

        //Botones
        document.getElementById("button-nueva-version").addEventListener("click", () => seleccionarVersion('nueva'));
        document.getElementById("button-habilitar").addEventListener("click", () => seleccionarVersion('habilitar'));
        document.getElementById("button-moderador").addEventListener("click", () => seleccionarUsuario(null, 'moderador'));

        //buscador participantes
        const formularioParticipantes = document.getElementById("formParticipante");
        formularioParticipantes.addEventListener("submit", (e) => {
            e.preventDefault();
            const fechaVencimiento = document.getElementById("fecha_vencimiento").value;
            const fechaValida = fechaVencimiento && fechaVencimiento >= new Date().toISOString().split('T')[0];
            if(!fechaValida && document.getElementById("modalParticipantes").dataset.tipoUsuario ==='participante'){
                document.getElementById("fecha_vencimiento").classList.add('is-invalid')
            } else {
                document.getElementById("fecha_vencimiento").classList.remove('is-invalid')
            }
            const nombrePart = document.getElementById("nombrePart");
            const participanteValid = nombrePart.value && nombrePart.value.length > 1 && nombrePart.value.length <= 20;
            if (participanteValid && (document.getElementById("modalParticipantes").dataset.tipoUsuario ==='participante'? fechaValida : true)){
                nombrePart.classList.remove('is-invalid')
                const participantesFiltrados = usuariosTotales.filter(p => p.NOMBRE.toLowerCase().includes(nombrePart.value.toLowerCase()));
                if(participantesFiltrados.length){
                    document.getElementById("no_participantes").classList.add('d-none');
                    mostrarParticipantes(participantesFiltrados); 
                    document.getElementById("participantes_container").classList.remove('d-none');
                    
                } else {
                    document.getElementById("lista_participantes").innerHTML = '';
                    document.getElementById("no_participantes").classList.remove('d-none');
                    document.getElementById("participantes_container").classList.remove('d-none');
                }
            } else {
                if(!participanteValid){
                    nombrePart.classList.add('is-invalid')
                }else if(document.getElementById("modalParticipantes").dataset.tipoUsuario ==='participante' && !fechaValida){
                    document.getElementById("fecha_vencimiento").classList.add('is-invalid')
                }
            }
        })

        //form de versiones
        const selectVersion = document.getElementById("select-version");
        versiones.forEach(version => {
            const option = document.createElement("option");
            option.value = version.NUM_VERSION;
            option.text = `Versión ${version.NUM_VERSION}`;
            selectVersion.appendChild(option);
        })
        const option = document.createElement("option");
        option.id = 'ninguno_opcion';
        option.value = '';
        option.text = `Ninguna`;
        selectVersion.appendChild(option);
        const formularioVersiones = document.getElementById("form-version");
        formularioVersiones.addEventListener("submit", (e) => {
            e.preventDefault();
            const selectVersion = document.getElementById("select-version").value;
            if (actionVersionesModal){
                if(actionVersionesModal === 'habilitar'){
                    activarVersion(selectVersion);
                } else if(actionVersionesModal === 'nueva'){
                    //Cambiar a crear con plantilla
                    editar(selectVersion);
                }
            }
        })
    }

}

window.onload = onloadPage;

function cargarVersiones(){
    const versionesOrdenadas = versiones.slice().sort((a, b) => {
        if (a.ACTIVO === 'Activo' && b.ACTIVO === 'Inactivo') return -1;
        if (a.ACTIVO === 'Inactivo' && b.ACTIVO === 'Activo') return 1;
        return 0;
    });
    let listaVersiones = document.getElementById("version-list");
    listaVersiones.innerHTML = "";
    versionesOrdenadas.forEach(version => {
        const calificacion = version.promedio_calificacion || 0;
        let estrellas = "";
        for (let i = 1; i <= 5; i++) {
            estrellas += i <= calificacion ? "★" : "☆";
        }
        let div = document.createElement("div");
        div.classList.add("col-12", "align-self-start");
        div.innerHTML = `
            <div class="card border_cuest my-3 ${version.ACTIVO === 'Activo'?'version-habilitada':'bg_cuest'}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h3>Version ${version.NUM_VERSION}</h3>
                        ${version.ACTIVO === 'Activo'?'<p class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> HABILITADO</p>':''}
                    </div>
                    <div>
                        <p><strong>Descripción: </strong> ${version.DESCRIPCION? version.DESCRIPCION : 'Sin descripción'}</p>
                        <p><i class="bi bi-calendar-date"></i> <strong>Fecha de creación:</strong> ${formatearFecha(version.FECHA_CREACION)}</p>
                        <p><i class="bi bi-question-circle"></i> <strong>Preguntas:</strong> ${version.cantidad_preguntas? version.cantidad_preguntas : '-'}</p>
                        <p><i class="bi bi-alarm"></i> <strong>Tiempo:</strong> ${version.TIEMPO_TOTAL?version.TIEMPO_TOTAL + ' minutos' : 'Libre'}</p>
                        <p class="rating">
                            <i class="bi bi-star-fill"></i>
                            Valoración: ${estrellas}
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
                        version.ACTIVO === 'Activo'? '<div class="col"><button type="button" id="button_invitar" class="btn bg-btn3"><i class="bi bi-person-fill-add"></i> Invitar</button></div>' +
                            '<div class="col"><button type="button" id="button_compartir" class="btn bg-btn4"><i class="bi bi-key-fill"></i> Compartir</button></div>'
                            : ''
                      }
                    </div>
                </div> 
            </div>
            `;
        listaVersiones.appendChild(div);
        div.querySelector("#button_ver").addEventListener("click", () => {
            ver(version.ID_VERSION)
        });
        div.querySelector("#button_editar").addEventListener("click", () => {
            editar(version.ID_VERSION)
        });
        if(version.ACTIVO === 'Activo'){
            div.querySelector("#button_invitar").addEventListener("click", () => {
                seleccionarUsuario(version.ID_VERSION)
            });
            div.querySelector("#button_compartir").addEventListener("click", () => {
                compartir(version.ID_VERSION)
            });
        }
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

function ver(version){
    window.location.href = `../Vista previa/verCuestionario.php?version=${version}`;
}

function editar(version){
    if(!version){
        window.location.href = `../Seleccionar Plantilla/SeleccionarPlantilla.php?cuestionario=${cuestionario.ID_CUESTIONARIO}`;
        return;
    }
    window.location.href = `../Seleccionar Plantilla/SeleccionarPlantilla.php?version=${version}`;
}

function compartir(idVersion){
    for (let version of versiones) {
        if (version.ID_VERSION == idVersion) {
            const modalCompartir = new bootstrap.Modal(document.getElementById('modalCompartir'));
            document.getElementById("modalTitulo").innerText = `${cuestionario.NOMBRE} - Versión ${version.NUM_VERSION}`;
            document.getElementById("enlace").innerText = version.COD_ACCESO;
            modalCompartir.show();
        break;
        }
    };
}

function seleccionarUsuario(id =null, user = 'participante'){
    document.getElementById("participantes_container").classList.add('d-none');
    document.getElementById("modal-user-title").innerHTML = user==='participante'? 'Agregar Participante': 'Seleccionar Moderador';
    document.getElementById("nombrePart").placeholder = `Buscar ${user==='participante'?'participante': 'Moderador'}`;
    if(user === 'moderador'){
        document.getElementById("fecha_vencimiento_container").classList.add('d-none');
    } else {
        const inputFecha = document.getElementById("fecha_vencimiento");
        const fecha = new Date();
        inputFecha.min = fecha.toISOString().split('T')[0];
        fecha.setMonth(fecha.getMonth() + 1);
        document.getElementById("fecha_vencimiento_container").classList.remove('d-none');
        inputFecha.value = fecha.toISOString().split('T')[0];
    }

    const modalUsuarios = document.getElementById('modalParticipantes');
    modalUsuarios.dataset.tipoUsuario = user;
    modalUsuarios.dataset.idVersion = id;
    const modal = new bootstrap.Modal(modalUsuarios);
    modal.show();
}

function mostrarParticipantes(participantes){
    //agregar logica para verificar que el participante no este ya agregado
    const lista_participantes = document.getElementById("lista_participantes");
    lista_participantes.innerHTML = '';

    const modalUsuarios = document.getElementById('modalParticipantes');
    const tipoUsuario = modalUsuarios.dataset.tipoUsuario;
    const idVersion = parseInt(modalUsuarios.dataset.idVersion);
    //paginado
    const totalPaginas = Math.ceil(participantes.length / participantesPorPagina);
    const inicio = (paginaActual - 1) * participantesPorPagina;
    const fin = inicio + participantesPorPagina;
    const participantesPagina = participantes.slice(inicio, fin);

    lista_participantes.innerHTML = '';
    if(participantesPagina.length){
        participantesPagina.forEach((participante) => {
            const divParticipante = document.createElement("div");
            divParticipante.classList.add("card", "border_cuest", "my-2", "button_principal");
            divParticipante.id = 'addParticipante_'+participante.ID_USUARIO;
            divParticipante.innerHTML = `
              <div class="card-body row">
                <div class="col-3 align-self-center">
                  <img src=${participante.FOTO_PERFIL} alt="imagen usuario" class="navbar_usuario">
                </div>
                <div class="col-9 align-self-center">
                  <h3 class="mb-0">${participante.NOMBRE}</h3>
                </div> 
              </div>
            `;
            lista_participantes.appendChild(divParticipante);
            document.getElementById('addParticipante_'+participante.ID_USUARIO).addEventListener("click", () => {
                if(tipoUsuario === 'moderador'){
                    cambiarModerador(participante.ID_USUARIO);
                } else {
                    agregarParticipante(participante.ID_USUARIO, idVersion);
                }
            });
        })
    }

    if(totalPaginas > 1){
        agregarControlesPaginado(totalPaginas, participantes);
    }
}

async function agregarParticipante(idUsuario, idVersion){
    const fechaVencimiento = document.getElementById("fecha_vencimiento").value;
    const body = {
        id_participante: idUsuario,
        id_version: idVersion,
        fecha_vencimiento: fechaVencimiento
    };
    console.log(body);
    const modalParticipantesEl = document.getElementById('modalParticipantes');
    const modalParticipantes = bootstrap.Modal.getInstance(modalParticipantesEl);
    if(idUsuario !== cuestionario.ID_MODERADOR && idUsuario !== cuestionario.ID_USUARIO){
        try {
            const response = await fetch('../BaseDeDatos/controladores/postInvitacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const result = await response.json();
            if(result.status === 'success'){
                if (modalParticipantes) {
                    modalParticipantes.hide();
                }

                const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                modalConfirmacion.show();
            } else if(result.status === 'error'){
                mostrarMensajeError(result.message || 'Error al agregar participante');
                if (modalParticipantes) {
                    modalParticipantes.hide();
                }
            }
        } catch (error) {
            mostrarMensajeError('Error al agregar participante');
            if (modalParticipantes) {
                modalParticipantes.hide();
            }
        } 
    } else {
        mostrarMensajeError('No se puede agregar al administrador o moderador como participante');
        if (modalParticipantes) {
            modalParticipantes.hide();
        }
    }
    document.getElementById("formParticipante").reset();
}

async function cambiarModerador(idUsuario){
    const body = {
        idCuestionario: cuestionario.ID_CUESTIONARIO,
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
            const usuario = usuariosTotales.find(usuario => usuario.ID_USUARIO === idUsuario);
            mostrarModerador(usuario.NOMBRE, usuario.FOTO_PERFIL);
            const modalParticipantesEl = document.getElementById('modalParticipantes');
            const modalParticipantes = bootstrap.Modal.getInstance(modalParticipantesEl);
            if (modalParticipantes) {
                modalParticipantes.hide();
            }
            const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
            modalConfirmacion.show();
            cuestionario.ID_MODERADOR = idUsuario;
        } else if(result.status === 'error'){
            mostrarMensajeError(result.message || 'Error al cambiar el moderador');
            if (modalParticipantes) {
                modalParticipantes.hide();
            }
        }
    } catch (error) {
        mostrarMensajeError('Error al cambiar el moderador');
        if (modalParticipantes) {
            modalParticipantes.hide();
        }
    }
    document.getElementById("formParticipante").reset();
}
  
function seleccionarVersion(action){
    const versionHabilitada = versiones.find(version => version.activo === 'Activo');
    const opcion = document.getElementById("ninguno_opcion");
    if(!versionHabilitada && action==='habilitar'){
        opcion.classList.add('d-none');
        opcion.selected = false;
    } else {
        opcion.classList.remove('d-none');
    }
    document.getElementById("tituloVersiones").innerHTML = action==='habilitar'? 'Habilitar Versión': 'Nueva Versión';
    document.getElementById("texto_versiones").innerHTML = action==='habilitar'? 'Selecciona la version a habilitar': 'Selecciona una version de plantilla';
    document.getElementById("seleccionar_versiones").innerHTML = action==='habilitar'? 'Continuar': 'Crear nueva versión';
    opcion.innerHTML = action==='habilitar'? 'Deshabilitar todas': 'Ninguna (Crear desde cero)';
    const modal = new bootstrap.Modal(document.getElementById('modalVersiones'));
    modal.show();
    actionVersionesModal = action;
}

async function activarVersion(idVersion){
    const body = {
        idCuestionario: cuestionario.ID_CUESTIONARIO,
        numVersion: idVersion? idVersion : 'deshabilitar'
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
                if(version.NUM_VERSION == idVersion){
                    version.ACTIVO = 'Activo';
                } else {
                    version.ACTIVO = 'Inactivo';
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

function mostrarMensajeError(mensaje){
    const toastEl = document.getElementById('toast_mensaje_error');
    const toastBody = document.getElementById('mensaje_error');
    toastBody.innerText = mensaje || 'Ups, ocurrio un error inesperado';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function agregarControlesPaginado(totalPaginas, participantes) {
    const paginador = document.getElementById("paginador");
    if (!paginador) return; // Por si el contenedor no existe

    paginador.innerHTML = '';

    // Botón "anterior"
    const btnAnterior = document.createElement("button");
    btnAnterior.classList.add("btn", "btn-sm", "me-2", "btn_paginado_color");
    btnAnterior.innerHTML = `<i class="bi bi-arrow-left-circle-fill"></i>`;
    btnAnterior.disabled = (paginaActual === 1);
    btnAnterior.addEventListener("click", () => {
        paginaActual--;
        mostrarParticipantes(participantes);
    });
    paginador.appendChild(btnAnterior);

    // Info de página
    const span = document.createElement("span");
    span.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    paginador.appendChild(span);

    // Botón "siguiente"
    const btnSiguiente = document.createElement("button");
    btnSiguiente.classList.add("btn", "btn-sm", "ms-2", "btn_paginado_color");
    btnSiguiente.innerHTML = `<i class="bi bi-arrow-right-circle-fill"></i>`;
    btnSiguiente.disabled = (paginaActual === totalPaginas);
    btnSiguiente.addEventListener("click", () => {
        paginaActual++;
        mostrarParticipantes(participantes);
    });
    paginador.appendChild(btnSiguiente);
}

function formatearFecha(fechaString) {
  return fechaString.split(' ')[0].split('-').reverse().join('/');
}