window.onload = function() {
    //selecciono todos los ele que estan dentro del div con class estrella
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
        botonCalificar.disabled = true;
        misEstrellas.forEach(s => {
           s.classList.add("disabled");
        })

    } else {
        mensaje.textContent = ""; // limpio mensaje de confirmación
        menErr.classList.remove("d-none"); // muestro error
    }
   });

     //Boton comentar

  const btnComentar = document.getElementById("btnComentar");

   btnComentar.addEventListener("click",function(){
    const men = document.getElementById("mensajeIniciarSesion");
    men.classList.remove("d-none");
   }) 
};

