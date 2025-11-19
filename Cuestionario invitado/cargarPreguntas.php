<?php
require("../Login/conexion.php"); 

try {
    $sql = "SELECT 
                c.id AS id_cuestionario,
                c.nombre AS nombre_cuestionario,
                c.descripcion,
                p.id AS id_pregunta,
                p.enunciado,
                p.tipo,
                o.id AS id_opcion,
                o.texto AS texto_opcion,
                o.correcta
            FROM cuestionario c
            JOIN pregunta p ON c.id = p.id_cuestionario
            JOIN opcion o ON p.id = o.id_pregunta
            ORDER BY c.id, p.id, o.orden";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Enviar en formato JSON
    header('Content-Type: application/json');
    echo json_encode($resultados);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
