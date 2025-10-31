<!DOCTYPE html>
<html lang="es">

<head>
  <?php
  require('../includesPHP/head.php');
  ?>
  <link rel="stylesheet" href="preguntasInvitado.css">
  <title>Preguntas</title>

  <script src="preguntasInvitado.js" defer></script>
</head>

<body>
  <?php
  require('../includesPHP/navInvitado.php');
  ?>

  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center">

    <!-- Input de nombre -->
    <div class="card cardEs w-card mb-4" id="micardNombre">
      <div class="card-body text-center">
        <input type="text" class="form-control mb-3 input-nombre" id="nombreIngresado" maxlength="10" placeholder="Ingrese un nombre">
        <div class="valid-feedback"></div>
        <div class="invalid-feedback"></div>
        <button type="button" class="btn mibtn w-100" id="btnJugar">Listo</button>
        <div class="mt-2 d-none" id="spinnerContainer">
          <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
          <span class="ms-2">Cargando...</span>
        </div>
      </div>
    </div>

    <!-- Contador -->
    <div id="contador" class="contador d-none"></div>

    <!-- Preguntas -->
    <div class="card-preguntas d-none">

      <div class="text-center pregunta">
        <h5 class="fw-bold mb-2">Pregunta 1</h5>
        <p>¿Cuál es el río más largo del mundo?</p>
      </div>

      <div class="row g-3 mt-3">
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Amazonas</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Nilo</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Yangtsé</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Misisipi</button></div>
      </div>

    </div>

    <div class="card-preguntas d-none">
      <div class="text-center pregunta">
        <p>¿Cuál es el país más grande del mundo en superficie?</p>
      </div>
      <div class="row g-3 mt-3">
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Canadá</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">China</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Rusia</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Estados Unidos</button></div>
      </div>

    </div>

    <div class="card-preguntas d-none">
      <div class="pregunta text-center">
        <p>¿En qué continente se encuentra el desierto del Sahara?</p>
      </div>
      <div class="row g-3 mt-3">
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Asia</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">África</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">América del Sur</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Australia</button></div>
      </div>

    </div>

    <div class="card-preguntas d-none">
      <div class="pregunta text-center">
        <p>¿Cuál es la capital de Australia?</p>
      </div>
      <div class="row g-3 mt-3">
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Sídney</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Melbourne</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Canberra</button></div>
        <div class="col-12 col-md-6"><button type="button" class="btn btnRespuestas w-100">Brisbane</button></div>
      </div>
    </div>

  </div>

  </div>

</body>

</html>