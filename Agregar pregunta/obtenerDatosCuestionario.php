<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
//EPA ESTE ES NUEVO, NO?, SI!
require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");

if (!$idVersion) {
    echo json_encode(["error" => "No se encontró idVersion en sesión"]);
    exit;
}

// 1) Traer versión
$stmt = $conn->prepare("SELECT * FROM version_cuestionario WHERE ID_VERSION = :id");
$stmt->bindValue(":id", $idVersion, PDO::PARAM_INT);
$stmt->execute();
$version = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$version) {
    echo json_encode(["error" => "No se encontró la versión"]);
    exit;
}

// 2) Traer datos del cuestionario
$stmt = $conn->prepare("SELECT * FROM cuestionario WHERE ID_CUESTIONARIO = :id");
$stmt->bindValue(":id", $version["ID_CUESTIONARIO"], PDO::PARAM_INT);
$stmt->execute();
$cuestionario = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "cuestionario" => $cuestionario,
    "version" => $version
]);
