window.onload = function(){

jugarPlantilla();
salirDePlantilla();

}

function jugarPlantilla(){
    const btnJugar = document.getElementById("btnIniciarCuestionario");

    btnJugar.addEventListener("click", function (){
        window.location.href = "../Jugar plantilla/jugarPlantilla.html";
    });
}
function salirDePlantilla(){
    const btnSalir = document.getElementById("btnSalirLobby");

    btnSalir.addEventListener("click", function (){
        window.location.href = "../administrador/administrador.html";
    });
}