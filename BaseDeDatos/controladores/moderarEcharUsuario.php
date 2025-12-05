<?php
require("../conexion.php");
session_start();
require_once(__DIR__ . '/./permisos.php');
$idUsuario = $_SESSION["usuario_id"];
// Verificar que tenga permisos para banear
$puedeEchar = Permisos::tieneAlgunPermiso([
    'echar_usuario'
], $idUsuario);

if (!$puedeEchar) {
    echo json_encode([
        "status" => "error",
        "message" => "No tenés permisos para eliminar usuarios"
    ]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
    UPDATE participacion SET ECHADO=1 
    WHERE ID_USUARIO=:u AND ID_VERSION=:v
");
$stmt->execute([
    ":u"=>$data["idUsuario"],
    ":v"=>$data["idVersion"]
]);

echo json_encode(["status"=>"success","message"=>"Usuario expulsado del cuestionario"]);