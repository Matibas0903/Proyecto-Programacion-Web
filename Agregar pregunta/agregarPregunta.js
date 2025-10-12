window.onload = function()
{
let cantidadPreguntas = 0;

abrirPanelDerecho();
abrirPanelTemas();
seleccionarTema();
salirDeCreacion();
mostrarConfiguracion();
ponerNombre();
validarTitulo();    
añadirPregunta(cantidadPreguntas);
}

function abrirPanelDerecho()
{
const panelDer = document.getElementById('panelDer');
const btnPanelDer = document.getElementById('btnPanelDer');
const main = document.getElementById("panelPrincipal");

// Toggle al presionar la flecha
btnPanelDer.addEventListener('click', () => {
    panelDer.classList.toggle('active');
    btnPanelDer.classList.toggle('open');

    if(panelDer.classList.contains('active') && main.classList.contains('col-9'))
    {
        main.classList.remove('col-9');
        main.classList.add('col-7');
    }
else
    {
        main.classList.remove('col-7');
        main.classList.add('col-9');
    }

});

}

function abrirPanelTemas()
{
const panelTemas = document.getElementById("panelTemas");
const btnCerrarTemas = document.getElementById("btnCerrarTemas");
const panelDer = document.getElementById('panelDer');
const main = document.getElementById("panelPrincipal");


btnTemas.addEventListener('click', () => { 
    const esVisible = panelTemas.style.visibility==="visible";
        if(!esVisible)
            {
                if(panelDer.classList.contains('active'))
                    {
                        panelTemas.style.visibility="visible";
                    }
                else
                    {
                    panelTemas.style.visibility="visible";
                    main.classList.remove('col-9');
                    main.classList.add('col-7');
                    }
            }
          
        else 
            {
                
                 if(panelDer.classList.contains('active'))
                    {
                        panelTemas.style.visibility="hidden";
                    }
                else
                    {
                        
                        panelTemas.style.visibility="hidden";
                        main.classList.remove('col-7');
                        main.classList.add('col-9');
                    }
            
            }
              
        btnCerrarTemas.addEventListener('click', () =>
        {
              if(panelDer.classList.contains('active'))
                    {
                        panelTemas.style.visibility="hidden";
                    }
                else
                    {
                        panelTemas.style.visibility="hidden";
                        main.classList.remove('col-7');
                        main.classList.add('col-9');
                    }
            
        })

});
}

function seleccionarTema()
{
    const btntema1 = document.getElementById("tema1");
    const btntema2 = document.getElementById("tema2");
    const btntema3 = document.getElementById("tema3");
    const fondo = document.getElementById("panelPrincipal");
    const tema1 = "url(./Recursos/tema1.jpeg)";
    const tema2 = "url(./Recursos/tema2.jpg)";
    btntema1.addEventListener("click", ()=>
        {
            fondo.style.backgroundImage = tema1;
        });
    btntema2.addEventListener("click", () => 
        {
             fondo.style.backgroundImage = tema2;
        });
    btntema3.addEventListener("click", () => 
        {
            fondo.style.backgroundImage = "none";
            
        });
}
    
function mostrarAlertaGuardado()
{

}

function salirDeCreacion(){
    const btnSalir = document.getElementById("btnSalir");
    
    btnSalir.addEventListener("click", function(){
        const modalSalirSinGuardar = new bootstrap.Modal(document.getElementById("modalSalirSinGuardar"));
        modalSalirSinGuardar.show();
    })
}


function mostrarConfiguracion()
{
    const btnConfig = document.getElementById("btnConfig");

    btnConfig.addEventListener("click", ()=>
        {
            const modalConfig = new bootstrap.Modal(document.getElementById('modalConfiguracion'))
            modalConfig.show();
        })
}

function validarTitulo() 
{
    const btnGuardar = document.getElementById("btnGuardar");
    const titulo = document.getElementById("tituloCuestionario");
    const inputTitulo = document.getElementById("inputIngresarTitulo");

    btnGuardar.addEventListener("click", ()=>
        {
            if(titulo.innerText.trim() === "")
                {
                    inputTitulo.classList.add("is-invalid");
                    inputTitulo.classList.remove("is-valid");
                    titulo.innerHTML = "cuestionario";
                }
            else
                {
                    inputTitulo.classList.add("is-valid");
                    inputTitulo.classList.remove("is-invalid")
                }

        });
}

