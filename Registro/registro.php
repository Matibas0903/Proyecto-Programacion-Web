<?php
session_start();

require("../BaseDeDatos/conexion.php");

$nombre = $mail = $contraseña = $fechaNacimiento = $fotoPerfil = "";
$nombreError = $mailError = $contraseñaError = $fechaNacimientoError = $fotoPerfilError = "";
$registroExitoso = "";
$mensaje = "";
$mostrarMensaje = "";
$existeUsuario = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $fotoPerfil = $_POST["selectFotoPerfil"];

  if (empty($_POST["inputNombre"])) {
    $nombreError = "Ingrese nombre";
  } else {
    $nombre = trim($_POST["inputNombre"]);
    $nombre = htmlspecialchars($nombre);

    if (!preg_match("/^[a-zA-Z ]+$/", $nombre)) {
      $nombreError = "Solo se permiten letras y espacios";
    }
  }


  if (empty($_POST["inputMail"])) {
    $mailError = "Ingrese correo electrónico";
  } else {
    $mail = trim($_POST["inputMail"]);
    $mail = htmlspecialchars($mail);
    $mailError = "";

    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
      $mailError = "Solo se permiten mails del tipo : usuario@gmail.com";
    }
  }


  if (empty($_POST["inputContraseña"])) {
    $contraseñaError = "Ingrese contraseña";
  } else {
    $contraseña = trim($_POST["inputContraseña"]);
    $contraseña = htmlspecialchars($contraseña);

    if (!preg_match("/^[A-Za-z0-9_]{6,12}$/", $contraseña)) {
      $contraseñaError = "Ingrese una contraseña correcta";
    }
  }


  if (empty($_POST["inputFechaNacimiento"])) {
    $fechaNacimientoError = "Ingrese su fecha de nacimiento";
  } else {
    $fechaNacimiento = $_POST["inputFechaNacimiento"];
    $fechaActual = date("Y-m-d");
    if ($fechaNacimiento > $fechaActual) {
      $fechaNacimientoError = "La fecha no puede ser futura";
    }
  }

  // Si no hay errores, busco si el correo existe en mi base de datos
  if (empty($mailError) && empty($contraseñaError)) {


    $stmt = $conn->prepare("SELECT * FROM usuario WHERE EMAIL = :correo");
    $stmt->execute([':correo' => $mail]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);



    //si el usuario existe y la contra sta bien
    if ($usuario) {
      $existeUsuario = true;
      $mensaje = "Ya existe un usuario con ese correo";
    }
  }



  if (empty($nombreError) && empty($mailError) && empty($contraseñaError) && empty($fechaNacimientoError) && $existeUsuario == false) {
    try {


      $hashPassword = password_hash($contraseña, PASSWORD_DEFAULT);

      $stmt = $conn->prepare("INSERT INTO usuario (NOMBRE, EMAIL, CONTRASENA, FECHA_NACIMIENTO, ID_ROL, FOTO_PERFIL) 
                              VALUES (:nombre, :correo, :contrasena, :fechaNacimiento, 1, :fotoPerfil)");

      $stmt->bindValue(':nombre', $nombre);
      $stmt->bindValue(':correo', $mail);
      $stmt->bindValue(':contrasena', $hashPassword);
      $stmt->bindValue(':fechaNacimiento', $fechaNacimiento);
      $stmt->bindValue(':fotoPerfil', $fotoPerfil);

      $stmt->execute();
      $registroExitoso = "Registro guardado correctamente.";
      $nuevoId = $conn->lastInsertId();

      // Consultar los datos del usuario recién insertado
      $stmt = $conn->prepare("SELECT * FROM usuario WHERE ID_USUARIO = :id");
      $stmt->execute([':id' => $nuevoId]);
      $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
      //guardo sesion,con los datos del usuario
      $_SESSION['correo'] = $usuario['EMAIL'];
      $_SESSION['usuario_id'] = $usuario['ID_USUARIO'];
      $_SESSION['nombre'] = $usuario['NOMBRE'];
      $_SESSION['fecha_nacimiento'] = $usuario['FECHA_NACIMIENTO'];
      $_SESSION['foto_perfil'] = $usuario['FOTO_PERFIL'];
      //reedirijo a la pagina del admi
      if (headers_sent($file, $line)) {
        die("Error: Los headers ya fueron enviados en $file línea $line");
      }
      header("Location:../administrador/administrador.php");
      exit;

      // Limpiar campos
      $nombre = $mail = $contraseña = $fechaNacimiento = $fotoPerfil = "";
    } catch (PDOException $e) {
      $mailError = "Error al guardar: " . $e->getMessage();
    }
  }
  $nuevoId = $conn->lastInsertId();

  // Consultar los datos del usuario recién insertado
  $stmt = $conn->prepare("SELECT * FROM usuario WHERE ID_USUARIO = :id");
  $stmt->execute([':id' => $nuevoId]);
  $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
  //guardo sesion,con los datos del usuario
  $_SESSION['correo'] = $usuario['email'];
  $_SESSION['usuario_id'] = $usuario['id'];
  $_SESSION['nombre'] = $usuario['nombre'];
  $_SESSION['fecha_nacimiento'] = $usuario['fecha_nacimiento'];
  $_SESSION['foto_perfil'] = $usuario['foto_perfil'];
  //reedirijo a la pagina del admi
  header("Location: ../administrador/administrador.php");
  exit;
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <?php
  require('../includesPHP/head.php');
  ?>
  <title>Registro</title>
  <link rel="stylesheet" href="registro.css">
  <script src="registro.js" defer></script>
</head>

<body>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center">
    <div class="card m-5">
      <div class="text-center">
        <img src="Recursos/icono.png" id="icono" class="img-fluid mx-auto d-block" alt="Imagen no encontrada"><br>
      </div>
      <div class="card-body">
        <h1>Crea una cuenta nueva</h1>
        <h2>¿Ya estás registrado? <a id="cuentaExistenteLogin" href="../Login/login.php">Iniciá sesión aquí.</a></h2><br>
        <?php if ($registroExitoso): ?>
          <div class="alert alert-success"><?= $registroExitoso ?></div>
        <?php endif; ?>
        <?php if ($existeUsuario): ?>
          <div class="alert alert-danger"><?= $mensaje ?></div>
        <?php endif; ?>
        <form id="registroForm" method="POST" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="form-floating">

          <div class="mb-3">
            <label for="text" class="form-label">Nombre</label>
            <input type="text" class="form-control <?= $nombreError ? 'is-invalid' : '' ?>" value="<?= $nombre ?>" name="inputNombre" id="nombre" placeholder="Ingrese nombre completo">
            <div class="invalid-feedback" <?= $nombreError ?>>Nombre inválido</label></div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Correo electronico</label>
            <input type="email" class="form-control  <?= $mailError ? 'is-invalid' : '' ?>" value="<?= $mail ?>" name="inputMail" id="email" placeholder="example@gmail.com">
            <div class="invalid-feedback" <?= $mailError ?>>Correo electronico invalido</div>
          </div>

          <div class="mb-3">
            <label for="contrasena" class="form-label">Contraseña</label>
            <input type="password" class="form-control <?= $contraseñaError ? 'is-invalid' : '' ?>" value="<?= $contraseña ?>" name="inputContraseña" id="contrasena" placeholder="Ingrese una contraseña ">
            <div class="invalid-feedback" <?= $contraseñaError ?>>Contraseña Invalida</div>
          </div>

          <div class="mb-3">
            <label for="fecha" class="form-label">Fecha de Nacimiento</label>
            <input type="date" class="form-control <?= $fechaNacimientoError ? 'is-invalid' : '' ?>" value="<?= $fechaNacimiento ?>" name="inputFechaNacimiento" id="fecha">
            <div class="invalid-feedback" <?= $fechaNacimientoError ?>>Fecha Invalida</div>
          </div>

          <div class="mb-3">
            <label for="fotoSelect" class="form-label">Seleccionar foto de perfil</label>
            <select id="fotoSelect" name="selectFotoPerfil" class="form-select">
              <option value="../EditarUsuario/Recursos/icono.png">Predeterminada</option>
              <option value="../EditarUsuario/Recursos/Avatar1.png">Avatar 1</option>
              <option value="../EditarUsuario/Recursos/Avatar2.png">Avatar 2</option>
              <option value="../EditarUsuario/Recursos/Avatar3.png">Avatar 3</option>
              <option value="../EditarUsuario/Recursos/Avatar4.png">Avatar 4</option>
              <option value="../EditarUsuario/Recursos/Avatar5.png">Avatar 5</option>
            </select>
          </div>

          <div class="text-center mb-3">
            <img id="vistaPreviaFoto" src="../EditarUsuario/Recursos/icono.png" class="rounded-circle border" width="100" height="100" alt="Vista previa">
          </div>

          <button type="submit" id="validar" class="btn btn-light w-100">Registrarse</button><br>

          <!-- Modal-->
          <div class="modal fade" id="registroExitoso" tabindex="-1" aria-labelledby="registroExitosoLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content text-center">
                <div class="modal-header bg-success text-white">
                  <h5 class="modal-title" id="registroExitosoLabel">¡Registro exitoso!</h5>
                  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                  ¡Gracias por registrarte! Tu cuenta fue creada correctamente.
                </div>
                <div class="modal-footer">
                  <a href="../administrador/administrador.php" class="btn btn-success">Aceptar</a>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>

</html>