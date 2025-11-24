<?php
    session_start();
    require('../conexion.php');
    header('Content-Type: application/json');

    try {
        if (!isset($_GET['nombre'])) {
            throw new Exception('Nombre no proporcionado.');
        }

        $nombreInvitado = trim($_GET['nombre']);

        if (empty($nombreInvitado)) {
            throw new Exception('El nombre del invitado no puede estar vacío.');
        }

        // Verificar si ya existe ese nombre de invitado
        $stmtVerificar = $conn->prepare("
            SELECT COUNT(*) AS cantidad
            FROM participacion
            WHERE NOMBRE_INVITADO = :nombreInvitado
                AND INVITADO = 1
        ");
        $stmtVerificar->bindParam(':nombreInvitado', $nombreInvitado, PDO::PARAM_STR);
        $stmtVerificar->execute();
        $resultado = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

        if ($resultado['cantidad'] > 0) {
            echo json_encode([
                "status" => "error",
                "disponible" => false,
                "message" => "Este nombre ya fue utilizado."
            ]);
        } else {
            echo json_encode([
                "status" => "success",
                "disponible" => true,
                "message" => "Nombre disponible."
            ]);
        }

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