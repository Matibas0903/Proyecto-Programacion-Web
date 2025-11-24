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
<div class="container mt-4" id="contendedorPrincipal"></div>


<div class="container py-5">
   <h2 class="text-center mb-4">🏆 Ranking de Jugadores 🏆</h2> 
   <div id="rankingCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000"> 
    <div class="carousel-inner" id="rankingInner"></div>
     <button class="carousel-control-prev" type="button" data-bs-target="#rankingCarousel" data-bs-slide="prev">
       <span class="carousel-control-prev-icon"></span> 
      </button> <button class="carousel-control-next" type="button" data-bs-target="#rankingCarousel" data-bs-slide="next"> 
        <span class="carousel-control-next-icon"></span>
       </button> 
      </div> 
    </div>


    <!--Comentarios-->

   <div class="container">
     <h2>Comentarios de los usuarios</h2>
    <div id="ContenedorComentarios" class="row"></div>
   </div>



</body>

</html>