// Mapeo temporal entre nombre del curso (cursos.js) y nombre en inscripciones.js
const CURSO_INSCRIPCIONES_ALIASES = {
    "Programación I": "Programación Java Avanzada",
    "Programación II": "Programación Java Avanzada",
    "Base de Datos": "Bases de Datos con MySQL",
    "Bases de Datos Avanzadas": "Bases de Datos con MySQL",
    "Desarrollo Web Frontend": "Desarrollo Web Frontend"
};

function nombreCursoParaInscripciones(nombreCurso) {
    return CURSO_INSCRIPCIONES_ALIASES[nombreCurso] || nombreCurso;
}

function getInscripcionesPorCurso(nombreCurso) {
    if (!window.inscripcionesData || !nombreCurso) return [];

    const nombreFiltro = nombreCursoParaInscripciones(nombreCurso);
    return window.inscripcionesData.filter((ins) => ins.curso === nombreFiltro);
}

window.currentPageAlumnosCurso = 1;
const ROWS_PER_PAGE_ALUMNOS = 10;

function badgeEstadoAlumno(estado) {
    if (estado === "Pendiente") {
        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pendiente</span>';
    }
    return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Confirmada</span>';
}

function actualizarEncabezadoCurso(curso) {
    const titulo = document.getElementById("curso-especifico-titulo");
    const subtitulo = document.getElementById("curso-especifico-subtitulo");
    const nombreDetalle = document.getElementById("curso-detalle-nombre");

    if (titulo) titulo.textContent = curso.nombre;
    if (subtitulo) subtitulo.textContent = `Código: ${curso.codigo || "S/C"} - ${curso.carrera || "Sin carrera"}`;
    if (nombreDetalle) nombreDetalle.textContent = curso.nombre;
}

function actualizarEstadisticasCurso(curso, cantidadInscriptos) {
    const max = curso.inscriptos_max || 0;
    const inscriptos = cantidadInscriptos;
    const disponibles = Math.max(0, max - inscriptos);
    const porcentaje = max > 0 ? Math.round((inscriptos / max) * 100) : 0;

    const elMax = document.getElementById("curso-stat-cupos");
    const elIns = document.getElementById("curso-stat-inscriptos");
    const elDisp = document.getElementById("curso-stat-disponibles");
    const elPct = document.getElementById("curso-stat-porcentaje");
    const elBarra = document.getElementById("curso-stat-barra");
    const elRatio = document.getElementById("curso-stat-ratio");

    if (elMax) elMax.textContent = max;
    if (elIns) elIns.textContent = inscriptos;
    if (elDisp) elDisp.textContent = disponibles;
    if (elPct) elPct.textContent = `${porcentaje}%`;
    if (elBarra) elBarra.style.width = `${Math.min(porcentaje, 100)}%`;
    if (elRatio) elRatio.textContent = `${inscriptos} / ${max}`;
}

function renderAlumnosInscriptos() {
    const tbody = document.getElementById("tabla-alumnos-inscriptos");
    if (!tbody) return;

    const curso = window.cursoSeleccionado;
    if (!curso) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">No hay curso seleccionado.</td></tr>`;
        return;
    }

    const alumnos = getInscripcionesPorCurso(curso.nombre);
    const total = alumnos.length;
    const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE_ALUMNOS));

    if (window.currentPageAlumnosCurso > totalPages) {
        window.currentPageAlumnosCurso = totalPages;
    }

    const inicio = (window.currentPageAlumnosCurso - 1) * ROWS_PER_PAGE_ALUMNOS;
    const fin = Math.min(inicio + ROWS_PER_PAGE_ALUMNOS, total);
    const pagina = alumnos.slice(inicio, fin);

    const totalLabel = document.getElementById("total-alumnos-inscriptos");
    if (totalLabel) {
        totalLabel.textContent = `Total: ${total} alumno${total !== 1 ? "s" : ""}`;
    }

    actualizarEstadisticasCurso(curso, total);

    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">No hay alumnos inscriptos en este curso.</td></tr>`;
    } else {
        tbody.innerHTML = "";
        pagina.forEach((ins) => {
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
                        class="text-amber-600 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded text-xs font-medium"
                        onclick="imprimirDiplomaIndividual('${ins.estudiante.replace(/'/g, "\\'")}', '${ins.curso.replace(/'/g, "\\'")}')">
                        Diploma
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

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
    const curso = window.cursoSeleccionado;
    if (!curso) return;

    const total = getInscripcionesPorCurso(curso.nombre).length;
    const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE_ALUMNOS));
    const nueva = window.currentPageAlumnosCurso + direction;

    if (nueva < 1 || nueva > totalPages) return;

    window.currentPageAlumnosCurso = nueva;
    renderAlumnosInscriptos();
}

function verCursoEspecifico(index) {
    if (!window.cursosData || !window.cursosData[index]) return;
    window.cursoSeleccionado = window.cursosData[index];
    window.cursoSeleccionadoIndex = index;
    cambiarVista("curso_especifico");
}

function initCursoEspecifico() {
    if (!window.cursoSeleccionado && window.cursosData?.length) {
        window.cursoSeleccionado = window.cursosData[0];
    }

    if (window.cursoSeleccionado) {
        if (!window.cursoSeleccionado.codigo) {
            window.cursoSeleccionado.codigo = "CUR-" + String((window.cursoSeleccionadoIndex ?? 0) + 1).padStart(3, "0");
        }
        if (!window.cursoSeleccionado.carrera) {
            window.cursoSeleccionado.carrera = "Ingeniería en Sistemas";
        }
        actualizarEncabezadoCurso(window.cursoSeleccionado);
    }

    window.currentPageAlumnosCurso = 1;
    renderAlumnosInscriptos();

    if (!window.cursoEspecificoListenersAdded) {
        const btnPrev = document.getElementById("btn-prev-alumnos");
        const btnNext = document.getElementById("btn-next-alumnos");

        if (btnPrev) btnPrev.addEventListener("click", () => cambiarPaginaAlumnos(-1));
        if (btnNext) btnNext.addEventListener("click", () => cambiarPaginaAlumnos(1));

        window.cursoEspecificoListenersAdded = true;
    }
}

window.verCursoEspecifico = verCursoEspecifico;
window.initCursoEspecifico = initCursoEspecifico;
window.getInscripcionesPorCurso = getInscripcionesPorCurso;
window.cambiarPaginaAlumnos = cambiarPaginaAlumnos;