// curso_especifico.js
import * as CursoApi from './api/api-cursos.js';
import * as InscripcionApi from './api/api-inscripciones.js';
import { confirmarEliminacion, mostrarExito, mostrarError } from './utils/swal.js';

window.currentPageAlumnosCurso = 1;
window.inscripcionesCache = {};
const ROWS_PER_PAGE_ALUMNOS = 10;

let isPrinting = false;

// Eventos para expandir la lista de alumnos y cambiar el nombre del archivo PDF al imprimir
window.addEventListener('beforeprint', () => {
    isPrinting = true;

    // Guardar el título original y cambiarlo al nombre del curso para nombrar el PDF
    window.originalTitle = document.title;
    if (window.cursoSeleccionado && window.cursoSeleccionado.nombre) {
        document.title = window.cursoSeleccionado.nombre;
    }

    // fecha de impresión en el reporte
    const fechaEl = document.getElementById('fecha-impresion-reporte');
    if (fechaEl) {
        fechaEl.textContent = new Date().toLocaleString();
    }

    renderAlumnosInscriptos();
});

window.addEventListener('afterprint', () => {
    isPrinting = false;

    // Restaurar el título de página original
    if (window.originalTitle) {
        document.title = window.originalTitle;
    }

    renderAlumnosInscriptos();
});

// ============ FUNCIONES BÁSICAS ============
function getMateriaActual() {
    const elTitulo = document.getElementById("curso-especifico-titulo");
    const desdeDom = elTitulo?.textContent?.trim();
    if (desdeDom && desdeDom !== "—") return desdeDom;
    return window.cursoSeleccionado?.nombre || "";
}

