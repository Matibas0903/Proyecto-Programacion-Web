<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    //OBTENER ID USUARIO DE LA SESSION!!!!

    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        $idUsuario = $_SESSION['usuario_id'];
        $stmt = $conn->prepare("
            SELECT c.*, v.activo, v.cod_acceso 
            FROM cuestionario c
            LEFT JOIN version_cuestionario v 
                ON c.id = v.id_cuestionario
                AND v.activo = 1
            WHERE c.id_administrador = :idUsuario 
            ORDER BY fecha_creacion DESC
        ");
        $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmt->execute();
        $cuestionariosAdministrador = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$cuestionariosAdministrador]);


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