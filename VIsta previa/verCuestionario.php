<!DOCTYPE html>
<html lang="es">

<head>
   <title>Ver cuestionario</title>
  <?php
      require('../includesPHP/head.php');
    ?>
  <link rel="stylesheet" href="verCuestionario.css">
  <script src="verCuestionario.js" defer></script>
</head>
<body>
<?php
  require('../includesPHP/navGeneral.php');
?>

 <h1 class="mt-3">VISTA PREVIA DEL CUESTIONARIO</h1><br><br>

 <!--Preguntas y respuesta, repetir por x cantidad-->
<div class="container mt-4" id="contendedorPrincipal">
 <!--1-->
<div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 1</h5>
    <p class="card-text">¿En qué año comenzó la Segunda Guerra Mundial?</p>
  </div>
</div>

 <div class="row g-3">
  <div class=" col-12 col-md-6">
    <button class="btn respuesta-btn w-100">1935 </button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">1937 </button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">1941 </button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100" id="rtaCorrecta" >1939 </button>
  </div>
 </div><br>


 <!--2-->
<div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 2</h5>
    <p class="card-text">¿Qué país fue invadido por Alemania, dando inicio a la guerra?</p>
  </div>
</div>
 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100"id="rtaCorrecta" >Polonia</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Francia</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Belgica</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100" >Checoslovaquia</button>
  </div>
 </div><br>


<!--3-->
<div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 3</h5>
    <p class="card-text">¿Qué líderes formaban parte del Eje?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Roosevelt, Churchill y Stalin</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">De Gaulle, Roosevelt y Hirohito</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100" id="rtaCorrecta" >Hitler, Mussolini y Hirohito</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100"  >Franco, Stalin y Mussolini</button>
  </div>
 </div><br>

<!--4-->
<div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 4</h5>
    <p class="card-text">¿Qué país fue atacado por Japón el 7 de diciembre de 1941?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">China</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100"id="rtaCorrecta">Estados Unidos (Pearl Harbor)</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Corea</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100"  >Filipinas</button>
  </div>
 </div><br>

<!--5-->
<div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 5</h5>
    <p class="card-text">¿Cómo se llamó la operación de invasión alemana a la Unión Soviética?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Operación León Marino</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Operación Tifón</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Operación Market Garden</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100" id="rtaCorrecta" >Operación Barbarroja</button>
  </div>
 </div><br>

  <!--6-->
  <div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 6</h5>
    <p class="card-text">¿Qué evento marcó el final de la guerra en Europa?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100"id="rtaCorrecta">La rendición de Alemania en mayo de 1945</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">El lanzamiento de la bomba atómica</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">La invasión de Normandía</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100"  >La muerte de Mussolini</button>
  </div>
 </div><br>

<!--7-->
<div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 7</h5>
    <p class="card-text">¿Cuál fue el nombre del plan aliado para invadir Francia en 1944?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Operación Dragón</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Operación Overlord</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100" id="rtaCorrecta">Operación Overlord (Desembarco de Normandía)</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100" >Operación Torch</button>
  </div>
 </div><br>


  <!--8-->
  <div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 8</h5>
    <p class="card-text">¿Qué país sufrió el mayor número de bajas militares y civiles?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Alemania</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Japón</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Francia</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100" id="rtaCorrecta" >Unión Soviética</button>
  </div>
 </div><br>


  <!--9-->
  <div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 9</h5>
    <p class="card-text">¿Qué países formaban los Aliados principales?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100"id="rtaCorrecta">Reino Unido, Estados Unidos, Unión Soviética</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Alemania, Italia, Japón</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Francia, España, Portugal</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100">Canadá, México, Brasil</button>
  </div>
 </div><br>

  <!--10-->
  <div class="card pregunta-card mb-4">
  <div class="card-body text-center">
    <h5 class="card-title fw-bold">Pregunta 10</h5>
    <p class="card-text">¿En qué ciudades se lanzaron las bombas atómicas?</p>
  </div>
