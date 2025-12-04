<?php
session_start();
require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');
$idUsuario = $_SESSION['usuario_id'];
$esAdministrador = Permisos::esRol('Administrador', $idUsuario);
$esParticipante = Permisos::esRol('Participante', $idUsuario);
$esModerador = Permisos::esRol('Moderador', $idUsuario);
//permiso para jugar
if (!Permisos::tienePermiso('jugar_cuestionario', $idUsuario)) {
    if($esAdministrador){
        header("Location: ../administrador/administrador.php");
        exit;
    } else if ($esModerador) {
        header("Location: ../moderador/moderador.php");
        exit;
    } else if ($esParticipante) {
        header("Location: ../participante/participante.php");
        exit;
    } else {
        header("Location: ../Inicio/inicio.php");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="./jugarPlantilla.css">
    <script src="jugarPlantilla.js" defer></script>
    <title>Jugar plantilla</title>
</head>

<body>
    <?php
        $invitado = isset($_GET['invitado']) && $_GET['invitado'] === 'true';
        if($invitado){
            require('../includesPHP/navInvitado.php');
        } else {
            require('../includesPHP/navGeneral.php');
        }
    ?>
    <!-- Juego -->
    <div id="contenedor-juego">
        <div id="cronometro" class="cronometro d-none"></div>
        <!-- Contador -->
        <div id="contador" class="contador d-none"></div>
    </div>
    </div>

    <?php
      include('../mensajeError/mensajeError.php');
    ?>
</body>

</html>