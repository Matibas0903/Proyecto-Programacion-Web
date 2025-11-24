<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    //OBTENER ID USUARIO DE LA SESSION
    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        $idUsuario = $_SESSION['usuario_id'];
        $stmt = $conn->prepare("
            SELECT c.*, v.ID_VERSION, v.TIEMPO_TOTAL, v.DESCRIPCION, v.ACTIVO, v.IMAGEN, cat.NOMBRE AS CATEGORIA_NOMBRE,
            COALESCE(( SELECT COUNT(*) 
                FROM pregunta p
                WHERE p.ID_VERSION = v.ID_VERSION
            ), 0) AS cantidad_preguntas,
            COALESCE((SELECT AVG(pa.VALORACION_CUESTIONARIO) 
                FROM participacion pa 
                WHERE pa.ID_VERSION = v.ID_VERSION
                AND pa.VALORACION_CUESTIONARIO > 0
            ), 0) AS promedio_calificacion
            FROM cuestionario c
            LEFT JOIN version_cuestionario v 
                ON c.ID_CUESTIONARIO = v.ID_CUESTIONARIO
                AND v.ACTIVO = 'Activo'
            LEFT JOIN categoria cat
                ON c.ID_CATEGORIA = cat.ID_CATEGORIA
            WHERE c.VISIBILIDAD = 'Publico' AND c.ID_USUARIO != :idUsuario
        ");
        $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmt->execute();
        $cuestionariosPublicos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$cuestionariosPublicos]);
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