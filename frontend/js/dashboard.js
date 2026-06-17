import { getEstudiantes } from './api/api-estudiantes.js';
import { getCursos } from './api/api-cursos.js';

async function initDashboard() {
    console.log("initDashboard ejecutado correctamente");
    await cargarDatosDashboard();
}

async function cargarDatosDashboard() {
    try {
        const [estudiantes, cursos] = await Promise.all([
            getEstudiantes(),
            getCursos()
        ]);

        const activeEstudiantes = estudiantes ? estudiantes.filter(e => Number(e.activo) !== 0) : [];
        const totalEstudiantes = activeEstudiantes.length;
        const totalCursos = cursos ? cursos.length : 0;

        const elEstudiantes = document.getElementById('total-estudiantes');
        const elCursos = document.getElementById('total-cursos');

        if (elEstudiantes) elEstudiantes.textContent = totalEstudiantes;
        if (elCursos) elCursos.textContent = totalCursos;

        // Cursos activos
        const cursosActivos = cursos ? cursos.filter(c => Number(c.id_curso_estado) === 2) : [];
        renderizarCursosActivos(cursosActivos);
    } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
    }
}

function renderizarCursosActivos(cursos) {
    const container = document.getElementById('cursos-activos-container');
    if (!container) return;

    container.innerHTML = '';

    if (cursos.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white border border-slate-200 p-8 rounded-3xl text-center text-slate-500 italic">
                No hay cursos activos en este momento.
            </div>
        `;
        return;
    }

    cursos.forEach(curso => {
        const cupoLleno = Number(curso.ocupados) >= Number(curso.inscriptos_max);
        const badgeColor = cupoLleno ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
        const badgeText = cupoLleno ? 'Cupo Lleno' : 'Disponible';

        const cardHTML = `
            <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-institucional-300 transition-all duration-300 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-3 gap-2">
                        <h3 class="text-lg font-bold text-slate-800 line-clamp-2">${curso.nombre}</h3>
                        <span class="text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${badgeColor}">
                            ${badgeText}
                        </span>
                    </div>
                    <p class="text-sm text-slate-500 mb-4 line-clamp-3">${curso.descripcion}</p>
                </div>
                
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-xs text-slate-400 font-medium flex gap-3">
                        <span>🕒 ${curso.cantidad_horas} hs</span>
                        <span>👥 ${curso.ocupados || 0}/${curso.inscriptos_max}</span>
                    </div>
                    <button onclick="cambiarVista('cursos')" class="text-sm font-bold text-white bg-institucional-600 hover:bg-institucional-700 px-4 py-2 rounded-xl transition-colors">
                        Gestionar
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Hacerlo disponible de manera global para main.js
window.initDashboard = initDashboard;