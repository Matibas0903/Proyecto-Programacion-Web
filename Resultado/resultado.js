window.onload = async function () {
  const invitado =
    new URLSearchParams(window.location.search).get("invitado") === "true";
  const idParticipacion = new URLSearchParams(window.location.search).get(
    "participacion"
  );
  let usuario = null;
  let nombreUsuario = "";
  let fotoUsuario = "";
  //borrar session invitado
  sessionStorage.removeItem("codigoVersion");
  sessionStorage.removeItem("nombreInvitado");

  if (!idParticipacion) {
    if (invitado) {
      window.location.href = "../Inicio/inicio.php";
    } else {
      window.location.href = "../participante/participante.php";
    }
  } else {
    try {
      // Si NO es invitado, cargamos el usuario registrado
      if (!invitado) {
        const responseParticipacion = await fetch(
          "../BaseDeDatos/controladores/getParticipacion.php?participacion=${idParticipacion}&invitado=${invitado}"
        );
        const resultUsuario = await responseUsuario.json();
        if (resultUsuario.status === "success") {
          usuario = resultUsuario.data;
          nombreUsuario = usuario.NOMBRE;
          fotoUsuario = usuario.FOTO_PERFIL;
          document.getElementById("usuarioNombre").innerHTML = nombreUsuario;
          document.getElementById("usuarioAvatar").src = fotoUsuario;
        } else if (resultUsuario.status === "error") {
          mostrarMensajeError(
            resultUsuario.message || "Error al obtener el usuario"
          );
        }
      }

      const responseParticipacion = await fetch(
        `../BaseDeDatos/controladores/getParticipacion.php?participacion=${idParticipacion}`
      );
      const resultParticipacion = await responseParticipacion.json();

      if (resultParticipacion.status === "success") {
        const participacion = resultParticipacion.data;

        // Si es invitado, usar datos de la participación
        if (invitado) {
          nombreUsuario = participacion.NOMBRE_INVITADO || "Invitado";
          fotoUsuario = "../images/invitado.png"; // Imagen por defecto
          document.getElementById("usuarioNombre").textContent = nombreUsuario;
          document.getElementById("usuarioAvatar").src = fotoUsuario;
        }

        let correctas = 0;
        participacion.respuestas.forEach((respuesta) => {
          if (respuesta.CORRECTA === "1") {
            correctas++;
          }
        });

        document.getElementById("respCorrectas").textContent =
          correctas + " / " + participacion.cantidad_preguntas;
        document.getElementById("respPuntuacion").textContent =
          participacion.PUNTAJE;

        const idVersion = participacion.ID_VERSION;
        if (idVersion) {
          // Pasar ID_PARTICIPACION para ranking (funciona para ambos)
          cargarRanking(idVersion, idParticipacion, invitado);
          cargarComentarios(idVersion);
        }
      } else if (resultParticipacion.status === "error") {
        mostrarMensajeError(
          resultParticipacion.message || "Error al obtener la participación"
        );
      }
    } catch (error) {
      mostrarMensajeError("Ocurrió un error al obtener la participación");
    }
  }

  // Resto del código de estrellas...

  const misEstrellas = document.querySelectorAll("#selectEstrellas .estrella");
  const menErr = document.getElementById("menErr");

  const botonCalificar = document.getElementById("btnCalificar");
  const mensaje = document.getElementById("mensaje");
  let cantidadEstre = 0; // para saber cueantas estrellas selecciono el usuario
  let estrellasConfirmadas = false; // para saber si el usuario apreto o no el boton de calificar

  misEstrellas.forEach((star) => {
    star.addEventListener("click", () => {
      if (estrellasConfirmadas) {
        // si ya apretó el botón de calificar, no deja volver a elegir
        return;
      } else {
        cantidadEstre = parseInt(star.getAttribute("data-value")); //guarda la cantidad de estrellas

        //recorro las estrellas y le voy poninedo el color amarilo dependiendo de la cantidad de estre selecionadas
        misEstrellas.forEach((s) => {
          s.classList.toggle(
            "yellow",
            s.getAttribute("data-value") <= cantidadEstre
          );
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
      botonCalificar.disabled = true; //desactivo btn
      misEstrellas.forEach((s) => {
        s.classList.add("disabled");
      });
    } else {
      mensaje.textContent = ""; // limpio mensaje
      menErr.classList.remove("d-none"); // muestro error
    }
  });

  //Comentarios
  const btnComentar = document.getElementById("btnComentar");
  const comentario = document.getElementById("comentario");
  const contenedorComentarios = document.querySelector(".MiComentario"); // contenedor de comentarios

  btnComentar.addEventListener("click", function () {
    const texto = comentario.value.trim();

    if (texto === "") {
      // Si el coemtario esta vacio, muestro elmensaje de error
      comentario.classList.add("is-invalid");
    } else {
      comentario.classList.remove("is-invalid");

      // Crear el nuevo comentario
      const nuevoComentario = document.createElement("div");
      nuevoComentario.classList.add("miConmen", "mt-2"); //le agrego clases

      // fecha del comentario realizadp
      const fecha = new Date();
      const fechaTexto = `${fecha.getDate()} de ${fecha.toLocaleString(
        "es-ES",
        { month: "long" }
      )} del ${fecha.getFullYear()}`;

      // Solo voy a mostrar las estrellas si se confirmó calificación
      let estrellasTexto;
      if (estrellasConfirmadas) {
        //Si el usuario ya confirmó su calificación
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

  // Botón volver
  const btnSalir = document.getElementById("btnSalir");
  btnSalir.addEventListener("click", function () {
    if (invitado) {
      window.location.href = "../Inicio/inicio.php";
    } else {
      volverAParticipante();
    }
  });
};

async function cargarRanking(idVersion, idParticipacion, esInvitado) {
  try {
    const responseRanking = await fetch(
      `../BaseDeDatos/controladores/getRankingVersion.php?version=${idVersion}`
    );
    const resultRanking = await responseRanking.json();

    if (resultRanking.status === "success") {
      const ranking = resultRanking.data;
      const carouselBody = document.getElementById("carouselRankingBody");
      let puestoParticipante = {
        puesto: null,
        datos: null,
      };

      if (ranking.length > 0) {
        const puestos = ranking.length < 5 ? ranking.length : 5;
        for (let index = 0; index < ranking.length; index++) {
          const participantePuesto = ranking[index];

          // Buscar por ID_PARTICIPACION en lugar de ID_USUARIO
          if (participantePuesto.ID_PARTICIPACION == idParticipacion) {
            puestoParticipante.puesto = index + 1;
            puestoParticipante.datos = participantePuesto;
          }
          if (index < puestos) {
            const item = document.createElement("div");
            item.classList.add("carousel-item");
            if (index === 0) item.classList.add("active");

            const medalla =
              index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : "👏🏻";

            item.innerHTML = `
                            <div class="card mx-auto" id="cardUsu">
                                <img src="${
                                  participantePuesto.INVITADO
                                    ? "../images/invitado.png"
                                    : participantePuesto.FOTO_PERFIL
                                }" class="card-img-top" alt="${
              participantePuesto.NOMBRE
            }">
                                <div class="card-body">
                                    <h5 class="card-title">#${
                                      index + 1
                                    } Lugar ${medalla}</h5>
                                    <p class="card-text">${
                                      participantePuesto.NOMBRE
                                    }</p>
                                    <p class="card-text">Puntaje: ${
                                      participantePuesto.PUNTAJE
                                    }</p>
                                </div>
                            </div>
                        `;

            carouselBody.appendChild(item);
          }
        }

        if (puestoParticipante.puesto && puestoParticipante.puesto > 5) {
          const cardParticipante =
            document.getElementById("puestoParticipante");
          const item = document.createElement("div");
          item.innerHTML = `
                        <div class="card mx-auto m-5" id="cardUsu">
                            <div class="row justify-content-center mb-2">
                                <div class="col-12 col-sm-6">
                                    <div class="d-flex align-items-center">
                                        <img src="${
                                          puestoParticipante.datos.INVITADO
                                            ? "../images/invitado.png"
                                            : puestoParticipante.datos
                                                .FOTO_PERFIL
                                        }" class="card-img-top" alt="${
            puestoParticipante.datos.NOMBRE
          }">
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <div class="card-body">
                                        <h5 class="card-title">#${
                                          puestoParticipante.puesto
                                        } Lugar</h5>
                                        <p class="card-text">${
                                          puestoParticipante.datos.NOMBRE
                                        }</p>
                                        <p class="card-text">Puntaje: ${
                                          puestoParticipante.datos.PUNTAJE
                                        }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
          cardParticipante.appendChild(item);
        }
      } else {
        document.getElementById("rankingCarousel").classList.add("d-none");
        document
          .getElementById("sinRankingResultado")
          .classList.remove("d-none");
      }
    } else if (resultRanking.status === "error") {
      mostrarMensajeError(
        resultRanking.message || "Error al obtener el ranking"
      );
    }
  } catch (error) {
    console.error(error);
    mostrarMensajeError("Error al obtener el ranking");
  }
}

async function cargarComentarios(idVersion) {
  try {
    const responseComentarios = await fetch(
      `../BaseDeDatos/controladores/getComentariosVersion.php?version=${idVersion}`
    );
    const resultComentarios = await responseComentarios.json();

    if (resultComentarios.status === "success") {
      const comentarios = resultComentarios.data;
      const contenedorComentarios = document.querySelector(".MiComentario");

      if (comentarios.length > 0) {
        const cantidadComentarios =
          comentarios.length < 5 ? comentarios.length : 5;
        for (let index = 0; index < cantidadComentarios; index++) {
          const comentario = comentarios[index];
          const nuevoComentario = document.createElement("div");
          nuevoComentario.classList.add("miConmen", "mt-2");

          const fecha = new Date(comentario.FECHA_PARTICIPACION);
          const fechaTexto = `${fecha.getDate()} de ${fecha.toLocaleString(
            "es-ES",
            { month: "long" }
          )} del ${fecha.getFullYear()}`;

          nuevoComentario.innerHTML = `
                        <h5 class="mb-1 fw-bold">${
                          comentario.NOMBRE
                        } ${"⭐".repeat(
            comentario.VALORACION_CUESTIONARIO
          )}</h5>
                        <p class="fecha">${fechaTexto}</p>
                        <p class="mb-0">${comentario.COMENTARIO}</p>
                    `;
          contenedorComentarios.appendChild(nuevoComentario);
        }
      } else {
        const noComentarios = document.createElement("div");
        noComentarios.innerHTML =
          "<p class='text-center'>No hay comentarios</p>";
        contenedorComentarios.appendChild(noComentarios);
      }
    } else if (resultComentarios.status === "error") {
      mostrarMensajeError(
        resultComentarios.message || "Error al obtener los comentarios"
      );
    }
  } catch (error) {
    mostrarMensajeError("Error al obtener los comentarios");
  }
}

function volverAParticipante() {
  window.location.href = "../participante/participante.php";
}

function mostrarMensajeError(mensaje) {
  const toastEl = document.getElementById("toast_mensaje_error");
  const toastBody = document.getElementById("mensaje_error");
  toastBody.innerText = mensaje || "Ups, ocurrió un error inesperado";
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
