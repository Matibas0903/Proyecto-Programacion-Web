<!DOCTYPE html>
<html lang="en">
<head>
    <?php
      require('../includesPHP/head.php');
    ?>
    <link rel="stylesheet" href="./participante.css">
    <title>Participante</title>
</head>
<body>
  <?php
    require('../includesPHP/navGeneral.php');
  ?>
  <div class="container mt-3">
    <!--header -->
    <div class="row my-3">
        <div class="col-12 col-md-6">
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
        <div class="col 12 col-md-6">
            <div class="d-flex justify-content-center m-1">
                <button class="button_principal border_cuest py-2" id="button_todos">Mostrar todos</button>
            </div>
            <div class="d-flex justify-content-center m-1">
                <button class="button_principal border_cuest" id="button-moderador"><i class="bi bi-incognito"></i> Moderar</button>
            </div>
        </div>
    </div>
    <!-- todos los cuestionarios -->
    <div class="row my-3">
        <div class="col-12 align-self-start">
          <div class="card border_cuest bg_cuest my-3">
            <!-- Usuario -->
            <div class="card-body row">
              <form action="" class="row g-2" id="form_filtros">
                <div class="col-12 col-md-4">
                  <select class="form-select border_select" id="select-categoria">
                    <option value="" selected>Categoría</option>
                  </select>
                </div>
                <div class="col-12 col-md-4">
                  <select class="form-select border_select" id="select-calificacion">
                    <option value="" selected>Calificación</option>
                    <option value="0" class="rating">☆☆☆☆☆</option>
                    <option value="1" class="rating">★☆☆☆☆</option>
                    <option value="2" class="rating">★★☆☆☆</option>
                    <option value="3" class="rating">★★★☆☆</option>
                    <option value="4" class="rating">★★★★☆</option>
                    <option value="5" class="rating">★★★★★</option>
                  </select>
                </div>
                <div class="col-12 col-md-4 d-flex justify-content-center">
                  <button type="submit" class="button_principal border_cuest py-2" id="button_filtrar"><i class="bi bi-list"></i> Filtrar</button>
                </div>
                <p class="text-danger text-center d-none" id="filtro-error"><i class="bi bi-exclamation-circle-fill"></i> No se han seleccionado filtros</p>
              </form>
            </div> 
          </div>
        </div>
        <!-- Cuestionarios -->
        <div class="card border_cuest card_orange my-2 d-none" id="contenedor_cuest_invitado">
          <div class="card-body">
            <h2 class="text-center">Te han invitado a participar a ...</h2>
            <div id="lista_cuest_invitado" class="row g-4 justify-content-center">
            </div>
          </div>
        </div>
    </div>

    <!-- cuestionarios encontrados -->
    <div class="container">
      <h2 class="text-center" id="list_title">Cuestionarios</h2>
      <div id="listado_total" class="row g-4 justify-content-center"></div>
      <div id="paginador" class="d-flex justify-content-center align-items-center mt-3"></div>
    </div>
 
  </div>

  <?php
    include('../mensajeError/mensajeError.php');
  ?>

</body>
<script src="./participante.js"></script>
</html>