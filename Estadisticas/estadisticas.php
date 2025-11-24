<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="estadisticas.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="estadisticas.js" defer></script>
    <title>Estadisticas</title>
</head>

<body>
    <?php
    require('../includesPHP/navGeneral.php');
    ?>
    <div class="container mt-4">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Estadisticas de cuestionarios completados</h5>
                    </div>
                    <div class="card-body">
                        <div>
                            <h6>Promedio de respuestas correctas</h6>
                            <p><b id="promedioCorrectas">%</b></p>
                        </div>
                        <div>
                            <h6>Cantidad de cuestionario resueltos</h6>
                            <p><b id="cantidadCuestionarios"></b></p>
                        </div>
                        <div>
                            <h6>Categorias con mas respuestas correctas</h6>
                            <p><b id="categoria"></b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Estadisticas de cuestionarios creados</h5>
                    </div>
                    <div class="card-body text-center">
                        <div class="mb-4">
                            <h5 class="card-title">Cantidad de respuestas</h5>
                                <canvas id="graficoCantRespuestas"></canvas>
                        </div>
                        <div class="mb-4">
                            <h5 class="card-title">Cantidad de usuarios</h5>
                                <canvas id="graficoCantUsuarios"></canvas>
                        </div>
                        <div class="mb-4">
                            <h5 class="card-title">Valoracion promedio</h5>
                                <canvas id="graficoValoracion"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>