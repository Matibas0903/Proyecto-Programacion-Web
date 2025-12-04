<?php

session_start();
 require("../Login/conexion.php");

 $codigoIngresado="";
 $codigoError=$mensaje="";


 if($_SERVER["REQUEST_METHOD"] == "POST")
 {
    if(empty($_POST["codigoIngresado"]))
    {
        $codigoError="Ingrese codigo.";
    }else{
        $codigoIngresado= trim($_POST["codigoIngresado"]);

        if(!is_numeric($codigoIngresado) || !preg_match("/^\d{6,10}$/",$codigoIngresado))
        {
            $codigoError="Ingrese un codigo Valido";
        }
        else
        {
            $sql = "SELECT num_version, id_cuestionario FROM version_cuestionario WHERE cod_acceso = :codigoIngresado";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":codigoIngresado", $codigoIngresado, PDO::PARAM_STR);
            $stmt->execute();

            // fetch() devuelve una sola fila o false si no hay resultado
            $fila = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($fila) {
                // Si encontró un cuestionario
                header("Location: ../Cuestionario invitado/preguntasInvitado.php");
                exit;
                }
                else
                {
                    $mensaje="No existe ningun cuestionatio con ese codigo.";
                }
        }
   }
 }

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <title>Codigo</title>
    <?php
    require('../includesPHP/head.php');
    ?>
    
    <link rel="stylesheet" href="codigo.css">
    <script src="codigo.js" defer></script>
</head>
<body>
    
   <div class="container vh-100 d-flex justify-content-center align-items-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-6">
            <div class="card cardEs" id="micard">
                <div class="card-body text-center">
                   <form action="<?= htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="POST" id="miform">
                       <input type="number" name="codigoIngresado" id="codigoIngresado" max="9999999999" placeholder="Código de juego"
                        class="form-control mb-3 <?= $codigoError ? 'is-invalid' : ($codigoIngresado ? '' :'')?>"
                        value="<?= htmlspecialchars($codigoIngresado)?>">
                        <div class="invalid-feedback"><?= $codigoError?></div>
                        <!--<div class="invalid-feedback"></div>-->
                        <button type="summit" class="btn mibtn" id="btingresar">Ingresar</button>
                        <div class="mt-2 d-none" id="spinnerContainer">
                        <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                             <span class="ms-2">Cargando...</span>
                        </div>
                         <div id="mensajeJS" class="alert alert-danger mt-2 <?= empty($mensaje) ? 'd-none' : '' ?>" role="alert">
                            <?= $mensaje ?>
                        </div>
                   </form>
                </div>
            </div>
     </div>

 </div>
</body>
</html>