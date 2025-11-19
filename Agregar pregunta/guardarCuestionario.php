<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
//EPA ESTE ES NUEVO, NO?, SI!
require("../BaseDeDatos/conexion.php");
header("Content-Type: application/json");
$_SESSION["idVersion"];

/*try {

    echo json_encode(["success" => true, "message" => "Preguntas guardadas correctamente"]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}


// Obtengo los datos JSON
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);
//valido que esten seteados y no esten vacios
if (!isset($input['preguntas']) && !empty($input['preguntas'])) {
    echo json_encode(['message' => 'No se enviaron preguntas']);
    exit;
}
$preguntas = $data['preguntas'];
//en teoria se hacen los insert aca "EN TEORIA"!
try {
    foreach ($preguntas as $pregunta) {
        //obtengo el ID version

        // Insertar pregunta
        $stmt = $conn->prepare("INSERT INTO pregunta (ENUNCIADO, IMAGEN, ID_VERSION) VALUES (:enunciado, :imagen, :idVersion)");
        $stmt->bindValue(':enunciado', $pregunta['enunciado']);
        $stmt->bindValue(':imagen', $pregunta['imagen']);
        $stmt->bindValue(':idVersion', $idVersion);
        $stmt->execute();
        //guardo el idPregunta
        $idPregunta = $conn->lastInsertId();
        $mensaje = "Pregunta insertada";

        // Insertar opciones
        foreach ($pregunta['opciones'] as $opcion) {
            $stmtOpc = $conn->prepare("INSERT INTO opcion (ID_PREGUNTA, TEXTO, ES_CORRECTA) VALUES (:idPregunta, :texto, :esCorrecta)");
            $stmtOpc->bindValue(':idPregunta', $idPregunta);
            $stmtOpc->bindValue(':texto', $opcion['texto']);
            $stmtOpc->bindValue(':esCorrecta', $opcion['esCorrecta']);
            $stmtOpc->execute();
        }
        $mensaje = "Opciones insertadas";
    }
    //envia  mensaje de que esta todo bien (todavia no lo recibi)
    echo json_encode(['message' => 'Preguntas guardadas correctamente']);
} catch (PDOException $e) {
    //a este mensaje ya lo vi bastante
    echo json_encode(['message' => 'Error al guardar preguntas: ' . $e->getMessage()]);
}
*/
//Nose si conte bien pero creo que llevo casi 20 horas con esto de corrido :s
//ESTOY LOCO LALALALALA
// EH CREADO UN HIBRIDO DE UN MONO CON BRAZOS DE ESPADAS QUE CAGA BOMBAS ATOMICAS 
// Y PUSE A PRUEBA SU PACIENCIA MOLESTANDOLO CON UN PALO, ESPEREMOS QUE NO ESCAPE.
// ...
// ESCAPO! xd.

$nombre = $descripcion = $visibilidad = $cod_acceso = $activo =  $fecha_creacion = $calificacion = $idCustionario = $idVersion = $numVersion = $idCategoria =
    "";


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $visibilidad = trim($_POST["Visibilidad"] ?? "");
    $nombre = trim($_POST["nombreCuestionario"] ?? "");
    $idCategoria = trim($_POST["selectCategoria"] ?? "");
    $idUsuario = trim($_POST["usuario_id"] ?? "");

    $idCustionario = trim($conn->lastInsertId() ?? "");
    $descripcion = trim($_POST["txtDescripcion"] ?? "");
    //Asigno la fehca de HOY
    $fecha_creacion = trim(date("Y-m-d") ?? "");
    $cod_acceso = trim($_POST["codigoAcceso"] ?? "");
    $activo = trim($_POST['Activo']) ? 'Activo' : 'Inactivo';

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

    try {
        // Busco el NUM_VERSION mas alto de la tabla, si da null lo convierte en 0
        $stmt = $conn->prepare("SELECT COALESCE(MAX(NUM_VERSION), 0) AS ultimo_num FROM version_cuestionario WHERE ID_CUESTIONARIO = :id_cuestionario");
        $stmt->bindValue(':id_cuestionario', $idCustionario);
        $stmt->execute();
        $row = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Le sumo uno al NUM_VERSION para auto incrementar
        $numVersion = trim(($row['ultimo_num'] + 1) ?? "");
    } catch (PDOException $e) {
        echo "Error al obtener categorías: " . $e->getMessage();
    }

    //inserto los datos a Version_cuestionario
    $stmt = $conn->prepare("INSERT INTO version_cuestionario (DESCRIPCION, COD_ACCESO, ACTIVO, ID_CUESTIONARIO, FECHA_CREACION, NUM_VERSION) VALUES (:descripcion, :codAcceso, :activo, :id_cuestionario, :fecha_creacion, :num_version)");
    $stmt->bindValue(':activo', $activo);
    $stmt->bindValue(':descripcion', $descripcion);
    $stmt->bindValue(':codAcceso', $cod_acceso);
    $stmt->bindValue(':id_cuestionario', $idCustionario);
    $stmt->bindValue(':fecha_creacion', $fecha_creacion);
    $stmt->bindValue(':num_version', $numVersion);
    $stmt->execute();
    // Guardo el Id de la version creada
    $idVersion = trim($conn->lastInsertId() ?? "");

    $_SESSION["idVersion"] = $idVersion;

    echo json_encode([
        "status" => "success",
        "message" => "Cuestionario guardado.",
        "idVersion" => $idVersion
    ]);
}
