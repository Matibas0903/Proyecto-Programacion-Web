<?php
    require('../conexion.php');
    header('Content-Type: application/json');
    
    try {
        if (!isset($_GET['version'])) {
            throw new Exception('ID de versión inválido.');
        }
        $idVersion = (int) $_GET['version'];
        
        $stmt = $conn->prepare("
            SELECT 
                p.COMENTARIO,
                p.VALORACION_CUESTIONARIO,
                p.FECHA_PARTICIPACION,
                p.INVITADO,
                u.ID_USUARIO,
                CASE 
                    WHEN p.INVITADO = 1 THEN p.NOMBRE_INVITADO
                    ELSE u.NOMBRE
                END AS NOMBRE,
                CASE 
                    WHEN p.INVITADO = 1 THEN NULL
                    ELSE u.FOTO_PERFIL
                END AS FOTO_PERFIL
            FROM participacion p
            LEFT JOIN usuario u ON p.ID_USUARIO = u.ID_USUARIO
            WHERE p.ID_VERSION = :idVersion
                AND p.BANEADO = 0
                AND p.COMENTARIO IS NOT NULL
            ORDER BY p.FECHA_PARTICIPACION DESC
        ");
        $stmt->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmt->execute();
        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $comentarios
        ]);
    
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