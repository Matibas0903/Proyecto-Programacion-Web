let version = null;
let tiempoRestante = null;
let intervaloCronometro = null;
let respuestasSeleccionadas = [];
let tiempoInicio = null;
let respuestasCorrectas = 0;

window.onload = function(){
    cargarVersion();
}

function generarPreguntas() {
    const contenedor = document.getElementById("contenedor-juego");
    const preguntas = version.preguntas;

    preguntas.forEach((pregunta, index) => {
        const card = document.createElement("div");
        card.classList.add("card-preguntas", "d-none");

        let opcionesHTML = "";
        
        const tipoPregunta = parseInt(pregunta.ID_TIPO_PREGUNTA || pregunta.tipo_pregunta);
        
        switch(tipoPregunta) {
            case 1: // Verdadero/Falso
            case 2: // Respuesta única
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
                break;
                
            case 3: // Respuesta abierta
                opcionesHTML = `
                    <div class="col-12">
                        <textarea 
                            class="form-control respuesta-abierta" 
                            rows="4" 
                            placeholder="Escribe tu respuesta aquí..."
                            data-id-pregunta="${pregunta.ID_PREGUNTA}"></textarea>
                        <button type="button" 
                            class="btn btnRespuestas" id="btnEnviarAbierta">
                            Enviar respuesta
                        </button>
                    </div>
                `;
                break;
                
            case 4: // Respuesta múltiple
                pregunta.opciones.forEach(opcion => {
                    opcionesHTML += `
                        <div class="col-12 col-md-6">
                            <div class="opcion-multiple-container">
                                <input 
                                    class="checkbox-multiple" 
                                    type="checkbox" 
                                    value="${opcion.ID_OPCION}"
                                    data-correcta="${opcion.ES_CORRECTA}"
                                    id="opcion-${opcion.ID_OPCION}">
                                <label class="btn btnRespuestas w-100" for="opcion-${opcion.ID_OPCION}">
                                    ${opcion.TEXTO}
                                </label>
                            </div>
                        </div>
                    `;
                });
                opcionesHTML += `
                    <div class="col-12 mt-3">
                        <button type="button" class="btn btnRespuestas btnConfirmarMultiple">
                            Confirmar respuestas
                        </button>
                    </div>
                `;
                break;
        }

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
        
        // Guardar tipo de pregunta en el card
        card.dataset.tipoPregunta = tipoPregunta;

        contenedor.appendChild(card);
    });

    mostrarPreguntas();
}

function iniciarCronometro(onTimeUp) {
    const cronometroEl = document.getElementById("cronometro");
    
    if (!version.TIEMPO_TOTAL || version.TIEMPO_TOTAL <= 0) {
        cronometroEl.classList.add("d-none");
        return;
    }

    tiempoRestante = version.TIEMPO_TOTAL * 60;
    cronometroEl.classList.remove("d-none");
    actualizarCronometro();

    intervaloCronometro = setInterval(() => {
        tiempoRestante--;
        actualizarCronometro();

        if (tiempoRestante <= 0) {
            clearInterval(intervaloCronometro);
            onTimeUp();
        }
    }, 1000);
}

function actualizarCronometro() {
    const cronometroEl = document.getElementById("cronometro");
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    cronometroEl.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (tiempoRestante <= 30) {
        cronometroEl.classList.add("tiempo-bajo");
    }
}

function calcularPuntaje(respuestasCorrectas, totalPreguntas, segundosTranscurridos) {
    // Puntos base por respuesta correcta (100 puntos cada una)
    const puntosBase = respuestasCorrectas * 100;

    // Bonus por tiempo: máximo 50 puntos por pregunta si es rápido
    // Tiempo promedio esperado: 30 segundos por pregunta
    const tiempoEsperado = totalPreguntas * 30;
    let bonusTiempo = 0;

    if (segundosTranscurridos < tiempoEsperado) {
        // Cuanto más rápido, más bonus (máximo 50 * totalPreguntas)
        const porcentajeRapidez = 1 - (segundosTranscurridos / tiempoEsperado);
        bonusTiempo = Math.round(porcentajeRapidez * 50 * totalPreguntas);
    }

    return puntosBase + bonusTiempo;
}

