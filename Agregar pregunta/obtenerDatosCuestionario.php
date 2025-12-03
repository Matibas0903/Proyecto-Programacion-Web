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
        "message" => "No se recibió JSON válido.",

    ]);
    exit;
}

//Obtenemos el id version, si no existe lo pasamos por sesion
$idVersion = $input["idVersion"] ?? null;

if (!$idVersion) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió idVersion."
    ]);
    exit;
}

// 1) Traer versión
$stmt = $conn->prepare("SELECT * FROM version_cuestionario WHERE ID_VERSION = :id");
$stmt->bindValue(":id", $idVersion, PDO::PARAM_INT);
$stmt->execute();
$version = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$version) {
    echo json_encode(["error" => "No se encontró la versión"]);
    exit;
}


// 2) Traer datos del cuestionario
$stmt = $conn->prepare("SELECT * FROM cuestionario WHERE ID_CUESTIONARIO = :id");
$stmt->bindValue(":id", $version["ID_CUESTIONARIO"], PDO::PARAM_INT);
$stmt->execute();
$cuestionario = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "cuestionario" => $cuestionario,
    "version" => $version
]);
