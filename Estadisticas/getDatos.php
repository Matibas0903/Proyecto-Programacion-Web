<?php
session_start();
header('Content-Type: application/json');
require("../BaseDeDatos/conexion.php"); 
require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit;
}

$idUsuario = $_SESSION['usuario_id'];
$data = [];

// Verificar permisos
$puedeVerEstadisticasParticipacion = Permisos::tienePermiso('ver_estadisticas_participacion', $idUsuario);
$puedeVerEstadisticasCuestionario = Permisos::tienePermiso('ver_estadisticas_cuestionario', $idUsuario);

if ($puedeVerEstadisticasParticipacion) {
    // Cantidad de cuestionarios resueltos
    $sql = "SELECT COUNT(*) AS cantidad FROM participacion WHERE ID_USUARIO = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idUsuario]);
    $data['completados']['cantidad_resueltos'] = (int)$stmt->fetchColumn();

    // Promedio de respuestas correctas (cada correcta vale 10 puntos)
    $sql = "SELECT AVG(PUNTAJE / 10) AS promedio_correctas 
            FROM participacion 
            WHERE ID_USUARIO = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idUsuario]);
    $data['completados']['promedio_correctas'] = round((float)$stmt->fetchColumn(), 2);

    // Categoría con más respuestas correctas
    $sql = "
        SELECT c.NOMBRE, SUM(r_correctas.correctas) AS total_correctas
        FROM (
            SELECT p.ID_PARTICIPACION, (p.PUNTAJE / 10) AS correctas, p.ID_VERSION
            FROM participacion p
            WHERE p.ID_USUARIO = ?
        ) r_correctas
        JOIN version_cuestionario v ON r_correctas.ID_VERSION = v.ID_VERSION
        JOIN cuestionario q ON v.ID_CUESTIONARIO = q.ID_CUESTIONARIO
        JOIN categoria c ON q.ID_CATEGORIA = c.ID_CATEGORIA
        GROUP BY q.ID_CATEGORIA
        ORDER BY total_correctas DESC
        LIMIT 1
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idUsuario]);
    $fila = $stmt->fetch(PDO::FETCH_ASSOC);

    $data['completados']['categoria_mas_correctas'] = $fila ? $fila['NOMBRE'] : "Sin datos";
}

if ($puedeVerEstadisticasCuestionario) {
    // Jugadores por cuestionario
    $sql = "
        SELECT q.NOMBRE_CUESTIONARIO, COUNT(p.ID_PARTICIPACION) AS jugadores
        FROM cuestionario q
        JOIN version_cuestionario v ON q.ID_CUESTIONARIO = v.ID_CUESTIONARIO
        LEFT JOIN participacion p ON v.ID_VERSION = p.ID_VERSION
        WHERE q.ID_USUARIO = ?
        GROUP BY q.ID_CUESTIONARIO
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idUsuario]);
    $data['creados']['jugadores'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Valoración por estrellas
    $sql = "
        SELECT VALORACION_CUESTIONARIO AS valor, COUNT(*) AS cantidad
        FROM participacion p
        JOIN version_cuestionario v ON p.ID_VERSION = v.ID_VERSION
        JOIN cuestionario q ON v.ID_CUESTIONARIO = q.ID_CUESTIONARIO
        WHERE q.ID_USUARIO = ?
        AND VALORACION_CUESTIONARIO IS NOT NULL
        GROUP BY VALORACION_CUESTIONARIO
        ORDER BY valor
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idUsuario]);
    $data['creados']['valoraciones'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Cantidad de respuestas por cuestionario
    $sql = "
        SELECT q.NOMBRE_CUESTIONARIO, COUNT(r.ID_RESPUESTA) AS total_respuestas
        FROM cuestionario q
        JOIN version_cuestionario v ON q.ID_CUESTIONARIO = v.ID_CUESTIONARIO
        JOIN participacion p ON v.ID_VERSION = p.ID_VERSION
        JOIN respuesta r ON p.ID_PARTICIPACION = r.ID_PARTICIPACION
        WHERE q.ID_USUARIO = ?
        GROUP BY q.ID_CUESTIONARIO
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idUsuario]);
    $data['creados']['respuestas'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
}



echo json_encode($data);
exit;

?>