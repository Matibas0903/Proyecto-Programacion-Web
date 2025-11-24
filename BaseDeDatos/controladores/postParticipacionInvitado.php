<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');
    //OBTENER ID USUARIO DE LA SESSION
    try {
        $body = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['idVersion']) || !isset($body['puntaje']) || !isset($body['respuestas']) || !isset($body['nombre_invitado'])) {
            throw new Exception('Datos incompletos.');
        }

        $idVersion = (int) $body['idVersion'];
        $puntaje = (int) $body['puntaje'];
        $respuestas = $body['respuestas'];
        $fechaActual = date('Y-m-d');
        $nombreInvitado = trim($body['nombre_invitado']);

        $conn->beginTransaction();

        //Insertamos la nueva participación
        $stmtParticipacion = $conn->prepare("
            INSERT INTO participacion (FECHA_PARTICIPACION, PUNTAJE, BANEADO, ID_VERSION, INVITADO, NOMBRE_INVITADO)
            VALUES (NOW(), :puntaje, 0, :idVersion, 1, :nombreInvitado)
        ");
        $stmtParticipacion->bindParam(':puntaje', $puntaje, PDO::PARAM_INT);
        $stmtParticipacion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtParticipacion->bindParam(':nombreInvitado', $nombreInvitado, PDO::PARAM_STR);
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