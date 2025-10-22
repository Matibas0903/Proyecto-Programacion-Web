<?php
  require('../Base de datos/conexion.php');

  
  $nombre = $mail = $contraseña = $fechaNacimiento = "";
  $nombreError = $mailError = $contraseñaError = $fechaNacimientoError = "";

  if($_SERVER ["REQUEST_METHOD"] == "POST"){   
    if(empty($_POST["inputNombre"]))  //si el input  nombre esta vacio
    {
        $nombreError= "Ingresar Nombre";
    }
    else {
        $nombre= trim($_POST["inputNombre"]);      // quita los esapcios
        $nombre = htmlspecialchars($nombre);    // Convierte caracteres especiales a HTML

        //validaos que solo tenga letras y espacio
        if(!preg_match("/^[a-zA-Z ]+$/" , $nombre))
        {
            $nombreError = "solo se permiten letras y esapcios";
        }
    }

    //valido  mail ingresado
    if(empty($_POST["inputMail"]))
    {
        $mailError = "Ingrese mail";
        
    }
    else
    {
        $mail = trim($_POST["inputMail"]);
        $mail = htmlspecialchars($mail);

        if(!filter_var($mail , FILTER_VALIDATE_EMAIL))
        {
            $mailError ="Solo se permiten mails del tipo : usuario@gmail.com";
        }
    }

    //validar contraseña
    if(empty($_POST["inputContraseña"])){
      $contraseñaError = "Ingrese contraseña";
    }else{
      $contraseña = trim($_POST["inputContraseña"]);
      $contraseña = htmlspecialchars($contraseña);

      if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/", $contraseña)) {
        $contraseñaError = "Ingrese una contraseña correcta";
      }
    }

    // Validar fecha de nacimiento
    if (empty($_POST["inputFechaNacimiento"])) {
        $fechaNacimientoError = "Ingrese su fecha de nacimiento";
    } else {
        $fechaNacimiento = $_POST["inputFechaNacimiento"];
        $fechaActual = date("Y-m-d");
        if ($fechaNacimiento > $fechaActual) {
            $fechaNacimientoError = "La fecha no puede ser futura";
        }
    }

    // Validar datos básicos (opcional pero recomendable)
    if (empty($nombreError) && empty($mailError) && empty($contraseñaError) && empty($fechaNacimientoError)) {
        try {
            $hashPassword = password_hash($contraseña, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO usuario (nombre, email, contraseña, fecha_nacimiento) 
                                    VALUES (:nombre, :correo, :contraseña, :fechaNacimiento)");

            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':correo', $mail);
            $stmt->bindParam(':contraseña', $hashPassword);
            $stmt->bindParam(':fechaNacimiento', $fechaNacimiento);

            $stmt->execute();
            echo "Registro guardado correctamente.";
        } catch (PDOException $e) {
            echo "Error al guardar el registro: " . $e->getMessage();
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
  <title>Registro</title>
  <link rel="stylesheet" href="registro.css">
  <script src="registro.js" defer></script>
</head>
<body>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center">
  <div class="card m-5">
  <div class="text-center" >
      <img src="Recursos/icono.png" id="icono" class="img-fluid mx-auto d-block" alt="Imagen no encontrada"><br>
  </div>
      <div class="card-body">
      <h1>Crea una cuenta nueva</h1>
      <h2>¿Ya estás registrado? <a href="../Login/login.html">Iniciá sesión aquí.</a></h2><br>

      <form id="registroForm" method="post" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>" class="form-floating">

        <div class="mb-3">
        <label for="text" class="form-label">Nombre</label>
        <input type="text" class="form-control" name="inputNombre" id="nombre" placeholder="Ingrese nombre completo">
        <div class="invalid-feedback">Nombre inválido</label></div>
        </div>

        <div class="mb-3">
        <label for="email" class="form-label">Correo electronico</label>
        <input type="email" class="form-control" name="inputMail" id="email" placeholder="example@gmail.com">
        <div class="invalid-feedback">Correo electronico invalido</div>
        </div>

        <div class="mb-3">
        <label for="contrasena" class="form-label">Contraseña</label>
        <input type="password" class="form-control" name="inputContraseña" id="contrasena" placeholder="Ingrese una contraseña ">
        <div class="invalid-feedback">Contraseña Invalida</div>
        </div>

        <div class="mb-3">
        <label for="fecha" class="form-label">Fecha de Nacimiento</label>
        <input type="date" class="form-control" name="inputFechaNacimiento" id="fecha">
        <div class="invalid-feedback">Fecha Invalida</div>
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
        <a href="../administrador/administrador.html" class="btn btn-success">Aceptar</a>
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
