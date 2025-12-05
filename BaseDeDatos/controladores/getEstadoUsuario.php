<?php
session_start();
require('../conexion.php');

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Usuario no autenticado');
    }
    $idUsuario = $_SESSION['usuario_id'];
    // Consultar estado global
    $stmt = $conn->prepare("
        SELECT 
            u.BANEADO AS baneado,
            u.SILENCIADO AS silenciado
        FROM usuario u
        WHERE u.ID_USUARIO = :idUsuario
        LIMIT 1
    ");
    
    $stmt->execute([":idUsuario" => $idUsuario]);

    $estado = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "baneado" => $estado["baneado"] == 1,
        "silenciado" => $estado["silenciado"] == 1,
        "motivo" => $estado["motivo"] ?? null
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}