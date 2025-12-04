<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
// Verificar si el usuario inició sesión
if (!isset($_SESSION['usuario_id'])) {
  header("Location: ../Login/login.php");
  exit;
}
require_once(__DIR__ . '/../BaseDeDatos/controladores/permisos.php');

$pantallaActual = pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME);
$idUsuario = $_SESSION['usuario_id'];

//roles del usuario
$esAdministrador = Permisos::esRol('Administrador', $idUsuario);
$esParticipante = Permisos::esRol('Participante', $idUsuario);
$esModerador = Permisos::esRol('Moderador', $idUsuario);

//permisos de estadísticas
$puedeVerEstadisticas = Permisos::tieneAlgunPermiso([
  'ver_estadisticas_cuestionario', 
  'ver_estadisticas_participacion'
], $idUsuario);
?>
<!-- navbar -->
<nav class="navbar sticky-top bg-body-tertiary navbar-cuestionarios" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="../Inicio/inicio.php">Tukii</a>
    <div class="dropdown-center ms-auto">
      <button class="navbar-dropdown-btn" type="button" data-bs-toggle="dropdown">
        <img src="<?= $_SESSION['foto_perfil'] ?>" alt="imagen usuario" class="navbar_usuario" id="navbarImg">
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><span class="dropdown-item-text" id="navbarName"><?= $_SESSION['nombre'] ?></span></li>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li>
          <a class="dropdown-item <?= $pantallaActual === 'editarUsuario'? 'active' : ''?>" href= <?= $pantallaActual === 'editarUsuario'? '#' : '"../EditarUsuario/editarUsuario.php"'?>>
            Editar usuario
          </a>
        </li>
        <?php if ($esAdministrador): ?>
        <li>
          <a class="dropdown-item <?= $pantallaActual === 'administrador'? 'active' : ''?>" href= <?= $pantallaActual === 'administrador'? '#' : '"../administrador/administrador.php"'?>>
            Panel de administrador
          </a>
        </li>
        <?php endif; ?>
        <?php if ($esParticipante): ?>
        <li>
          <a class="dropdown-item <?= $pantallaActual === 'participante'? 'active' : ''?>" href= <?= $pantallaActual === 'participante'? '#' : '"../participante/participante.php"'?>>
            Panel de participante
          </a>
        </li>
        <?php endif; ?>
        <?php if ($esModerador): ?>
        <li>
          <a class="dropdown-item <?= $pantallaActual === 'moderador'? 'active' : ''?>" href= <?= $pantallaActual === 'moderador'? '#' : '"../moderador/moderador.php"'?>>
            Panel de moderador
          </a>
        </li>
        <?php endif; ?>
        <?php if ($puedeVerEstadisticas): ?>
        <li>
          <a class="dropdown-item <?= $pantallaActual === 'estadisticas'? 'active' : ''?>" href= <?= $pantallaActual === 'estadisticas'? '#' : '"../Estadisticas/estadisticas.php"'?>>
            Ver estadísticas
          </a>
        </li>
        <?php endif; ?>
        <li>
          <a class="dropdown-item" href="../Registro/logout.php">
            Logout
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>