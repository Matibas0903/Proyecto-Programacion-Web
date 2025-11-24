<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');
    
    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        
        $idUsuario = (int) $_SESSION['usuario_id'];
        $body = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['idVersion']) || !isset($body['puntaje']) || !isset($body['respuestas'])) {
            throw new Exception('Datos incompletos.');
        }

        $idVersion = (int) $body['idVersion'];
        $puntaje = (int) $body['puntaje'];
        $respuestas = $body['respuestas'];

        $conn->beginTransaction();

        //Obtener información del cuestionario (visibilidad)
        $stmtCuestionario = $conn->prepare("
            SELECT c.VISIBILIDAD
            FROM version_cuestionario v
            INNER JOIN cuestionario c ON v.ID_CUESTIONARIO = c.ID_CUESTIONARIO
            WHERE v.ID_VERSION = :idVersion
        ");
        $stmtCuestionario->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtCuestionario->execute();
        $cuestionario = $stmtCuestionario->fetch(PDO::FETCH_ASSOC);

        if (!$cuestionario) {
            throw new Exception('Cuestionario no encontrado.');
        }

        //Verificamos si es privado y si tiene invitación pendiente
        if($cuestionario['VISIBILIDAD'] === 'Privado'){
            $stmtInvitacion = $conn->prepare("
                SELECT ID_INVITACION
                FROM invitacion
                WHERE ID_VERSION = :idVersion 
                    AND ID_USUARIO = :idUsuario
                    AND ESTADO = 'Pendiente'
                    AND DATE(FECHA_VENCIMIENTO) >= CURDATE()
                LIMIT 1
            ");
                
            $stmtInvitacion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
            $stmtInvitacion->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
            $stmtInvitacion->execute();
            $invitacion = $stmtInvitacion->fetch(PDO::FETCH_ASSOC);
            
            if (!$invitacion) {
                throw new Exception('Acceso denegado. No posee invitación válida para este cuestionario.');
            }

            //Cambiamos estado de invitación
            $stmtActualizarInvitacion = $conn->prepare("
                UPDATE invitacion 
                SET ESTADO = 'Aceptada'
                WHERE ID_INVITACION = :idInvitacion
            ");
            $stmtActualizarInvitacion->bindParam(':idInvitacion', $invitacion['ID_INVITACION'], PDO::PARAM_INT);
            $stmtActualizarInvitacion->execute();
        }

        //Verificamos si el usuario ya participó en esta versión
        $stmtVerificar = $conn->prepare("
            SELECT ID_PARTICIPACION 
            FROM participacion 
            WHERE ID_USUARIO = :idUsuario AND ID_VERSION = :idVersion
        ");
        $stmtVerificar->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmtVerificar->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtVerificar->execute();
        $participacionExistente = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

        if ($participacionExistente) {
            $idParticipacionAnterior = $participacionExistente['ID_PARTICIPACION'];

            // Eliminar respuestas anteriores
            $stmtEliminarRespuestas = $conn->prepare("
                DELETE FROM respuesta WHERE ID_PARTICIPACION = :idParticipacion
            ");
            $stmtEliminarRespuestas->bindParam(':idParticipacion', $idParticipacionAnterior, PDO::PARAM_INT);
            $stmtEliminarRespuestas->execute();

            // Eliminar participación anterior
            $stmtEliminarParticipacion = $conn->prepare("
                DELETE FROM participacion WHERE ID_PARTICIPACION = :idParticipacion
            ");
            $stmtEliminarParticipacion->bindParam(':idParticipacion', $idParticipacionAnterior, PDO::PARAM_INT);
            $stmtEliminarParticipacion->execute();
        }

        //Insertamos la nueva participación
        $stmtParticipacion = $conn->prepare("
            INSERT INTO participacion (ID_USUARIO, FECHA_PARTICIPACION, PUNTAJE, BANEADO, ID_VERSION, INVITADO)
            VALUES (:idUsuario, NOW(), :puntaje, 0, :idVersion, 0)
        ");
        $stmtParticipacion->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmtParticipacion->bindParam(':puntaje', $puntaje, PDO::PARAM_INT);
        $stmtParticipacion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtParticipacion->execute();

        $idParticipacion = $conn->lastInsertId();

        //Insertamos las respuestas
        $stmtRespuesta = $conn->prepare("
            INSERT INTO respuesta (ID_PARTICIPACION, ID_OPCION)
            VALUES (:idParticipacion, :idOpcion)
        ");

        foreach ($respuestas as $idOpcion) {
            $stmtRespuesta->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
            $stmtRespuesta->bindParam(':idOpcion', $idOpcion, PDO::PARAM_INT);
            $stmtRespuesta->execute();
        }

        $conn->commit();

        echo json_encode([
            "status" => "success",
            "idParticipacion" => $idParticipacion
        ]);
        
    } catch (PDOException $e) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "message" => "Error de base de datos",
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        if($conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
?>