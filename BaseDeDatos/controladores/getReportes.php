<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require('../conexion.php');
header('Content-Type: application/json');

try {
    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Usuario no autenticado');
    }

    if (!isset($_GET['cuestionario'])) {
        throw new Exception('ID de cuestionario no proporcionado');
    }

    $idCuestionario = (int) $_GET['cuestionario'];
    $idUsuario = $_SESSION['usuario_id'];

    // Verificar que el usuario sea el creador o moderador del cuestionario
    $stmtVerificar = $conn->prepare("
        SELECT ID_CUESTIONARIO 
        FROM cuestionario 
        WHERE ID_CUESTIONARIO = :idCuestionario 
        AND (ID_USUARIO = :idUsuario OR ID_MODERADOR = :idUsuario)
    ");
    $stmtVerificar->execute([
        ':idCuestionario' => $idCuestionario,
        ':idUsuario' => $idUsuario
    ]);

    if (!$stmtVerificar->fetch()) {
        throw new Exception('No tienes permisos para ver los reportes de este cuestionario');
    }

    // Obtener reportes del cuestionario
    $stmt = $conn->prepare("
        SELECT 
            r.ID_REPORTE,
            r.MOTIVO,
            r.FECHA_REPORTE,
            u.ID_USUARIO,
            u.NOMBRE,
            u.FOTO_PERFIL,
            u.EMAIL
        FROM reportes r
        INNER JOIN usuario u ON r.ID_USUARIO = u.ID_USUARIO
        WHERE r.ID_CUESTIONARIO = :idCuestionario
        ORDER BY r.FECHA_REPORTE DESC
    ");
    
    $stmt->execute([':idCuestionario' => $idCuestionario]);
    $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $reportes
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