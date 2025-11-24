<?php
    require('../conexion.php');
    header('Content-Type: application/json');
    
    try {
        if (!isset($_GET['version'])) {
            throw new Exception('ID de versión inválido.');
        }
        $idVersion = (int) $_GET['version'];
    
        // Query que incluye tanto usuarios registrados como invitados
        $stmtRanking = $conn->prepare("
            SELECT 
                p.ID_PARTICIPACION,
                p.FECHA_PARTICIPACION,
                p.PUNTAJE,
                p.ID_VERSION,
                p.INVITADO,
                u.ID_USUARIO,
                CASE 
                    WHEN p.INVITADO = 1 THEN p.NOMBRE_INVITADO
                    ELSE u.NOMBRE
                END AS NOMBRE,
                CASE 
                    WHEN p.INVITADO = 1 THEN ''
                    ELSE u.FOTO_PERFIL
                END AS FOTO_PERFIL
            FROM participacion p
            LEFT JOIN usuario u ON p.ID_USUARIO = u.ID_USUARIO
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