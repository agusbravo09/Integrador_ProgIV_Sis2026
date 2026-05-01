document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el Dashboard
    cargarDatosDashboard();

    // 2. Configurar botón de cerrar sesión
    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Lógica para borrar JWT token en el futuro
            window.location.href = '../index.html'; // Redirige al login
        });
    }
});

/**
 * Función que simula la petición a la API Rest para traer los totales y cursos activos.
 * En el futuro, aquí usarán fetch() conectándose al backend de sus compañeros.
 */
function cargarDatosDashboard() {
    // --- DATOS SIMULADOS (Mock Data) ---
    const dashboardData = {
        totalEstudiantes: 142,
        totalCursos: 15,
        cursosActivos: [
            { id: 1, nombre: "Programación IV", descripcion: "Desarrollo Web Integrador", horas: 60, cupoMax: 30, inscriptos: 25 },
            { id: 2, nombre: "Base de Datos", descripcion: "Modelado y SQL", horas: 40, cupoMax: 25, inscriptos: 25 },
            { id: 3, nombre: "Diseño UX/UI", descripcion: "Fundamentos de diseño de interfaces", horas: 30, cupoMax: 20, inscriptos: 15 }
        ]
    };

    // Actualizar Totales en el HTML
    document.getElementById('total-estudiantes').textContent = dashboardData.totalEstudiantes;
    document.getElementById('total-cursos').textContent = dashboardData.totalCursos;

    // Renderizar Cursos Activos
    renderizarCursosActivos(dashboardData.cursosActivos);
}

/**
 * Genera las tarjetas HTML para los links rápidos de los cursos activos.
 */
function renderizarCursosActivos(cursos) {
    const container = document.getElementById('cursos-activos-container');
    container.innerHTML = ''; // Limpiar contenedor

    if (cursos.length === 0) {
        container.innerHTML = `<p class="text-slate-500">No hay cursos activos en este momento.</p>`;
        return;
    }

    cursos.forEach(curso => {
        // Calcular si está lleno el cupo
        const cupoIleno = curso.inscriptos >= curso.cupoMax;
        const badgeColor = cupoIleno ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
        const badgeText = cupoIleno ? 'Cupo Lleno' : 'Disponible';

        const cardHTML = `
            <div class="bg-white/80 backdrop-blur-md border border-white p-6 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-bold text-slate-800">${curso.nombre}</h3>
                        <span class="text-[10px] font-bold px-2 py-1 rounded-full ${badgeColor}">
                            ${badgeText}
                        </span>
                    </div>
                    <p class="text-sm text-slate-500 mb-4">${curso.descripcion}</p>
                </div>
                
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-xs text-slate-400 font-medium flex gap-3">
                        <span>🕒 ${curso.horas} hs</span>
                        <span>👥 ${curso.inscriptos}/${curso.cupoMax}</span>
                    </div>
                    <a href="cursos.html?id=${curso.id}" class="text-sm font-bold text-white bg-institucional-600 hover:bg-institucional-700 px-4 py-2 rounded-xl transition-colors">
                        Gestionar
                    </a>
                </div>
            </div>
        `;
        
        // Insertar la tarjeta en el contenedor
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}