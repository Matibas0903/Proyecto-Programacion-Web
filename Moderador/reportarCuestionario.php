<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");
require("../BaseDeDatos/conexion.php");

if (!isset($_SESSION["usuario_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "No estás logueado"
    ]);
    exit;
}

$idUsuario = $_SESSION["usuario_id"];

//Verificamos que sea moderador
$sql = $conn->prepare("SELECT rol FROM usuario WHERE id_usuario = ?");
$sql->execute([$idUsuario]);
$rol = $sql->fetchColumn();

if ($rol !== "moderador") {
    echo json_encode(["success" => false, "message" => "No tenés permisos de moderador"]);
    exit;
}

//Leemos los datos que recibimos de js
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["idCuestionario"]) || !isset($input["motivos"])) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);
    exit;
}

$idCuest = $input["idCuestionario"];
$motivos = $input["motivos"];

//Convertimos array de motivos a string
$motivoTexto = implode(", ", $motivos);

try {
    // 4. Insertar reporte en la BD
    $insert = $conn->prepare("
        INSERT INTO reportes (id_cuestionario, id_usuario, motivo)
        VALUES (:idCuestionario, :usuario_id, :motivos)
    ");

    $insert->execute([$idCuest, $idUsuario, $motivoTexto]);

    echo json_encode([
        "success" => true,
        "message" => "Reporte enviado correctamente"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
