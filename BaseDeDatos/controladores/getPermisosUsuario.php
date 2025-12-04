<?php
session_start();
header('Content-Type: application/json');
require_once(__DIR__ . '/../conexion.php');
require_once(__DIR__ . '/permisos.php');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit;
}

$idUsuario = $_SESSION['usuario_id'];

$roles = Permisos::getRoles($idUsuario);
$nombreRoles = array_column($roles, 'nombre');

$permisos = Permisos::getPermisos($idUsuario);
$nombrePermisos = array_column($permisos, 'nombre');

echo json_encode([
    'status' => 'success',
    'roles' => $nombreRoles,
    'permisos' => $nombrePermisos
]);
exit;
?>