<?php
session_start();
require('../BaseDeDatos/conexion.php');

if (!isset($_SESSION['usuario_id'])) {
  header("Location: ../Login/login.php");
  exit;
}

?>

<!DOCTYPE html>
<html lang="es">

<head>
  <?php
  require('../includesPHP/head.php');
  ?>


  <link rel="stylesheet" href="editarUsuarioEstilo.css">


  <script src="editarUsuario.js" defer></script>
</head>

<body>
  <?php
  require('../includesPHP/navGeneral.php');
  ?>
  <div class="container vh-100 flex-column justify-content-center align-items-center">
    <div class="card m-5">
      <div class="text-center">
        <img src="<?= $_SESSION['foto_perfil'] ?>" id="icono" class="img-fluid mx-auto d-block" alt="Imagen no encontrada"><br>
      </div>
      <div class="card-body">
        <h1>Editar Usuario</h1>

        <form id="editarForm" class="form-floating">
          <div class="row">
            <div class="col-12 col-lg-6 mb-3">
              <label for="nombreNuevo" class="form-label">Nuevo nombre</label>
              <input type="text" class="form-control" id="nombreNuevo" placeholder="Ingrese nombre completo">
              <div class="invalid-feedback">Nombre inválido</label></div>
            </div>

            <div class="col-12 col-lg-6 mb-3">
              <label for="email" class="form-label">Cambiar correo electronico</label>
              <input type="email" class="form-control" id="emailNuevo" placeholder="example@gmail.com">
              <div class="invalid-feedback">Correo electronico invalido</div>
            </div>

            <div class="col-12 col-lg-6 mb-3">
              <label for="contrasena" class="form-label">Cambiar contraseña</label>
              <input type="password" class="form-control" id="contrasenaNueva" placeholder="Ingrese una contraseña ">
              <div class="invalid-feedback">Contraseña Invalida</div>
            </div>

            <div class="col-12 col-lg-6 mb-3">
              <label for="contrasena" class="form-label">Repetir contraseña</label>
              <input type="password" class="form-control" id="contrasenaNueva2" placeholder="Ingrese una contraseña ">
              <div class="invalid-feedback">Contraseña Invalida</div>
            </div>

            <div class="col-12 col-lg-6 mb-3">
              <label for="fecha" class="form-label">Cambiar fecha de Nacimiento</label>
              <input type="date" class="form-control" id="fechaNueva">
              <div class="invalid-feedback">Fecha Invalida</div>
            </div>

            <div class="col-12 col-lg-6 mb-3">
              <label for="fotoSelect" class="form-label">Seleccionar foto de perfil</label>
              <select id="fotoSelect" class="form-select">
                <option value="../Recursos/icono.png" selected>Predeterminada</option>
                <option value="../Recursos/Avatar1.png">Avatar 1</option>
                <option value="../Recursos/Avatar2.png">Avatar 2</option>
                <option value="../Recursos/Avatar3.png">Avatar 3</option>
                <option value="../Recursos/Avatar4.png">Avatar 4</option>
                <option value="../Recursos/Avatar5.png">Avatar 5</option>
              </select>
            </div>

            <div class="text-center mb-3">
              <img id="vistaPreviaFoto" src="" class="rounded-circle border" width="100" height="100" alt="Vista previa">
            </div>
            <div class="col-12 col-lg-6">
              <button type="submit" id="validarBoton" class="btn miboton mt-2">Guardar cambios</button><br>
            </div>
            <div class="col-12 col-lg-6">
              <a href="../administrador/administrador.php" class="btn botonCancelar mt-2">Cancelar</a>
            </div>
            <div id="mensajeBackend" class="mt-1"></div>
          </div>
        </form>

        <!--Modal-->
        <div class="modal fade" id="edicionExitosa" tabindex="-1" aria-labelledby="edicionExitosaLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">
              <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="edicionExitosaLabel">¡Cambio exitoso!</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>

              <div class="modal-body">
                ¡Tus cambios fueron guardados correctamente!
              </div>

              <div class="text-center mb-3">
                <img id="vistaPreviaFoto" src="" class="rounded-circle border" width="100" height="100" alt="Vista previa">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </div>
        </div>



        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
        </script>

</body>

</html>