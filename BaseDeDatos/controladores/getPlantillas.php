<?php
    session_start();
    require('../conexion.php');

    header('Content-Type: application/json');

    //OBTENER ID USUARIO DE LA SESSION!!!!

    try {
        if(!isset($_SESSION['usuario_id'])){
            throw new Exception('Usuario no autenticado');
        }
        $idUsuario = $_SESSION['usuario_id'];

        $stmtP = $conn->prepare("
            SELECT c.*, v.num_version, v.activo, v.cod_acceso,
                CASE 
                    WHEN c.id_administrador = :idUsuario THEN 1 
                    ELSE 0 
                END AS isOwner
            FROM version_cuestionario v
            LEFT JOIN cuestionario c 
                ON c.id = v.id_cuestionario
            WHERE (c.id_administrador = :idUsuario)
                OR (v.plantilla = 1 AND C.visibilidad = 'publico')
            ORDER BY fecha_creacion DESC
        ");
        $stmtP->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $stmtP->execute();
        $plantillas = $stmtP->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>"success", "data"=>$plantillas]);


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