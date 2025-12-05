<?php
    session_start();
    require('../conexion.php');
    require_once(__DIR__ . '/permisos.php');

    header('Content-Type: application/json');
    //OBTENER ID USUARIO DE LA SESSION
    try {
        if(!Permisos::tienePermiso(['agregar_participante'], $_SESSION['usuario_id'])){
            throw new Exception('No tienes permiso para enviar invitaciones.');
        }
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
        $idVersion = $body['id_version'];
        $fechaVencimiento = $body['fecha_vencimiento'];
        $fechaActual = date('Y-m-d');

        //verificamos que el usuario no tenga una invitacion para esa version en estado Pendiente o Aceptada
        $stmt1 = $conn->prepare("
            SELECT COUNT(*) as count
            FROM invitacion
            WHERE ID_USUARIO = :idParticipante
              AND ID_VERSION = :idVersion
              AND ESTADO IN ('Pendiente', 'Aceptada')
        ");
        $stmt1->bindParam(':idParticipante', $idParticipante, PDO::PARAM_INT);
        $stmt1->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmt1->execute();
        $result = $stmt1->fetch(PDO::FETCH_ASSOC);
        if ($result['count'] > 0) {
            throw new Exception("El usuario ya tiene una invitación pendiente o aceptada para esta versión");
        }

        $stmt = $conn->prepare("
            INSERT INTO invitacion (ID_USUARIO, ESTADO, FECHA_VENCIMIENTO, ID_VERSION)
             VALUES (:idParticipante, 'Pendiente', :fechaVencimiento, :idVersion)
        ");
        $stmt->bindParam(':idParticipante', $idParticipante, PDO::PARAM_INT);
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