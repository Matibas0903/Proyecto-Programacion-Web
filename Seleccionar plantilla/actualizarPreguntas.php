<?php
//traer todo
//preguntar si ya esta en la base de datos o es nueva
//si esta en la base de datos usar update
//sino usar update

// actualizarPreguntas.php
// Este archivo maneja la lógica de actualización de plantillas de cuestionarios.
// Se basa en los archivos existentes para reutilizar lógica donde sea posible.

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");

// Decodificar el input JSON
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode([
        "status" => "error",
        "message" => "No se recibió JSON válido."
    ]);
    exit;
}

// Extraer datos del input
$idVersion = $input["idVersion"] ?? null;
$preguntasActuales = $input["preguntas"] ?? []; // Array de preguntas actuales (con opciones, enunciado, etc.)
$datosCuestionario = $input["cuestionario"] ?? []; // Datos del cuestionario (titulo, descripcion, etc.) si se necesitan actualizar

// Obtener el ID del usuario actual de la sesión
$idUsuarioActual = $_SESSION["usuario_id"] ?? null;

if (!$idVersion || !$idUsuarioActual) {
    echo json_encode([
        "status" => "error",
        "message" => "Faltan parámetros: idVersion o usuario no válido."
    ]);
    exit;
}

// Paso 1: Verificar si la versión existe y es una plantilla (reutilizar lógica de obtenerPlantillas.php)
$stmtVersion = $conn->prepare("SELECT * FROM version_cuestionario WHERE ID_VERSION = :id");
$stmtVersion->bindValue(":id", $idVersion, PDO::PARAM_INT);
$stmtVersion->execute();
$version = $stmtVersion->fetch(PDO::FETCH_ASSOC);

if (!$version) {
    echo json_encode([
        "status" => "error",
        "message" => "No se encontró la versión con ID $idVersion."
    ]);
    exit;
}

if ($version['PLANTILLA'] != 1) {
    echo json_encode([
        "status" => "error",
        "message" => "La versión no es una plantilla válida."
    ]);
    exit;
}

// Paso 2: Obtener el cuestionario y verificar el autor (reutilizar lógica de obtenerPlantillas.php)
$stmtCuestionario = $conn->prepare("SELECT * FROM cuestionario WHERE ID_CUESTIONARIO = :id");
$stmtCuestionario->bindValue(":id", $version["ID_CUESTIONARIO"], PDO::PARAM_INT);
$stmtCuestionario->execute();
$cuestionario = $stmtCuestionario->fetch(PDO::FETCH_ASSOC);

if (!$cuestionario) {
    echo json_encode([
        "status" => "error",
        "message" => "No se encontró el cuestionario asociado."
    ]);
    exit;
}

$autorCuestionario = $cuestionario['ID_USUARIO']; // Asumiendo que hay una columna ID_USUARIO en cuestionario