function setTextIfExists(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ============ CARGAR INSCRIPCIONES DESDE API ============
async function getAlumnosPorCurso() {
    const cursoId = window.cursoSeleccionado?.id_curso;
    if (!cursoId) return [];

    try {
        if (!window.inscripcionesCache[cursoId]) {
            window.inscripcionesCache[cursoId] = await InscripcionApi.getInscripcionesByCurso(cursoId);
        }

        const inscripciones = window.inscripcionesCache[cursoId] || [];

        return inscripciones.map(ins => ({
            id: ins.id_inscripcion || "—",
            estudiante: ins.nombre_alumno || `Estudiante #${ins.id_estudiante}`,
            dni: ins.dni_alumno || "—",
            fechaHora: ins.fecha_hora_inscripcion
                ? new Date(ins.fecha_hora_inscripcion).toLocaleDateString()
                : "—",
            estado: "Confirmada",
            curso: window.cursoSeleccionado?.nombre || ""
        }));
    } catch (error) {
        console.warn('API no disponible:', error.message);
        return [];
    }
}

// ============ BADGE DE ESTADO ============
function badgeEstadoAlumno(estado) {
    if (estado === "Pendiente") {
        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pendiente</span>';
    }
    return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Confirmada</span>';
}

// ============ CREAR FILA ============
function crearFilaAlumno(ins) {
    const tpl = document.getElementById("tpl-fila-alumno-inscripto");

    // Si existe la plantilla, usarla
    if (tpl?.content) {
        const fila = tpl.content.cloneNode(true).querySelector("tr");
        if (fila) {
            const nombreEl = fila.querySelector('[data-campo="nombre"]');
            const idEl = fila.querySelector('[data-campo="inscripcion-id"]');
            const dniEl = fila.querySelector('[data-campo="dni"]');
            const fechaEl = fila.querySelector('[data-campo="fecha"]');
            const estadoEl = fila.querySelector('[data-campo="estado"]');

            if (nombreEl) nombreEl.textContent = ins.estudiante;
            if (idEl) idEl.textContent = `Inscripción #${ins.id}`;
            if (dniEl) dniEl.textContent = ins.dni;
            if (fechaEl) fechaEl.textContent = ins.fechaHora;
            if (estadoEl) estadoEl.innerHTML = badgeEstadoAlumno(ins.estado);

            return fila;
        }
    }

    // Fallback: crear fila manualmente
    const fila = document.createElement("tr");
    fila.className = "hover:bg-slate-50 transition-colors";
    fila.innerHTML = `
        <td class="px-6 py-4">
            <div class="font-medium text-slate-800">${ins.estudiante}</div>
            <div class="text-xs text-slate-500">Inscripción #${ins.id}</div>
        </td>
        <td class="px-6 py-4 text-slate-600 font-mono text-sm">${ins.dni}</td>
        <td class="px-6 py-4 text-slate-600">${ins.fechaHora}</td>
        <td class="px-6 py-4 text-center">${badgeEstadoAlumno(ins.estado)}</td>
        <td class="px-6 py-4 text-right">
            <button type="button"
                class="text-amber-600 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded text-xs font-medium">
                Diploma
            </button>
        </td>
    `;
    return fila;
}

// ============ ACTUALIZAR DETALLES DEL CURSO ============
function actualizarDetallesCurso(curso) {
    // Título principal
    const titulo = document.getElementById("curso-especifico-titulo");
    if (titulo) titulo.textContent = curso.nombre || "—";

    // Subtítulo
    const subtitulo = document.getElementById("curso-especifico-subtitulo");
    if (subtitulo) {
        const fecha = curso.fecha_inicio
            ? new Date(curso.fecha_inicio).toLocaleDateString(undefined, { timeZone: 'UTC' })
            : "Sin fecha";
        subtitulo.textContent = `Inicio: ${fecha} — ${curso.cantidad_horas || 0} horas`;
    }

    // Materia oculta
    const materiaOculta = document.getElementById("curso-especifico-materia-activa");
    if (materiaOculta) materiaOculta.textContent = curso.nombre || "";

    // Campos de detalle
    setTextIfExists("curso-detalle-nombre", curso.nombre || "—");
    setTextIfExists("curso-detalle-fecha-texto", curso.fecha_inicio
        ? new Date(curso.fecha_inicio).toLocaleDateString(undefined, { timeZone: 'UTC' })
        : "—");
    setTextIfExists("curso-detalle-horas", curso.cantidad_horas ? `${curso.cantidad_horas} h` : "—");
    setTextIfExists("curso-detalle-maximos", curso.inscriptos_max ? `${curso.inscriptos_max} alumnos` : "—");
    setTextIfExists("curso-detalle-descripcion", curso.descripcion || "Sin descripción");

    // Estado con color
    const estadoEl = document.getElementById("curso-detalle-estado");
    if (estadoEl) {
        const estado = Number(curso.id_curso_estado);
        let clases, texto;
        switch (estado) {
            case 1: clases = "bg-slate-100 text-slate-700"; texto = "Borrador"; break;
            case 2: clases = "bg-emerald-100 text-emerald-700"; texto = "Inscripción abierta"; break;
            case 3: clases = "bg-yellow-100 text-yellow-800"; texto = "Inscripción cerrada"; break;
            case 4: clases = "bg-red-100 text-red-700"; texto = "Eliminado"; break;
            default: clases = "bg-slate-100 text-slate-700"; texto = "—";
        }
        estadoEl.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clases}`;
        estadoEl.textContent = texto;
    }
}

// ============ ESTADÍSTICAS ============
function actualizarEstadisticasCurso(curso, cantidadInscriptos) {
    const max = curso.inscriptos_max || 0;
    const inscriptos = cantidadInscriptos;
    const disponibles = Math.max(0, max - inscriptos);
    const porcentaje = max > 0 ? Math.round((inscriptos / max) * 100) : 0;

    setTextIfExists("curso-stat-cupos", max);
    setTextIfExists("curso-stat-inscriptos", inscriptos);
    setTextIfExists("curso-stat-disponibles", disponibles);
    setTextIfExists("curso-stat-porcentaje", `${porcentaje}%`);

    const barra = document.getElementById("curso-stat-barra");
    if (barra) barra.style.width = `${Math.min(porcentaje, 100)}%`;

    setTextIfExists("curso-stat-ratio", `${inscriptos} / ${max}`);
}

// ============ RENDERIZAR ALUMNOS ============
async function renderAlumnosInscriptos() {
    const tbody = document.getElementById("tabla-alumnos-inscriptos");
    if (!tbody) return;

    const materia = getMateriaActual();
    if (!materia) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">No hay curso seleccionado.</td></tr>`;
        return;
    }

    // Actualizar título de sección
    const refTabla = document.getElementById("alumnos-inscriptos-materia");
    if (refTabla) refTabla.textContent = `— ${materia}`;

    // Cargar alumnos
    const alumnos = await getAlumnosPorCurso();
    const total = alumnos.length;
    const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE_ALUMNOS));

    if (window.currentPageAlumnosCurso > totalPages) {
        window.currentPageAlumnosCurso = totalPages;
    }

    const inicio = (window.currentPageAlumnosCurso - 1) * ROWS_PER_PAGE_ALUMNOS;
    const fin = Math.min(inicio + ROWS_PER_PAGE_ALUMNOS, total);
    const pagina = isPrinting ? alumnos : alumnos.slice(inicio, fin);

    // Total label
    const totalLabel = document.getElementById("total-alumnos-inscriptos");
    if (totalLabel) {
        totalLabel.textContent = `Total: ${total} alumno${total !== 1 ? "s" : ""} en ${materia}`;
    }

    // Estadísticas
    if (window.cursoSeleccionado) {
        actualizarEstadisticasCurso(window.cursoSeleccionado, total);
    }

    // Renderizar filas
    tbody.innerHTML = "";

    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">No hay alumnos inscriptos en <strong>${materia}</strong>.</td></tr>`;
    } else {
        pagina.forEach((ins) => {
            const fila = crearFilaAlumno(ins);
            if (fila) tbody.appendChild(fila);
        });
    }

    // Paginación
    const info = document.getElementById("paginacion-alumnos-info");
    if (info) {
        const startRow = total === 0 ? 0 : inicio + 1;
        info.innerHTML = `Mostrando <span class="font-medium text-slate-700">${startRow}</span> a <span class="font-medium text-slate-700">${fin}</span> de <span class="font-medium text-slate-700">${total}</span> alumnos`;
    }

    const btnPrev = document.getElementById("btn-prev-alumnos");
    const btnNext = document.getElementById("btn-next-alumnos");
    if (btnPrev) btnPrev.disabled = window.currentPageAlumnosCurso === 1 || total === 0;
    if (btnNext) btnNext.disabled = window.currentPageAlumnosCurso >= totalPages || total === 0;
}

