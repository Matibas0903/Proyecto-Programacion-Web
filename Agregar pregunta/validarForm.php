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
    $visibilidad  = trim($_POST["Visibilidad"] ?? "");
    $activo       = trim($_POST["estado"] ?? "");



    // --- Validación: Título ---
    if (empty($titulo)) {
        $errores["inputTitulo"] = "El título no puede estar vacío";
    } else {
        $data["titulo"] = htmlspecialchars($titulo);
    }

    // --- Validacion: Descripcion (opcional) ---
    $data["descripcion"] = htmlspecialchars($descripcion);

    // --- Validacion: Código de acceso ---
    if ($visibilidad === "Privado" && empty($cod_acceso)) {
        $errores["inputCodigoAcceso"] = "Un cuestionario privado necesita un código de acceso";
    } else {
        $data["cod_acceso"] = htmlspecialchars($cod_acceso);
    }

    // --- Validacion: Categoria ---
    if (empty($categoria)) {
        $errores["selectCategoria"] = "Debe seleccionar una categoría";
    } else {
        $data["categoria"] = htmlspecialchars($categoria);
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

    // --- Validacion: Estado ---

    $data["activo"] = htmlspecialchars($activo);

    // --- Validacion: Plantilla ---

    $data["plantilla"] = htmlspecialchars($plantilla);


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
