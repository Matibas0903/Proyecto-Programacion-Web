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
        <!-- Contador -->
        <div id="contador" class="contador d-none"></div>

        <!-- Preguntas -->
        <div class="card-preguntas d-none">
            <div class="text-center pregunta">
                <h5 class="fw-bold mb-2">Pregunta 1</h5>
                <p>¿En qué año comenzó la Segunda Guerra Mundial?</p>
            </div>

            <div class="row g-3 mt-3">
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">1914</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">1939</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">1945</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">1929</button></div>
            </div>
        </div>

        <div class="card-preguntas d-none">
            <div class="text-center pregunta">
                <h5 class="fw-bold mb-2">Pregunta 2</h5>
                <p>¿Quién fue el líder del movimiento de independencia de la India contra el Imperio Británico?</p>
            </div>
            <div class="row g-3 mt-3">
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Mahatma Gandhi</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Nelson Mandela</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Simón Bolívar</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Martin Luther King Jr.</button></div>
            </div>
        </div>

        <div class="card-preguntas d-none">
            <div class="pregunta text-center">
                <p>La caída del Imperio Romano de Occidente se considera generalmente en:</p>
                <h5 class="fw-bold mb-2">Pregunta 3</h5>
            </div>
            <div class="row g-3 mt-3">
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">476 d.C.</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">1453 d.C.</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">1492 d.C.</button></div>
                <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">395 d.C.</button></div>
            </div>
        </div>
    </div>
    </div>
</body>

</html>