function cambiarPaginaAlumnos(direction) {
    const nueva = window.currentPageAlumnosCurso + direction;
    if (nueva < 1) return;
    window.currentPageAlumnosCurso = nueva;
    renderAlumnosInscriptos();
}

// ============ BOTONES DEL HEADER ============
function volverACursos() {
    if (typeof cambiarVista === 'function') {
        cambiarVista('cursos');
    }
}

function imprimirCursoEspecifico() {
    window.print();
}

function editarCursoEspecifico() {
    if (window.cursoSeleccionadoIndex == null) return;

    // Volver a la vista de cursos
    if (typeof cambiarVista === 'function') {
        cambiarVista('cursos');
    }

    // Esperar a que se cargue el modal y abrirlo
    setTimeout(() => {
        if (typeof editarCurso === 'function') {
            editarCurso(window.cursoSeleccionadoIndex);
        }
    }, 500);
}

async function eliminarCursoEspecifico() {
    if (!window.cursoSeleccionado) return;

    const confirmado = await confirmarEliminacion(window.cursoSeleccionado.nombre);
    if (!confirmado) return;

    try {
        await CursoApi.deleteCursoApi(window.cursoSeleccionado.id_curso);
        window.cursoSeleccionado.id_curso_estado = 4;
        mostrarExito("Curso eliminado correctamente.");
        setTimeout(() => {
            if (typeof cambiarVista === 'function') cambiarVista('cursos');
        }, 800);
    } catch (error) {
        console.error('Error:', error);
        mostrarError("No se pudo eliminar el curso.");
    }
}

// ============ NAVEGACIÓN ============
function verCursoEspecifico(identifier) {
    if (!window.cursosData) return;

    // Buscar el curso por id_curso o por índice
    let cursoEncontrado = null;
    let indexEncontrado = null;

    // Primero intentar buscar por id_curso
    if (typeof identifier === 'number' && identifier > 0) {
        indexEncontrado = window.cursosData.findIndex(c => c.id_curso === identifier);
        if (indexEncontrado !== -1) {
            cursoEncontrado = window.cursosData[indexEncontrado];
        }
    }

    // Si no encuentra por ID, usar el índice directamente
    if (!cursoEncontrado && window.cursosData[identifier]) {
        cursoEncontrado = window.cursosData[identifier];
        indexEncontrado = identifier;
    }

    if (!cursoEncontrado) {
        console.error('Curso no encontrado:', identifier);
        return;
    }

    window.cursoSeleccionado = cursoEncontrado;
    window.cursoSeleccionadoIndex = indexEncontrado;
    window.inscripcionesCache = {};

    if (typeof cambiarVista === 'function') {
        cambiarVista("curso_especifico");
    }
}

// ============ INICIALIZACIÓN ============
async function initCursoEspecifico() {
    if (!window.cursoSeleccionado && window.cursosData?.length) {
        window.cursoSeleccionado = window.cursosData[0];
        window.cursoSeleccionadoIndex = 0;
    }

    if (window.cursoSeleccionado) {
        actualizarDetallesCurso(window.cursoSeleccionado);
    }

    window.currentPageAlumnosCurso = 1;
    await renderAlumnosInscriptos();

    if (!window.cursoEspecificoListenersAdded) {
        const btnPrev = document.getElementById("btn-prev-alumnos");
        const btnNext = document.getElementById("btn-next-alumnos");

        if (btnPrev) btnPrev.addEventListener("click", () => cambiarPaginaAlumnos(-1));
        if (btnNext) btnNext.addEventListener("click", () => cambiarPaginaAlumnos(1));

        window.cursoEspecificoListenersAdded = true;
    }
}


// Exportar al scope global
window.verCursoEspecifico = verCursoEspecifico;
window.initCursoEspecifico = initCursoEspecifico;
window.getMateriaActual = getMateriaActual;
window.cambiarPaginaAlumnos = cambiarPaginaAlumnos;
window.renderAlumnosInscriptos = renderAlumnosInscriptos;
window.imprimirCursoEspecifico = imprimirCursoEspecifico;
window.editarCursoEspecifico = editarCursoEspecifico;
window.eliminarCursoEspecifico = eliminarCursoEspecifico;
window.volverACursos = volverACursos;