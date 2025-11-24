<?php
    require('../conexion.php');
    header('Content-Type: application/json');
    
    try {
        if (!isset($_GET['version'])) {
            throw new Exception('ID de versión inválido.');
        }
        $idVersion = (int) $_GET['version'];
    
        $stmtRanking = $conn->prepare("
            SELECT 
                p.ID_PARTICIPACION,
                p.FECHA_PARTICIPACION,
                p.PUNTAJE,
                p.ID_VERSION,
                u.ID_USUARIO,
                u.NOMBRE,
                u.FOTO_PERFIL
            FROM participacion p
            INNER JOIN usuario u ON p.ID_USUARIO = u.ID_USUARIO
            WHERE p.ID_VERSION = :idVersion
                AND p.BANEADO = 0
            ORDER BY p.PUNTAJE DESC
        ");
        $stmtRanking->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtRanking->execute();
        $ranking = $stmtRanking->fetchAll(PDO::FETCH_ASSOC);
    
        echo json_encode(["status" => "success", "data" => $ranking]);
    
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