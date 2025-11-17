<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }
        //obtenemos el body id cuestionario y id de usuario
        $body = json_decode(file_get_contents('php://input'), true);
        if (!isset($body['idCuestionario']) || !isset($body['idModerador'])) {
            throw new Exception("Faltan parámetros");
        }
        $cuestionario = $body['idCuestionario'];
        $moderador = $body['idModerador'];
        $stmt = $conn->prepare("
            UPDATE cuestionario
            SET ID_MODERADOR = :idModerador
            WHERE ID_CUESTIONARIO = :idCuestionario
        ");
        $stmt->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
        $stmt->bindParam(':idModerador', $moderador, PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status"=>"success", "message" => "Moderador actualizado"]);
        } else {
            echo json_encode(["status"=>"fail", "message" => "No se pudo actualizar el moderador"]);
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