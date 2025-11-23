<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        if (!isset($_GET['participacion'])) {
            throw new Exception('ID de participación inválido.');
        }
        
        $body = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['calificacion']) && !isset($body['comentario'])) {
            throw new Exception('Debe enviar calificación o comentario.');
        }

        $idParticipacion = (int) $_GET['participacion'];
        $idUsuario = (int) $_SESSION['usuario_id'];

        // Verificamos que la participación existe y pertenece al usuario
        $stmtVerificar = $conn->prepare("
            SELECT ID_PARTICIPACION 
            FROM participacion 
            WHERE ID_USUARIO = :idUsuario AND ID_PARTICIPACION = :idParticipacion
        ");
        $stmtVerificar->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmtVerificar->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
        $stmtVerificar->execute();
        $participacionExistente = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

        if (!$participacionExistente) {
            throw new Exception('La participación no existe o no pertenece al usuario.');
        }

        // Solo calificación
        if (isset($body['calificacion']) && !isset($body['comentario'])) {
            $calificacion = (int) $body['calificacion'];
            $stmt = $conn->prepare("
                UPDATE participacion 
                SET VALORACION_CUESTIONARIO = :calificacion 
                WHERE ID_PARTICIPACION = :idParticipacion
            ");
            $stmt->bindParam(':calificacion', $calificacion, PDO::PARAM_INT);
            $stmt->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
            $stmt->execute();
        }
        // Solo comentario
        else if (!isset($body['calificacion']) && isset($body['comentario'])) {
            $comentario = trim($body['comentario']);
            $stmt = $conn->prepare("
                UPDATE participacion 
                SET COMENTARIO = :comentario 
                WHERE ID_PARTICIPACION = :idParticipacion
            ");
            $stmt->bindParam(':comentario', $comentario, PDO::PARAM_STR);
            $stmt->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
            $stmt->execute();
        }
        // Ambos
        else {
            $calificacion = (int) $body['calificacion'];
            $comentario = trim($body['comentario']);
            $stmt = $conn->prepare("
                UPDATE participacion 
                SET VALORACION_CUESTIONARIO = :calificacion, COMENTARIO = :comentario 
                WHERE ID_PARTICIPACION = :idParticipacion
            ");
            $stmt->bindParam(':calificacion', $calificacion, PDO::PARAM_INT);
            $stmt->bindParam(':comentario', $comentario, PDO::PARAM_STR);
            $stmt->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
            $stmt->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Participación actualizada correctamente"
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