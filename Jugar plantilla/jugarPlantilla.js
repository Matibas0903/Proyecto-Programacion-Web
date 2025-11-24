window.onload = function(){
<<<<<<< Updated upstream
=======
    cargarVersion();
}

function generarPreguntas() {
    const contenedor = document.getElementById("contenedor-juego");
    const preguntas = version.preguntas;

    
    preguntas.forEach((pregunta, index) => {
        const card = document.createElement("div");
        card.classList.add("card-preguntas", "d-none");
    
        let opcionesHTML = "";
        pregunta.opciones.forEach(opcion => {
            opcionesHTML += `
                <div class="col-12 col-md-6">
                    <button type="button" 
                        class="btn btnRespuestas w-100" 
                        data-correcta="${opcion.ES_CORRECTA}"
                        data-id-opcion="${opcion.ID_OPCION}">
                        ${opcion.TEXTO}
                    </button>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="text-center pregunta">
                <h5 class="fw-bold mb-2">Pregunta ${index + 1}</h5>
                <p>${pregunta.ENUNCIADO}</p>
                ${pregunta.IMAGEN ? `<img src="${pregunta.IMAGEN}" alt="Imagen de la pregunta" class="mb-3 pregunta_img">` : ''}
            </div>
            <div class="row g-3 mt-3">
                ${opcionesHTML}
            </div>
        `;

        contenedor.appendChild(card);
    });

>>>>>>> Stashed changes
    mostrarPreguntas();
}

//muestro las preguntas
function mostrarPreguntas() {
    const cards = document.querySelectorAll(".card-preguntas");
    const correctas = ["1939", "Mahatma Gandhi", "476 d.C."];
    let preguntaNum= 0;
    let respuestasCorrectas = 0;

  // Contador dentro del div #contador
    const contador = document.getElementById("contador");
    contador.classList.remove("d-none");

<<<<<<< Updated upstream
  let auxContador = 3;
  const auxintervalo = setInterval(() => {
    contador.textContent = auxContador > 0 ? auxContador : "¡A jugar! ";
    auxContador--;
    if (auxContador < -1) {
      clearInterval(auxintervalo);
      contador.classList.add("d-none");
      cards[preguntaNum].classList.remove("d-none");
    }
  }, 1000);
=======
    let auxContador = 3;
    const auxintervalo = setInterval(() => {
        contador.textContent = auxContador > 0 ? auxContador : "¡A jugar!";
        auxContador--;
        if (auxContador < -1) {
            clearInterval(auxintervalo);
            contador.classList.add("d-none");
            if (!cards[preguntaNum]) {
                console.error("La card", preguntaNum, "no existe");
                return;
            }
            cards[preguntaNum].classList.remove("d-none");
>>>>>>> Stashed changes

  // Recorro cada card
  cards.forEach((card, index) => {
    card.querySelectorAll(".btnRespuestas").forEach(btn => {
      btn.addEventListener("click", () => {
        const esCorrecta = btn.textContent.trim() === correctas[index];

        // marco correcta o incorrecta
        btn.classList.add(esCorrecta ? "correcta" : "incorrecta");

        if (esCorrecta) {
          respuestasCorrectas++;
        }

        // Deshabilito todos los botones
        card.querySelectorAll(".btnRespuestas").forEach(b => b.disabled = true);

        setTimeout(() => {
            card.classList.add("d-none");
            preguntaNum++;
            if (preguntaNum < cards.length) {
                cards[preguntaNum].classList.remove("d-none");
            } else {
                setTimeout(() => {
                    window.location.href = "../Resultado/resultado.html";
                }, 300);
            }
            }, 1000);
        });
        });
    });
}

<<<<<<< Updated upstream
=======
async function cargarVersion(){
    const idVersion = new URLSearchParams(window.location.search).get('version');
    const invitado = new URLSearchParams(window.location.search).get('invitado');
    const codigoVersion = sessionStorage.getItem('codigoVersion');
    if(!invitado && !idVersion){
      redirigirConError('ID de versión inválido.', false);
    } else {
        try {
            let response;
            if (invitado === 'true' && codigoVersion) {
                response = await fetch(`../BaseDeDatos/controladores/getVersionByCode.php?codigo=${codigoVersion}&invitado=true`);
            } else {
                response = await fetch(`../BaseDeDatos/controladores/getVersionById.php?version=${idVersion}&jugador=true`);
            }
            const result = await response.json();
            if(result.status === 'success'){
                version = result.data;
                if(version.ACTIVO === 'Inactivo'){
                    mostrarMensajeError('La versión no está activa.');
                    window.location.href = "../participante/participante.php";
                    return;
                } else {
                    if (version.IMAGEN) {
                        document.getElementById("contenedor-juego").style.backgroundImage = 
                            `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${version.IMAGEN}')`;
                    } else {
                        document.getElementById("contenedor-juego").style.backgroundImage = 
                            `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../images/fondo_default.jpg')`;
                    }
                    generarPreguntas();
                }
            }
            else if(result.status === 'error'){
              redirigirConError(result.message || 'Error al obtener el cuestionario', invitado);
            }
        } catch (error) {
          redirigirConError('Error al obtener el cuestionario', invitado)
        }
    }
}

async function finalizarJuego(respuestasCorrectas, totalPreguntas) {
    clearInterval(intervaloCronometro);
    const invitado = new URLSearchParams(window.location.search).get('invitado') === 'true';
    const idVersion = new URLSearchParams(window.location.search).get('version');
    
    // Calcular tiempo transcurrido en segundos
    const segundosTranscurridos = Math.round((Date.now() - tiempoInicio) / 1000);
    
    // Calcular puntaje final
    const puntajeFinal = calcularPuntaje(respuestasCorrectas, totalPreguntas, segundosTranscurridos);

    try {
        let response;
        if(invitado){
            const nombreInvitado = sessionStorage.getItem('nombreInvitado') || 'Invitado';
            response = await fetch('../BaseDeDatos/controladores/postParticipacionInvitado.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idVersion: idVersion,
                    puntaje: puntajeFinal,
                    respuestas: respuestasSeleccionadas,
                    nombre_invitado: nombreInvitado
                })
            });
        } else {
            response = await fetch('../BaseDeDatos/controladores/postParticipacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idVersion: idVersion,
                    puntaje: puntajeFinal,
                    respuestas: respuestasSeleccionadas
                })
            });
        }
        const result = await response.json();

        if (result.status === 'success') {
            window.location.href = `../Resultado/resultado.php?participacion=${result.idParticipacion}&invitado=${invitado}`;
        } else {
            redirigirConError(result.message || 'Error al guardar participación', invitado);
        }
    } catch (error) {
        redirigirConError('Error al guardar participación', invitado);
    }
}

function redirigirConError(errorMensaje, invitado = false){
      sessionStorage.setItem('mensajeError', errorMensaje);
      if(invitado){
        //borrar el codigo de la session
        sessionStorage.removeItem('codigoVersion');
        sessionStorage.removeItem('nombreInvitado');
        window.location.href = "../Inicio/inicio.php";
      }else{
        window.location.href = "../participante/participante.php";
      }
}

function mostrarMensajeError(mensaje){
    const toastEl = document.getElementById('toast_mensaje_error');
    const toastBody = document.getElementById('mensaje_error');
    toastBody.innerText = mensaje || 'Ups, ocurrio un error inesperado';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
>>>>>>> Stashed changes
