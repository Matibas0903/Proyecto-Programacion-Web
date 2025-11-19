<?php
require("conexion.php");
session_start();
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

// Campos opcionales
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

// Si no hay campos a actualizar
if (empty($campos)) {
    echo json_encode(["exito" => false, "mensaje" => "No se realizaron cambios."]);
    exit;
}

// Armar el UPDATE dinámico
$sql = "UPDATE usuario SET " . implode(", ", $campos) . " WHERE ID_USUARIO = :id";
$valores[':id'] = $idUsuario;

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute($valores);
    echo json_encode(["exito" => true, "mensaje" => "Perfil actualizado correctamente."]);
} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al actualizar: " . $e->getMessage()]);
}
