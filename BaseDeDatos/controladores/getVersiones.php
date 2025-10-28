<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        //obtenemos el parametro cuestionario
        if (!isset($_GET['cuestionario']) || !filter_var($_GET['cuestionario'], FILTER_VALIDATE_INT)) {
            throw new Exception('ID de cuestionario inválido.');
        }
        $idCuestionario = (int) $_GET['cuestionario'];
        $stmt = $conn->prepare("
            SELECT* 
            FROM version_cuestionario
            WHERE id_cuestionario = :idCuestionario
        ");
        $stmt->bindParam(':idCuestionario', $idCuestionario, PDO::PARAM_INT);
        $stmt->execute();
        $cuestionario = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$cuestionario]);


    } catch (PDOException $e) {
        echo json_encode(["status"=>"error", "data"=>$e->getMessage()]);
    }
?>