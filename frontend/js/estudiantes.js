// Función para colapsar/expandir la Sidebar de forma fluida
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('contenido-dinamico');
    const texts = document.querySelectorAll('.sidebar-text');
    const toggleIcon = document.getElementById('toggle-icon');

    // Elementos específicos
    const logoWrapper = document.getElementById('sidebar-logo-wrapper');
    const toggleBtn = document.getElementById('toggle-btn');
    const profileBox = document.getElementById('profile-box');

    // Comprobar si está expandida
    if (sidebar.classList.contains('w-64')) {

        // === ACHICAR BARRA ===
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');

        if (mainContent) {
            mainContent.classList.remove('ml-72', 'w-[calc(100%-18rem)]');
            mainContent.classList.add('ml-24', 'w-[calc(100%-6rem)]');
        }

        // Cabecera: Ocultar suavemente el logo
        logoWrapper.classList.remove('w-40', 'opacity-100');
        logoWrapper.classList.add('w-0', 'opacity-0');

        // Cabecera: Mover el botón de flechas al centro exacto
        toggleBtn.classList.remove('right-4');
        toggleBtn.classList.add('right-5');

        // Textos: Encoger suavemente todos los textos
        texts.forEach(text => {
            text.classList.remove('max-w-[200px]', 'opacity-100');
            text.classList.add('max-w-0', 'opacity-0');
        });

        // Perfil: Quitar bordes y fondo
        profileBox.classList.remove('bg-slate-50/50', 'border-white/60');
        profileBox.classList.add('bg-transparent', 'border-transparent');

        // Animar flecha
        toggleIcon.classList.add('rotate-180');

    } else {
        // === EXPANDIR BARRA ===
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');

        if (mainContent) {
            mainContent.classList.remove('ml-24', 'w-[calc(100%-6rem)]');
            mainContent.classList.add('ml-72', 'w-[calc(100%-18rem)]');
        }

        // Restaurar Logo
        logoWrapper.classList.remove('w-0', 'opacity-0');
        logoWrapper.classList.add('w-40', 'opacity-100');

        // Restaurar Flechas
        toggleBtn.classList.remove('right-5');
        toggleBtn.classList.add('right-4');

        // Restaurar Textos
        texts.forEach(text => {
            text.classList.remove('max-w-0', 'opacity-0');
            text.classList.add('max-w-[200px]', 'opacity-100');
        });

        // Restaurar Caja de Perfil
        profileBox.classList.remove('bg-transparent', 'border-transparent');
        profileBox.classList.add('bg-slate-50/50', 'border-white/60');

        toggleIcon.classList.remove('rotate-180');
    }
}
// Logout
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}