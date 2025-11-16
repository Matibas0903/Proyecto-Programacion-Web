<?php
    require('../conexion.php');

    header('Content-Type: application/json');

    try {
        //obtenemos el parametro cuestionario
        if (!isset($_GET['cuestionario'])) {
            throw new Exception('ID de cuestionario inválido.');
        }
        $idCuestionario = (int) $_GET['cuestionario'];
        $stmt = $conn->prepare("
            SELECT v.*,
            COALESCE(( SELECT COUNT(*) 
                FROM pregunta p
                WHERE p.ID_VERSION = v.ID_VERSION
            ), 0) AS cantidad_preguntas,
            COALESCE((SELECT AVG(pa.VALORACION_CUESTIONARIO) 
                FROM participacion pa
                WHERE pa.ID_VERSION = v.ID_VERSION
                  AND pa.VALORACION_CUESTIONARIO IS NOT NULL
            ), 0) AS promedio_calificacion
            FROM version_cuestionario v
            WHERE ID_CUESTIONARIO = :idCuestionario
        ");
        $stmt->bindParam(':idCuestionario', $idCuestionario, PDO::PARAM_INT);
        $stmt->execute();
        $cuestionario = $stmt->fetchAll(PDO::FETCH_ASSOC);
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