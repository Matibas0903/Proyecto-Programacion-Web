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
    <div  class="container-fluid">
        <div class="row">
            <div id="panelIzq" class="col-3 p-3 vh-100">
                <h4 class="fw-bold">Jugadores</h4>
                <div class="rounded shadow overflow-hidden">
                    <table id="tablaUsuarios" class="table table-bordered table-hover table-striped table-sm align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Posicion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        
    

        <!--Contenedor principal-->
            <div class="col-9 d-flex flex-column justify-content-center align-items-center vh-100">
                <div>
                    <button class="btn" id="btnIniciarCuestionario">Iniciar cuestionario</button>
                </div>
                <div>
                    <button class="btn" id="btnSalirLobby">Salir</button>
                </div>
                <div id="tituloCuestionario">
                    <h3>Cuestionario de Historia</h3>
                </div>
            </div>
        </div>
    </div>
</body>
</html>