window.onload = function () 
{   
   const miForm = document.getElementById("miform");
    
    miForm.addEventListener("submit", function (event) 
    {
        event.preventDefault();

        const correoValido = validarGmail("gmail");
        const contraValido = validarContra();

        if (!correoValido || !contraValido) {
             return; 
        }

        
        });
    
     inicializarModal();
     logueoCorrecto();
};

function validarContra() 
{
    const contra = document.getElementById("contraseña");
    const valorIngresado = contra.value.trim();
    const reglaContra = /^[A-Za-z0-9_]{6,8}$/;

    if (!reglaContra.test(valorIngresado) || valorIngresado === "") {
        contra.classList.add("is-invalid");
        contra.classList.remove("is-valid");
        return false;
    } else {
        contra.classList.remove("is-invalid");
        contra.classList.add("is-valid");
         return true;
    }
}

function validarGmail(idCampo)
{
    const campo = document.getElementById(idCampo);
    const valorIngresado = campo.value.trim();
    const reglaGmail = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

    if (!reglaGmail.test(valorIngresado) || valorIngresado === "") {
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
        return false;
     } else {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
        return true;
    }
}

function inicializarModal() {
    const btnEnviarModal = document.getElementById("btnEnviar");
    const inputCorreo = document.getElementById("inputCorreo");
    const modalOlvide = document.getElementById("modalOlvide");
    const mensajeValido = modalOlvide.querySelector(".valid-feedback");
    const botonesFooter = modalOlvide.querySelectorAll(".modal-footer button");

    // Al enviar correo desde el modal
    btnEnviarModal.addEventListener("click", function() {
        if (validarGmail(inputCorreo.id)) {
            // Mostrar mensaje de éxito
            mensajeValido.classList.remove("d-none");

            // Deshabilitar botones
            botonesFooter.forEach(btn => btn.disabled = true);
        }
    });

    // Al cancelar el modal
    const btnCancelar = document.getElementById("btnCancelar");
    btnCancelar.addEventListener("click", function() {
        btnCancelar.blur() ; //quita el foco del boton
        inputCorreo.value = "";             // limpiar input
        mensajeValido.classList.add("d-none"); // ocultar mensaje
        // Rehabilitar botones
        botonesFooter.forEach(btn => btn.disabled = false);
    });
}

function logueoCorrecto(){
    const btnIniciarSesion = document.getElementById("botonEnviar");

    btnIniciarSesion.addEventListener("click", function(){
        window.location.href = "../administrador/administrador.html";
    });
    
}

