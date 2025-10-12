//Datos de muestra-cantidad de usuarios
const cuestionarios = ['Cuestionario 1', 'Cuestionario 2', 'Cuestionario 3', 'Cuestionario 4'];
const jugadores = [10, 20, 30, 15];
//Datos de muestra-valoracion promedio
const valoracion = ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'];
const cantDeCada = [2, 5, 8, 20, 40];
//Datos de muestra-cantidad de respuestas
const respuestas = ['Cuestionario 1', 'Cuestionario 2', 'Cuestionario 3', 'Cuestionario 4'];
const cantDeRespuestas = [30, 15, 40, 55];
//Grafico de barras
new Chart(document.getElementById('graficoCantUsuarios'), {
    type: 'bar',
    data: {
        labels: cuestionarios,
        datasets: [{
        label: 'Cantidad de jugadores',
        data: jugadores,
        backgroundColor: '#f4d4ca'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
        }
        }
    }
});
//grafico de valoracion promedio
new Chart(document.getElementById('graficoValoracion'), {
    type: 'pie',
    data: {
        labels: valoracion,
        datasets: [{
        data: cantDeCada,
        backgroundColor: [
            '#edb51a',
            '#4f9d86',
            '#ef7131',
            '#964f4f',
            '#f7705c'
        ]
        }]
    }
});
//grafico de cantidad de respuestas por cuestionario
new Chart(document.getElementById('graficoCantRespuestas'), {
    type: 'pie',
    data: {
        labels: respuestas,
        datasets: [{
        data: cantDeRespuestas,
        backgroundColor: [
            '#4f9d86',
            '#edb51a',
            '#f7705c',
            '#964f4f'
        ]
        }]
    }
});

