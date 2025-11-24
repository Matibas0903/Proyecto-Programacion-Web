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
                    <input type="number" class="form-control mb-3" id="codigoIngresado" max="9999999999" placeholder="Código de juego">
                    <div class="valid-feedback"></div>
                    <div class="invalid-feedback"></div>
                    <button type="button" class="btn mibtn" id="btingresar">Ingresar</button>
                    <div class="mt-2 d-none" id="spinnerContainer">
                    <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                        <span class="ms-2">Cargando...</span>
                    </div>
                </div>
            </div>
     </div>

 </div>
</body>
</html>