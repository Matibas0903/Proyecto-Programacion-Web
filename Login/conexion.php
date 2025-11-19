<?php

    //conectar base de datos 
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dataBase ="proyecto_prog_web";

    try {
    $conn = new PDO("mysql:host=$servername;dbname=proyecto_prog_web", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "SE CONECTO";
    } catch(PDOException $e) {
    echo "Error de coneccion: " . $e->getMessage();
    }

?>