<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }
        //obtenemos el body id cuestionario y id de usuario
        $body = json_decode(file_get_contents('php://input'), true);
        if (!isset($body['idCuestionario']) || !isset($body['numVersion'])) {
            throw new Exception("Faltan parámetros");
        }
        $cuestionario = $body['idCuestionario'];
        $version = $body['numVersion'];
        //Desactivo todas las versiones del cuestionario
        $stmt = $conn->prepare("
            UPDATE version_cuestionario
            SET activo = 0
            WHERE id_cuestionario = :idCuestionario
        ");
        $stmt->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
        $stmt->execute();

        //Activo la version seleccionada
        if($version === 'deshabilitar'){
            echo json_encode(["status"=>"success", "message" => "Versiones deshabilitadas"]);
            exit();
        }
        $stmt1 = $conn->prepare("
            UPDATE version_cuestionario
            SET activo = 1
            WHERE id_cuestionario = :idCuestionario AND num_version = :numVersion
        ");
        $stmt1->bindParam(':idCuestionario', $cuestionario, PDO::PARAM_INT);
        $stmt1->bindParam(':numVersion', $version, PDO::PARAM_INT);
        $stmt1->execute();

        if ($stmt1->rowCount() > 0) {
            echo json_encode(["status"=>"success", "message" => "Version activada"]);
        } else {
            echo json_encode(["status"=>"fail", "message" => "No se pudo activar la version"]);
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