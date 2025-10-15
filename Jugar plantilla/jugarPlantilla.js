window.onload = function(){
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

