<?php

session_start();

header("Content-Type: application/json");

// 1) Validar que exista idVersion

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió JSON válido."
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

$preguntas = $input["preguntas"] ?? null;

if (!$preguntas || !is_array($preguntas)) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibieron preguntas."
    ]);
    exit;
}

// 3) Conectar a BD
require("../BaseDeDatos/conexion.php");

// 4) Insertar preguntas y opciones
try {
    $conn->beginTransaction();

    // Preparar consultas
    $sqlPregunta = $conn->prepare("
        INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, ID_TIPO_PREGUNTA ,IMAGEN)
        VALUES (:idv, :nro, :enun, :idtp,:img)
    ");

    $sqlOpcion = $conn->prepare("
        INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA)
        VALUES (:idp, :txt, :cor)
    ");



    foreach ($preguntas as $pregunta) {

        // --- VALIDACIÓN BÁSICA ---
        if (empty($pregunta["tipo"]) || !is_numeric($pregunta["tipo"])) {
            // Saltar sin guardar
            continue;
        }

        if (empty($pregunta["enunciado"])) {
            continue;
        }

        // Si pasa las validaciones, guardar
        $sqlPregunta->execute([
            ":idv" => $idVersion,
            ":nro" => $pregunta["nro_orden"],
            ":enun" => $pregunta["enunciado"],
            ":idtp" => $pregunta["tipo"],
            ":img" => $pregunta["imagen"] ?? null,
        ]);

        $idPregunta = $conn->lastInsertId();

        foreach ($pregunta["opciones"] as $op) {
            $sqlOpcion->execute([
                ":idp" => $idPregunta,
                ":txt" => $op["texto"],
                ":cor" => $op["esCorrecta"] ?? 0
            ]);
        }
    }
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Preguntas guardadas correctamente.",

    ]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Error al guardar: " . $e->getMessage()
    ]);
}
