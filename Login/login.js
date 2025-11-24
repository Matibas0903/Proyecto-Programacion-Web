window.onload = function () {   
    const miForm = document.getElementById("miform");
    const mensaje = document.getElementById("mensajeJS");

   miForm.addEventListener("submit", function (event) {
    // Limpiar mensaje antes de validar
    if (mensaje) {
        mensaje.classList.add("d-none");
        mensaje.textContent = ""; // limpia el texto
    }

    let correoValido = validarGmail("gmail");
    let contraValido = validarContra();

    if (!correoValido || !contraValido) {
        event.preventDefault();
        if (mensaje) {
           mensaje.textContent = "Por favor, ingrese datos validos.";
            mensaje.classList.remove("d-none");
        }
    }
});
    inicializarModal();
};

function validarContra() {
    const contra = document.getElementById("contraseña");
    const valor = contra.value.trim();
    const regex = /^[A-Za-z0-9_]{6,12}$/;

    if (!regex.test(valor) || valor === "") {
        if (!contra.classList.contains("is-invalid")) {
            contra.classList.add("is-invalid");
        }
        return false;
    } else {
        // Solo eliminar is-invalid si no hay error de PHP
        if (!contra.dataset.phperror) {
            contra.classList.remove("is-invalid");
        }
        return true;
    }
}

// Valida el correo (JS solo verifica formato y vacío)
function validarGmail(id) {
    const campo = document.getElementById(id);
    const valor = campo.value.trim();
    const regex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

    if (!regex.test(valor) || valor === "") {
        if (!campo.classList.contains("is-invalid")) {
            campo.classList.add("is-invalid");
        }
        return false;
    } else {
        if (!campo.dataset.phperror) {
            campo.classList.remove("is-invalid");
        }
        return true;
    }
}

function inicializarModal() {
    const btnEnviarModal = document.getElementById("btnEnviar");
    const inputCorreo = document.getElementById("inputCorreo");
    const modalOlvide = document.getElementById("modalOlvide");
    const mensajeValido = modalOlvide.querySelector(".valid-feedback");
    const mensajeError = document.getElementById("mensajeError");
    const botonesFooter = modalOlvide.querySelectorAll(".modal-footer button");

    btnEnviarModal.addEventListener("click", function() {
        // Limpiar clases anteriores
        inputCorreo.classList.remove("is-valid", "is-invalid");
        mensajeValido.classList.add("d-none");
        mensajeError.classList.add("d-none");

        // Validar formato de correo
        if (validarGmail(inputCorreo.id)) {
            fetch('recuperar_contraseña.php', {
                method: 'POST',
                body: new URLSearchParams({ correo: inputCorreo.value })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data); // para verificar qué llega
                if (data.success) {
                    inputCorreo.classList.add("is-valid");
                    mensajeValido.textContent = data.mensaje; // texto dinámico
                    mensajeValido.classList.remove("d-none");
                    botonesFooter.forEach(btn => btn.disabled = true);
                } else {
                    inputCorreo.classList.add("is-invalid");
                    mensajeError.textContent = data.mensaje; // texto dinámico
                    mensajeError.classList.remove("d-none");
                }
            });
        } else {
            inputCorreo.classList.add("is-invalid");
            mensajeError.textContent = "Ingrese un correo válido (@gmail.com)";
            mensajeError.classList.remove("d-none");
        }
    });

    const btnCancelar = document.getElementById("btnCancelar");
    const btnCerrar = document.getElementById("btnCerrar");

    // Limpiar input y mensajes al cerrar modal
    [btnCancelar, btnCerrar].forEach(btn => {
        btn.addEventListener("click", function() {
            inputCorreo.value = "";
            inputCorreo.classList.remove("is-valid", "is-invalid");
            mensajeValido.classList.add("d-none");
            mensajeError.classList.add("d-none");
            botonesFooter.forEach(btn => btn.disabled = false);
        });
    });
}