function ponerNombre()
{
    const inputTitulo = document.getElementById("inputIngresarTitulo");
    const titulo = document.getElementById("tituloCuestionario");
    const inputTituloconfig = document.getElementById("inputTitulo")
    const btnListo = document.getElementById("btnListo");

    inputTitulo.addEventListener("input", ()=>
        {
            titulo.innerHTML= inputTitulo.value;
        })
    btnListo.addEventListener("click", ()=>
        {
            titulo.innerHTML = inputTituloconfig.value;
            if(titulo.innerText.trim() === "")
                {
                    titulo.innerHTML = "cuestionario";
                }
        })
}

function añadirPregunta(cantidadPreguntas) {
    const btnAñadirPregunta = document.getElementById("btnAñadirPregunta");
    const divContenedor = document.getElementById("divPreguntas");

    btnAñadirPregunta.addEventListener("click", () => {
        cantidadPreguntas++;
        const preguntaId = `pregunta-${cantidadPreguntas}`;

        // Botón lateral
        const preguntaDiv = document.createElement("div");
        preguntaDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2", "btn", "btn-light");
        preguntaDiv.id = preguntaId;

        const p = document.createElement("p");
        p.classList.add("text-center", "text-muted", "mb-0");
        p.textContent = `Pregunta`;
        p.id = `tituloPregunta-${preguntaId}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

        const icono = document.createElement("i");
        icono.classList.add("bi", "bi-trash-fill");
        btnEliminar.appendChild(icono);

        btnEliminar.addEventListener("click", (e) => {
            e.stopPropagation(); // evitar que se muestre al eliminar
            preguntaDiv.remove();
            document.getElementById(`form-${preguntaId}`)?.remove(); // borrar el formulario también
        });

        // Al hacer clic en el botón lateral, mostrar el formulario correspondiente
        preguntaDiv.addEventListener("click", () => {
            // ocultar todos los formularios
            document.querySelectorAll(".form-pregunta").forEach(f => f.style.display = "none");
            const form = document.getElementById(`form-${preguntaId}`);
            if (form) form.style.display = "block";
        });

        preguntaDiv.appendChild(p);
        preguntaDiv.appendChild(btnEliminar);
        divContenedor.appendChild(preguntaDiv);

        // Crear el formulario asociado
        crearPregunta(preguntaId);
    });
}

// --------- Función nueva: bloque principal de la pregunta ----------
function crearPregunta(preguntaId) {
    const panelPrincipal = document.getElementById("panelPrincipal");

    const container = document.createElement("div");
    container.classList.add("container", "mt-4", "form-pregunta");
    container.id = `form-${preguntaId}`;
    container.style.display = "none"; // inicialmente oculto

    const card = document.createElement("div");
    card.classList.add("card", "mb-4");

    // Card body con input
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-center");

    const inputPregunta = document.createElement("input");
    inputPregunta.type = "text";
    inputPregunta.classList.add("form-control", "text-center", "fw-bold");
    inputPregunta.placeholder = "Escribe aquí la pregunta...";
    inputPregunta.id = `pregunta-${preguntaId}`;

    cardBody.appendChild(inputPregunta);

    // Opciones 2x2
    const row = document.createElement("div");
    row.classList.add("row", "g-3");

    for (let i = 1; i <= 4; i++) {
        const col = document.createElement("div");
        col.classList.add("col-6");

        const btnOpcion = document.createElement("button");
        btnOpcion.classList.add("btn", "btn-outline-primary", "w-100");
        btnOpcion.contentEditable = true;
        btnOpcion.textContent = `Opción ${i}`;

        col.appendChild(btnOpcion);
        row.appendChild(col);
    }

    card.appendChild(cardBody);
    card.appendChild(row);
    container.appendChild(card);
    panelPrincipal.appendChild(container);

inputPregunta.addEventListener("input", ()=>
    {
        const tituloPregunta = document.getElementById(`tituloPregunta-${preguntaId}`);
        tituloPregunta.innerText = inputPregunta.value;
        if(tituloPregunta.innerText.trim() === "")
                {
                    tituloPregunta.innerText = "Pregunta";
                }
    })
}


