<?php
require("../conexion.php");
session_start();
require_once(__DIR__ . '/./permisos.php');
$idUsuario = $_SESSION["usuario_id"];
// Verificar que tenga permisos para banear
$puedeSilenciarr = Permisos::tieneAlgunPermiso([
    'silenciar_usuario'
], $idUsuario);

if (!$puedeSilenciarr) {
    echo json_encode([
        "status" => "error",
        "message" => "No tenés permisos para silenciar usuarios"
    ]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

$id = $data["idUsuario"];

$stmt = $conn->prepare("UPDATE usuario SET SILENCIADO=1 WHERE ID_USUARIO=:id");
$stmt->execute([":id"=>$id]);

echo json_encode(["status"=>"success","message"=>"Usuario silenciado"]);