<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    //OBTENER ID USUARIO DE LA SESSION!!!!

    try {
        //obtenemos el parametro cuestionario
        if (!isset($_GET['cuestionario'])) {
            throw new Exception('ID de cuestionario inválido.');
        }
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        $idUsuario = $_SESSION['usuario_id'];
        $idCuestionario = (int) $_GET['cuestionario'];
        $stmt = $conn->prepare("
            SELECT* 
            FROM cuestionario
            WHERE (ID_CUESTIONARIO = :idCuestionario AND ID_USUARIO = :idUsuario)
        ");
        $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmt->bindParam(':idCuestionario', $idCuestionario, PDO::PARAM_INT);
        $stmt->execute();
        $cuestionario = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$cuestionario]);


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