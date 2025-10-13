window.onload = function() {
    //selecciono todos los elem que estan dentro del div con class estrella
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
}
