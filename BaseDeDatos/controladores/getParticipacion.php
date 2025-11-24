<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        $invitado = isset($_GET['invitado']) && $_GET['invitado'] === 'true';
        //obtenemos el parametro id de usuario
        if(!isset($_SESSION['usuario_id']) && !$invitado){
             throw new Exception('Usuario no autenticado');
        }
        if (!isset($_GET['participacion'])) {
            throw new Exception('ID de participación inválido.');
        }
        $participacion = (int) $_GET['participacion'];
        $idUsuario = isset($_SESSION['usuario_id']) ? (int) $_SESSION['usuario_id'] : null;
        //consultamos la participacion
        $stmt = $conn->prepare("
            SELECT 
                p.*,
                v.ID_VERSION,
                c.NOMBRE_CUESTIONARIO,
                COALESCE((SELECT COUNT(*) FROM pregunta preg WHERE preg.ID_VERSION = v.ID_VERSION), 0) AS cantidad_preguntas
            FROM participacion p
            INNER JOIN version_cuestionario v ON p.ID_VERSION = v.ID_VERSION
            INNER JOIN cuestionario c ON v.ID_CUESTIONARIO = c.ID_CUESTIONARIO
            WHERE p.ID_PARTICIPACION = :participacion
        ");
        $stmt->bindParam(':participacion', $participacion, PDO::PARAM_INT);
        $stmt->execute();
        $participacionData = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$participacionData) {
            throw new Exception('No se ha encontrado la participación.');
        }

        //Consultamos las respuestas de esa participación
        $stmtRespuestas = $conn->prepare("
            SELECT 
                r.ID_RESPUESTA,
                r.ID_OPCION,
                o.TEXTO,
                o.ES_CORRECTA,
                p.ID_PREGUNTA,
                p.ENUNCIADO,
                p.NRO_ORDEN
            FROM respuesta r
            INNER JOIN opcion o ON r.ID_OPCION = o.ID_OPCION
            INNER JOIN pregunta p ON o.ID_PREGUNTA = p.ID_PREGUNTA
            WHERE r.ID_PARTICIPACION = :participacion
            ORDER BY p.NRO_ORDEN
        ");
        $stmtRespuestas->bindParam(':participacion', $participacion, PDO::PARAM_INT);
        $stmtRespuestas->execute();
        $respuestas = $stmtRespuestas->fetchAll(PDO::FETCH_ASSOC);

        //Agregamos las respuestas a la participación
        $participacionData['respuestas'] = $respuestas;
        echo json_encode([
            "status" => "success",
            "data" => $participacionData
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error de base de datos",
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
?>