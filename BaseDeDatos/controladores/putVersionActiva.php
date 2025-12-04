<?php
    session_start();
    require('../conexion.php');
    require_once(__DIR__ . '/permisos.php');

    header('Content-Type: application/json');

    try {
        if(!Permisos::tienePermiso(['activar_version'], $_SESSION['usuario_id'])){
            throw new Exception('No tienes permiso para activar versiones.');
        }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }
        
        // Obtenemos el body
        $body = json_decode(file_get_contents('php://input'), true);
        if (!isset($body['idCuestionario']) || !isset($body['idVersion'])) {
            throw new Exception("Faltan parámetros");
        }
        
        $cuestionario = (int) $body['idCuestionario'];
        $version = $body['idVersion'];

        // ✅ Iniciar transacción
        $conn->beginTransaction();

        // Si es "deshabilitar", solo desactivamos todas
        if($version === 'deshabilitar'){
            $stmt = $conn->prepare("
                UPDATE version_cuestionario
                SET ACTIVO = 'Inactivo'
                WHERE ID_CUESTIONARIO = :idCuestionario
            ");
            $stmt->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
            $stmt->execute();
            
            $conn->commit();
            echo json_encode(["status"=>"success", "message" => "Versiones deshabilitadas"]);
            exit();
        }

        // ✅ VALIDACIÓN 1: Verificar que la versión existe
        $stmtVerificar = $conn->prepare("
            SELECT ID_VERSION, ACTIVO
            FROM version_cuestionario
            WHERE ID_CUESTIONARIO = :idCuestionario AND ID_VERSION = :idVersion
        ");
        $stmtVerificar->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
        $stmtVerificar->bindParam(':idVersion', $version, PDO::PARAM_INT);
        $stmtVerificar->execute();
        $versionData = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

        if (!$versionData) {
            throw new Exception("La versión $version no existe para este cuestionario");
        }

        // ✅ VALIDACIÓN 2: Verificar que la versión tiene preguntas
        $stmtPreguntas = $conn->prepare("
            SELECT COUNT(*) as total
            FROM pregunta
            WHERE ID_VERSION = :idVersion
        ");
        $stmtPreguntas->bindParam(':idVersion', $version, PDO::PARAM_INT);
        $stmtPreguntas->execute();
        $countPreguntas = $stmtPreguntas->fetch(PDO::FETCH_ASSOC);

        if ($countPreguntas['total'] == 0) {
            throw new Exception("No se puede activar una versión sin preguntas. Agrega preguntas primero.");
        }

        // ✅ VALIDACIÓN 3: Verificar que todas las preguntas tienen opciones
        $stmtOpcionesFaltantes = $conn->prepare("
            SELECT p.ID_PREGUNTA, p.ENUNCIADO
            FROM pregunta p
            LEFT JOIN opcion o ON o.ID_PREGUNTA = p.ID_PREGUNTA
            WHERE p.ID_VERSION = :idVersion
            GROUP BY p.ID_PREGUNTA
            HAVING COUNT(o.ID_OPCION) = 0
        ");
        $stmtOpcionesFaltantes->bindParam(':idVersion', $version, PDO::PARAM_INT);
        $stmtOpcionesFaltantes->execute();
        $preguntasSinOpciones = $stmtOpcionesFaltantes->fetchAll(PDO::FETCH_ASSOC);

        if (count($preguntasSinOpciones) > 0) {
            throw new Exception("Hay preguntas sin opciones de respuesta. Completa todas las preguntas antes de activar.");
        }

        // ✅ VALIDACIÓN 4: Verificar que hay al menos una opción correcta por pregunta
        $stmtSinCorrectas = $conn->prepare("
            SELECT p.ID_PREGUNTA, p.ENUNCIADO, p.ID_TIPO_PREGUNTA
            FROM pregunta p
            WHERE p.ID_VERSION = :idVersion
            AND p.ID_TIPO_PREGUNTA IN (1, 2, 4)
            AND NOT EXISTS (
                SELECT 1 
                FROM opcion o 
                WHERE o.ID_PREGUNTA = p.ID_PREGUNTA 
                AND o.ES_CORRECTA = 1
            )
        ");
        $stmtSinCorrectas->bindParam(':idVersion', $version, PDO::PARAM_INT);
        $stmtSinCorrectas->execute();
        $preguntasSinCorrectas = $stmtSinCorrectas->fetchAll(PDO::FETCH_ASSOC);

        if (count($preguntasSinCorrectas) > 0) {
            throw new Exception("Hay preguntas sin respuesta correcta marcada. Marca al menos una opción correcta en cada pregunta.");
        }

        // ✅ TODO OK: Desactivar todas las versiones del cuestionario
        $stmt = $conn->prepare("
            UPDATE version_cuestionario
            SET ACTIVO = 'Inactivo'
            WHERE ID_CUESTIONARIO = :idCuestionario
        ");
        $stmt->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
        $stmt->execute();

        // ✅ Activar la versión seleccionada
        $stmt1 = $conn->prepare("
            UPDATE version_cuestionario
            SET ACTIVO = 'Activo'
            WHERE ID_CUESTIONARIO = :idCuestionario AND ID_VERSION = :idVersion
        ");
        $stmt1->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
        $stmt1->bindParam(':idVersion', $version, PDO::PARAM_INT);
        $stmt1->execute();

        if ($stmt1->rowCount() > 0) {
            $conn->commit();
            echo json_encode([
                "status" => "success", 
                "message" => "Versión $version activada correctamente",
                "totalPreguntas" => $countPreguntas['total']
            ]);
        } else {
            throw new Exception("No se pudo activar la versión");
        }

    } catch (PDOException $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            "status" => "error",
            "message" => "Error de base de datos",
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
?>