function mostrarPreguntas() {
    const cards = document.querySelectorAll(".card-preguntas");
    let preguntaNum = 0;

    const contador = document.getElementById("contador");
    contador.classList.remove("d-none");

    let auxContador = 3;
    const auxintervalo = setInterval(() => {
        contador.textContent = auxContador > 0 ? auxContador : "¡A jugar!";
        auxContador--;
        if (auxContador < -1) {
            clearInterval(auxintervalo);
            contador.classList.add("d-none");
            cards[preguntaNum].classList.remove("d-none");

            tiempoInicio = Date.now();

            iniciarCronometro(() => {
                finalizarJuego(respuestasCorrectas, cards.length);
            });
        }
    }, 1000);

    cards.forEach((card) => {
        const tipoPregunta = parseInt(card.dataset.tipoPregunta);
        
        switch(tipoPregunta) {
            case 1: // Verdadero/Falso
            case 2: // Respuesta única
                manejarRespuestaUnica(card, () => {
                    preguntaNum++;
                    avanzarPregunta(cards, preguntaNum, respuestasCorrectas);
                });
                break;
                
            case 3: // Respuesta abierta
                manejarRespuestaAbierta(card, () => {
                    preguntaNum++;
                    avanzarPregunta(cards, preguntaNum, respuestasCorrectas);
                });
                break;
                
            case 4: // Respuesta múltiple
                manejarRespuestaMultiple(card, () => {
                    preguntaNum++;
                    avanzarPregunta(cards, preguntaNum, respuestasCorrectas);
                });
                break;
        }
    });
}

function manejarRespuestaUnica(card, onContinuar) {
    card.querySelectorAll(".btnRespuestas").forEach(btn => {
        btn.addEventListener("click", () => {
            const esCorrecta = btn.dataset.correcta === "1";
            const idOpcion = parseInt(btn.dataset.idOpcion);
            
            respuestasSeleccionadas.push(idOpcion);
            btn.classList.add(esCorrecta ? "correcta" : "incorrecta");
            
            if (esCorrecta) {
                respuestasCorrectas++;
            }
            
            card.querySelectorAll(".btnRespuestas").forEach(b => b.disabled = true);
            
            setTimeout(() => {
                card.classList.add("d-none");
                onContinuar();
            }, 1000);
        });
    });
}

function manejarRespuestaAbierta(card, onContinuar) {
    const btnEnviar = card.querySelector("#btnEnviarAbierta");
    const textarea = card.querySelector(".respuesta-abierta");
    
    btnEnviar.addEventListener("click", () => {
        const respuesta = textarea.value.trim();
        
        if (!respuesta) {
            alert("Por favor escribe una respuesta");
            return;
        }
        
        const idPregunta = parseInt(textarea.dataset.idPregunta);
        
        const pregunta = version.preguntas.find(p => p.ID_PREGUNTA === idPregunta);
        if (pregunta && pregunta.opciones.length > 0) {
            const idOpcion = pregunta.opciones[0].ID_OPCION;
            
            respuestasSeleccionadas.push({
                idOpcion: idOpcion,
                textoRespuesta: respuesta
            });
        }
        
        textarea.disabled = true;
        btnEnviar.disabled = true;
        
        setTimeout(() => {
            card.classList.add("d-none");
            onContinuar();
        }, 500);
    });
}

function manejarRespuestaMultiple(card, onContinuar) {
    const btnConfirmar = card.querySelector(".btnConfirmarMultiple");
    const checkboxes = card.querySelectorAll(".checkbox-multiple");
    
    btnConfirmar.addEventListener("click", () => {
        const seleccionadas = Array.from(checkboxes).filter(cb => cb.checked);
        
        if (seleccionadas.length === 0) {
            alert("Debes seleccionar al menos una opción");
            return;
        }
        
        let todasCorrectas = true;
        
        checkboxes.forEach(cb => {
            const esCorrecta = cb.dataset.correcta === "1";
            const estaSeleccionada = cb.checked;
            
            if (esCorrecta && !estaSeleccionada) {
                todasCorrectas = false;
            }
            if (!esCorrecta && estaSeleccionada) {
                todasCorrectas = false;
            }
            
            if (estaSeleccionada) {
                const idOpcion = parseInt(cb.value);
                respuestasSeleccionadas.push(idOpcion);
            }
            
            const label = cb.nextElementSibling;
            if (esCorrecta) {
                label.classList.add("correcta");
            } else if (estaSeleccionada) {
                label.classList.add("incorrecta");
            }
        });
        
        if (todasCorrectas) {
            respuestasCorrectas++;
        }
        
        checkboxes.forEach(cb => cb.disabled = true);
        btnConfirmar.disabled = true;
        
        setTimeout(() => {
            card.classList.add("d-none");
            onContinuar();
        }, 1500);
    });
}

function avanzarPregunta(cards, preguntaNum, respuestasCorrectas) {
    if (preguntaNum < cards.length) {
        cards[preguntaNum].classList.remove("d-none");
    } else {
        finalizarJuego(respuestasCorrectas, cards.length);
    }
}

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
            const invitacion = new URLSearchParams(window.location.search).get('invitacion');
            response = await fetch('../BaseDeDatos/controladores/postParticipacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idVersion: idVersion,
                    puntaje: puntajeFinal,
                    respuestas: respuestasSeleccionadas,
                    invitacion: invitacion || 'false'
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
