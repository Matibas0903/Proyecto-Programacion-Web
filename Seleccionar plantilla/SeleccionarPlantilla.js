window.onload = function()
{
inicializarPreguntasHardcodeadas();
let cantidadPreguntas = 3;

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
    const tema1 = "url(./Recursos/temaHistoria.jpg)";
    const tema2 = "url(./Recursos/temaHistoria2.jpg)";

     fondo.style.backgroundImage = tema2;

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

function crearBotonPregunta(preguntaId, titulo = "Pregunta") {
    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2", "btn", "btn-light");
    div.id = preguntaId;

        const pTitulo = document.createElement("p");
        pTitulo.classList.add("text-center", "text-muted", "mb-0","fs-6", "fs-md-5", "fs-lg-4"); /*responsive al texto de los btn*/
        pTitulo.textContent = p.titulo;
        pTitulo.id = `tituloPregunta-${preguntaId}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
    const icono = document.createElement("i");
    icono.classList.add("bi", "bi-trash-fill");
    btnEliminar.appendChild(icono);

    btnEliminar.addEventListener("click", (e) => {
        e.stopPropagation();
        div.remove();
        document.getElementById(`form-${preguntaId}`)?.remove();
    });

    div.addEventListener("click", () => {
        
        document.querySelectorAll(".form-pregunta").forEach(f => f.style.display = "none");
        const form = document.getElementById(`form-${preguntaId}`);
        if (form) form.style.display = "block";
    });

    div.appendChild(pTitulo);
    div.appendChild(btnEliminar);
    return div;
}

function crearFormularioPregunta(preguntaId, titulo = "Pregunta", opciones = []) {
    const panelPrincipal = document.getElementById("panelPrincipal");

    const container = document.createElement("div");
    container.classList.add("container", "mt-4", "form-pregunta");
    container.id = `form-${preguntaId}`;
    container.style.display = "none";

    const card = document.createElement("div");
    card.classList.add("card", "mb-4","cardPregunta"); //card que contiene las preguntas/respuestas

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-center","cardBodyPregun");//le puse una clase para darle estilo

    const inputPregunta = document.createElement("input");
    inputPregunta.type = "text";
    inputPregunta.classList.add("form-control", "text-center", "fw-bold");
    inputPregunta.value = titulo;
    inputPregunta.placeholder = "Escribe aquí la pregunta...";
    inputPregunta.id = `inputPregunta-${preguntaId}`;

    inputPregunta.addEventListener("input", () => {
        const tituloPregunta = document.getElementById(`tituloPregunta-${preguntaId}`);
        tituloPregunta.innerText = inputPregunta.value.trim() === "" ? "Pregunta" : inputPregunta.value;
    });

    cardBody.appendChild(inputPregunta);

    // Opciones
    const row = document.createElement("div");
    row.classList.add("row", "g-3");

    const opcionesDef = opciones.length ? opciones : ["Opción 1", "Opción 2", "Opción 3", "Opción 4"];
    opcionesDef.forEach((texto) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-md-6"); //le puse lo del responsive

        const btnOpcion = document.createElement("button");
        btnOpcion.classList.add("btn", "w-100","btnOpciones");//le clase clase de btrp y puse uno  nuevo
        btnOpcion.contentEditable = true;
        btnOpcion.textContent = opcion;

        col.appendChild(btnOpcion);
        col.classList.add("col-6");
        const cardRespuesta = document.createElement("div");
        cardRespuesta.classList.add("card-body", "d-flex", "flex-row", "mb-3");
        cardRespuesta.id = "OpcionRespuesta";

        const btn = document.createElement("button");
        
        btn.classList.add("btn", "btn-outline-primary", "w-100");
        btn.contentEditable = true;
        btn.textContent = texto;

        const radioCorrecta = document.createElement("input");
        radioCorrecta.type="radio";
        radioCorrecta.name= "radioCorrecto";
        radioCorrecta.classList.add("form-check-input");

        cardRespuesta.appendChild(radioCorrecta);
        cardRespuesta.appendChild(btn);
        col.appendChild(cardRespuesta);
        row.appendChild(col);
    });

    card.appendChild(cardBody);
    card.appendChild(row);
    container.appendChild(card);
    panelPrincipal.appendChild(container);
}

function añadirPregunta(cantidadPreguntas) {
    const btn = document.getElementById("btnAñadirPregunta");
    const contenedor = document.getElementById("divPreguntas");

    btn.addEventListener("click", () => {
        cantidadPreguntas++;
        const id = `pregunta-${cantidadPreguntas}`;
        contenedor.appendChild(crearBotonPregunta(id));
        crearFormularioPregunta(id);
        
    });

    return cantidadPreguntas;
}

function inicializarPreguntasHardcodeadas() {
    const preguntas = [
        { titulo: "¿En qué año comenzó la Segunda Guerra Mundial?", opciones: ["1914", "1939", "1945", "1929"] },
        { titulo: "¿Quién fue el líder del movimiento de independencia de la India?", opciones: ["Mahatma Gandhi", "Nelson Mandela", "Simón Bolívar", "Martin Luther King Jr."] },
        { titulo: "La caída del Imperio Romano de Occidente fue en:", opciones: ["476 d.C.", "1453 d.C.", "1492 d.C.", "395 d.C."] }
    ];

    const contenedor = document.getElementById("divPreguntas");
    preguntas.forEach((p, i) => {
        const id = `pregunta-${i + 1}`;
        contenedor.appendChild(crearBotonPregunta(id, p.titulo));
        crearFormularioPregunta(id, p.titulo, p.opciones);
    });
}
