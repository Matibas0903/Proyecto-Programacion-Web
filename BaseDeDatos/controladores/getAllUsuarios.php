<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        $stmt = $conn->prepare("
            SELECT id, nombre, email, avatar 
            FROM usuario
        ");
        $stmt->execute();
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$usuarios]);


    } catch (PDOException $e) {
        echo json_encode(["status"=>"error", "data"=>$e->getMessage()]);
    }
?>