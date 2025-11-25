<<<<<<< Updated upstream
window.onload = function() {
    //selecciono todos los elem que estan dentro del div con class estrella
=======
window.onload = async function() {
    const invitado = new URLSearchParams(window.location.search).get('invitado') === 'true';
    const idParticipacion = new URLSearchParams(window.location.search).get('participacion');
    let usuario = null;
    let nombreUsuario = '';
    let fotoUsuario = '';
    //borrar session invitado
    sessionStorage.removeItem('codigoVersion');
    sessionStorage.removeItem('nombreInvitado');
    
    if(!idParticipacion){
        if(invitado){
            window.location.href = "../Inicio/inicio.php";
        } else {
            window.location.href = "../participante/participante.php";
        }
    } else {
        try {
            // Si NO es invitado, cargamos el usuario registrado
            if(!invitado){
                const responseParticipacion = await fetch("../BaseDeDatos/controladores/getParticipacion.php?participacion=${idParticipacion}&invitado=${invitado}");
                const resultUsuario = await responseUsuario.json();
                if(resultUsuario.status === 'success'){
                    usuario = resultUsuario.data;
                    nombreUsuario = usuario.NOMBRE;
                    fotoUsuario = usuario.FOTO_PERFIL;
                    document.getElementById("usuarioNombre").innerHTML = nombreUsuario;
                    document.getElementById("usuarioAvatar").src = fotoUsuario;
                } else if(resultUsuario.status === 'error'){
                    mostrarMensajeError(resultUsuario.message || 'Error al obtener el usuario');
                }
            }

            const responseParticipacion = await fetch(`../BaseDeDatos/controladores/getParticipacion.php?participacion=${idParticipacion}`);
            const resultParticipacion = await responseParticipacion.json();
            
            if(resultParticipacion.status === 'success'){
                const participacion = resultParticipacion.data;
                
                // Si es invitado, usar datos de la participación
                if(invitado){
                    nombreUsuario = participacion.NOMBRE_INVITADO || 'Invitado';
                    fotoUsuario = '../images/invitado.png'; // Imagen por defecto
                    document.getElementById("usuarioNombre").textContent = nombreUsuario;
                    document.getElementById("usuarioAvatar").src = fotoUsuario;
                }
                
                let correctas = 0;
                participacion.respuestas.forEach(respuesta => {
                    if(respuesta.CORRECTA === '1'){
                        correctas++;
                    }
                });
                
                document.getElementById("respCorrectas").textContent = correctas + " / " + participacion.cantidad_preguntas;
                document.getElementById("respPuntuacion").textContent = participacion.PUNTAJE;
                
                const idVersion = participacion.ID_VERSION;
                if(idVersion){
                    // Pasar ID_PARTICIPACION para ranking (funciona para ambos)
                    cargarRanking(idVersion, idParticipacion, invitado);
                    cargarComentarios(idVersion);
                }
            } else if(resultParticipacion.status === 'error'){
                mostrarMensajeError(resultParticipacion.message || 'Error al obtener la participación');
            }
        } catch (error) {
            mostrarMensajeError('Ocurrió un error al obtener la participación');
        }
    }

    // Resto del código de estrellas...
>>>>>>> Stashed changes
    const misEstrellas = document.querySelectorAll("#selectEstrellas .estrella");
    const menErr= document.getElementById("menErr"); 

    const botonCalificar = document.getElementById('btnCalificar');
    const mensaje = document.getElementById("mensaje"); 
    let cantidadEstre = 0; // para saber cueantas estrellas selecciono el usuario
    let estrellasConfirmadas = false; // para saber si el usuario apreto o no el boton de calificar

    misEstrellas.forEach(star => {
        star.addEventListener("click", () => {
            if (estrellasConfirmadas) { // si ya apretó el botón de calificar, no deja volver a elegir
                return; 
            } else {
                cantidadEstre = parseInt(star.getAttribute("data-value"));  //guarda la cantidad de estrellas

                //recorro las estrellas y le voy poninedo el color amarilo dependiendo de la cantidad de estre selecionadas
                misEstrellas.forEach(s => {
                    s.classList.toggle("yellow", s.getAttribute("data-value") <= cantidadEstre);
                }); 
            }
        });
    });


    //btn calificar cuestionario
   botonCalificar.addEventListener("click", () => {
    if (cantidadEstre > 0) {
        estrellasConfirmadas = true;
        mensaje.textContent = "Gracias por calificar el cuestionario!!";
        menErr.classList.add("d-none"); // oculto mensaje de error
        botonCalificar.disabled = true;  //desactivo btn
        misEstrellas.forEach(s => {
           s.classList.add("disabled");  
        })
        
    } else {
        mensaje.textContent = ""; // limpio mensaje
        menErr.classList.remove("d-none"); // muestro error
    }
   });

    //Comentarios
    const btnComentar = document.getElementById("btnComentar");
    const comentario = document.getElementById("comentario");
    const contenedorComentarios = document.querySelector(".MiComentario"); // contenedor de comentarios

    btnComentar.addEventListener("click", function() {
        const texto = comentario.value.trim();

        if (texto === "") {
            // Si el coemtario esta vacio, muestro elmensaje de error
            comentario.classList.add("is-invalid");
        } else {
            comentario.classList.remove("is-invalid"); 

            // Crear el nuevo comentario
            const nuevoComentario = document.createElement("div");
            nuevoComentario.classList.add("miConmen","mt-2");  //le agrego clases

            // fecha del comentario realizadp
            const fecha = new Date();
            const fechaTexto = `${fecha.getDate()} de ${fecha.toLocaleString('es-ES', { month: 'long' })} del ${fecha.getFullYear()}`;

            // Solo voy a mostrar las estrellas si se confirmó calificación
            let estrellasTexto;
            if (estrellasConfirmadas)  //Si el usuario ya confirmó su calificación
             {
                estrellasTexto = "⭐".repeat(cantidadEstre); //se guarda la cantidad de estrellas que selec
            } else {
                estrellasTexto = ""; //sinno, deja el texto vacio
            }


            // Contenido del comentario
            nuevoComentario.innerHTML = `
                <h5 class="mb-1 fw-bold">Usuario21${estrellasTexto}</h5>
                <p class="fecha">${fechaTexto}</p>
                <p class="mb-0">${texto}</p>
            `;

            // Agregar al contenedor que cree antes
            contenedorComentarios.appendChild(nuevoComentario);

            // limpio el textarea
            comentario.value = "";
        }
    });
<<<<<<< Updated upstream
=======

    // Botón volver
    const btnSalir = document.getElementById("btnSalir");
    btnSalir.addEventListener("click", function() {
        if(invitado){
            window.location.href = "../Inicio/inicio.php";
        } else {
            volverAParticipante();
        }
    });

>>>>>>> Stashed changes
}
