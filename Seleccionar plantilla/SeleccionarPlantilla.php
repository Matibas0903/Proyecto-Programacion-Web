<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$idUsuario = $_SESSION["usuario_id"];
require("../BaseDeDatos/conexion.php");


$idVersion = $_GET['id_version'] ?? null;

try {
    // Consultar las categorias
    $stmt = $conn->prepare("SELECT ID_CATEGORIA, NOMBRE FROM categoria ORDER BY NOMBRE ASC");
    $stmt->execute();

    // Guardar los resultados
    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error al obtener categorías: " . $e->getMessage();
}


try {
    // Consultar los tipos de preguntas
    $stmt = $conn->prepare("SELECT ID_TIPO_PREGUNTA, TIPO FROM tipo_pregunta");
    $stmt->execute();

    // Guardar los resultados
    $tipoPreguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error al obtener el tipo de preguntas: " . $e->getMessage();
}



?>

<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="SeleccionarPlantilla.css">
    <script src="SeleccionarPlantilla.js" defer></script>
    <title> Seleccionar Plantilla </title>
</head>

<body data-idversion="<?= $idVersion ?>">
    <?php
    require('../includesPHP/navGeneral.php');

    include('../mensajeError/mensajeError.php')
    ?>

    <!-- navbar crear cuestionario -->
    <nav id="navBarCrearPreg" class="navbar navbar-expand-md">
        <div class="container-fluid">
            <a class="navbar-brand" href="#" id="tituloCuestionario">Cuestionario</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- Izquierda: Configuracion -->
                <ul class="navbar-nav me-auto">
                    <li class="nav-item mb-2">
                        <button id="btnConfig" class="btn btn-outline-secondary nav-link" type="button">
                            Configuración
                        </button>
                    </li>
                </ul>

                <!-- Derecha: Temas, Guardar, Salir -->
                <ul class="navbar-nav">
                    <li class="nav-item mb-2">
                        <button id="btnTemas" class="btn btn-outline-primary nav-link me-3" type="button">
                            <i class="bi bi-palette-fill"></i> Temas
                        </button>
                    </li>
                    <li class="nav-item d-none d-md-inline">
                        <span class="navbar-text me-3">|</span>
                    </li>
                    <li class="nav-item mb-2">
                        <button id="btnGuardar" class="btn btn-primary nav-link me-3" type="button">Guardar</button>
                    </li>
                    <li class="nav-item mb-2">
                        <button id="btnSalir" class="btn btn-secondary nav-link" type="button">Salir</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!--Barra lateral izquierda-->
    <div class="container-fluid">
        <div class="row">

            <!-- PANEL IZQUIERDO -->
            <div id="panelIzq" class="col-12 col-md-4 col-lg-2 p-3 border-end vh-100">
                <h6 class="fw-bold">1 Quiz</h6>
                <div class="border rounded p-2 mb-3" id="divPreguntas">

                </div>
                <button id="btnAñadirPregunta" class="btn w-100 mb-2">
                    <i class="bi bi-plus-square"></i> Añadir pregunta
                </button>
            </div>

            <!-- AREA PRINCIPAL -->
            <!--Le puse lo del responsive aca y en la del panel izquierdo-->
            <div class="col-12 col-md-8 col-lg-10 p-4 position-relative" id="panelPrincipal">

                <!--Estos dos div no lo estas utilizando y por eso hay una linea horizontal arriba del card de las preguntas :(
                 no lo quiero sacar por si las moscas
                <div class="container mt-4">
                    <div class="card mb-4">-->


                <!-- Opciones en 2x2 -->
                <div id="btnsOpciones" class="row g-3">


                </div>
            </div>
        </div>

        <!-- PANEL DERECHO -->
        <div id="panelDer" class="col-12 col-md-4 col-lg-3 p-3 vh-100">

            <i class="bi bi-stopwatch-fill"></i>
            Tiempo de respuesta
            </h5>
            <div class="mb-5">
                <select class="form-select" name="selectTiempoRespuesta" id="selectTiempoRespuesta">
                    <option class="dropdown-item" value>Tiempo de respuesta</option>
                    <option class="dropdown-item" value="1">Ilimitado</option>
                    <option class="dropdown-item" value="1" disabled>10 segundos(Proximamente)</option>
                    <option class="dropdown-item" value="2" disabled>15 segundos(Proximamente)</option>
                    <option class="dropdown-item" value="3" disabled>20 segundos(Proximamente)</option>
                </select>
            </div>

            <h5>
                <i class="bi bi-question-square-fill"></i>
                Tipo de pregunta
            </h5>
            <div class="mb-5">
                <select class="form-select" name="selectTipoPregunta" id="selectTipoPregunta">
                    <option class="dropdown-item" value>Tipo de pregunta</option>
                    <?php //llenar el select
                    foreach ($tipoPreguntas as $cat): ?>
                        <option value="<?= htmlspecialchars($cat['ID_TIPO_PREGUNTA']) ?>">
                            <?= htmlspecialchars($cat['TIPO']) ?>

                        </option>
                    <?php endforeach;
                    ?>
                </select>
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <button id="btnPanelDer"><i class="bi bi-caret-left-fill"></i></button>

        <div id="panelTemas" class="col-3 p-2 border-start vh-100 ">
            <div class="contenedor-temas">
                <div><button id="btnCerrarTemas" type="button" class="btn-close"></button></div>
                <div class="d-flex"></div>
                <div class="row">
                    <h5>Temas</h5>
                    <div>
                        <img id="tema1" src="./Recursos/temaHistoria.jpg" width="100" height="100" type="button">
                        <img id="tema2" src="./Recursos/temaHistoria2.jpg" width="100" height="100" type="button">
                        <div id="tema3" width="100" height="100" type="button"></div>

                    </div>
                </div>
            </div>
        </div>
        <!-- Modal Salir-->
    </div>
    <div class="modal" id="modalSalirSinGuardar" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Atención!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>¿Está seguro que desea salir sin guardar?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" id="btnSalirSinGuardar" class="btn btn-secondary" data-bs-dismiss="modal">Salir sin guardar</button>
                    <button type="button" id="btnGuardarYSalir" class="btn btn-primary">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Modal Configuracion -->
    <div class="modal" id="modalConfiguracion">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">

                <!-- config Header -->
                <div class="modal-header">
                    <h4 class="modal-title"><i class="bi bi-gear"></i> Configuracion</h4>
                    <div class="ms-auto">
                        <button type="button" class="btn btn-danger m-2" data-bs-dismiss="modal">Close</button>
                    </div>

                </div>

                <!-- config body -->
                <div class="modal-body">
                    <form method="POST" id="cuestionarioData" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                        <div class="d-flex flex-column flex-lg-row justify-content-center gap-3">
                            <div class="container mt-4">
                                <div class="row">
                                    <div class="card flex-fill w-100 w-lg-50 mb-3 mb-lg-0">
                                        <div class="card-body p-4">
                                            <div class="d-flex flex-column">

                                                <div class="mb-5">
                                                    <label for="lblTitulo" class="fw-bold fs-5 form-label">Titulo</label>
                                                    <label for="inputTitulo" id="lblTitulo" class="subtitulo form-label">Escriba un titulo para su custionario</label>
                                                    <input type="text" id="inputTitulo" name="nombreCuestionario" class="form-control needs-validation">
                                                    <div class="invalid-feedback"></div>
                                                </div>

                                                <label for="lblDescripcion" id="lblTituloDescripcion" class="fw-bold fs-5 form-label">Descripcion</label>
                                                <label for="lblTituloDescripcion" class="opcional fs-6 form-label"> (Opcional)</label>
                                                <label for="descripcion" class="subtitulo form-label" id="lblDescripcion">Escribe una breve descripcion</label>
                                                <textarea id="descripcion" name="txtDescripcion" class="form-textarea" maxlength="300" rows="3"></textarea>
                                                <div class="invalid-feedback"></div>

                                                <div class="mb-5">
                                                    <label for="inputCodigoAcceso" id="lblCodigoAcceso" class="subtitulo form-label">Ingrese un codigo para acceder al cuestionario</label>
                                                    <input type="text" id="inputCodigoAcceso" name="codigoAcceso" class="form-control needs-validation">
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                                <div class="mb-5">
                                                    <label for="selectCategoria" class="fw-bold fs-5 form-label">Categoria del cuestionario</label>
                                                    <select name="selectCategoria" id="selectCategoria" class="form-select">
                                                        <option value="">Seleccionar categoría</option>

                                                        <?php //llenar el select
                                                        foreach ($categorias as $cat): ?>
                                                            <option value="<?= htmlspecialchars($cat['ID_CATEGORIA']) ?>">
                                                                <?= htmlspecialchars($cat['NOMBRE']) ?>

                                                            </option>
                                                        <?php endforeach;
                                                        ?>
                                                    </select>
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="card flex-fill w-10 0 w-lg-50 mb-3 mb-lg-0">
                                        <div class="card-body p-4">
                                            <div class="d-flex flex-column">
                                                <div class="mb-5">
                                                    <label for="lblVisibilidad" id="lblVisivilidad" class="fw-bold fs-5 form-label">Visibilidad</label><br>
                                                    <label for="radios" class="subtitulo form-label" id="lblDescripVisibilidad">Elige quien tiene acceso</label><br>

                                                    <div class="form-check d-flex align-items-center mb-4">
                                                        <input type="radio" class="form-check-input" name="Visibilidad" value="privado" id="radioPrivado">
                                                        <label for="radioPrivado" class="form-check-label fw-bold ms-2">Privado</label>
                                                        <span class="subtitulo ms-3">(solo tendrán acceso con link)</span>
                                                    </div>

                                                    <div class="form-check d-flex align-items-center mb-4">
                                                        <input type="radio" class="form-check-input" name="Visibilidad" value="publico" id="radiopublico" checked>
                                                        <label for="radiopublico" class="form-check-label fw-bold ms-2">Público</label>
                                                        <span class="subtitulo ms-3">(Cualquiera puede acceder)</span>
                                                    </div>
                                                    <div class="invalid-feedback"></div>
                                                </div>
                                                <div class="form-check form-switch mb-5">
                                                    <label class="fw-bold fs-6 form-check-label" for="SwitchEstado">Activar Cuestionario</label>
                                                    <input class="form-check-input" type="checkbox" role="switch" id="SwitchEstado" name="estado" value="Activo" checked>
                                                    <div class="invalid-feedback"></div>

                                                </div>
                                                <div class="form-check form-switch mb-5">
                                                    <label class="fw-bold fs-6 form-check-label" for="SwitchPlantilla">Habilitar como plantilla</label>
                                                    <input class="form-check-input" type="checkbox" role="switch" id="SwitchPlantilla" name="plantilla" value="1" checked>
                                                    <div class="invalid-feedback"></div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

            </div>


</body>

</html>