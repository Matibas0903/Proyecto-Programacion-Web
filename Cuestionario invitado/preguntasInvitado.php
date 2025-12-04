<?php
session_start();

$nombreInvitado=$nombreErr="";
if($_SERVER["REQUEST_METHOD"] == "POST")
{
    if(empty($_POST["nombreInvitado"]))
    {
      $nombreErr="Ingrese un nombre";
    }
    else
    {
      $nombreInvitado=trim($_POST["nombreInvitado"]);
      $nombreInvitado=htmlspecialchars($nombreInvitado);

      if(!preg_match("/^[A-Za-z0-9_]+$/",$nombreInvitado))
      {
        $nombreErr="ingrese un nombre valido";
      }
      else
      {
        $_SESSION['nombre_Invitado'] = $nombreInvitado;
      }
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <?php
  require('../includesPHP/head.php');
  ?>
  <link rel="stylesheet" href="preguntasInvitado.css">
  <title>Preguntas</title>

  <script src="preguntasInvitado.js" defer></script>
</head>

<body>
  <?php
  require('../includesPHP/navInvitado.php');
  ?>

  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center">

    <!-- Input de nombre -->
    <div class="card cardEs w-card mb-4" id="micardNombre">
      <div class="card-body text-center">
        <input type="text" class="form-control mb-3 input-nombre" id="nombreIngresado" maxlength="14" placeholder="Ingrese un nombre">
        <div class="valid-feedback"></div>
        <div class="invalid-feedback" id="mensajeError"></div>
        <button type="button" class="btn mibtn w-100" id="btnJugar">Listo</button>
        <div class="mt-2 d-none" id="spinnerContainer">
          <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
          <span class="ms-2">Cargando...</span>
        </div>
      </div>
    </div>

  </div>

  </div>
    <?php
      include('../mensajeError/mensajeError.php');
    ?>

</body>

</html>