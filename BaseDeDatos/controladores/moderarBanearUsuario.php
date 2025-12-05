<?php
require("../conexion.php");
session_start();
require_once(__DIR__ . '/./permisos.php');
$idUsuario = $_SESSION["usuario_id"];
// Verificar que tenga permisos para banear
$puedeBanear = Permisos::tieneAlgunPermiso([
    'banear_usuario'
], $idUsuario);

if (!$puedeBanear) {
    echo json_encode([
        "status" => "error",
        "message" => "No tenés permisos para banear usuarios"
    ]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("UPDATE usuario SET BANEADO=1 WHERE ID_USUARIO=:id");
$stmt->execute([":id"=>$data["idUsuario"]]);

echo json_encode(["status"=>"success","message"=>"Usuario baneado permanentemente"]);