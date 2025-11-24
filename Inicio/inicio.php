<!DOCTYPE html>
<html lang="es">
    <head>
        <?php
        require('../includesPHP/head.php');
        ?>
        <title>inicio</title>
    
        <link rel="stylesheet" href="inicio.css">
    </head>
    <body>  
         <div class="container">
            <div class="row g-4">
                <div class="col-12 col-lg-4">
                    <a href="../Codigo invitado/codigo.php" class="text-decoration-none text-dark">
                    <div class="card" id="miCard">
                        <img src="../inicio/img/4.png" class="card-img-top" alt="Invitado">
                        <div class="card-body">
                            <h5 class="card-title fw-bold  text-center">INVITADO</h5>
                         </div>
                    </div>
                    </a>
                </div>
                <div class="col-12  col-lg-4">
                    <a href="../Registro/registro.php" class="text-decoration-none text-dark">
                    <div class="card" id="miCard">
                        <img src="../inicio/img/3.png" class="card-img-top" alt="Invitado">
                        <div class="card-body">
                            <h5 class="card-title fw-bold  text-center">REGISTRARSE</h5>

                         </div>
                    </div>
                    </a>
                </div>
                <div class="col-12  col-lg-4">
                    <a href="../Login/login.php" class="text-decoration-none text-dark">
                    <div class="card" id="miCard">
                        <img src="../inicio/img/2.png" class="card-img-top" alt="Invitado">
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-center">INICIAR SESION</h5>
                         </div>
                    </div>
                    </a>
                </div>
            </div>
         </div>
        <?php
          include('../mensajeError/mensajeError.php');
        ?>
    </body>
    <script src="./inicio.js"></script>
</html>