<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");
require("../BaseDeDatos/conexion.php");
require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');

if (!isset($_SESSION["usuario_id"])) {
    echo json_encode([
        "status" => "error",
        "message" => "No estás logueado"
    ]);
    exit;
}

$idUsuario = $_SESSION["usuario_id"];

// Verificar que tenga permisos para reportar
$puedeReportar = Permisos::tieneAlgunPermiso([
    'reportar_cuestionario'
], $idUsuario);

if (!$puedeReportar) {
    echo json_encode([
        "status" => "error",
        "message" => "No tenés permisos para reportar cuestionarios"
    ]);
    exit;
}

// Leemos los datos que recibimos de js
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió JSON válido"
    ]);
    exit;
}

if (!isset($input["ID_CUESTIONARIO"]) || !isset($input["MOTIVOS"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Datos inválidos. Se requiere ID_CUESTIONARIO y MOTIVOS"
    ]);
    exit;
}

$idCuestionario = $input["ID_CUESTIONARIO"];
$motivos = $input["MOTIVOS"];

// Validar que motivos sea un array
if (!is_array($motivos) || empty($motivos)) {
    echo json_encode([
        "status" => "error",
        "message" => "Debe seleccionar al menos un motivo"
    ]);
    exit;
}

// Convertir array de motivos a string
$motivoTexto = implode(", ", $motivos);

try {
    // Verificar que el cuestionario exista
    $checkCuestionario = $conn->prepare("SELECT ID_CUESTIONARIO FROM cuestionario WHERE ID_CUESTIONARIO = :id");
    $checkCuestionario->execute([":id" => $idCuestionario]);
    
    if (!$checkCuestionario->fetch()) {
        echo json_encode([
            "status" => "error",
            "message" => "El cuestionario no existe"
        ]);
        exit;
    }

    // Verificar si el usuario ya reportó este cuestionario
    $checkReporte = $conn->prepare("
        SELECT COUNT(*) as total 
        FROM reportes 
        WHERE id_cuestionario = :idCuest AND id_usuario = :idUser
    ");
    $checkReporte->execute([
        ":idCuest" => $idCuestionario,
        ":idUser" => $idUsuario
    ]);
    $yaReporto = $checkReporte->fetch(PDO::FETCH_ASSOC)["total"];

    if ($yaReporto > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Ya has reportado este cuestionario anteriormente"
        ]);
        exit;
    }

    // Insertar reporte en la BD
    $insert = $conn->prepare("
        INSERT INTO reportes (id_cuestionario, id_usuario, motivo, fecha_reporte)
        VALUES (:idCuestionario, :idUsuario, :motivos, NOW())
    ");

    $insert->execute([
        ":idCuestionario" => $idCuestionario,
        ":idUsuario" => $idUsuario,
        ":motivos" => $motivoTexto
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Reporte enviado correctamente"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al procesar el reporte",
        "error" => $e->getMessage()
    ]);
}
?>