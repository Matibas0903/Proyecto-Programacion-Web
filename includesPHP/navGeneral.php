<!-- navbar -->
  <nav class="navbar sticky-top bg-body-tertiary navbar-cuestionarios" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Nombre web</a>
      <div class="dropdown-center ms-auto">
        <button class="navbar-dropdown-btn" type="button" data-bs-toggle="dropdown">
          <img src="./images/perrito-avatar.jpg" alt="imagen usuario" class="navbar_usuario" id="navbarImg">
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><span class="dropdown-item-text" id="navbarName">Usuario Prueba</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="../EditarUsuario/editarUsuario.html">Editar usuario</a></li>
          <!-- link a pantalla administrador si estan en una carpeta ../administrador/administrador.html
          A su pantalla ponganle # y class active -->
          <li><a class="dropdown-item active" href="#">Panel de administrador</a></li>
          <li><a class="dropdown-item" href="../participante/participante.html">Panel de participante</a></li>
          <li><a class="dropdown-item" href="../Estadisticas/estadisticas.html">Ver estadísticas</a></li>
          <li><a class="dropdown-item" href="../Inicio/inicio.html">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>