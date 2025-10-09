const items = document.querySelectorAll('#carousel-container .carrossel-item');
let index = 0;

function updateCarousel() {
  items.forEach((item, i) => {
    item.classList.remove('prev', 'active', 'next');

    if (i === index) {
      item.classList.add('active');
    } else if (i === (index - 1 + items.length) % items.length) {
      item.classList.add('prev');
    } else if (i === (index + 1) % items.length) {
      item.classList.add('next');
    }
  });
}

// Inicializa
updateCarousel();

// Cambio automático cada 3 segundos
setInterval(() => {
  index = (index + 1) % items.length;
  updateCarousel();
}, 3000);
