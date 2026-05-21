// --- Configuración: al conectar API, modificar solo estas funciones de datos ---
const CURSO_INSCRIPCIONES_ALIASES = {
    "Programación I": "Programación Java Avanzada",
    "Programación II": "Programación Java Avanzada",
    "Base de Datos": "Bases de Datos con MySQL",
    "Bases de Datos Avanzadas": "Bases de Datos con MySQL",
    "Desarrollo Web Frontend": "Desarrollo Web Frontend"
};

const MATERIA_POR_NOMBRE_CURSO_INSCRIPCION = {
    "Programación Java Avanzada": "Programación I",
    "Bases de Datos con MySQL": "Base de Datos",
    "Desarrollo Web Frontend": "Desarrollo Web Frontend"
};

function nombreCursoParaInscripciones(nombreMateria) {
    return CURSO_INSCRIPCIONES_ALIASES[nombreMateria] || nombreMateria;
}

function asegurarCampoMateriaEnInscripciones() {
    if (!window.inscripcionesData) return;
    window.inscripcionesData.forEach((ins) => {
        if (!ins.materia) {
            ins.materia = MATERIA_POR_NOMBRE_CURSO_INSCRIPCION[ins.curso] || ins.curso;
        }
    });
}

/** Materia activa: la que muestra #curso-especifico-titulo (sincronizada con cursoSeleccionado). */
function getMateriaActual() {
    const elTitulo = document.getElementById("curso-especifico-titulo");
    const desdeDom = elTitulo?.textContent?.trim();
    if (desdeDom && desdeDom !== "—") return desdeDom;

    return window.cursoSeleccionado?.nombre || "";
}

function setMateriaActivaEnDom(nombreMateria) {
    const titulo = document.getElementById("curso-especifico-titulo");
    const materiaOculta = document.getElementById("curso-especifico-materia-activa");
    const refTabla = document.getElementById("alumnos-inscriptos-materia");
    const totalLabel = document.getElementById("total-alumnos-inscriptos");
    const tbody = document.getElementById("tabla-alumnos-inscriptos");

    if (titulo) titulo.textContent = nombreMateria;
    if (materiaOculta) materiaOculta.textContent = nombreMateria;
    if (refTabla) refTabla.textContent = nombreMateria ? `— ${nombreMateria}` : "";
    if (totalLabel) totalLabel.dataset.materiaFiltro = nombreMateria;
    if (tbody) tbody.dataset.materiaFiltro = nombreMateria;
}

/**
 * Alumnos inscriptos en la materia del título.
 * Reemplazar el cuerpo por fetch/API cuando corresponda.
 */
function getAlumnosPorMateria(nombreMateria) {
    if (!window.inscripcionesData || !nombreMateria) return [];

    asegurarCampoMateriaEnInscripciones();

    const nombreCursoLegacy = nombreCursoParaInscripciones(nombreMateria);

    return window.inscripcionesData.filter(
        (ins) =>
            ins.materia === nombreMateria ||
            ins.curso === nombreMateria ||
            ins.curso === nombreCursoLegacy
    );
}

function getInscripcionesPorCurso(nombreCurso) {
    return getAlumnosPorMateria(nombreCurso);
}

window.currentPageAlumnosCurso = 1;
const ROWS_PER_PAGE_ALUMNOS = 10;

function badgeEstadoAlumno(estado) {
    if (estado === "Pendiente") {
        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pendiente</span>';
    }
    return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Confirmada</span>';
}

function crearFilaAlumnoDesdePlantilla(ins) {
    const tpl = document.getElementById("tpl-fila-alumno-inscripto");
    if (!tpl?.content) return null;

    const fila = tpl.content.cloneNode(true).querySelector("tr");
    if (!fila) return null;

    const nombreEl = fila.querySelector('[data-campo="nombre"]');
    const idEl = fila.querySelector('[data-campo="inscripcion-id"]');
    const dniEl = fila.querySelector('[data-campo="dni"]');
    const fechaEl = fila.querySelector('[data-campo="fecha"]');
    const estadoEl = fila.querySelector('[data-campo="estado"]');
    const btnDiploma = fila.querySelector(".btn-diploma-alumno");

    if (nombreEl) nombreEl.textContent = ins.estudiante;
    if (idEl) idEl.textContent = `Inscripción #${ins.id}`;
    if (dniEl) dniEl.textContent = ins.dni;
    if (fechaEl) fechaEl.textContent = ins.fechaHora;
    if (estadoEl) estadoEl.innerHTML = badgeEstadoAlumno(ins.estado);
    if (btnDiploma) {
        btnDiploma.addEventListener("click", () => {
            if (typeof imprimirDiplomaIndividual === "function") {
                imprimirDiplomaIndividual(ins.estudiante, ins.curso);
            }
        });
    }

    return fila;
}

