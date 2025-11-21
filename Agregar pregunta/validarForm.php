<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$idUsuario = $_SESSION["usuario_id"];

require("../BaseDeDatos/conexion.php");

header("Content-Type: application/json; charset=utf-8");

//validaciones
$titulo = $descripcion = $cod_acceso = $categoria = $tipoPregunta = $visibilidad = $activo = "";
$tituloErr = $descripcionErr = $cod_accesoErr = $categoriaErr = $tipoPreguntaErr = $visibilidadErr = $activoErr = "";


if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $titulo = trim($_POST["nombreCuestionario"]);
    $descripcion = trim($_POST["txtDescripcion"]);
    $cod_acceso = trim($_POST["codigoAcceso"]);
    $categoria = trim($_POST["selectCategoria"]);
    $tipoPregunta = trim($_POST["selectTipoPregunta"]);
    $visibilidad = trim($_POST["Visibilidad"]);
    $activo = trim($_POST["estado"]);

    //valido titulo
    if (empty($titulo)) {
        $tituloErr = "El titulo no puede estar vacio";
    } else {
        $titulo = htmlspecialchars($_POST["nombreCuestionario"]);
    }

    //valido descripcion
    if (!empty($descripcion)) {
        $descripcion = htmlspecialchars($_POST["txtDescripcion"]);
    }
    //valido el codigo de acceso
    if ($visibilidad === "Privado" && empty($cod_acceso)) {
        $cod_accesoErr = "Un cuestionario privado NECESITA un codigo de acceso";
    }

    if (empty($categoria)) {
        $categoriaErr = "Por favor elija una categoria para su cuestionario";
    } else {
        $categoria = htmlspecialchars($_POST["selectCategoria"]);
    }

    if (empty($tipoPregunta)) {
        $tipoPreguntaErr = "Seleccione el tipo de Pregunta para su cuestionario";
    } else {
        $tipoPregunta = htmlspecialchars($_POST["selectTipoPregunta"]);
        if ($tipoPregunta === "Verdadero o Falso") {
            $tipoPreguntaErr = "La Opcion de verdadero o falso aun no esta disponible en esta version";
        }
    }
}
//falta armar el json respuesta correcta y error

/* Forma mas Limpia
<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$idUsuario = $_SESSION["usuario_id"] ?? null;

require("../BaseDeDatos/conexion.php");

header("Content-Type: application/json; charset=utf-8");

$errores = [];
$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // --- Captura y trim de datos ---
    $titulo       = trim($_POST["nombreCuestionario"] ?? "");
    $descripcion  = trim($_POST["txtDescripcion"] ?? "");
    $cod_acceso   = trim($_POST["codigoAcceso"] ?? "");
    $categoria    = trim($_POST["selectCategoria"] ?? "");
    $tipoPregunta = trim($_POST["selectTipoPregunta"] ?? "");
    $visibilidad  = trim($_POST["Visibilidad"] ?? "");
    $activo       = trim($_POST["estado"] ?? "");

    // --- Validación: Título ---
    if (empty($titulo)) {
        $errores["titulo"] = "El título no puede estar vacío";
    } else {
        $data["titulo"] = htmlspecialchars($titulo);
    }

    // --- Validación: Descripción (opcional) ---
    $data["descripcion"] = htmlspecialchars($descripcion);

    // --- Validación: Código de acceso ---
    if ($visibilidad === "Privado" && empty($cod_acceso)) {
        $errores["cod_acceso"] = "Un cuestionario privado necesita un código de acceso";
    } else {
        $data["cod_acceso"] = htmlspecialchars($cod_acceso);
    }

    // --- Validación: Categoría ---
    if (empty($categoria)) {
        $errores["categoria"] = "Debe seleccionar una categoría";
    } else {
        $data["categoria"] = htmlspecialchars($categoria);
    }

    // --- Validación: Tipo de Pregunta ---
    if (empty($tipoPregunta)) {
        $errores["tipoPregunta"] = "Seleccione un tipo de pregunta";
    } else {
        if ($tipoPregunta === "Verdadero o Falso") {
            $errores["tipoPregunta"] = "Verdadero/Falso aún no está disponible";
        }
        $data["tipoPregunta"] = htmlspecialchars($tipoPregunta);
    }

    // --- Validación: Visibilidad ---
    if (empty($visibilidad)) {
        $errores["visibilidad"] = "Seleccione una visibilidad";
    } else {
        $data["visibilidad"] = htmlspecialchars($visibilidad);
    }

    // --- Validación: Estado ---
    if ($activo !== "0" && $activo !== "1") {
        $errores["activo"] = "Estado inválido";
    } else {
        $data["activo"] = htmlspecialchars($activo);
    }

    // --- Si hay errores, devolverlos y salir ---
    if (!empty($errores)) {
        echo json_encode([
            "status" => "error",
            "errors" => $errores
        ]);
        exit;
    }

    // --- Si no hay errores, devolver datos limpios ---
    echo json_encode([
        "status" => "ok",
        "message" => "Validación correcta",
        "data" => $data
    ]);
    exit;
}

// Si no es POST, error general
echo json_encode([
    "status" => "error",
    "errors" => ["general" => "Método no permitido"]
]);
exit;
?>
