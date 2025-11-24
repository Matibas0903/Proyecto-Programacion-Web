<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="./jugarPlantilla.css">
    <script src="jugarPlantilla.js" defer></script>
    <title>Jugar plantilla</title>
</head>

<body>
    <?php
    require('../includesPHP/navGeneral.php');
    ?>
    <!-- Juego -->
    <div id="contenedor-juego">
        <div id="cronometro" class="cronometro d-none"></div>
        <!-- Contador -->
        <div id="contador" class="contador d-none"></div>
    </div>
    </div>

    <?php
      include('../mensajeError/mensajeError.php');
    ?>
</body>

</html>