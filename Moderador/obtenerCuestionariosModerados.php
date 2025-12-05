<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");

try {
    // Verificar si el usuario está autenticado
    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Usuario no autenticado');
    }

    $idUsuario = $_SESSION['usuario_id'];

    // Traer cuestionarios donde el usuario sea MODERADOR con versiones activas
    $stmt = $conn->prepare("
        SELECT c.*, 
               v.ID_VERSION, 
               v.TIEMPO_TOTAL, 
               v.DESCRIPCION, 
               v.ACTIVO, 
               v.IMAGEN,
               v.COD_ACCESO,
               v.NUM_VERSION,
               v.PLANTILLA,
               v.FECHA_CREACION,
               cat.NOMBRE AS CATEGORIA_NOMBRE,
               COALESCE((
                   SELECT COUNT(*) 
                   FROM pregunta p
                   WHERE p.ID_VERSION = v.ID_VERSION
               ), 0) AS cantidad_preguntas,
               COALESCE((
                   SELECT AVG(pa.VALORACION_CUESTIONARIO) 
                   FROM participacion pa 
                   WHERE pa.ID_VERSION = v.ID_VERSION
                   AND pa.VALORACION_CUESTIONARIO > 0
               ), 0) AS promedio_calificacion
        FROM cuestionario c
        INNER JOIN version_cuestionario v 
            ON c.ID_CUESTIONARIO = v.ID_CUESTIONARIO
            AND v.ACTIVO = 'Activo'
        LEFT JOIN categoria cat
            ON c.ID_CATEGORIA = cat.ID_CATEGORIA
        WHERE c.ID_MODERADOR = :idUsuario
        ORDER BY v.FECHA_CREACION DESC
    ");
    
    $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
    $stmt->execute();
    $cuestionariosModerados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success", 
        "data" => $cuestionariosModerados
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