<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');
    //OBTENER ID USUARIO DE LA SESSION
    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        $idParticipante = $_SESSION['usuario_id'];
        $body = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['idVersion']) || !isset($body['puntaje']) || !isset($body['respuestas'])) {
            throw new Exception('Datos incompletos.');
        }

        $idVersion = (int) $body['idVersion'];
        $idUsuario = (int) $_SESSION['usuario_id'];
        $puntaje = (int) $body['puntaje'];
        $respuestas = $body['respuestas'];
        $fechaActual = date('Y-m-d');

        $conn->beginTransaction();

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

        //Si ya participo, eliminamos respuestas y participación anterior
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
            INSERT INTO participacion (ID_USUARIO, FECHA_PARTICIPACION, PUNTAJE, BANEADO, ID_VERSION)
            VALUES (:idUsuario, NOW(), :puntaje, 0, :idVersion)
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