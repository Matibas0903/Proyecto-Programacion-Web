<?php
//este archivo los escribio chatgpt se supone que recibe el idversion,vpero falta la logica de escribir la informacion del cuestionario, podria modificar la forma en la que se envian esos datos y hacerlo con ajax, significa tener un archi para la info del cuestionario y otro para el guardado de preguntas, mañana sigo, el id version ya se esta psando el problema no era la session, aun asi hay que leer el codigo de gpt y verificarlo

session_start();
header("Content-Type: application/json");

// 1) Validar que exista idVersion

$data = json_decode(file_get_contents("php://input"), true);

$idVersion = $data["idVersion"] ?? ($_SESSION["idVersion"] ?? null);

if (!$idVersion) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió idVersion."
    ]);
    exit;
}

$idVersion = $_SESSION["idVersion"];

// 2) Leer el JSON enviado por fetch
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data["preguntas"])) {
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
    $conexion->beginTransaction();

    foreach ($data["preguntas"] as $pregunta) {

        $nro = $pregunta["nro_orden"];
        $enunciado = $pregunta["enunciado"];
        $imagen = $pregunta["imagen"]; // puede ser null

        // 4A) Insertar pregunta
        $sql = "INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, IMAGEN)
                VALUES (:idv, :nro, :enun, :img)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ":idv" => $idVersion,
            ":nro" => $nro,
            ":enun" => $enunciado,
            ":img" => $imagen
        ]);

        $idPregunta = $conexion->lastInsertId();

        // 4B) Insertar opciones
        foreach ($pregunta["opciones"] as $op) {
            $texto = $op["texto"];
            $correcta = $op["esCorrecta"]; // 1 o 0

            $sql2 = "INSERT INTO opcion (ID_PREGUNTA, TEXTO, CORRECTA)
                     VALUES (:idp, :txt, :cor)";
            $stmt2 = $conexion->prepare($sql2);
            $stmt2->execute([
                ":idp" => $idPregunta,
                ":txt" => $texto,
                ":cor" => $correcta,
            ]);
        }
    }

    $conexion->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Preguntas guardadas correctamente."
    ]);
} catch (Exception $e) {
    $conexion->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Error al guardar: " . $e->getMessage()
    ]);
}
