window.onload = function(){
    cargarVersion();
    jugarPlantilla();
    salirDePlantilla();
}

function jugarPlantilla(){
    const btnJugar = document.getElementById("btnIniciarCuestionario");
    const idVersion = new URLSearchParams(window.location.search).get('version');
    if(!idVersion){
        //redireccionar a pantalla panticipante si no hay id de versión
        redirigirConError('ID de versión inválido.');
        window.location.href = "../participante/participante.php";
        return;
    } else {
        btnJugar.addEventListener("click", function (){
            window.location.href = `../Jugar plantilla/jugarPlantilla.php?version=${idVersion}`;
        });
    }
}
function salirDePlantilla(){
    const btnSalir = document.getElementById("btnSalirLobby");

    btnSalir.addEventListener("click", function (){
        window.location.href = "../participante/participante.php";
    });
}

async function cargarVersion(){
    const idVersion = new URLSearchParams(window.location.search).get('version');
    if(!idVersion){
        //redireccionar a pantalla panticipante si no hay id de versión
        redirigirConError('ID de versión inválido.');
        window.location.href = "../participante/participante.php";
    } else {
        try {
            const response = await fetch(`../BaseDeDatos/controladores/getVersionById.php?version=${idVersion}&jugador=true`);
            const result = await response.json();
            if(result.status === 'success'){
                const version = result.data;
                if(version.ACTIVO === 'Inactivo'){
                    redirigirConError('La versión seleccionada no está activa.');
                    //redireccionar a pantalla panticipante si no hay id de versión
                    window.location.href = "../participante/participante.php";
                    return;
                } else {
                    if (version.IMAGEN) {
                        document.getElementById("background_image").style.backgroundImage = 
                            `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${version.IMAGEN}')`;
                    } else {
                        document.getElementById("background_image").style.backgroundImage = 
                            `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../images/fondo_default.jpg')`;
                    }
                    if(version.NOMBRE_CUESTIONARIO){
                        document.getElementById("tituloCuestionario").innerText = version.NOMBRE_CUESTIONARIO;
                    }
                    //calificación
                    if(version.DESCRIPCION){
                        document.getElementById("descripcionCuestionario").innerText = version.DESCRIPCION;
                    }
                    if(version.promedio_calificacion > 0){
                        const calificacion = version.promedio_calificacion || 0;
                        let estrellas = "";
                        for (let i = 1; i <= 5; i++) {
                            estrellas += i <= calificacion ? "★" : "☆";
                        }
                        document.getElementById("calificacionCuestionario").innerText = estrellas;
                    }
                }
            }
            else if(result.status === 'error'){
                redirigirConError(result.message || 'Error al obtener el cuestionario');
                return;
            }
            //cargamos el ranking
            const responseRanking = await fetch(`../BaseDeDatos/controladores/getRankingVersion.php?version=${idVersion}`);
            const resultRanking = await responseRanking.json();
            if(resultRanking.status === 'success'){
                const ranking = resultRanking.data;
                if(ranking.length > 0){
                    const puestosRanking = ranking.length < 5 ? ranking.length : 5;
                    const rankingBody = document.getElementById('cuerpoRanking');
                    for (let i = 0; i < puestosRanking; i++) {
                        const row = document.createElement('tr');
                        const cellNombre = document.createElement('td');
                        cellNombre.innerText = ranking[i].NOMBRE;
                        const puesto = document.createElement('td');
                        puesto.innerText = (i + 1);

                        row.appendChild(cellNombre);
                        row.appendChild(puesto);
                        rankingBody.appendChild(row);
                    }
                    document.getElementById('sinRanking').classList.add('d-none');
                    document.getElementById('tablaUsuarios').classList.remove('d-none'); 
                }else {
                    document.getElementById('sinRanking').classList.remove('d-none');
                    document.getElementById('tablaUsuarios').classList.add('d-none');
                }
            }
            else if(resultRanking.status === 'error'){
                mostrarMensajeError(resultRanking.message || 'Error al obtener el ranking');
            }
        } catch (error) {
            redirigirConError('Ha ocurrido un error');
        }
    }
}

function redirigirConError(errorMensaje){
    sessionStorage.setItem('mensajeError', errorMensaje);
    window.location.href = "../participante/participante.php";
}

function mostrarMensajeError(mensaje){
    const toastEl = document.getElementById('toast_mensaje_error');
    const toastBody = document.getElementById('mensaje_error');
    toastBody.innerText = mensaje || 'Ups, ocurrio un error inesperado';
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}