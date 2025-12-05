<?php
session_start();
require('../conexion.php');
require_once(__DIR__ . '/permisos.php');

header('Content-Type: application/json');

try {
    if(!Permisos::tienePermiso(['jugar_cuestionario'], $_SESSION['usuario_id'])){
            throw new Exception('No tienes permiso para jugar el cuestionario.');
    }
    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Usuario no autenticado');
    }

    $idUsuario = (int) $_SESSION['usuario_id'];
    $body = json_decode(file_get_contents('php://input'), true);

    if (!isset($body['idVersion']) || !isset($body['puntaje']) || !isset($body['respuestas'])) {
        throw new Exception('Datos incompletos.');
    }

    $idVersion = (int) $body['idVersion'];
    $puntaje = (int) $body['puntaje'];
    $respuestas = $body['respuestas'];

    $conn->beginTransaction();

    //Obtener información del cuestionario (visibilidad)
    $stmtCuestionario = $conn->prepare("
            SELECT c.VISIBILIDAD
            FROM version_cuestionario v
            INNER JOIN cuestionario c ON v.ID_CUESTIONARIO = c.ID_CUESTIONARIO
            WHERE v.ID_VERSION = :idVersion
        ");
    $stmtCuestionario->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
    $stmtCuestionario->execute();
    $cuestionario = $stmtCuestionario->fetch(PDO::FETCH_ASSOC);

    if (!$cuestionario) {
        throw new Exception('Cuestionario no encontrado.');
    }

    //Verificamos si es privado y si tiene invitación pendiente
    if ($cuestionario['VISIBILIDAD'] === 'Privado') {
        $stmtInvitacion = $conn->prepare("
                SELECT ID_INVITACION
                FROM invitacion
                WHERE ID_VERSION = :idVersion 
                    AND ID_USUARIO = :idUsuario
                    AND ESTADO = 'Pendiente'
                    AND DATE(FECHA_VENCIMIENTO) >= CURDATE()
                LIMIT 1
            ");

        $stmtInvitacion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtInvitacion->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmtInvitacion->execute();
        $invitacion = $stmtInvitacion->fetch(PDO::FETCH_ASSOC);

        if (!$invitacion) {
            throw new Exception('Acceso denegado. No posee invitación válida para este cuestionario.');
        }

        //Cambiamos estado de invitación
        $stmtActualizarInvitacion = $conn->prepare("
                UPDATE invitacion 
                SET ESTADO = 'Aceptada'
                WHERE ID_INVITACION = :idInvitacion
            ");
        $stmtActualizarInvitacion->bindParam(':idInvitacion', $invitacion['ID_INVITACION'], PDO::PARAM_INT);
        $stmtActualizarInvitacion->execute();
    }
    //Verificamos si tiene invitación pendiente
    if(isset($body['invitacion']) && $body['invitacion'] === 'true'){
        $stmtInvitacionC = $conn->prepare("
                SELECT ID_INVITACION
                FROM invitacion
                WHERE ID_VERSION = :idVersion 
                    AND ID_USUARIO = :idUsuario
                    AND ESTADO = 'Pendiente'
                    AND DATE(FECHA_VENCIMIENTO) >= CURDATE()
                LIMIT 1
            ");

        $stmtInvitacionC->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
        $stmtInvitacionC->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmtInvitacionC->execute();
        $invitacionC = $stmtInvitacionC->fetch(PDO::FETCH_ASSOC);
        
        if ($invitacionC) {
            //Cambiamos estado de invitación
            $stmtActualizarInvitacionC = $conn->prepare("
                    UPDATE invitacion 
                    SET ESTADO = 'Aceptada'
                    WHERE ID_INVITACION = :idInvitacion
                ");
            $stmtActualizarInvitacionC->bindParam(':idInvitacion', $invitacionC['ID_INVITACION'], PDO::PARAM_INT);
            $stmtActualizarInvitacionC->execute();
        }
    }
    //Verificamos si el usuario ya participó en esta versión
    $stmtVerificar = $conn->prepare("
            SELECT ID_PARTICIPACION 
            FROM participacion 
            WHERE ID_USUARIO = :idUsuario AND ID_VERSION = :idVersion
        ");
    $stmtVerificar->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
    $stmtVerificar->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
    $stmtVerificar->execute();
    $participacionExistente = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

    if ($participacionExistente) {
        $idParticipacionAnterior = $participacionExistente['ID_PARTICIPACION'];

        // Eliminar respuestas anteriores
        $stmtEliminarRespuestas = $conn->prepare("
                DELETE FROM respuesta WHERE ID_PARTICIPACION = :idParticipacion
            ");
        $stmtEliminarRespuestas->bindParam(':idParticipacion', $idParticipacionAnterior, PDO::PARAM_INT);
        $stmtEliminarRespuestas->execute();

        // Eliminar participación anterior
        $stmtEliminarParticipacion = $conn->prepare("
                DELETE FROM participacion WHERE ID_PARTICIPACION = :idParticipacion
            ");
        $stmtEliminarParticipacion->bindParam(':idParticipacion', $idParticipacionAnterior, PDO::PARAM_INT);
        $stmtEliminarParticipacion->execute();
    }

    //Insertamos la nueva participación
    $stmtParticipacion = $conn->prepare("
            INSERT INTO participacion (ID_USUARIO, FECHA_PARTICIPACION, PUNTAJE, BANEADO, ID_VERSION, INVITADO)
            VALUES (:idUsuario, NOW(), :puntaje, 0, :idVersion, 0)
        ");
    $stmtParticipacion->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
    $stmtParticipacion->bindParam(':puntaje', $puntaje, PDO::PARAM_INT);
    $stmtParticipacion->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
    $stmtParticipacion->execute();

    $idParticipacion = $conn->lastInsertId();

    $stmtPreguntas = $conn->prepare("
        SELECT 
            p.ID_PREGUNTA,
            p.ID_TIPO_PREGUNTA,
            o.ID_OPCION,
            o.TEXTO AS TEXTO_CORRECTO,
            o.ES_CORRECTA
        FROM pregunta p
        LEFT JOIN opcion o ON o.ID_PREGUNTA = p.ID_PREGUNTA
        WHERE p.ID_VERSION = :idVersion
    ");
    $stmtPreguntas->bindParam(':idVersion', $idVersion, PDO::PARAM_INT);
    $stmtPreguntas->execute();
    $preguntasConOpciones = $stmtPreguntas->fetchAll(PDO::FETCH_ASSOC);

    $stmtRespuesta = $conn->prepare("
        INSERT INTO respuesta (ID_PARTICIPACION, ID_OPCION)
        VALUES (:idParticipacion, :idOpcion)
    ");

    $stmtRespuestaAbierta = $conn->prepare("
        INSERT INTO respuesta (ID_PARTICIPACION, ID_OPCION, TEXTO_RESPUESTA, ES_CORRECTA)
        VALUES (:idParticipacion, :idOpcion, :textoRespuesta, :esCorrecta)
    ");

    foreach ($respuestas as $respuesta) {
        if (is_array($respuesta) && isset($respuesta['idOpcion']) && isset($respuesta['textoRespuesta'])) {
            $idOpcion = (int) $respuesta['idOpcion'];
            $textoRespuesta = trim($respuesta['textoRespuesta']);
            
            // Buscar la respuesta correcta en las opciones
            $opcionCorrecta = null;
            foreach ($preguntasConOpciones as $po) {
                if ($po['ID_OPCION'] == $idOpcion) {
                    $opcionCorrecta = $po;
                    break;
                }
            }
            
            if ($opcionCorrecta) {
                $textoEsperado = mb_strtolower(trim($opcionCorrecta['TEXTO_CORRECTO']), 'UTF-8');
                $textoIngresado = mb_strtolower($textoRespuesta, 'UTF-8');
                
                $esCorrecta = ($textoEsperado === $textoIngresado) ? 1 : 0;
                
                // Insertar respuesta abierta con validación
                $stmtRespuestaAbierta->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
                $stmtRespuestaAbierta->bindParam(':idOpcion', $idOpcion, PDO::PARAM_INT);
                $stmtRespuestaAbierta->bindParam(':textoRespuesta', $textoRespuesta, PDO::PARAM_STR);
                $stmtRespuestaAbierta->bindParam(':esCorrecta', $esCorrecta, PDO::PARAM_INT);
                $stmtRespuestaAbierta->execute();
            }
        } 
        // ✅ CASO 2: Respuestas normales (Verdadero/Falso, única, múltiple)
        else {
            $idOpcion = (int) $respuesta;
            $stmtRespuesta->bindParam(':idParticipacion', $idParticipacion, PDO::PARAM_INT);
            $stmtRespuesta->bindParam(':idOpcion', $idOpcion, PDO::PARAM_INT);
            $stmtRespuesta->execute();
        }
    }

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "idParticipacion" => $idParticipacion
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Error de base de datos",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>