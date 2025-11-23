<?php
if(session_status() === PHP_SESSION_NONE){
  session_start();
}
  // Verificar si el usuario inició sesión
  if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../Login/login.php");
    exit;
  }
?>
<!-- navbar -->
  <nav class="navbar sticky-top bg-body-tertiary navbar-cuestionarios" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Tukii</a>
      <div class="dropdown-center ms-auto">
        <button class="navbar-dropdown-btn" type="button" data-bs-toggle="dropdown">
          <img src="<?=$_SESSION['foto_perfil']?>" alt="imagen usuario" class="navbar_usuario" id="navbarImg">
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><span class="dropdown-item-text" id="navbarName"><?=$_SESSION['nombre']?></span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="../EditarUsuario/editarUsuario.php">Editar usuario</a></li>
          <!-- link a pantalla administrador si estan en una carpeta ../administrador/administrador.html
          A su pantalla ponganle # y class active -->
          <li><a class="dropdown-item active" href="../administrador/administrador.php">Panel de administrador</a></li>
          <li><a class="dropdown-item" href="../participante/participante.php">Panel de participante</a></li>
          <li><a class="dropdown-item" href="../Estadisticas/estadisticas.php">Ver estadísticas</a></li>
          <li><a class="dropdown-item" href="../Registro/logout.php">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>