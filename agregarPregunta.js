const panelDer = document.getElementById('panelDer');
const btnToggleSidebar = document.getElementById('btnPanelDer');
const btnCerrarSidebar = document.getElementById('btnCerrarSidebar');

const areaPrincipal = document.getElementById('areaPrincipal');

btnToggleSidebar.addEventListener('click', () => {
    panelDer.classList.toggle('active');
    btnToggleSidebar.classList.toggle('open');

    // Ajustar ancho del área principal
    if(panelDer.classList.contains('active')) {
        // Sidebar abierto → área principal más pequeña
        areaPrincipal.classList.remove('col-9');
        areaPrincipal.classList.add('col-7');
    } else {
        // Sidebar cerrado → área principal más grande
        areaPrincipal.classList.remove('col-7');
        areaPrincipal.classList.add('col-9');
    }
});