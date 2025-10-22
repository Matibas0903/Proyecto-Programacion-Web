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
        <div class="row">
            <div class="col-12 col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Estadisticas de cuestionarios completados</h5>
                    </div>
                    <div class="card-body">
                        <div>
                            <h6>Promedio de respuestas correctas</h6>
                            <p><b>65.7%</b></p>
                        </div>
                        <div>
                            <h6>Cantidad de cuestionario resueltos</h6>
                            <p><b>25</b></p>
                        </div>
                        <div>
                            <h6>Categorias con mas respuestas correctas</h6>
                            <p><b>Geografia</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-6 mt-3">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Estadisticas de cuestionarios creados</h5>
                    </div>
                    <div class="card-body">
                        <div>
                            <h6 class="card-title">Cantidad de respuestas</h5>
                            <canvas id="graficoCantRespuestas"></canvas>
                        </div>
                        <div>
                            <h6 class="card-title">Cantidad de usuarios</h5>
                            <canvas id="graficoCantUsuarios"></canvas>
                        </div>
                        <div>
                            <h6 class="card-title">Valoracion promedio</h5>
                            <canvas id="graficoValoracion"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>