<!DOCTYPE html>
<html lang="es">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="moderador.css">
    <script src="morderador.js" defer></script>
    <title>Panel de Moderador - Mis Cuestionarios</title>
</head>

<body>
    <?php
    require('../includesPHP/navGeneral.php');
    ?>
    <!-- Contenido principal -->
    <div class="container-fluid main-content">
        <div class="row">
            <div class="col-12">
                <div class="header d-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-2">Panel de moderación</h1>
                        <p class="mb-0 text-muted">Seleccioná un cuestionario para moderar</p>
                    </div>
                </div>
            </div>

            <!-- Buscador y agregar cuestionario -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card carta-acciones">
                        <div class="card-body">
                            <div class="row g-3 align-items-center">
                                <div class="col-md-4">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="Buscador">
                                            <i class="bi bi-search"></i>
                                        </span>
                                        <input type="text" class="form-control" id="inputBusqueda" placeholder="Buscar cuestionario por nombre">
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <button class="btn btn-agregar" id="btnAgregarCuestionario">
                                        <i class="bi bi-plus-circle-fill"></i> Agregar cuestionario</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grilla de cuestionarios -->
            <div class="row" id="custionarios">
                <!-- Custionario de ejemplo 1 -->
                <div class="col-md-4 mb-4">
                    <div class="card carta-cuestionario h-100">
                        <div class="card-body">
                            <h5 class="card-title">Cuestionario de Historia</h5>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="bi bi-person-fill"></i> Admin: Enzo Cruz<br>
                                    <i class="bi bi-calendar-date"></i> Fecha: 15/10/2025<br>
                                    Jugadores: 15
                                </small>
                            </p>
                            <span class="state activo"> Activo</span>
                            <div class="rating">
                                <i class="bi bi-star-fill"></i>
                                Valoración: ★★★★☆
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-moderar" data-cuestionario="Historia">
                                    <i class="bi bi-incognito"></i>
                                    Moderar</button>
                                <button class="btn btn-detalles"
                                    data-titulo="Cuestionario de Historia"
                                    data-admin="Enzo Cruz"
                                    data-fecha="15/10/2025"
                                    data-jugadores="15"
                                    data-estado="Activo"
                                    data-valoracion="★★★★☆"
                                    data-descripcion="Cuestionario sobre historia general">
                                    <i class="bi bi-list-columns"></i>
                                    Detalles
                                </button>
                                <button class="btn btn-reportes">
                                    <i class="bi bi-exclamation-diamond-fill"></i>
                                    Reportar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Custionario de ejemplo 2 -->
                <div class="col-md-4 mb-4">
                    <div class="card carta-cuestionario h-100">
                        <div class="card-body">
                            <h5 class="card-title">Programacion</h5>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="bi bi-person-fill"></i> Admin: María López<br>
                                    <i class="bi bi-calendar-date"></i> Fecha: 20/09/2024<br>
                                    Jugadores: 8
                                </small>
                            </p>
                            <span class="state finalizado">Finalizado</span>
                            <div class="rating">
                                <i class="bi bi-star-fill"></i>
                                Valoración: ★★★☆☆
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-moderar" data-cuestionario="Programacion">
                                    <i class="bi bi-incognito"></i>
                                    Moderar</button>
                                <button class="btn btn-detalles"
                                    data-titulo="Programación"
                                    data-admin="María López"
                                    data-fecha="20/09/2024"
                                    data-jugadores="8"
                                    data-estado="Finalizado"
                                    data-valoracion="★★★☆☆"
                                    data-descripcion="Puede resolver problemas en javascript? Averiguemoslo!">
                                    <i class="bi bi-list-columns"></i>
                                    Detalles
                                </button>
                                <button class="btn btn-reportes">
                                    <i class="bi bi-exclamation-diamond-fill"></i>
                                    Reportar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Custionario de ejemplo 3 -->
                <div class="col-md-4 mb-4">
                    <div class="card carta-cuestionario h-100">
                        <div class="card-body">
                            <h5 class="card-title">Geografia</h5>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="bi bi-person-fill"></i> Admin: Juan Pérez<br>
                                    <i class="bi bi-calendar-date"></i> Próxima: 25/10/2024<br>
                                    Jugadores: 0
                                </small>
                            </p>
                            <span class="state esperando">Esperando</span>
                            <div class="rating">
                                <i class="bi bi-star-fill"></i>
                                Sin valoraciones
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-moderar" data-cuestionario="Geografia">
                                    <i class="bi bi-incognito"></i>
                                    Moderar</button>
                                <button class="btn btn-detalles"
                                    data-titulo="Geografía"
                                    data-admin="Juan Pérez"
                                    data-fecha="25/10/2024"
                                    data-jugadores="0"
                                    data-estado="Esperando"
                                    data-valoracion="Sin valoraciones"
                                    data-descripcion="Pon a prueba tus conocimientos del mundo!">
                                    <i class="bi bi-list-columns"></i>
                                    Detalles
                                </button>
                                <button class="btn btn-reportes">
                                    <i class="bi bi-exclamation-diamond-fill"></i>
                                    Reportar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Reportes -->
        <!-- Header del Modal-->
        <div class="modal fade" id="modalReportes" tabindex="-1" aria-labelledby="modalReportesLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalReportesLabel">Menú de Reportes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <!--Cuerpo del Modal-->
                    <div class="modal-body">
                        <p>Porque desea reportar este cuestionario?</p>
                        <div class="list-group" id="checkboxes">
                            <!-- Lista de checkboxes -->
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="ventas" id="chkNoApropiado">
                                    <label class="form-check-label" for="chkNoApropiado">
                                        Temas no apropiados.
                                    </label>
                                </div>
                            </label>
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="chkOfensivo">
                                    <label class="form-check-label" for="chkOfensivo">
                                        Contenido ofensivo o discriminatorio.
                                    </label>
                                </div>
                            </label>
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="chkManipulacion">
                                    <label class="form-check-label" for="chkManipulacion">
                                        Manipulacion o sesgo.
                                    </label>
                                </div>
                            </label>
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="chkPrivacidad">
                                    <label class="form-check-label" for="chkPrivacidad">
                                        Violacion de privacidad
                                    </label>
                                </div>
                            </label>
                            <div class="invalid-feedback">Por favor, selecciona al menos un reporte.</div>
                        </div>
                    </div>
                    <!--Footer del Modal-->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="btnReportar">Reportar</button>

                    </div>
                </div>
            </div>
        </div>
        <!--Modal Agregar Cuestionario -->
        <div class="modal fade" id="modalAgregarCuestionario" tabindex="-1" aria-labelledby="modalAgregarLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalAgregarLabel">Agregar Cuestionario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p>Ingrese el código del cuestionario que desea agregar:</p>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="bi bi-key"></i>
                            </span>
                            <input type="text" class="form-control" id="inputCodigo" placeholder="Ej: ABC123" maxlength="20">
                            <div class="invalid-feedback">Por favor, ingrese el código del cuestionario.</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnEnviarSolicitud">Enviar solicitud</button>
                    </div>
                </div>
            </div>
        </div>
        <!--Modal de detalles-->
        <div class="modal fade" id="modalDetalles" tabindex="-1" aria-labelledby="modalDetallesLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalDetallesLabel">Detalles del Cuestionario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Título:</strong> <span id="detalleTitulo"></span></p>
                        <p><strong>Estado:</strong> <span id="detalleEstado"></span></p>
                        <p><strong>Descripción:</strong> <span id="detalleDescripcion"></span></p>
                        <p><strong>Fecha de creación:</strong> <span id="detalleFecha"></span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!--Modal Moderar-->
        <!-- Modal -->
        <div class="modal fade" id="modalModeracion" tabindex="-1" aria-labelledby="tituloModal" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloModal">Comentarios</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    <div class="modal-body" id="contenedorComentarios">
                        <!-- Los comentarios se insertarán acá por JS -->
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>

                </div>
            </div>
        </div>




</body>

</html>