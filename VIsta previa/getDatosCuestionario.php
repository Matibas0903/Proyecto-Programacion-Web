<?php
header('Content-Type: application/json');
require("../BaseDeDatos/conexion.php");

if (!isset($_GET['version'])) {
    echo json_encode(["error" => "Falta el parámetro version"]);
    exit;
}

$id_version = intval($_GET['version']);

// preguntas
$sqlPreg = "
    SELECT ID_PREGUNTA, ENUNCIADO, IMAGEN, NRO_ORDEN
    FROM pregunta
    WHERE ID_VERSION = :id_version
    ORDER BY NRO_ORDEN ASC
";

$stmtPreg = $conn->prepare($sqlPreg);
$stmtPreg->execute([":id_version" => $id_version]);

$preguntas_raw = $stmtPreg->fetchAll(PDO::FETCH_ASSOC);

$preguntas = [];

foreach ($preguntas_raw as $p) {
    $id_pregunta = $p['ID_PREGUNTA'];

    // 2. Traer opciones de la pregunta
    $sqlOpc = "
        SELECT ID_OPCION, TEXTO, IMAGEN, ES_CORRECTA
        FROM opcion
        WHERE ID_PREGUNTA = :id_pregunta
    ";

    $stmtOpc = $conn->prepare($sqlOpc);
    $stmtOpc->execute([":id_pregunta" => $id_pregunta]);

    $opciones = $stmtOpc->fetchAll(PDO::FETCH_ASSOC);

    // agregar opciones al objeto pregunta
    $p["opciones"] = $opciones;

    $preguntas[] = $p;
}

// JSON final
echo json_encode([
    "preguntas" => $preguntas
]);
?>
