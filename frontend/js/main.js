// Variable global para almacenar la vista actualmente activa y evitar recargas duplicadas
window.vistaActual = '';

document.addEventListener("DOMContentLoaded", () => {
    // Escuchamos el evento 'hashchange' para manejar cuando el usuario va hacia atrás o adelante
    window.addEventListener("hashchange", manejarCambioRuta);
    
    // Ejecutamos la función una vez al iniciar la aplicación para cargar la vista correcta basada en la URL actual
    manejarCambioRuta();
});

// Esta función lee el hash de la URL y decide qué vista cargar
function manejarCambioRuta() {
    // Obtenemos el hash actual sin el símbolo '#' (ej: '#cursos' -> 'cursos')
    const hash = window.location.hash.slice(1);
    
    // Si no hay hash en la URL, por defecto vamos a 'dashboard'
    const vistaDestino = hash || 'dashboard';
    
    // Cargamos la vista correspondiente indicando que viene de un cambio de hash (deHistorial = true)
    cambiarVista(vistaDestino, true);
}

async function cambiarVista(vistaDestino, deHistorial = false) {
    // Si ya estamos en la vista solicitada, no hacemos nada para evitar recargas innecesarias
    if (vistaDestino === window.vistaActual) {
        return;
    }

    const contenedor = document.getElementById('contenido-dinamico');

    
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
        
        const respuesta = await fetch(`html/${vistaDestino}.html`);

        if (!respuesta.ok) {
            throw new Error(`No se pudo encontrar el archivo html/${vistaDestino}.html`);
        }

        
        const htmlTexto = await respuesta.text();

        
        contenedor.innerHTML = htmlTexto;

        
        actualizarMenu(vistaDestino);

        // Si el cambio de vista NO se originó por el historial (ej: clic directo), actualizamos el hash en la URL
        if (!deHistorial) {
            window.location.hash = vistaDestino;
        }

        // Guardamos la vista actual globalmente
        window.vistaActual = vistaDestino;
        
        if (vistaDestino === 'cursos' && typeof initCursos === 'function') {
            initCursos();
        }
        if (vistaDestino === 'dashboard' && typeof initDashboard === 'function') {
            initDashboard();
        }
        if (vistaDestino === 'inscripciones' && typeof initInscripciones === 'function') {
            initInscripciones();
        }
        if (vistaDestino === 'curso_especifico' && typeof initCursoEspecifico === 'function') {
            initCursoEspecifico();
        }

        

    } catch (error) {
        console.error("Error cargando la vista:", error);
        contenedor.innerHTML = `
            <div class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                <p class="font-bold">Error al cargar la vista: ${vistaDestino}</p>
                <p class="text-sm mt-1">Asegúrate de que el archivo <code>html/${vistaDestino}.html</code> exista.</p>
            </div>`;
    }
}


function actualizarMenu(vistaActiva) {

    const vistas = ['dashboard', 'estudiantes', 'cursos', 'inscripciones'];

    // Clases para la sidebar (desktop)
    const claseActivo = ['bg-institucional-600', 'text-white', 'shadow-md', 'shadow-institucional-600/20'];
    const claseInactivo = ['text-slate-600', 'hover:text-institucional-600', 'hover:bg-white/50'];

    // Clases para la bottom nav (móvil)
    const bnavActivo = ['text-institucional-600'];
    const bnavInactivo = ['text-slate-400'];

    vistas.forEach(vista => {

        // Actualizar botón de la sidebar
        const boton = document.getElementById(`btn-${vista}`);
        if (boton) {
            if (vista === vistaActiva) {
                boton.classList.remove(...claseInactivo);
                boton.classList.add(...claseActivo);
            } else {
                boton.classList.remove(...claseActivo);
                boton.classList.add(...claseInactivo);
            }
        }

        // Actualizar botón de la bottom nav
        const bnavBtn = document.getElementById(`bnav-${vista}`);
        if (bnavBtn) {
            const bnavLabel = bnavBtn.querySelector('span');
            if (vista === vistaActiva) {
                bnavBtn.classList.remove(...bnavInactivo);
                bnavBtn.classList.add(...bnavActivo);
                if (bnavLabel) {
                    bnavLabel.classList.remove('font-medium');
                    bnavLabel.classList.add('font-semibold');
                }
            } else {
                bnavBtn.classList.remove(...bnavActivo);
                bnavBtn.classList.add(...bnavInactivo);
                if (bnavLabel) {
                    bnavLabel.classList.remove('font-semibold');
                    bnavLabel.classList.add('font-medium');
                }
            }
        }
    });
}


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('contenido-dinamico');
    const texts = document.querySelectorAll('.sidebar-text');
    const toggleIcon = document.getElementById('toggle-icon');

    
    const logoWrapper = document.getElementById('sidebar-logo-wrapper');
    const toggleBtn = document.getElementById('toggle-btn');
    const profileBox = document.getElementById('profile-box');

    
    if (sidebar.classList.contains('w-64')) {

        
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');

        
        if (mainContent) {
            mainContent.classList.remove('sm:ml-72', 'sm:w-[calc(100%-18rem)]');
            mainContent.classList.add('sm:ml-24', 'sm:w-[calc(100%-6rem)]');
        }

        
        logoWrapper.classList.remove('w-40', 'opacity-100');
        logoWrapper.classList.add('w-0', 'opacity-0');

        
        toggleBtn.classList.remove('right-4');
        toggleBtn.classList.add('right-5');

        
        texts.forEach(text => {
            text.classList.remove('max-w-[200px]', 'opacity-100');
            text.classList.add('max-w-0', 'opacity-0');
        });

        
        profileBox.classList.remove('bg-slate-50/50', 'border-white/60');
        profileBox.classList.add('bg-transparent', 'border-transparent');

        
        toggleIcon.classList.add('rotate-180');

    } else {
        
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');

        
        if (mainContent) {
            mainContent.classList.remove('sm:ml-24', 'sm:w-[calc(100%-6rem)]');
            mainContent.classList.add('sm:ml-72', 'sm:w-[calc(100%-18rem)]');
        }

        
        logoWrapper.classList.remove('w-0', 'opacity-0');
        logoWrapper.classList.add('w-40', 'opacity-100');

        
        toggleBtn.classList.remove('right-5');
        toggleBtn.classList.add('right-4');

        
        texts.forEach(text => {
            text.classList.remove('max-w-0', 'opacity-0');
            text.classList.add('max-w-[200px]', 'opacity-100');
        });

        
        profileBox.classList.remove('bg-transparent', 'border-transparent');
        profileBox.classList.add('bg-slate-50/50', 'border-white/60');

        
        toggleIcon.classList.remove('rotate-180');
    }
}
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}