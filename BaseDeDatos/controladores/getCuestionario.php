<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    //OBTENER ID USUARIO DE LA SESSION!!!!

    try {
        //obtenemos el parametro cuestionario
        if (!isset($_GET['cuestionario']) || !filter_var($_GET['cuestionario'], FILTER_VALIDATE_INT)) {
            throw new Exception('ID de cuestionario inválido.');
        }
        if(!isset($_SESSION['idUsuario']) || !filter_var($_SESSION['idUsuario'], FILTER_VALIDATE_INT)){
            throw new Exception('Usuario no autenticado');
        }
        $idUsuario = $_SESSION['idUsuario'];
        $idCuestionario = (int) $_GET['cuestionario'];
        $stmt = $conn->prepare("
            SELECT* 
            FROM cuestionario
            WHERE (id = :idCuestionario AND id_administrador = :idUsuario)
        ");
        $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmt->bindParam(':idCuestionario', $idCuestionario, PDO::PARAM_INT);
        $stmt->execute();
        $cuestionario = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$cuestionario]);


    } catch (PDOException $e) {
        echo json_encode(["status"=>"error", "data"=>$e->getMessage()]);
    }
?>