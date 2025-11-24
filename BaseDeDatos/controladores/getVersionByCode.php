<?php
    session_start();
    require('../conexion.php');
    header('Content-Type: application/json');

    try {
        if (!isset($_GET['codigo'])) {
            throw new Exception('Código inválido.');
        }
        $codigoVersion = (int) $_GET['codigo'];
        if (isset($_GET['invitado']) && $_GET['invitado'] === 'true') {
            //fijar en session que es invitado
            $_SESSION['es_invitado'] = true;
        }

        //versión + cuestionario + categoría
        $stmtVersion = $conn->prepare("
            SELECT 
                c.*,
                v.ID_VERSION,
                v.COD_ACCESO,
                v.TIEMPO_TOTAL,
                v.DESCRIPCION,
                v.ACTIVO,
                v.IMAGEN,
                cat.NOMBRE AS CATEGORIA_NOMBRE,
                COALESCE((SELECT COUNT(*) FROM pregunta p WHERE p.ID_VERSION = v.ID_VERSION), 0) AS cantidad_preguntas,
                COALESCE((SELECT AVG(pa.VALORACION_CUESTIONARIO) 
                    FROM participacion pa 
                    WHERE pa.ID_VERSION = v.ID_VERSION 
                    AND pa.VALORACION_CUESTIONARIO > 0), 0) AS promedio_calificacion
            FROM version_cuestionario v
            INNER JOIN cuestionario c ON c.ID_CUESTIONARIO = v.ID_CUESTIONARIO
            INNER JOIN categoria cat ON c.ID_CATEGORIA = cat.ID_CATEGORIA
            WHERE v.COD_ACCESO = :codVersion
        ");
        $stmtVersion->bindParam(':codVersion', $codigoVersion, PDO::PARAM_INT);
        $stmtVersion->execute();
        $cuestionario = $stmtVersion->fetch(PDO::FETCH_ASSOC);

        if (!$cuestionario) {
            throw new Exception('No se ha encontrado el cuestionario.');
        }

        //preguntas
        $stmtPreguntas = $conn->prepare("
            SELECT 
                p.ID_PREGUNTA,
                tp.TIPO AS tipo_pregunta,
                p.NRO_ORDEN,
                p.ENUNCIADO,
                p.IMAGEN
            FROM pregunta p
            INNER JOIN tipo_pregunta tp ON p.ID_TIPO_PREGUNTA = tp.ID_TIPO_PREGUNTA
            WHERE p.ID_VERSION = :idVersion
            ORDER BY p.NRO_ORDEN
        ");
        $stmtPreguntas->bindParam(':idVersion', $cuestionario['ID_VERSION'], PDO::PARAM_INT);
        $stmtPreguntas->execute();
        $preguntas = $stmtPreguntas->fetchAll(PDO::FETCH_ASSOC);

        //opciones para cada pregunta
        $stmtOpciones = $conn->prepare("
            SELECT 
                ID_OPCION,
                TEXTO,
                IMAGEN,
                ES_CORRECTA
            FROM opcion
            WHERE ID_PREGUNTA = :idPregunta
        ");

        foreach ($preguntas as &$pregunta) {
            $stmtOpciones->bindParam(':idPregunta', $pregunta['ID_PREGUNTA'], PDO::PARAM_INT);
            $stmtOpciones->execute();
            $pregunta['opciones'] = $stmtOpciones->fetchAll(PDO::FETCH_ASSOC);
        }

        // 4. Agregar preguntas al cuestionario
        $cuestionario['preguntas'] = $preguntas;

        echo json_encode(["status" => "success", "data" => $cuestionario]);

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