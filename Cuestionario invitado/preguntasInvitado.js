window.onload = function()
{

    const botonNombre = document.getElementById("btnJugar");
    const cardNombre = document.getElementById("micardNombre");

    botonNombre.addEventListener("click", function(){
        const valido =validarNombre();
        //si el nombre es valido, muestro las preguntas
        if(valido)
        {    cardNombre.classList.add("d-none");
             mostrarPreguntas();
        }
    })

}

//valido el nombre ingresado
function validarNombre() {
    const input = document.getElementById("nombreIngresado"); 
    const nombre = input.value.trim();

    const regex = /^[A-Za-z0-9_]+$/;

    if (!regex.test(nombre)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    }
}

//muestro las preguntas
function mostrarPreguntas() {
  const cards = document.querySelectorAll(".card-preguntas");
  const correctas = ["Amazonas", "Rusia", "África", "Canberra"];
  let preguntaNum= 0;
  let respuestasCorrectas = 0;

  const nombreIngresado = document.getElementById("nombreIngresado");
  const nom = nombreIngresado.value.trim();

  // Contador dentro del div #contador
  const contador = document.getElementById("contador");
  contador.classList.remove("d-none");

  let auxContador = 3;
  const auxintervalo = setInterval(() => {
    contador.textContent = auxContador > 0 ? auxContador : "¡A jugar! " + nom;
    auxContador--;
    if (auxContador < -1) {
      clearInterval(auxintervalo);
      contador.classList.add("d-none");
      cards[preguntaNum].classList.remove("d-none");
    }
  }, 1000);

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
              window.location.href = "../Resultado invitado/invitadoResultado.html"
            }, 300);
          }
        }, 1000);
      });
    });
  });
}
