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
    require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');

    $idUsuario = $_SESSION['usuario_id'];

    //verificar permisos
    if (!Permisos::tieneAlgunPermiso([
        'ver_estadisticas_cuestionario',
        'ver_estadisticas_participacion'
    ], $idUsuario)) {
        //verifico roles para redirigir si no tiene permisos
        $esAdministrador = Permisos::esRol('Administrador', $idUsuario);
        $esParticipante = Permisos::esRol('Participante', $idUsuario);
        $esModerador = Permisos::esRol('Moderador', $idUsuario);
        if ($esAdministrador) {
            header("Location: ../administrador/administrador.php");
            exit;
        } elseif ($esModerador) {
            header("Location: ../moderador/moderador.php");
            exit;
        } elseif ($esParticipante) {
            header("Location: ../participante/participante.php");
            exit;
        } else {
            header("Location: ../Inicio/inicio.php");
            exit;
        }
    }
    $ver_estadisticas_cuestionario = Permisos::tienePermiso('ver_estadisticas_cuestionario', $idUsuario);
    $ver_estadisticas_participacion = Permisos::tienePermiso('ver_estadisticas_participacion', $idUsuario);
    ?>
    <div class="container mt-4">
        <?php if ($ver_estadisticas_participacion): ?>
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
        <?php endif; ?>
        <?php if ($ver_estadisticas_cuestionario): ?>
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
        <?php endif; ?>
    </div>
</body>

</html>