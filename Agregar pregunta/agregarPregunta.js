window.onload = function()
{
/*TO DO LIST

Validaciones de cambios
Alerta por cambios no guardados
agregar una nueva pregunta(talvez un redireccionamieto o limpieza de campos)
borrar una pregunta
modal de configuracion(?)
cambios de estructura segun el tipo de pregunta
*/

abrirPanelDerecho();
abrirPanelTemas();
seleccionarTema();
salirDeCreacion();
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
