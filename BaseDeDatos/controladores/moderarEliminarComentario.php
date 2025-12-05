<?php
require("../conexion.php");
session_start();
require_once(__DIR__ . '/./permisos.php');
$idUsuario = $_SESSION["usuario_id"];
// Verificar que tenga permisos para banear
$puedeEliminarCom = Permisos::tieneAlgunPermiso([
    'eliminar_comentario'
], $idUsuario);

if (!$puedeEliminarCom) {
    echo json_encode([
        "status" => "error",
        "message" => "No tenés permisos para eliminar comentarios"
    ]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

$id = $data["idParticipacion"];

$stmt = $conn->prepare("UPDATE participacion SET COMENTARIO=NULL WHERE ID_PARTICIPACION=:id");
$stmt->execute([":id"=>$id]);

echo json_encode(["status"=>"success", "message"=>"Comentario eliminado"]);