function actualizarEncabezadoCurso(curso) {
    const subtitulo = document.getElementById("curso-especifico-subtitulo");
    const nombreDetalle = document.getElementById("curso-detalle-nombre");

    setMateriaActivaEnDom(curso.nombre);
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

    const materia = getMateriaActual();
    if (!materia) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">No hay materia seleccionada.</td></tr>`;
        return;
    }

    const alumnos = getAlumnosPorMateria(materia);
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
        totalLabel.textContent = `Total: ${total} alumno${total !== 1 ? "s" : ""} en ${materia}`;
        totalLabel.dataset.materiaFiltro = materia;
    }

    if (window.cursoSeleccionado) {
        actualizarEstadisticasCurso(window.cursoSeleccionado, total);
    }

    tbody.innerHTML = "";

    if (total === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">No hay alumnos inscriptos en <strong>${materia}</strong>.</td></tr>`;
    } else {
        pagina.forEach((ins) => {
            const fila = crearFilaAlumnoDesdePlantilla(ins);
            if (fila) {
                tbody.appendChild(fila);
            } else {
                const fallback = document.createElement("tr");
                fallback.className = "hover:bg-slate-50 transition-colors";
                fallback.innerHTML = `
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
                tbody.appendChild(fallback);
            }
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
    const materia = getMateriaActual();
    if (!materia) return;

    const total = getAlumnosPorMateria(materia).length;
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
    asegurarCampoMateriaEnInscripciones();

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

    initModalEditarCurso();
}

function initModalEditarCurso() {
    const btnEditar = document.getElementById("btn-editar-curso");
    const modalEditar = document.getElementById("modal-editar-curso");
    const btnCerrar = document.getElementById("btn-cerrar-modal-editar");
    const btnCancelar = document.getElementById("btn-cancelar-editar");
    const formEditar = document.getElementById("form-editar-curso");

    if (!btnEditar || !modalEditar || btnEditar.dataset.modalInit) return;
    
    btnEditar.dataset.modalInit = "true";

    function abrirModal() {
        if (window.cursoSeleccionado) {
            document.getElementById("edit-fecha-inicio").value = window.cursoSeleccionado.fecha_inicio || "";
            document.getElementById("edit-horas").value = window.cursoSeleccionado.horas || "";
            document.getElementById("edit-inscriptos-max").value = window.cursoSeleccionado.inscriptos_max || "";
            document.getElementById("edit-estado").value = window.cursoSeleccionado.estado || "activo";
        }
        modalEditar.classList.remove("hidden");
        modalEditar.classList.add("flex");
    }

    function cerrarModal() {
        modalEditar.classList.add("hidden");
        modalEditar.classList.remove("flex");
    }

    btnEditar.addEventListener("click", abrirModal);
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarModal);

    modalEditar.addEventListener("click", (e) => {
        if (e.target === modalEditar) cerrarModal();
    });

    if (formEditar) {
        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if (window.cursoSeleccionado) {
                window.cursoSeleccionado.fecha_inicio = document.getElementById("edit-fecha-inicio").value;
                window.cursoSeleccionado.horas = parseInt(document.getElementById("edit-horas").value) || 0;
                window.cursoSeleccionado.inscriptos_max = parseInt(document.getElementById("edit-inscriptos-max").value) || 0;
                window.cursoSeleccionado.estado = document.getElementById("edit-estado").value;
                
                actualizarEstadisticasCurso(window.cursoSeleccionado, getAlumnosPorMateria(getMateriaActual()).length);
            }
            
            cerrarModal();
            
            if (typeof mostrarNotificacion === "function") {
                mostrarNotificacion("Curso actualizado correctamente", "success");
            } else {
                alert("Cambios guardados con éxito.");
            }
        });
    }
}

window.verCursoEspecifico = verCursoEspecifico;
window.initCursoEspecifico = initCursoEspecifico;
window.getMateriaActual = getMateriaActual;
window.getAlumnosPorMateria = getAlumnosPorMateria;
window.getInscripcionesPorCurso = getInscripcionesPorCurso;
window.cambiarPaginaAlumnos = cambiarPaginaAlumnos;
window.renderAlumnosInscriptos = renderAlumnosInscriptos;
