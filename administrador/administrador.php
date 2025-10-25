<?php
    session_start();

    require('../BaseDeDatos/conexion.php');

    $_SESSION['idUsuario'] = 1; // PARA TESTEAR

    $usuario = null;
    
    //obtener datos usuario
    try {
      if(!isset($_SESSION['idUsuario'])){
          throw new Exception('Usuario no autenticado');
      }
      $idUsuario = $_SESSION['idUsuario'];
      $stmt = $conn->prepare("
        SELECT nombre, email, avatar
        FROM usuario
        WHERE id = :idUsuario
      ");
      $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
      $stmt->execute();
      $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php
      require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="./administrador.css">
    <title>Administrador</title>
</head>
<body>
  <?php
    require('../includesPHP/navGeneral.php');
  ?>
  <div class="container mt-3">
    <!--header -->
    <div class="row">
        <div class="col-12 col-md-6 my-3">
            <form id="formId" class="needs-validation" novalidate>
                <div class="input-group input-group-lg">
                  <button class="input-group-text icon_container c_orange button_search" id="basic-addon1"><i class="bi bi-search"></i></button>
                  <input type="text" id="nombreCuest" class="form-control border_cuest" placeholder="Buscar cuestionario" maxlength="50" required>
                  <div class="invalid-feedback" id="nameInvalid">
                    Ingresa un nombre de cuestionario no mayor a 50 caracteres
                  </div>
                </div>
            </form>
        </div>
    </div>
    <!--cuerpo -->
    <div class="row my-3">
      <div class="col-12 col-md-6 align-self-start">
        <div class="card border_cuest bg_cuest my-3">
          <!-- Usuario -->
          <div class="card-body row">
            <div class="col-3 align-self-center">
              <img src="<?php 
                if($usuario['avatar']){echo $usuario['avatar'];} 
                else { echo 'https://i.pinimg.com/1200x/99/54/b9/9954b9690260d251ad2f5358514ab747.jpg';}
              ?>" alt="imagen usuario" class="img_usuario" id="img_usuario">
            </div>
            <div class="col-9 align-self-center">
              <h2 class="mb-0" id="name_usuario">
                <?php 
                  if($usuario['nombre']) {
                    echo $usuario['nombre'];
                  } else {
                    echo "";
                  }
                ?>
              </h2>
            </div> 
          </div> 
        </div>

        <!-- Cuestionarios -->
        <div class="card border_cuest card_orange my-2" id="contenedor_cuestionarios">
          <div class="card-body">
            <div id="lista_cuestionarios"></div>
            <div class="d-flex justify-content-center">
              <button class="button_mas card_orange border_cuest py-2 px-3 d-none" id="mas_cuestionarios">Ver más</button>
            </div>
          </div>
        </div>

      </div>
      <div class="col-12 col-md-6 align-self-start">
        <h2>PLANTILLAS</h2>
        <!-- Plantillas -->
        <div class="card border_cuest card_yellow my-2">
          <div class="card-body">
            <div id="lista_plantillas"></div>
            <div class="d-flex justify-content-center">
              <button class="button_mas card_yellow border_cuest py-2 px-3 d-none" id="mas_plantillas">Ver más</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- botones -->
    <div class="row my-3">
      <div class="col 12 col-md-6 d-flex my-2">
        <button class="button_principal border_cuest py-2" id="button_crear">Crear cuestionario</button>
      </div>
      <div class="col-12 col-md-6 d-flex my-2">
        <button class="button_principal border_cuest py-2" id="button_unirme">Unirme a cuestionario</button>
      </div>
    </div>

    <!-- cuestionarios encontrados -->
    <div>
      <h2 class="text-center" id="list_title"></h2>
      <div id="listado_total"></div>
    </div>
  </div>

  <!-- modal compartir -->
   <div class="modal" tabindex="-1" id="modalCompartir">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitulo"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <p class="text-center">Copia y comparte el enlace</p>
              <br>
              <h2 class="text-center modal_enlace" id="enlace"></h2>
            <p></p>
          </div>
        </div>
      </div>
    </div>

</body>
<script src="./administrador.js"></script>
</html>