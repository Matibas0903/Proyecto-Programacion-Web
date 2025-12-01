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
        $errores["inputTitulo"] = "El título no puede estar vacío";
    } else {
        $data["titulo"] = htmlspecialchars($titulo);
    }

    // --- Validación: Descripción (opcional) ---
    $data["descripcion"] = htmlspecialchars($descripcion);

    // --- Validación: Código de acceso ---
    if ($visibilidad === "Privado" && empty($cod_acceso)) {
        $errores["inputCodigoAcceso"] = "Un cuestionario privado necesita un código de acceso";
    } else {
        $data["cod_acceso"] = htmlspecialchars($cod_acceso);
    }

    // --- Validación: Categoría ---
    if (empty($categoria)) {
        $errores["selectCategoria"] = "Debe seleccionar una categoría";
    } else {
        $data["categoria"] = htmlspecialchars($categoria);
    }

    // --- Validación: Tipo de Pregunta ---
    if (empty($tipoPregunta)) {
        $errores["selectTipoPregunta"] = "Seleccione un tipo de pregunta";
    } else {
        if ($tipoPregunta !== "2") {
            $errores["selectTipoPregunta"] = "Ese tipo de pregunta no esta disponible en esta version";
        }
        $data["tipoPregunta"] = htmlspecialchars($tipoPregunta);
    }

    if (!preg_match("/^\d{6,10}$/", $cod_acceso)) {
        $errores["codigoAcceso"] = "El codigo debe tener 6 digitos";
    }


    // --- Validación: Codigo de Acceso---
    if (!preg_match("/^\d{6,10}$/", $cod_acceso)) {
        $errores["codigoAcceso"] = "El codigo debe tener 6 digitos";
    }

    // --- Validacion: Visibilidad ---

    if (empty($visibilidad)) {
        $errores["radioPrivado"] = "";
        $errores["radiopublico"] = "Seleccione una visibilidad";
    } else {
        $data["visibilidad"] = htmlspecialchars($visibilidad);
    }

    // --- Validación: Estado ---

    $data["activo"] = htmlspecialchars($activo);


    // --- Si hay errores, devolverlos y salir ---
    if (!empty($errores)) {
        echo json_encode([
            "status" => "error",
            "errors" => $errores
        ]);
        exit;
    } else

        // --- Si no hay errores, devolver datos limpios ---
        echo json_encode([
            "status" => "ok",
            "message" => "Validación correcta",
            "data" => $data
        ]);
    exit;
}
