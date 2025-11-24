<?php
header("Content-Type: application/json");
require("../BaseDeDatos/conexion.php");

$version = $_GET["version"] ?? 0;

if ($version == 0) {
    echo json_encode(["error" => "Falta la versión"]);
    exit;
}

$sqlRanking = $conn->prepare("
    SELECT 
        u.ID_USUARIO,
        u.NOMBRE,
        u.FOTO_PERFIL,
        p.PUNTAJE,
        (
            SELECT COUNT(*)
            FROM respuesta r
            JOIN opcion o ON r.ID_OPCION = o.ID_OPCION
            WHERE r.ID_PARTICIPACION = p.ID_PARTICIPACION
              AND o.ES_CORRECTA = 1
        ) AS respuestas_correctas
    FROM participacion p
    JOIN usuario u ON p.ID_USUARIO = u.ID_USUARIO
    WHERE p.ID_VERSION = ?
    ORDER BY p.PUNTAJE DESC
");
$sqlRanking->execute([$version]);
$ranking = $sqlRanking->fetchAll(PDO::FETCH_ASSOC);

$sqlComentarios = $conn->prepare("
    SELECT 
        u.NOMBRE,
        p.VALORACION_CUESTIONARIO AS valoracion,
        p.COMENTARIO,
        p.FECHA_PARTICIPACION AS fecha
    FROM participacion p
    JOIN usuario u ON p.ID_USUARIO = u.ID_USUARIO
    WHERE p.ID_VERSION = ?
      AND p.COMENTARIO IS NOT NULL
      AND p.COMENTARIO <> ''
    ORDER BY p.FECHA_PARTICIPACION DESC
");
$sqlComentarios->execute([$version]);
$comentarios = $sqlComentarios->fetchAll(PDO::FETCH_ASSOC);


echo json_encode([
    "ranking" => $ranking,
    "comentarios" => $comentarios
]);

?>