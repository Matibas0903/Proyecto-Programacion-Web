<?php
session_start();
require('../BaseDeDatos/conexion.php');
header('Content-Type: application/json; charset=utf-8');

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["exito" => false, "mensaje" => "Sesión no iniciada"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["exito" => false, "mensaje" => "No se recibieron datos válidos"]);
    exit;
}

$idUsuario = $_SESSION['usuario_id'];
$campos = [];
$valores = [];
$errores = [];

//validaciones de los inputs
if (!empty($input['nombre'])) {
    if (!preg_match("/^[a-zA-Z0-9\s]+$/", $input['nombre'])) {
        $errores[] = "El nombre solo puede contener letras y números.";
    }
}

//verifico si el mail est bien y si ya existe alguna cuenta con es mail
if (!empty($input['mail'])) {

    // Validar formato
    if (!filter_var($input['mail'], FILTER_VALIDATE_EMAIL)) {
        $errores[] = "El email no tiene un formato válido.";
    } else {

        $sql= "SELECT ID_USUARIO FROM usuario WHERE EMAIL = :email AND ID_USUARIO != :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':email' => $input['mail'],
            ':id'    => $idUsuario
        ]);

        $dato = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Si devuelve algo, significa que ya existe otro usuario con ese email
        if ($dato) {
            $errores[] = "El email ya está registrado por otro usuario.";
        }

    }
}

if (!empty($input['fecha'])) {
    $fechaIngresada = strtotime($input['fecha']);
    $hoy = strtotime(date("Y-m-d"));

    if (!$fechaIngresada) {
        $errores[] = "La fecha ingresada no es válida.";
    } else {
        // Valido que la fecha sea menor a hoy
        if ($fechaIngresada >= $hoy) {
            $errores[] = "La fecha debe ser anterior a la fecha actual.";
        }
    }
}


// Validar contraseña
if (!empty($input['contrasena'])) {
    if (strlen($input['contrasena']) < 8) {
        $errores[] = "La contraseña debe tener al menos 8 caracteres.";
    }
}

// Si hubo errores
if (!empty($errores)) {
    echo json_encode([
        "exito" => false,
        "mensaje" => implode("<br>", $errores)
    ]);
    exit;
}


//valido si no estan vacios y los guado para haceel update
if (!empty($input['nombre'])) {
    $campos[] = "NOMBRE = :nombre";
    $valores[':nombre'] = $input['nombre'];
}
if (!empty($input['mail'])) {
    $campos[] = "EMAIL = :email";
    $valores[':email'] = $input['mail'];
}
if (!empty($input['fechaNacimiento'])) {
    $campos[] = "FECHA_NACIMIENTO = :fecha";
    $valores[':fecha'] = $input['fechaNacimiento'];
}
if (!empty($input['fotoPerfil'])) {
    $campos[] = "FOTO_PERFIL = :foto";
    $valores[':foto'] = $input['fotoPerfil'];
}
if (!empty($input['contrasena'])) {
    $hash = password_hash($input['contrasena'], PASSWORD_BCRYPT);
    $campos[] = "CONTRASENA = :contrasena";
    $valores[':contrasena'] = $hash;
}

// Si no hay cambios
if (empty($campos)) {
    echo json_encode(["exito" => false, "mensaje" => "No se realizaron cambios."]);
    exit;
}


try {
     
    //cargo los datos a la base de datos
    $sql = "UPDATE usuario SET " . implode(", ", $campos) . " WHERE ID_USUARIO = :id";
    $valores[':id'] = $idUsuario;
    $stmt = $conn->prepare($sql);
    $stmt->execute($valores);

    // Actualizar variables de sesión
    if (!empty($input['nombre'])) {
        $_SESSION['nombre'] = $input['nombre'];
    }
    if (!empty($input['mail'])) {
        $_SESSION['email'] = $input['mail'];
    }
    if (!empty($input['fotoPerfil'])) {
        $_SESSION['foto_perfil'] = $input['fotoPerfil'];
    }

    echo json_encode(["exito" => true, "mensaje" => "Perfil actualizado correctamente."]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al actualizar: " . $e->getMessage()]);
}
?>