// Paso 3: Comparar autor
if ($autorCuestionario != $idUsuarioActual) {
    // Caso B: Autor no coincide, crear un nuevo cuestionario desde cero
    // Reutilizar lógica de InsertDatosCuestionario.php y InsertPreguntas.php
    // Aquí puedes llamar a funciones o incluir los archivos si es posible, pero para simplicidad, replicar la lógica básica

    // Primero, insertar nuevo cuestionario (adaptar de InsertDatosCuestionario.php)
    // Asumir que $datosCuestionario contiene los datos necesarios
    $stmtInsertCuestionario = $conn->prepare("INSERT INTO cuestionario (NOMBRE_CUESTIONARIO, VISIBILIDAD, ID_CATEGORIA, ID_USUARIO) VALUES (:nombre, :visibilidad, :id_categoria, :id_usuario)");
    $stmtInsertCuestionario->bindValue(':visibilidad', $visibilidad);
    $stmtInsertCuestionario->bindValue(':nombre', $nombre);
    $stmtInsertCuestionario->bindValue(':id_categoria', $idCategoria, PDO::PARAM_INT);
    $stmtInsertCuestionario->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
    $stmtInsertCuestionario->execute();
    $idNuevoCuestionario = $conn->lastInsertId();

    // Insertar nueva versión
    $stmtInsertVersion = $conn->prepare("INSERT INTO version_cuestionario (DESCRIPCION, COD_ACCESO, ACTIVO, ID_CUESTIONARIO, FECHA_CREACION, NUM_VERSION, PLANTILLA) VALUES (:descripcion, :codAcceso, :activo, :id_cuestionario, :fecha_creacion, :num_version, :plantilla)");
    $stmtInsertVersion->bindValue(':activo', $activo);
    $stmtInsertVersion->bindValue(':descripcion', $descripcion);
    $stmtInsertVersion->bindValue(':codAcceso', $cod_acceso);
    $stmtInsertVersion->bindValue(':id_cuestionario', $idCustionario);
    $stmtInsertVersion->bindValue(':fecha_creacion', $fecha_creacion);
    $stmtInsertVersion->bindValue(':num_version', $numVersion);
    $stmtInsertVersion->bindValue(':plantilla', $plantilla);
    $stmtInsertVersion->execute();
    // Guardo el Id de la version creada
    $idNuevaVersion = $conn->lastInsertId();

    try {
        $conn->beginTransaction();

        // Preparar consultas
        $sqlPregunta = $conn->prepare("
        INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, IMAGEN)
        VALUES (:idv, :nro, :enun, :img)
    ");

        $sqlOpcion = $conn->prepare("
        INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA)
        VALUES (:idp, :txt, :cor)
    ");

        foreach ($preguntas as $pregunta) {

            $sqlPregunta->execute([
                ":idv" => $idNuevaVersion,
                ":nro" => $pregunta["nro_orden"],
                ":enun" => $pregunta["enunciado"],
                ":img" => $pregunta["imagen"] ?? null,
            ]);

            $idPregunta = $conn->lastInsertId();

            foreach ($pregunta["opciones"] as $op) {
                $sqlOpcion->execute([
                    ":idp" => $idPregunta,
                    ":txt" => $op["texto"],
                ]);
            }

            foreach ($pregunta["opcionesCorrectas"] as $opCor) {
                $sqlOpcion->execute([
                    ":cor" => $opCor["esCorrecta"]
                ]);
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "message" => "Error al guardar: " . $e->getMessage()
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Nuevo cuestionario creado exitosamente.",
            "idNuevaVersion" => $idNuevaVersion
        ]);
    }
} else {
    // Caso A: Autor coincide, proceder a comparar y actualizar
    // Obtener preguntas existentes de la BD (reutilizar lógica de obtenerPreguntas.php)
    $stmtPreg = $conn->prepare("SELECT * FROM pregunta WHERE ID_VERSION = :id");
    $stmtPreg->bindValue(":id", $idVersion);
    $stmtPreg->execute();
    $preguntasBD = $stmtPreg->fetchAll(PDO::FETCH_ASSOC);

    // Agregar opciones a cada pregunta
    foreach ($preguntasBD as &$preg) {
        $stmtOpt = $conn->prepare("SELECT * FROM opcion WHERE ID_PREGUNTA = :idPreg"); // Cambié a SELECT * para tener más datos si es necesario
        $stmtOpt->bindValue(":idPreg", $preg["ID_PREGUNTA"]);
        $stmtOpt->execute();
        $preg["opciones"] = $stmtOpt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Comparar contenido: Asumir que enunciados son únicos por versión
    // Crear un mapa de preguntas BD por enunciado para comparación rápida
    $mapaPreguntasBD = [];
    foreach ($preguntasBD as $preg) {
        $mapaPreguntasBD[$preg['ENUNCIADO']] = $preg;
    }

    // Para cada pregunta actual
    foreach ($preguntasActuales as $pregActual) {
        $enunciado = $pregActual['enunciado'];

        if (isset($mapaPreguntasBD[$enunciado])) {
            // Pregunta existe: UPDATE
            $idPregunta = $mapaPreguntasBD[$enunciado]['ID_PREGUNTA'];
            $stmtUpdatePregunta = $conn->prepare("UPDATE pregunta SET NRO_ORDEN, ENUNCIADO, IMAGEN)
        VALUES ( :nro, :enun, :img WHERE ID_PREGUNTA = :id");
            $stmtUpdatePregunta->execute([
                ":id" => $idPregunta,
                ":nro" => $pregActual["nro_orden"],
                ":enun" => $pregActual["enunciado"],
                ":img" => $pregActual["imagen"] ?? null,
            ]);

            $idPregunta = $conn->lastInsertId();

            // Comparar y actualizar opciones (asumir que opciones se identifican por texto o posición)
            // Para simplicidad, borrar opciones existentes y reinsertar
            $stmtDeleteOpciones = $conn->prepare("DELETE FROM opcion WHERE ID_PREGUNTA = :id");
            $stmtDeleteOpciones->bindValue(":id", $idPregunta);
            $stmtDeleteOpciones->execute();

            foreach ($pregActual['opciones'] as $opcion) {
                $stmtInsertOpcion = $conn->prepare("INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA) VALUES (:idp, :txt, :cor)");
                $sqlOpcion->execute([
                    ":idp" => $idPregunta,
                    ":txt" => $op["texto"],
                ]);
            }

            foreach ($pregunta["opcionesCorrectas"] as $opCor) {
                $sqlOpcion->execute([
                    ":cor" => $opCor["esCorrecta"]
                ]);
            }
        } else {
            // Pregunta nueva: INSERT
            $stmtInsertPregunta = $conn->prepare("INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, IMAGEN) VALUES (:idv, :nro, :enun, :img)");
            $stmtInsertPregunta->bindValue(":idv", $idVersion, PDO::PARAM_INT);
            $stmtInsertPregunta->bindValue(":nro", $pregActual["nro_orden"], PDO::PARAM_INT);
            $stmtInsertPregunta->bindValue(":enun", $pregActual["enunciado"]);
            $stmtInsertPregunta->bindValue(":img", $pregActual["imagen"] ?? null);

            $stmtInsertPregunta->execute();
            $idNuevaPregunta = $conn->lastInsertId();

            // Insertar opciones
            foreach ($pregActual['opciones'] as $opcion) {
                $stmtOpt = $conn->prepare("SELECT * FROM opcion WHERE ID_PREGUNTA = :idPreg"); // Cambié a SELECT * para tener más datos si es necesario
                $stmtOpt->bindValue(":idPreg", $idNuevaPregunta);
                $stmtOpt->execute();
                $pregActual["opciones"] = $stmtOpt->fetchAll(PDO::FETCH_ASSOC);
            }
        }
    }

    // Opcional: Actualizar datos del cuestionario o versión si es necesario (e.g., descripción, etc.)
    // if ($datosCuestionario) { ... UPDATE version_cuestionario o cuestionario ... }

    echo json_encode([
        "status" => "success",
        "message" => "Plantilla actualizada exitosamente."
    ]);
    exit;
}
