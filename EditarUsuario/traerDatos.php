<?php 
session_start();

require("conexion.php");


//verifico si inicio sesion
if(!isset($_SESSION["usuario_id"])){
    header("Location: ../login/login.php");
    exit;
}

try{
    $id=$_SESSION["usuario_id"];
    $sql="SELECT NOMBRE,EMAIL,FECHA_NACIMIENTO, FOTO_PERFIL FROM usuario WHERE ID_USUARIO = :id";
    $stmt =$conn->prepare($sql);
    $stmt -> bindParam(":id", $id, PDO::PARAM_INT);
    $stmt->execute();
    $datosUsuario= $stmt->fetch(PDO::FETCH_ASSOC);

    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($datosUsuario);

}catch(PDOException $e){
    echo"error al traer los datos: " . $e->getMessage();
}

?>