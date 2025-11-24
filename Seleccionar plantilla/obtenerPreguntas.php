<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    //EPA ESTE ES NUEVO, NO?, SI!
    require("../BaseDeDatos/conexion.php");
    header("Content-Type: application/json");

    $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            echo json_encode([
                "status" => "error",
                "message" => "No se recibió JSON válido."
            ]);
            exit;
        }

        //Obtenemos el id version, si no existe lo pasamos por sesion
    $idVersion = $input["idVersion"] ?? null;


        if (!$idVersion) {
            echo json_encode([
                "status" => "error",
                "message" => "No se recibió idVersion."
            ]);
            exit;
        }

        $stmtPreg = $conn->prepare("SELECT * FROM pregunta WHERE ID_VERSION = :id");
        $stmtPreg->bindValue(":id", $idVersion);
        $stmtPreg->execute();
        $preguntas = $stmtPreg->fetchAll(PDO::FETCH_ASSOC);

        foreach ($preguntas as &$preg) {
            $stmtOpt = $conn->prepare("SELECT TEXTO FROM opcion WHERE ID_PREGUNTA = :idPreg");
            $stmtOpt->bindValue(":idPreg", $preg["ID_PREGUNTA"]);
            $stmtOpt->execute();

            $preg["opciones"] = $stmtOpt->fetchAll(PDO::FETCH_COLUMN);
        }

        echo json_encode([
            "status" => "Ok",
            "message" => "Salio todo bien",
            "preguntas" => $preguntas
        ]);
        exit;
?>