

<?php
session_start();
    require("../BaseDeDatos/conexion.php");
    require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');
    $idUsuario = $_SESSION['usuario_id'];
    //roles del usuario
    $esAdministrador = Permisos::esRol('Administrador', $idUsuario);
    $esParticipante = Permisos::esRol('Participante', $idUsuario);
    $esModerador = Permisos::esRol('Moderador', $idUsuario);
    if (!$esModerador) {
        if($esAdministrador){
            header("Location: ../administrador/administrador.php");
            exit;
        } else if ($esParticipante) {
            header("Location: ../participante/participante.php");
            exit;
        } else {
            header("Location: ../Inicio/inicio.php");
            exit;
        }
    }
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <?php
    require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="moderador.css">
    <script src="moderador.js" defer></script>
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

            <!-- Buscador -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card carta-acciones">
                        <div class="card-body">
                            <div class="row g-3 align-items-center">
                                <div class="col-md-6">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="Buscador">
                                            <i class="bi bi-search"></i>
                                        </span>
                                        <input type="text" class="form-control" id="inputBusqueda" placeholder="Buscar cuestionario por nombre">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grilla de cuestionarios (se carga dinámicamente desde JS) -->
            <div class="row" id="custionarios">
                <!-- Los cuestionarios se cargarán aquí dinámicamente -->
            </div>
        </div>

        <!-- Modal de Reportes -->
        <div class="modal fade" id="modalReportes" tabindex="-1" aria-labelledby="modalReportesLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalReportesLabel">Menú de Reportes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Por qué desea reportar este cuestionario?</p>
                        <div class="list-group" id="checkboxes">
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" value="Temas no apropiados" type="checkbox" id="chkNoApropiado">
                                    <label class="form-check-label" for="chkNoApropiado">
                                        Temas no apropiados.
                                    </label>
                                </div>
                            </label>
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" value="Contenido ofensivo o discriminatorio" type="checkbox" id="chkOfensivo">
                                    <label class="form-check-label" for="chkOfensivo">
                                        Contenido ofensivo o discriminatorio.
                                    </label>
                                </div>
                            </label>
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" value="Manipulacion o sesgo" type="checkbox" id="chkManipulacion">
                                    <label class="form-check-label" for="chkManipulacion">
                                        Manipulación o sesgo.
                                    </label>
                                </div>
                            </label>
                            <label class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" value="Violacion de privacidad" type="checkbox" id="chkPrivacidad">
                                    <label class="form-check-label" for="chkPrivacidad">
                                        Violación de privacidad
                                    </label>
                                </div>
                            </label>
                            <div class="invalid-feedback">Por favor, selecciona al menos un reporte.</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="btnReportar">Reportar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de detalles -->
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

        <!-- Modal Moderar Comentarios -->
        <div class="modal fade" id="modalModeracion" tabindex="-1" aria-labelledby="tituloModal" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloModal">Comentarios</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body" id="contenedorComentarios">
                        <!-- Los comentarios se insertarán aquí por JS -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>