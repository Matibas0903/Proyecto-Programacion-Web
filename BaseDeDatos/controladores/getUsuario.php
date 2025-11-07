<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        //obtenemos el parametro id de usuario
        if (!isset($_GET['id'])) {
            throw new Exception('ID de usuario inválido.');
        }
        $idUsuario = (int) $_GET['id'];
        $stmt = $conn->prepare("
            SELECT id, nombre, email, foto_perfil 
            FROM usuario
            WHERE id = :idUsuario
        ");
        $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$usuario]);


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