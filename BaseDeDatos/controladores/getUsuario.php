<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        $typeUsuario = '';
        $idUsuario = null;
        if (!isset($_GET['type'])) {
            $typeUsuario = 'byId';
        } else {
            $typeUsuario = $_GET['type'];
        }
        if($typeUsuario === 'byId'){
            //obtenemos el parametro id de usuario
            if (!isset($_GET['id'])) {
                throw new Exception('ID de usuario inválido.');
            }
            $idUsuario = (int) $_GET['id'];
        } else {
            if(!isset($_SESSION['usuario_id'])){
                throw new Exception('Usuario no autenticado');
            }
            $idUsuario = $_SESSION['usuario_id'];
        }
        $stmt = $conn->prepare("
            SELECT ID_USUARIO, NOMBRE, EMAIL, FOTO_PERFIL  
            FROM usuario
            WHERE ID_USUARIO = :idUsuario
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