<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió JSON válido."
    ]);
    exit;
}

$usuario = $_SESSION["usuario_id"] ?? null;

try {

    // 1) Traer cuestionarios del usuario
    $stmt = $conn->prepare("
        SELECT * FROM cuestionario 
        WHERE ID_MODERADOR = :id OR ID_USUARIO = :id
    ");
    $stmt->bindValue(":id", $usuario, PDO::PARAM_INT);
    $stmt->execute();
    $cuestionarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cantCuestionarios = count($cuestionarios);

    // Si no tiene, devolver vacio
    if ($cantCuestionarios === 0) {
        echo json_encode([
            "status" => "ok",
            "message" => "El usuario no tiene cuestionarios"

        ]);
        exit;
    }

    // Por cada cuestionario, traer sus versiones
    foreach ($cuestionarios as &$c) {

        $stmt = $conn->prepare("
            SELECT * FROM version_cuestionario 
            WHERE ID_CUESTIONARIO = :id
        ");
        $stmt->bindValue(":id", $c["ID_CUESTIONARIO"], PDO::PARAM_INT);
        $stmt->execute();

        // Guardamos las versiones dentro del mismo array
        $c["versiones"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        "status" => "Ok",
        "message" => "Datos cargados correctamente",
        "cuestionarios" => $cuestionarios,
        "cantCuestionarios" => $cantCuestionarios
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "Error",
        "message" => "Error en la búsqueda",
        "exception" => $e->getMessage()
    ]);
}
