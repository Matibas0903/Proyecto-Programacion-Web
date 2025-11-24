function iniciarCarrusel() {
    const items = document.querySelectorAll('#rankingInner .carousel-item');

    let index = 0;

    function updateCarousel() {
        items.forEach((item, i) => {
            item.classList.remove('prev', 'active', 'next');

            if (i === index) {
                item.classList.add('active');
            } else if (i === (index - 1 + items.length) % items.length) {
                item.classList.add('prev');
            } else if (i === (index + 1) % items.length) {
                item.classList.add('next');
            }
        });
    }

    // Inicializa
    updateCarousel();

    // Cambio automático cada 3 segundos
    setInterval(() => {
        index = (index + 1) % items.length;
        updateCarousel();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
   const params = new URLSearchParams(window.location.search);
  const version = params.get("version");
    cargarCuestionario(version);
    cargarRanking(version);

console.log("Versión recibida:", params.get("version"));

});





async function cargarCuestionario(version) {
    const contenedor = document.getElementById("contendedorPrincipal");

    const res = await fetch(`getDatosCuestionario.php?version=${version}`);
    const data = await res.json();

    if (data.error) {
        contenedor.innerHTML = `<p>${data.error}</p>`;
        return;
    }

    let html = "";

   data.preguntas.forEach(p => {

    html += `
        <div class="preguntas">
            <h3>Pregunta ${p.NRO_ORDEN}</h3>
            <p class="pregunta-enunciado">${p.ENUNCIADO}</p>

            ${p.IMAGEN ? `<img class="pregunta-imagen" src="${p.IMAGEN}" alt="Imagen de la pregunta">` : ""}

            <div class="opciones-grid">
    `;

    p.opciones.forEach(op => {
        let clase = "opcion";

        if (op.ES_CORRECTA == 1) {
            clase += " opcion-correcta"; // respuesta correcta
        }

        html += `<div class="${clase}">${op.TEXTO}</div>`;
    });

    html += `
            </div>
        </div>
    `;
});

contenedor.innerHTML = html;
}


async function cargarRanking(version) {
    const contRanking = document.getElementById("rankingInner");
    const contComentarios = document.getElementById("ContenedorComentarios");

    const res = await fetch(`Comentarios_ranking.php?version=${version}`);
    const data = await res.json();

    if (data.error) {
        contRanking.innerHTML = `<p>${data.error}</p>`;
        return;
    }

    const ranking = data.ranking;
    const comentarios = data.comentarios;

    let htmlRanking = "";
    let htmlComentarios = "";

    ranking.forEach((usuario, index) => {

        const lugar = index + 1;
        const active = index === 0 ? "active" : "";

        const foto = usuario.FOTO_PERFIL && usuario.FOTO_PERFIL !== "" 
            ? usuario.FOTO_PERFIL
            : "./Recursos/";

        htmlRanking += `
            <div class="carousel-item ${active}">
                <div class="card mx-auto" id="cardUsu" style="width: 280px; border-radius:20px;">
                    <img src="${foto}" class="card-img-top" style="width:140px; height:140px; margin: 20px auto; border-radius: 50%; object-fit: cover;">
                    <div class="card-body text-center">
                        <h5 class="card-title">#${lugar} Lugar 🏆</h5>
                        <p class="card-text">${usuario.NOMBRE}</p>
                        <p class="card-text">Respuestas correctas: ${usuario.respuestas_correctas}</p>
                        <p class="card-text">Puntaje: ${usuario.PUNTAJE}</p>
                    </div>
                </div>
            </div>
        `;
    });

    contRanking.innerHTML = htmlRanking;

    //Comentarios
    if (!comentarios || comentarios.length === 0) {
       contComentarios.innerHTML = `<p>No hay comentarios todavía.</p>`;

        return;
    }

    comentarios.forEach(c => {

        htmlComentarios += `
        <div class="col-12 col-md-10 col-lg-6 mx-auto">
            <div class="card comentario-card mb-4 p-3">

                <p class="fw-bold nombre">${c.NOMBRE}</p>
                 <p class="valoracion">${estrellasHTML(c.valoracion)}</p>
                <p class="fecha">${c.fecha}</p>
                <p class="comentario-texto">${c.COMENTARIO}</p>

            </div>
        </div>`;
    });

    contComentarios.innerHTML = htmlComentarios;
}


function estrellasHTML(valor) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
      html += i <= valor ? "★" : "☆";
  }
  return html;
}
