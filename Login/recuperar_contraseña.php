<?php
require("../BaseDeDatos/conexion.php");

$respuesta = ['success' => false, 'mensaje' => ''];

if (!empty($_POST['correo'])) {
    $correo = strtolower(trim($_POST['correo']));
    
    $stmt = $conn->prepare("SELECT * FROM usuario WHERE email = :correo");
    $stmt->execute([':correo' => $correo]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        // Simulación de envío de correo
        $respuesta['success'] = true;
        $respuesta['mensaje'] = "Correo enviado correctamente a $correo";
    } else {
        $respuesta['mensaje'] = "Correo no registrado.";
    }
}

echo json_encode($respuesta);
?>