</div>

 <div class="row g-3">
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Osaka y Tokio</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100" id="rtaCorrecta">Hiroshima y Nagasaki</button>
  </div>
  <div class="col-12 col-md-6">
    <button class="btn respuesta-btn w-100">Kyoto y Yokohama</button>
  </div>
  <div class="col-12 col-md-6" >
    <button class="btn respuesta-btn w-100">Nagoya y Hiroshima</button>
  </div>


</div><br><br>


<!--Carrusel-->
 <div class="container py-5">
    <h2 class="text-center mb-4">🏆 Ranking de Jugadores 🏆</h2>

    <div id="rankingCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-inner">

        <!-- Usuario 1 -->
        <div class="carousel-item active">
          <div class="card mx-auto" id="cardUsu">
            <img src="./Recursos/usuario1.png" class="card-img-top" alt="Valentina">
            <div class="card-body">
              <h5 class="card-title">#1 Lugar 🏆</h5>
              <p class="card-text">Valentina</p>
              <p class="card-text">Respuestas correctas: 10</p>
              <p class="card-text">Puntaje: 321</p>
            </div>
          </div>
        </div>

        <!-- Usuario 2 -->
        <div class="carousel-item">
          <div class="card mx-auto" id="cardUsu">
            <img src="./Recursos/usuario2.png" class="card-img-top" alt="Invitado">
            <div class="card-body">
              <h5 class="card-title">#2 Lugar 🏆</h5>
              <p class="card-text">Invitado</p>
              <p class="card-text">Respuestas correctas: 7</p>
              <p class="card-text">Puntaje: 234</p>
            </div>
          </div>
        </div>

        <!-- Usuario 3 -->
        <div class="carousel-item">
          <div class="card mx-auto" id="cardUsu">
            <img src="./Recursos/usuario3.png" class="card-img-top" alt="Araceli">
            <div class="card-body">
              <h5 class="card-title">#3 Lugar 🏆</h5>
              <p class="card-text">Araceli</p>
              <p class="card-text">Respuestas correctas: 5</p>
              <p class="card-text">Puntaje: 130</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Controles -->
      <button class="carousel-control-prev" type="button" data-bs-target="#rankingCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#rankingCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  </div>


  <!--Comentarios-->
<section class="container my-5">
  <h2 class="mb-4">Comentarios de los usuarios</h2>
  <div class="row g-4">

    <!-- Comentario 1 -->
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Marco Villordo ⭐⭐⭐</h5>
          <h6 class="card-subtitle mb-2 text-muted">5 de Octubre 2025</h6>
          <p class="card-text">
            ¡Me encantó el cuestionario! Algunas preguntas me hicieron pensar mucho y aprendí datos que no conocía sobre la Segunda Guerra Mundial.
          </p>
        </div>
      </div>
    </div>

    <!-- Comentario 2 -->
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Matias Basterra⭐⭐⭐⭐⭐</h5>
          <h6 class="card-subtitle mb-2 text-muted">3 de Octubre 2025</h6>
          <p class="card-text">
            Muy buen quiz, la interfaz es clara y las respuestas están bien explicadas. ¡Se nota que está bien hecho!
          </p>
        </div>
      </div>
    </div>

    <!-- Comentario 3 -->
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Ana⭐⭐⭐⭐</h5>
          <h6 class="card-subtitle mb-2 text-muted">1 de Octubre 2025</h6>
          <p class="card-text">
            Algunas preguntas eran complicadas, pero eso me gustó. Me motivó a investigar más sobre la historia.
          </p>
        </div>
      </div>
    </div>

  <!--Comentario 4-->
<div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Griselda Juarez⭐</h5>
          <h6 class="card-subtitle mb-2 text-muted">9 de Octubre 2025</h6>
          <p class="card-text">
           Excelente forma de aprender historia. Me gusta que sea interactivo y no solo leer datos.
          </p>
        </div>
      </div>
    </div>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>

</html>