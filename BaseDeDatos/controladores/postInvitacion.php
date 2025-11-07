<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');
    //OBTENER ID USUARIO DE LA SESSION
    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        $idModerador = $_SESSION['usuario_id'];
        //obtenemos parametros id_participante, id_version, fecha_vencimiento
        $body = json_decode(file_get_contents('php://input'), true);
        if (!isset($body['id_participante']) || !isset($body['id_version']) || !isset($body['fecha_vencimiento'])) {
            throw new Exception("Faltan parámetros");
        }
        $idParticipante = $body['id_participante'];
        $idVersion = (int) $body['id_version'];
        $fechaVencimiento = $body['fecha_vencimiento'];
        $fechaActual = date('Y-m-d');

        $stmt = $conn->prepare("
            INSERT INTO invitacion (
                id_participante, id_moderador, fecha, estado, fecha_vencimiento, id_version
            ) VALUES (
                :idParticipante, :idModerador, :fecha, 'pendiente', :fechaVencimiento, :idVersion
            )
        ");
        $stmt->bindParam(':idParticipante', $idParticipante, PDO::PARAM_INT);
        $stmt->bindParam(':idModerador', $idModerador, PDO::PARAM_INT);
        $stmt->bindParam(':fecha', $fechaActual);
        $stmt->bindParam(':fechaVencimiento', $fechaVencimiento);
        $stmt->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status"=>"success", "message" => "Invitación creada"]);
        } else {
            echo json_encode(["status"=>"fail", "message" => "No se pudo crear la invitación"]);
        }
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