<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");

// Decodificar el input JSON
$input = json_decode(file_get_contents("php://input"), true);
$flujo = [];
$flujo["decodificacion"] = "se decodifico el json correctamente";

if (!$input) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió JSON válido.",
        "flujo" => $flujo,
    ]);
    exit;
}

// Extraer datos del input
$idVersion = $input["idVersion"] ?? null;
$preguntasActuales = $input["preguntas"] ?? []; // Array de preguntas actuales
$datosCuestionario = $input["cuestionario"] ?? []; // Datos del cuestionario

// Obtener el ID del usuario actual de la sesion
$idUsuarioActual = $_SESSION["usuario_id"] ?? null;

/*
// Debug completo
$flujo = []; // Inicializamos el flujo de debug
$flujo["debug_idVersion"] = $idVersion;
$flujo["debug_numPreguntas"] = count($preguntasActuales);
$flujo["debug_preguntasActuales"] = $preguntasActuales; 
$flujo["debug_datosCuestionario"] = $datosCuestionario;

// Adicional: verificar que cada pregunta tenga opciones y enunciado
foreach ($preguntasActuales as $index => $preg) {
    $flujo["pregunta_$index"] = [
        "nro_orden" => $preg["nro_orden"] ?? 'no definido',
        "enunciado" => $preg["enunciado"] ?? 'no definido',
        "imagen" => $preg["imagen"] ?? null,
        "num_opciones" => isset($preg["opciones"]) ? count($preg["opciones"]) : 0,
        "opciones" => $preg["opciones"] ?? 'no definido'
    ];
}

// Devolver JSON de debug
echo json_encode([
    "status" => "debug",
    "message" => "Datos recibidos desde el frontend",
    "flujo" => $flujo
], JSON_PRETTY_PRINT);
exit;
*/
if (!$idVersion || !$idUsuarioActual) {
    $flujo["validacion"] = "Faltan parametros idVersion o usuario no valido";
    echo json_encode([
        "status" => "error",
        "message" => "Faltan parámetros: idVersion o usuario no válido.",
        "flujo" => $flujo,
    ]);
    exit;
}

// Paso 1: Verificar si la version existe y es una plantilla (reutilizar lógica de obtenerPlantillas.php)
$stmtVersion = $conn->prepare("SELECT * FROM version_cuestionario WHERE ID_VERSION = :id");
$stmtVersion->bindValue(":id", $idVersion, PDO::PARAM_INT);
$stmtVersion->execute();
$version = $stmtVersion->fetch(PDO::FETCH_ASSOC);

if (!$version) {
    $flujo["validacion"] = "No se encontro la version con id $idVersion";
    echo json_encode([
        "status" => "error",
        "message" => "No se encontró la versión con ID $idVersion.",
        "flujo" => $flujo,
    ]);
    exit;
}

if ($version['PLANTILLA'] != 1) {
    $flujo["validacion"] = "La version con id $idVersion no es una plantilla";
    echo json_encode([
        "status" => "error",
        "message" => "La versión no es una plantilla válida.",
        "flujo" => $flujo,
    ]);
    exit;
}

// Paso 2: Obtener el cuestionario y verificar el autor
$stmtCuestionario = $conn->prepare("SELECT * FROM cuestionario WHERE ID_CUESTIONARIO = :id");
$stmtCuestionario->bindValue(":id", $version["ID_CUESTIONARIO"], PDO::PARAM_INT);
$stmtCuestionario->execute();
$cuestionario = $stmtCuestionario->fetch(PDO::FETCH_ASSOC);

if (!$cuestionario) {
    $flujo["validacion"] = "No se encontro el cuestionario con id " . $version["ID_CUESTIONARIO"];
    echo json_encode([
        "status" => "error",
        "message" => "No se encontró el cuestionario asociado.",
        "flujo" => $flujo,
    ]);
    exit;
}

$autorCuestionario = $cuestionario['ID_USUARIO'];

