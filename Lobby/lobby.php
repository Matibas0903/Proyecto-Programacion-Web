<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="lobby.css">
    <script src="lobby.js" defer></script>
    <title>Document</title>
</head>

<body>
    <?php
    require('../includesPHP/navGeneral.php');
    ?>
    <!--Barra lateral izquierda-->
    <div class="container-fluid">
        <div class="row flex-column-reverse flex-md-row">
            <div id="panelIzq" class="col-12 col-md-4 col-lg-3 p-3 min-vh-md-100">
                <div>
                    <p id="calificacionCuestionario" class="rating"></p>
                    <h4 class="fw-bold">Descripción</h4>
                    <p id="descripcionCuestionario"></p>
                </div>
                <h4 class="fw-bold">Ranking</h4>
                <div class="rounded shadow overflow-hidden">
                    <table id="tablaUsuarios" class="table table-bordered table-hover table-striped table-sm align-middle mb-0 d-none">
                        <thead class="table-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Posicion</th>
                            </tr>
                        </thead>
                        <tbody id="cuerpoRanking">
                            <!-- <tr>
                                <td>Marco</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>Mati</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>Val</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>Ara</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>Griselda</td>
                                <td>5</td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <p id="sinRanking" class="d-none">No disponible</p>
            </div>

            <!--Contenedor principal-->
            <div id="background_image" class="col-12 col-md-8 col-lg-9 d-flex flex-column justify-content-center align-items-center">
                <div class="mb-3">
                    <h3 id="tituloCuestionario" class="text-center"></h3>
                </div>
                <div class="d-flex gap-3">
                    <button class="btn" id="btnSalirLobby">Volver</button>
                    <button class="btn" id="btnIniciarCuestionario">Iniciar cuestionario</button>
                </div>
            </div>
        </div>
    </div>

    <?php
      include('../mensajeError/mensajeError.php');
    ?>
</body>

</html>