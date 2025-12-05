<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

$idVersion = $input["idVersion"] ?? null;
$preguntasActuales = $input["preguntas"] ?? [];
$datosCuestionario = $input["cuestionario"] ?? [];
$idUsuarioActual = $_SESSION["usuario_id"] ?? null;

$action = $_GET["action"] ?? null;

if (!$action) {
    echo json_encode(["status" => "error", "message" => "No se recibió acción"]);
    exit;
}

function insertarPreguntas($conn, $idVersionNueva, $preguntas)
{
    $stmtP = $conn->prepare("INSERT INTO pregunta (ID_VERSION, NRO_ORDEN, ENUNCIADO, IMAGEN)
                             VALUES (:v,:n,:e,:i)");

    $stmtO = $conn->prepare("INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA)
                             VALUES (:p,:t,:c)");

    foreach ($preguntas as $p) {

        $stmtP->execute([
            ":v" => $idVersionNueva,
            ":n" => $p["nro_orden"],
            ":e" => $p["enunciado"],
            ":i" => $p["imagen"] ?? null
        ]);

        $idPreguntaNueva = $conn->lastInsertId();

        if (!empty($p["opciones"])) {
            foreach ($p["opciones"] as $op) {
                $stmtO->execute([
                    ":p" => $idPreguntaNueva,
                    ":t" => $op["texto"],
                    ":c" => $op["esCorrecta"] ?? 0
                ]);
            }
        }
    }
}

function obtenerAutorCuestionario($conn, $idVersion)
{
    $stmt = $conn->prepare("
        SELECT c.ID_USUARIO
        FROM version_cuestionario v
        JOIN cuestionario c ON c.ID_CUESTIONARIO = v.ID_CUESTIONARIO
        WHERE v.ID_VERSION = :id;
    ");
    $stmt->execute([":id" => $idVersion]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? $row["ID_USUARIO"] : null;
}

if ($action == "crear_cuestionario") {

    try {
        $conn->beginTransaction();
        $codAccesoIngresado = $datosCuestionario["codigoAcceso"];

        // Verificar si ese codigo existe en cualquier version
        $stmtCheck = $conn->prepare("
            SELECT COUNT(*) AS existe
            FROM version_cuestionario
            WHERE COD_ACCESO = :c
        ");
        $stmtCheck->execute([":c" => $codAccesoIngresado]);
        $existe = $stmtCheck->fetch(PDO::FETCH_ASSOC)["existe"];

        if ($existe > 0) {
            // Preferencia: combinación lógica
            $codigoGenerado = $ver["ID_CUESTIONARIO"] . $nuevoNumVersion;

            // verificar que no exista tampoco
            $stmtCheck2 = $conn->prepare("
                SELECT COUNT(*) AS existe
                FROM version_cuestionario
                WHERE COD_ACCESO = :c
            ");
            $stmtCheck2->execute([":c" => $codigoGenerado]);
            $existe2 = $stmtCheck2->fetch(PDO::FETCH_ASSOC)["existe"];

            if ($existe2 > 0) {
                // último recurso: número aleatorio de 7 a 9 dígitos
                $codigoGenerado = random_int(1000000, 999999999);
            }

            $codAccesoFinal = $codigoGenerado;

        } else {
            $codAccesoFinal = $codAccesoIngresado;
        }

        $fechaCreacion = date("Y-m-d H:i:s");

        // Crear cuestionario
        $stmt = $conn->prepare("
            INSERT INTO cuestionario (NOMBRE_CUESTIONARIO, VISIBILIDAD, ID_CATEGORIA, ID_USUARIO)
            VALUES (:n,:v,:c,:u)
        ");
        $stmt->execute([
            ":n" => $datosCuestionario["nombreCuestionario"],
            ":v" => $datosCuestionario["Visibilidad"],
            ":c" => $datosCuestionario["selectCategoria"],
            ":u" => $idUsuarioActual
        ]);
        $idCuest = $conn->lastInsertId();

        // Crear versión
        $stmt = $conn->prepare("
            INSERT INTO version_cuestionario (DESCRIPCION, COD_ACCESO, ACTIVO, ID_CUESTIONARIO, PLANTILLA, FECHA_CREACION)
            VALUES (:d,:code,:a,:idc,:p,:fc)
        ");
        $stmt->execute([
            ":d" => $datosCuestionario["txtDescripcion"],
            ":code" => $codAccesoFinal,
            ":a" => $datosCuestionario["estado"],
            ":idc" => $idCuest,
            ":p" => $datosCuestionario["plantilla"]
            ":fc" => $fechaCreacion
        ]);
        $idVersionNueva = $conn->lastInsertId();

        insertarPreguntas($conn, $idVersionNueva, $preguntasActuales);

        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Cuestionario creado correctamente",
            "idVersion" => $idVersionNueva
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "message" => "Error al crear cuestionario: " . $e->getMessage()
        ]);
    }

    exit;
}

if ($action == "editar_version") {

    // verificar autor
    $autor = obtenerAutorCuestionario($conn, $idVersion);

    if ($autor != $idUsuarioActual) {
        echo json_encode([
            "status" => "error",
            "message" => "No puedes editar una versión que no te pertenece."
        ]);
        exit;
    }

    try {
        $conn->beginTransaction();

        // obtenemos las preguntas actuales en BD
        $stmt = $conn->prepare("SELECT ID_PREGUNTA FROM pregunta WHERE ID_VERSION = :id");
        $stmt->execute([":id" => $idVersion]);
        $pregBD = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $idsActuales = array_map(fn($p) => $p["ID_PREGUNTA"] ?? 0, $preguntasActuales);
        $idsAEliminar = array_diff($pregBD, $idsActuales);

        // preparar deletes
        $delO = $conn->prepare("DELETE FROM opcion WHERE ID_PREGUNTA=:id");
        $delP = $conn->prepare("DELETE FROM pregunta WHERE ID_PREGUNTA=:id");

        foreach ($idsAEliminar as $idDel) {
            $delO->execute([":id" => $idDel]);
            $delP->execute([":id" => $idDel]);
        }

        // eliminar e insertar todo
        foreach ($preguntasActuales as $p) {

            if (!empty($p["ID_PREGUNTA"])) {
                $delO->execute([":id" => $p["ID_PREGUNTA"]]);
                $delP->execute([":id" => $p["ID_PREGUNTA"]]);
            }

            // insertar nuevamente
            $stmtP = $conn->prepare("
                INSERT INTO pregunta (ID_VERSION,NRO_ORDEN,ENUNCIADO,IMAGEN)
                VALUES (:v,:n,:e,:i)
            ");
            $stmtP->execute([
                ":v" => $idVersion,
                ":n" => $p["nro_orden"],
                ":e" => $p["enunciado"],
                ":i" => $p["imagen"] ?? null
            ]);

            $idPreguntaNueva = $conn->lastInsertId();

            if (!empty($p["opciones"])) {
                $stmtO = $conn->prepare("
                    INSERT INTO opcion (ID_PREGUNTA,TEXTO,ES_CORRECTA)
                    VALUES (:p,:t,:c)
                ");
                foreach ($p["opciones"] as $op) {
                    $stmtO->execute([
                        ":p" => $idPreguntaNueva,
                        ":t" => $op["texto"],
                        ":c" => $op["esCorrecta"] ?? 0
                    ]);
                }
            }
        }

        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Versión actualizada correctamente."
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "message" => "Error al actualizar versión: " . $e->getMessage()
        ]);
    }

    exit;
}

if ($action == "nueva_version") {

    // verificar autor
    $autor = obtenerAutorCuestionario($conn, $idVersion);

    if ($autor != $idUsuarioActual) {
        echo json_encode([
            "status" => "error",
            "message" => "No puedes crear una nueva versión si no eres el autor."
        ]);
        exit;
    }

    try {
        $conn->beginTransaction();

        // obtener la version original
        $stmt = $conn->prepare("SELECT * FROM version_cuestionario WHERE ID_VERSION=:id");
        $stmt->execute([":id" => $idVersion]);
        $ver = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$ver) {
            echo json_encode(["status" => "error", "message" => "Versión no encontrada"]);
            exit;
        }

        $stmtMax = $conn->prepare("
            SELECT COALESCE(MAX(NUM_VERSION), 0) AS max_ver
            FROM version_cuestionario
            WHERE ID_CUESTIONARIO = :idc
        ");
        $stmtMax->execute([":idc" => $ver["ID_CUESTIONARIO"]]);
        $rowMax = $stmtMax->fetch(PDO::FETCH_ASSOC);

        $nuevoNumVersion = $rowMax["max_ver"] + 1;

        $codAccesoIngresado = $datosCuestionario["codigoAcceso"];

        // Verificar si ese codigo existe en cualquier version
        $stmtCheck = $conn->prepare("
            SELECT COUNT(*) AS existe
            FROM version_cuestionario
            WHERE COD_ACCESO = :c
        ");
        $stmtCheck->execute([":c" => $codAccesoIngresado]);
        $existe = $stmtCheck->fetch(PDO::FETCH_ASSOC)["existe"];

        if ($existe > 0) {
            // Preferencia: combinación lógica
            $codigoGenerado = $ver["ID_CUESTIONARIO"] . $nuevoNumVersion;

            // verificar que no exista tampoco
            $stmtCheck2 = $conn->prepare("
                SELECT COUNT(*) AS existe
                FROM version_cuestionario
                WHERE COD_ACCESO = :c
            ");
            $stmtCheck2->execute([":c" => $codigoGenerado]);
            $existe2 = $stmtCheck2->fetch(PDO::FETCH_ASSOC)["existe"];

            if ($existe2 > 0) {
                // último recurso: número aleatorio de 7 a 9 dígitos
                $codigoGenerado = random_int(1000000, 999999999);
            }

            $codAccesoFinal = $codigoGenerado;

        } else {
            $codAccesoFinal = $codAccesoIngresado;
        }

        $fechaCreacion = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("
            INSERT INTO version_cuestionario 
            (DESCRIPCION, COD_ACCESO, ACTIVO, ID_CUESTIONARIO, PLANTILLA, NUM_VERSION, FECHA_CREACION)
            VALUES (:d, :c, 'Inactivo', :idc, :p, :numVer, :fecha)
        ");

        $stmt->execute([
            ":d"      => $datosCuestionario["txtDescripcion"],
            ":c"      => $codAccesoFinal,
            ":idc"    => $ver["ID_CUESTIONARIO"],
            ":p"      => $datosCuestionario["plantilla"],
            ":numVer" => $nuevoNumVersion,
            ":fecha"  => $fechaCreacion
        ]);

        $idVersionNueva = $conn->lastInsertId();

        insertarPreguntas($conn, $idVersionNueva, $preguntasActuales);

        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Nueva versión creada correctamente.",
            "idVersion" => $idVersionNueva
        ]);

    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "message" => "Error al crear nueva versión: " . $e->getMessage()
        ]);
    }

    exit;
}

// Si action no coincide
echo json_encode(["status"=>"error","message"=>"Acción inválida"]);