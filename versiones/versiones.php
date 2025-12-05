<?
session_start();
require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');
$idUsuario = $_SESSION['usuario_id'];
//roles del usuario
$esAdministrador = Permisos::esRol('Administrador', $idUsuario);
$esParticipante = Permisos::esRol('Participante', $idUsuario);
$esModerador = Permisos::esRol('Moderador', $idUsuario);

if (!$esAdministrador) {
    if ($esModerador) {
        header("Location: ../moderador/moderador.php");
        exit;
    } elseif ($esParticipante) {
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
  <link rel="stylesheet" href="./versiones.css">
  <title>Versiones</title>
</head>

<body>
  <?php
  require('../includesPHP/navGeneral.php');
  ?>
  <div class="container mt-3">
    <!--header -->
    <div class="row">
      <div class="col-12 col-md-8 my-3 order-2 order-md-1">
        <h1 id="titulo_cuestionario"></h1>
        <!-- <p><strong>Descripción: </strong><span id="descripcion_cuestionario"></span></p> -->
        <div>
          <div class="border_cuest d-flex justify-content-between align-items-center p-2 my-3" id="moderador_card">
            <p class="mb-0"><i class="bi bi-incognito"></i> <strong>Moderador: </strong> <span id="moderador_nombre"></span></p>
            <img src="" alt="moderador" class="moderador_avatar" id="moderador_avatar">
          </div>
        </div>
        <div id="reportes"></div>
      </div>
      <!-- <div class="col-12 col-md-4 my-3 order-1 order-md-2">
            <img src="" alt="img-programacion" id="image_cuest" class="img-cuestionario d-block mx-auto">
        </div> -->
    </div>
    <div class="col-12 col-md-8 row g-2 mb-3">
      <div class="col-12 col-md-3">
        <button class="button_principal border_cuest" id="button-nueva-version"><i class="bi bi-plus-circle-fill"></i> Nueva version</button>
      </div>
      <div class="col-12 col-md-3" id="habilitar_container">
        <button class="button_principal border_cuest" id="button-habilitar"><i class="bi bi-lock-fill"></i> Habilitar version</button>
      </div>
      <div class="col-12 col-md-3">
        <button class="button_principal border_cuest" id="button-moderador"><i class="bi bi-incognito"></i> Moderador</button>
      </div>
    </div>
    <!--cuerpo -->
    <div class="row my-3" id="version-list">
    </div>
  </div>

  <!-- modal compartir -->
  <div class="modal" tabindex="-1" id="modalCompartir">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitulo"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-center">Copia y comparte el enlace</p>
          <br>
          <h2 class="text-center modal_enlace" id="enlace"></h2>
          <p></p>
        </div>
      </div>
    </div>
  </div>
  <!-- modal habilitar -->
  <div class="modal" tabindex="-1" id="modalHabilitar">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloHab"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-center" id="texto_hab"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary" id="habilitar_btn">Si</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal confirmacion -->
  <div class="modal" tabindex="-1" id="modalConfirmacion">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloHab"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p id="text_confirmacion" class="text-center">Operación exitosa!!!</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal +participante -->
  <div class="modal" tabindex="-1" id="modalParticipantes">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-user-title"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="formParticipante" class="needs-validation" novalidate>
            <div class="mb-3" id="fecha_vencimiento_container">
              <label for="fecha" class="form-label">Fecha de vencimiento de la invitación</label>
              <input type="date" class="form-control border_cuest" name="inputFechaNacimiento" id="fecha_vencimiento">
              <div class="invalid-feedback">La fecha debe ser superior a la fecha actual</div>
            </div>
            <div class="input-group input-group-lg">
              <button class="input-group-text icon_container c_orange button_search" id="button-part"><i class="bi bi-search"></i></button>
              <input type="text" id="nombrePart" class="form-control border_cuest" placeholder="" maxlength="20" required>
              <div class="invalid-feedback" id="namePartInvalid">
                Ingresa un nombre no mayor a 20 caracteres
              </div>
            </div>
            <div id="participantes_container" class="my-3 d-none">
              <h2 class="text-center">USUARIOS</h2>
              <div id="lista_participantes" class="m-1"></div>
              <div id="paginador" class="d-flex justify-content-center align-items-center mt-3"></div>
              <p class="text-center fs-4 d-none" id="no_participantes">No se encontraron usuarios</p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- modal versiones -->
  <div class="modal" tabindex="-1" id="modalVersiones">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloVersiones"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="form-version">
            <label for="select-version" id="texto_versiones"></label>
            <select class="form-select" id="select-version">
            </select>
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="submit" class="btn btn-primary" id="seleccionar_versiones">Seleccionar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <?php
  include('../mensajeError/mensajeError.php');
  ?>

</body>
<script src="./versiones.js"></script>

</html>