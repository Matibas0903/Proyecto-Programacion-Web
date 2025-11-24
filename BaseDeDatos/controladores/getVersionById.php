<?php
    session_start();
    require('../conexion.php');
    header('Content-Type: application/json');

    try {
        $esParticipante = false;
        if (isset($_GET['jugador']) && $_GET['jugador'] === 'true') {
            $esParticipante = true;
        }
        if (!isset($_GET['version'])) {
            throw new Exception('ID de versión inválido.');
        }
        $idVersion = (int) $_GET['version'];

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
            WHERE v.ID_VERSION = :idVersion
        ");
        $stmtVersion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtVersion->execute();
        $cuestionario = $stmtVersion->fetch(PDO::FETCH_ASSOC);

        if (!$cuestionario) {
            throw new Exception('No se ha encontrado la versión.');
        }
        //verificamos que participante no sea administrador o moderador
        if ($esParticipante) {
            if (!isset($_SESSION['usuario_id'])) {
                throw new Exception('Usuario no autenticado');
            }
            $idUsuario = (int) $_SESSION['usuario_id'];

            if((int)$cuestionario['ID_USUARIO'] === $idUsuario || (int)$cuestionario['ID_MODERADOR'] === $idUsuario){
                throw new Exception('Acceso denegado para administradores y moderadores');
            }
        }

        //verificar si es un cuestionario privado si el usuario posee invitacion
        if($cuestionario['VISIBILIDAD'] === 'Privado'){
            if (!isset($_SESSION['usuario_id'])) {
                throw new Exception('Usuario no autenticado');
            }
            $idUsuario = (int) $_SESSION['usuario_id'];
            $stmtInvitacion = $conn->prepare("
                SELECT COUNT(*) AS cantidad
                FROM invitacion
                WHERE ID_VERSION = :idVersion AND ID_USUARIO = :idUsuario
                AND ESTADO = 'Pendiente'
                AND DATE(FECHA_VENCIMIENTO) >= CURDATE()
            ");
                
            $stmtInvitacion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
            $stmtInvitacion->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
            $stmtInvitacion->execute();
            $invitacionData = $stmtInvitacion->fetch(PDO::FETCH_ASSOC);
            if ($invitacionData['cantidad'] == 0) {
                throw new Exception('Acceso denegado. No posee invitación para el cuestionario');
            }
        }

        //preguntas
        $stmtPreguntas = $conn->prepare("
            SELECT 
                p.ID_PREGUNTA,
                p.NRO_ORDEN,
                p.ENUNCIADO,
                p.IMAGEN
            FROM pregunta p
            WHERE p.ID_VERSION = :idVersion
            ORDER BY p.NRO_ORDEN
        ");
        $stmtPreguntas->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
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