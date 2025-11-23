<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");


$nombre = $descripcion = $visibilidad = $cod_acceso = $activo =  $fecha_creacion = $calificacion = $idCustionario = $idVersion = $numVersion = $idCategoria =
    "";


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $visibilidad = trim($_POST["Visibilidad"] ?? "");
    $nombre = trim($_POST["nombreCuestionario"] ?? "");
    $idCategoria = trim($_POST["selectCategoria"] ?? "");
    $idUsuario = $_SESSION["usuario_id"];

    $idCustionario = trim($conn->lastInsertId() ?? "");
    $descripcion = trim($_POST["txtDescripcion"] ?? "");
    //Asigno la fehca de HOY
    $fecha_creacion = trim(date("Y-m-d") ?? "");
    $cod_acceso = trim($_POST["codigoAcceso"] ?? "");
    $activo = trim($_POST["estado"]);
    $plantilla       = trim($_POST["plantilla"] ?? "");

    //borro los otros que estan abajo?



    //tabla Cuestionario
    if (empty($_POST["nombreCuestionario"])) {
        $nombreError = "Ingrese nombre";
    } else {
        $nombre = htmlspecialchars($_POST["nombreCuestionario"]);

        if (!preg_match("/^[a-zA-Z ]+$/", $nombre)) {
            $nombreError = "Solo se permiten letras y espacios";
        }
    }

    if (isset($_POST["Visibilidad"]) && !empty($_POST["Visibilidad"])) {
        $visibilidad = htmlspecialchars($_POST["Visibilidad"]);
    } else {

        $visibilidad = "Privado"; // valor por defecto si no se selecciona nada
    }

    if (isset($_POST["selectCategoria"]) && !empty($_POST["selectCategoria"])) {
        $idCategoria = htmlspecialchars($_POST["selectCategoria"]);
    }

    //inserto en cuestionario el nombre y la visibilidad
    $stmt = $conn->prepare("INSERT INTO cuestionario (NOMBRE_CUESTIONARIO, VISIBILIDAD, ID_CATEGORIA, ID_USUARIO) VALUES (:nombre, :visibilidad, :id_categoria, :id_usuario)");
    $stmt->bindValue(':visibilidad', $visibilidad);
    $stmt->bindValue(':nombre', $nombre);
    $stmt->bindValue(':id_categoria', $idCategoria, PDO::PARAM_INT);
    $stmt->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
    $stmt->execute();

    //Guardo ID_Cuestionario
    $idCustionario = trim($conn->lastInsertId());

    //tabla version_cuestionario

    if (!empty($_POST["txtDescripcion"]) && $descripcion < 300) {
        $descripcion = htmlspecialchars($_POST["txtDescripcion"]);
    } else {
        $descripcionErr = "La descripcion puede tener tan solo 300 caracteres";
    }



    //si el custionario es privado le exijo un codigo de acceso sino no
    if (!empty($_POST["codigoAcceso"]) && $visibilidad != "Privado") {
        if ($cod_acceso > 20) {
            $codAccesoErr = "El codigo no debe ser mayor a 20 caracteres";
        }
        $cod_acceso = $_POST["codigoAcceso"];
    } else {

        $codAccesoErr = "Proporcione un codigo de acceso para los participantes";
    }
    $activo = isset($_POST['Activo']) ? 'Activo' : 'Inactivo';

    $plantilla = isset($_POST["plantilla"]) ? 1 : 0;

    try {
        // Busco el NUM_VERSION mas alto de la tabla, si da null lo convierte en 0
        $stmt = $conn->prepare("SELECT COALESCE(MAX(NUM_VERSION), 0) AS ultimo_num FROM version_cuestionario WHERE ID_CUESTIONARIO = :id_cuestionario");
        $stmt->bindValue(':id_cuestionario', $idCustionario);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Le sumo uno al NUM_VERSION para auto incrementar
        $numVersion = ($row['ultimo_num'] ?? 0) + 1;
    } catch (PDOException $e) {
        echo "Error al obtener categorías: " . $e->getMessage();
    }

    //inserto los datos a Version_cuestionario
    $stmt = $conn->prepare("INSERT INTO version_cuestionario (DESCRIPCION, COD_ACCESO, ACTIVO, ID_CUESTIONARIO, FECHA_CREACION, NUM_VERSION, PLANTILLA) VALUES (:descripcion, :codAcceso, :activo, :id_cuestionario, :fecha_creacion, :num_version, :plantilla)");
    $stmt->bindValue(':activo', $activo);
    $stmt->bindValue(':descripcion', $descripcion);
    $stmt->bindValue(':codAcceso', $cod_acceso);
    $stmt->bindValue(':id_cuestionario', $idCustionario);
    $stmt->bindValue(':fecha_creacion', $fecha_creacion);
    $stmt->bindValue(':num_version', $numVersion);
    $stmt->bindValue(':plantilla', $plantilla);
    $stmt->execute();
    // Guardo el Id de la version creada
    $idVersion = $conn->lastInsertId();

    $_SESSION["idVersion"] = $idVersion;

    echo json_encode([
        "status" => "success",
        "message" => "Cuestionario guardado.",
        "idVersion" => $idVersion
    ]);
}
