// frontend/js/main.js

// 1. Cargar la vista por defecto ('dashboard') cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    cambiarVista('dashboard');
});

/**
 * Función principal para cambiar el contenido dinámico (SPA)
 * @param {string} vistaDestino - El nombre del archivo HTML parcial a cargar (sin la extensión)
 */
async function cambiarVista(vistaDestino) {
    const contenedor = document.getElementById('contenido-dinamico');

    // Mostrar un pequeño indicador de carga para que la app se sienta viva
    contenedor.innerHTML = `
        <div class="flex h-[60vh] items-center justify-center text-slate-400 font-medium">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-institucional-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando vista...
        </div>
    `;

    try {
        // Hacemos un fetch a la carpeta html/ para traer la vista parcial
        const respuesta = await fetch(`html/${vistaDestino}.html`);

        if (!respuesta.ok) {
            throw new Error(`No se pudo encontrar el archivo html/${vistaDestino}.html`);
        }

        // Extraemos el texto HTML
        const htmlTexto = await respuesta.text();

        // Inyectamos el HTML en el contenedor principal del main.html
        contenedor.innerHTML = htmlTexto;

        // Actualizamos las clases del menú para pintar el botón activo
        actualizarMenu(vistaDestino);

        // --- INICIALIZAMOS LA LÓGICA DE CADA VISTA ---
        if (vistaDestino === 'cursos' && typeof initCursos === 'function') {
            initCursos();
        }
        if (vistaDestino === 'dashboard' && typeof initDashboard === 'function') {
            initDashboard();
        }
        if (vistaDestino === 'inscripciones' && typeof initInscripciones === 'function') {
            initInscripciones();
        }

        // Más adelante aquí agregarás: if (vistaDestino === 'estudiantes') initEstudiantes();

    } catch (error) {
        console.error("Error cargando la vista:", error);
        contenedor.innerHTML = `
            <div class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                <p class="font-bold">Error al cargar la vista: ${vistaDestino}</p>
                <p class="text-sm mt-1">Asegúrate de que el archivo <code>html/${vistaDestino}.html</code> exista.</p>
            </div>`;
    }
}

/**
 * Función para actualizar el color del botón activo en el menú lateral
 * @param {string} vistaActiva - El ID de la vista que se acaba de cargar
 */
function actualizarMenu(vistaActiva) {
    // Array con todas las vistas posibles en tu sidebar
    const vistas = ['dashboard', 'estudiantes', 'cursos', 'inscripciones'];

    // Clases de Tailwind para estado ACTIVO (Azul, texto blanco, sombreado)
    const claseActivo = ['bg-institucional-600', 'text-white', 'shadow-md', 'shadow-institucional-600/20'];

    // Clases de Tailwind para estado INACTIVO (Texto gris, hover)
    const claseInactivo = ['text-slate-600', 'hover:text-institucional-600', 'hover:bg-white/50'];

    vistas.forEach(vista => {
        const boton = document.getElementById(`btn-${vista}`);
        if (!boton) return; // Si el botón no existe en el HTML, lo saltamos

        if (vista === vistaActiva) {
            boton.classList.remove(...claseInactivo);
            boton.classList.add(...claseActivo);
        } else {
            boton.classList.remove(...claseActivo);
            boton.classList.add(...claseInactivo);
        }
    });
}

/**
 * Función para colapsar y expandir la Sidebar de forma fluida
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('contenido-dinamico');
    const texts = document.querySelectorAll('.sidebar-text');
    const toggleIcon = document.getElementById('toggle-icon');

    // Elementos específicos de la barra
    const logoWrapper = document.getElementById('sidebar-logo-wrapper');
    const toggleBtn = document.getElementById('toggle-btn');
    const profileBox = document.getElementById('profile-box');

    // Comprobar si la barra está actualmente expandida (ancho 64)
    if (sidebar.classList.contains('w-64')) {

        // === ACHICAR BARRA ===
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');

        // Agrandar el contenedor principal dinámico para que ocupe el nuevo espacio
        if (mainContent) {
            mainContent.classList.remove('ml-72', 'w-[calc(100%-18rem)]');
            mainContent.classList.add('ml-24', 'w-[calc(100%-6rem)]');
        }

        // Cabecera: Ocultar suavemente el logo cambiando su ancho y opacidad a 0
        logoWrapper.classList.remove('w-40', 'opacity-100');
        logoWrapper.classList.add('w-0', 'opacity-0');

        // Cabecera: Mover el botón de flechas un píxel a la izquierda para centrarlo perfecto
        toggleBtn.classList.remove('right-4');
        toggleBtn.classList.add('right-5');

        // Textos: Encoger suavemente todos los textos
        texts.forEach(text => {
            text.classList.remove('max-w-[200px]', 'opacity-100');
            text.classList.add('max-w-0', 'opacity-0');
        });

        // Perfil: Quitar bordes y fondo para que quede transparente
        profileBox.classList.remove('bg-slate-50/50', 'border-white/60');
        profileBox.classList.add('bg-transparent', 'border-transparent');

        // Girar la flecha
        toggleIcon.classList.add('rotate-180');

    } else {
        // === EXPANDIR BARRA ===
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');

        // Achicar el contenedor principal para que la barra no lo tape
        if (mainContent) {
            mainContent.classList.remove('ml-24', 'w-[calc(100%-6rem)]');
            mainContent.classList.add('ml-72', 'w-[calc(100%-18rem)]');
        }

        // Restaurar Logo
        logoWrapper.classList.remove('w-0', 'opacity-0');
        logoWrapper.classList.add('w-40', 'opacity-100');

        // Restaurar posición de Flechas
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

        // Restaurar flecha
        toggleIcon.classList.remove('rotate-180');
    }
}
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