// Paso 3: Comparar autor
if ($autorCuestionario != $idUsuarioActual) {
    // Autor no coincide, crear un nuevo cuestionario desde cero

    try {
        $conn->beginTransaction();

        // Insertar nuevo cuestionario
        $stmtInsertCuestionario = $conn->prepare("INSERT INTO cuestionario (NOMBRE_CUESTIONARIO, VISIBILIDAD, ID_CATEGORIA, ID_USUARIO) VALUES (:nombre, :visibilidad, :id_categoria, :id_usuario)");
        $stmtInsertCuestionario->execute([
            ':visibilidad' => $datosCuestionario['Visibilidad'],
            ':nombre' => $datosCuestionario["nombreCuestionario"],
            ':id_categoria' => $datosCuestionario["selectCategoria"],
            ':id_usuario' => $idUsuarioActual,
        ]);
        $idNuevoCuestionario = $conn->lastInsertId();

        // Insertar nueva version
        $stmtInsertVersion = $conn->prepare("INSERT INTO version_cuestionario (DESCRIPCION, COD_ACCESO, ACTIVO, ID_CUESTIONARIO, PLANTILLA) VALUES (:descripcion, :codAcceso, :activo, :id_cuestionario, :plantilla)");
        $stmtInsertVersion->execute([
            ':activo' => $datosCuestionario["estado"],
            ':descripcion' => $datosCuestionario["txtDescripcion"],
            ':codAcceso' => $datosCuestionario["codigoAcceso"],
            ':id_cuestionario' => $idNuevoCuestionario,
            ':plantilla' => $datosCuestionario["plantilla"],
        ]);
        $idNuevaVersion = $conn->lastInsertId();
        $flujo["insercionCuestionario"] = "Se inserto el nuevo cuestionario con id $idNuevoCuestionario y la nueva version con id $idNuevaVersion";

        // Preparar consultas para preguntas y opciones
        $stmtInsertPregunta = $conn->prepare("INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, IMAGEN) VALUES (:idv, :nro, :enun, :img)");
        $stmtInsertOpcion = $conn->prepare("INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA) VALUES (:idp, :txt, :cor)");

        foreach ($preguntasActuales as $pregunta) {
            $stmtInsertPregunta->execute([
                ":idv" => $idNuevaVersion,
                ":nro" => $pregunta["nro_orden"],
                ":enun" => $pregunta["enunciado"],
                ":img" => $pregunta["imagen"] ?? null,
            ]);
            $idPregunta = $conn->lastInsertId();

            // Insertar opciones (asumiendo que cada opción tiene 'texto' y 'esCorrecta')
            foreach ($pregunta["opciones"] as $opcion) {
                $stmtInsertOpcion->execute([
                    ":idp" => $idPregunta,
                    ":txt" => $opcion["texto"],
                    ":cor" => $opcion["esCorrecta"] ?? 0, // Default a 0 si no está definido
                ]);
            }
        }

        $conn->commit();
        $flujo["exito"] = "Se guardaron las preguntas correctamente";
        echo json_encode([
            "status" => "success",
            "message" => "Nuevo cuestionario creado exitosamente.",
            "idNuevaVersion" => $idNuevaVersion,
            "flujo" => $flujo,
        ]);
    } catch (Exception $e) {
        $conn->rollBack();
        $flujo["error"] = "Error al guardar el nuevo cuestionario: " . $e->getMessage();
        echo json_encode([
            "status" => "error",
            "message" => "Error al guardar: " . $e->getMessage(),
            "flujo" => $flujo,
        ]);
    }
} else {
    //Autor coincide, proceder a comparar y actualizar
    try {
        $conn->beginTransaction();

        // Obtener preguntas existentes de la BD
        $stmtPreg = $conn->prepare("SELECT * FROM pregunta WHERE ID_VERSION = :id");
        $stmtPreg->execute([":id" => $idVersion]);
        $preguntasBD = $stmtPreg->fetchAll(PDO::FETCH_ASSOC);
        $idsBD = array_column($preguntasBD, 'ID_PREGUNTA');

        // Preparar consultas
        $stmtDeleteOpciones = $conn->prepare("DELETE FROM opcion WHERE ID_PREGUNTA = :id");
        $stmtDeletePregunta = $conn->prepare("DELETE FROM pregunta WHERE ID_PREGUNTA = :id");
        $stmtInsertPregunta = $conn->prepare("INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, IMAGEN) VALUES (:idv, :nro, :enun, :img)");
        $stmtInsertOpcion = $conn->prepare("INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA) VALUES (:idp, :txt, :cor)");

        // Borrar preguntas que ya no estan
        $idsActuales = array_map(fn($p) => $p['ID_PREGUNTA'] ?? 0, $preguntasActuales);
        $idsAEliminar = array_diff($idsBD, $idsActuales);

        foreach ($idsAEliminar as $idEliminar) {
            $stmtDeleteOpciones->execute([":id" => $idEliminar]);
            $stmtDeletePregunta->execute([":id" => $idEliminar]);
        }

        // Insertar o reemplazar todas las preguntas actuales
        foreach ($preguntasActuales as $pregActual) {

            // Si la pregunta ya existia, borrarla antes de insertar
            if (!empty($pregActual['ID_PREGUNTA'])) {
                $stmtDeleteOpciones->execute([":id" => $pregActual['ID_PREGUNTA']]);
                $stmtDeletePregunta->execute([":id" => $pregActual['ID_PREGUNTA']]);
            }

            // Insertar pregunta nueva
            $stmtInsertPregunta->execute([
                ":idv" => $idVersion,
                ":nro" => $pregActual["nro_orden"],
                ":enun" => $pregActual["enunciado"],
                ":img" => $pregActual["imagen"] ?? null,
            ]);
            $idNuevaPregunta = $conn->lastInsertId();

            // Insertar opciones
            if (!empty($pregActual['opciones']) && is_array($pregActual['opciones'])) {
                foreach ($pregActual['opciones'] as $opcion) {
                    if (!isset($opcion['texto'])) continue;
                    $stmtInsertOpcion->execute([
                        ":idp" => $idNuevaPregunta,
                        ":txt" => $opcion["texto"],
                        ":cor" => isset($opcion["esCorrecta"]) ? (int)$opcion["esCorrecta"] : 0,
                    ]);
                }
            }
        }

        $conn->commit();
        echo json_encode([
            "status" => "success",
            "message" => "Plantilla actualizada exitosamente."
        ]);
    } catch (Exception $e) {
        $conn->rollBack();
        $flujo["error"] = "Error al actualizar la plantilla: " . $e->getMessage();
        echo json_encode([
            "status" => "error",
            "message" => "Error al actualizar: " . $e->getMessage(),
            "flujo" => $flujo,
        ]);
    }
}