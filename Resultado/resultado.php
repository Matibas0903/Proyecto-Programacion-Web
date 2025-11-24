<!DOCTYPE html>
<html lang="es">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="resultado.css">
    <script src="resultado.js" defer></script>
    <title>Resultados del cuestionario</title>
</head>

<body>

    <?php
        session_start();
        $invitado = isset($_GET['invitado']) && $_GET['invitado'] === 'true';
        if($invitado){
            require('../includesPHP/navInvitado.php');
        } else {
            require('../includesPHP/navGeneral.php');
        }
    ?>

    <div class="container micontainer mt-5">
        <div class="row align-items-center" id="contenedorDatos">
            <div class="col-12 col-md-6 imagen" id="imgUsuario">
                <img id="usuarioAvatar" alt="Usuario" class="img-fluid mx-auto d-block">
                <p id="usuarioNombre" class="fw-bold mb-0"></p>

            </div>

            <div class="col-12 col-md-6 " id="res">
                <h2>Resultados</h2>
                <div class="mb-2 p-2" id="respuestaC">Respuestas correctas: <span id="respCorrectas">-</span></div>
                <div class="mb-3 p-2" id="Puntuacion">Puntuación total: <span id="respPuntuacion">-</span></div>

                <div class="calificar">
                    <p class="fw-semibold mb-0">Calificar Cuestionario:</p>
                    <div id="selectEstrellas" class="fs-1">
                        <span class="estrella" data-value="1">&#9733;</span>
                        <span class="estrella" data-value="2">&#9733;</span>
                        <span class="estrella" data-value="3">&#9733;</span>
                        <span class="estrella" data-value="4">&#9733;</span>
                        <span class="estrella" data-value="5">&#9733;</span>
                    </div>
                    <div>
                        <button class="btn" id="btnCalificar">Calificar</button>
                    </div>
                    <p id="mensaje" class="mt-2 fw-semibold miMensaje"></p>
                    <p class="text-danger d-none" id="menErr">Seleccione por lo menos una estrella</p>

                </div>
            </div>
        </div>
    </div>

    </div>
    </div>


    <!--nav pills del menu-->
    <div class="container micontainer mb-3">
        <ul class="nav nav-pills justify-content-center" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="pill" href="#comentarios">Comentarios</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-bs-toggle="pill" href="#ranking">Ver Ranking</a>
            </li>
        </ul>

        <div class="tab-content">
            <div id="comentarios" class="container tab-pane active"><br>
                <div class="row justify-content-center">
                    <div class="col-12 col-md-8 MiComentario">
                        <div class="mb-3">
                            <textarea class="form-control" id="comentario" rows="3" placeholder="Escribe un comentario..." maxlength="500"></textarea>
                            <div class="invalid-feedback">Escriba un comentario...</div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <button class="btn fw-semibold mb-3" id="btnComentar">Comentar</button>
                            <button class="btn fw-semibold mb-3" id="btnSalir">Volver</button>
                        </div>

                    </div>
                </div>
            </div>
            <!--Ver ranking, ejemplo-->


            <div id="ranking" class="container tab-pane fade"><br>
                <div class="container py-5">
                    <h2 class="text-center mb-4">🏆 Ranking de Participantes 🏆</h2>
                    <div id="rankingCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                        <div class="carousel-inner" id="carouselRankingBody">
                            <!-- Se carga dinámicamente -->
                        </div>

                        <!-- Controles -->
                        <button class="carousel-control-prev" type="button" data-bs-target="#rankingCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#rankingCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                    <div id="puestoParticipante"></div>
                    <p id="sinRankingResultado" class="text-center d-none">No hay participantes en el ranking</p>
                </div>
            </div>

        </div>
    </div>

    <?php
        include('../mensajeError/mensajeError.php');
    ?>
</body>

</html>