<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        $stmt = $conn->prepare("
            SELECT ID_USUARIO, NOMBRE, EMAIL, FOTO_PERFIL 
            FROM usuario
        ");
        $stmt->execute();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$usuarios]);


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