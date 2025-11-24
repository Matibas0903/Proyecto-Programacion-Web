<?php
session_start();
require("../BaseDeDatos/conexion.php");

$correo = $contra = "";
$correoErr = $contraError = "";
$mostrarMensaje = false;
$mensaje = "";

// Si se envía el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Validar correo ---
    if (empty($_POST["correo"])) {
        $correoErr = "";
    } else {
        $correo = trim($_POST["correo"]);
        $correo = htmlspecialchars($correo);
        if (!preg_match("/^[A-Za-z0-9._%+-]+@gmail\.com$/", $correo)) {
            $correoErr = "Ingrese un correo válido (@gmail.com).";
        }
    }

    // --- Validar contraseña ---
    if (empty($_POST["contraseña"])) {
        $contraError = "";
    } else {
        $contra = trim($_POST["contraseña"]);
        $contra = htmlspecialchars($contra);

        // Debe tener 6 a 8 caracteres alfanuméricos o guión bajo
        if (!preg_match("/^[A-Za-z0-9_]{6,12}$/", $contra)) {
            $contraError = "La contraseña debe tener entre 6 y 12 caracteres válidos.";
        }
    }

    // Si no hay errores, busco si el correo existe en mi base de datos
    if (empty($correoErr) && empty($contraError)) {
        $stmt = $conn->prepare("SELECT * FROM usuario WHERE EMAIL = :correo");
        $stmt->execute([':correo' => $correo]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        //si el usuario existe y la contra sta bien
        if ($usuario) {
            if(password_verify($contra, $usuario["CONTRASENA"])) {
                //guardo sesion,con los datos del usuario
                $_SESSION['correo'] = $usuario['EMAIL'];
                $_SESSION['usuario_id'] = $usuario['ID_USUARIO'];
                $_SESSION['nombre'] = $usuario['NOMBRE'];
                $_SESSION['foto_perfil'] = $usuario['FOTO_PERFIL'];
                $_SESSION['rol_id'] = $usuario['ID_ROL'];

                //reedirijo a la pagina del admi
                header("Location: ../administrador/administrador.php");
                exit;
            } else {
                $mensaje = "Contraseña incorrecta.";
                $mostrarMensaje = true;
            }
        } else {
            $mensaje = "Cuenta no encontrada.";
            $mostrarMensaje = true;
        }
    }
}

?>


<!DOCTYPE html>
<html lang="es">

<head>
    <title>Login</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <link rel="stylesheet" href="login.css">
    <script src="login.js" defer></script>
</head>

<body>
    <div class="container d-flex justify-content-center">
        <div class="card login col-12 col-sm-10 col-md-8 col-lg-6">

            <img src="../Login/img/img.png" alt="" class="img-fluid mx-auto d-block" width="100">

            <h1 class="text-center">Iniciar sesión</h1>
            <form action="login.php" method="POST" class="needs-validation" id="miform" novalidate>
                <!-- Campo de correo -->
                <div class="mb-3">
                    <label for="gmail" class="form-label">Correo Electrónico</label>
                    <input type="email" name="correo" id="gmail"
                        class="form-control <?= $correoErr || ($mostrarMensaje && $mensaje == "El correo no está registrado.") ? 'is-invalid' : '' ?>"
                        maxlength="30" placeholder="micorreo@gmail.com" value="<?= htmlspecialchars($correo) ?>">
                    <div class="invalid-feedback">
                        <?= $correoErr ? $correoErr : ($mostrarMensaje && $mensaje == "El correo no está registrado." ? $mensaje : "") ?>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="contraseña" class="form-label">Contraseña</label>
                    <input type="password" name="contraseña" id="contraseña"
                        class="form-control <?= $contraError || ($mostrarMensaje && $mensaje == "Contraseña incorrecta..") ? 'is-invalid' : '' ?>"
                        placeholder="••••••••••••" maxlength="12">
                    <div class="invalid-feedback">
                        <?= $contraError ? $contraError : ($mostrarMensaje && $mensaje == "Contraseña incorrecta." ? $mensaje : "") ?>
                    </div>
                </div>

                <div id="mensajeJS" class="alert alert-danger <?= empty($mensaje) ? 'd-none' : '' ?>" role="alert">
                    <?= $mensaje ?>
                </div>
                <!-- Enlaces y botones -->
                <a href="#" data-bs-toggle="modal" data-bs-target="#modalOlvide">¿Olvidaste tu contraseña?</a>
                <button type="submit" class="btn miboton mt-3" id="botonEnviar">Iniciar</button>
                <p>¿No tienes una cuenta? <a href="../Registro/registro.php">Registrarse</a></p>
            </form>

        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalOlvide" tabindex="-1" aria-labelledby="modalOlvideLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalOlvideLabel">Recuperar contraseña</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" id="btnCerrar"></button>
            </div>
            <div class="modal-body">
                <input type="email" class="form-control " id="inputCorreo" placeholder="Tu correo">
                <div class="valid-feedback d-none">Correo enviado correctamente</div>
                <div class="invalid-feedback d-none" id="mensajeError"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCancelar">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnEnviar">Enviar</button>
            </div>
            </div>
        </div>
    </div>

</body>

</html>