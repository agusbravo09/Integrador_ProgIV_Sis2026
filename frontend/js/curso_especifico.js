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

/** Materia activa (prioriza cursoSeleccionado; el DOM puede quedar desactualizado). */
function getMateriaActual() {
    if (window.cursoSeleccionado?.nombre) {
        return window.cursoSeleccionado.nombre;
    }

    const materiaOculta = document.getElementById("curso-especifico-materia-activa");
    const desdeOculto = materiaOculta?.textContent?.trim();
    if (desdeOculto) return desdeOculto;

    const elTitulo = document.getElementById("curso-especifico-titulo");
    const desdeDom = elTitulo?.textContent?.trim();
    if (desdeDom && desdeDom !== "—") return desdeDom;

    return "";
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

function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function obtenerIframeImpresion(id = "iframe-impresion-listado-alumnos", titulo = "Impresión") {
    let iframe = document.getElementById(id);
    if (iframe) return iframe;

    iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.setAttribute("title", titulo);
    iframe.style.cssText =
        "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(iframe);
    return iframe;
}

function imprimirHtmlEnIframe(documentoHtml, iframeId, iframeTitulo) {
    const iframe = obtenerIframeImpresion(iframeId, iframeTitulo);
    const ventana = iframe.contentWindow;
    if (!ventana) {
        alert("No se pudo preparar la impresión.");
        return;
    }

    const doc = ventana.document;
    doc.open();
    doc.write(documentoHtml);
    doc.close();

    const abrirDialogoImpresion = () => {
        ventana.focus();
        ventana.print();
    };

    iframe.onload = () => setTimeout(abrirDialogoImpresion, 150);
    setTimeout(abrirDialogoImpresion, 300);
}

function isCursadaFinalizada(curso) {
    return curso?.estado === "Finalizado";
}

function puedeEmitirDiplomaCursadaActual() {
    return isCursadaFinalizada(window.cursoSeleccionado);
}

function clasesBadgeEstadoCurso(estado) {
    if (estado === "Finalizado") return "bg-slate-100 text-slate-700";
    if (estado === "Lleno") return "bg-red-100 text-red-700";
    if (estado === "Pausado") return "bg-yellow-100 text-yellow-800";
    if (estado === "Eliminado") return "bg-red-50 text-red-600";
    return "bg-emerald-100 text-emerald-800";
}

function actualizarEstadoCursoEnDom(curso) {
    const el = document.getElementById("curso-detalle-estado");
    if (!el || !curso) return;

    const estado = curso.estado || "Activo";
    el.textContent = estado;
    el.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${clasesBadgeEstadoCurso(estado)}`;
}

function generarHtmlDiploma(ins, curso, materia) {
    const codigo = curso?.codigo || "S/C";
    const carrera = curso?.carrera || "Ingeniería en Sistemas";
    const horas = curso?.cantidad_horas ? `${curso.cantidad_horas} horas` : "—";
    const fechaEmision = new Date().toLocaleDateString("es-AR", { dateStyle: "long" });

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Diploma — ${escapeHtml(ins.estudiante)}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: Georgia, "Times New Roman", serif;
            color: #1e293b;
            margin: 0;
            padding: 2.5rem 2rem;
            text-align: center;
        }
        .diploma {
            border: 3px double #b45309;
            padding: 2.5rem 2rem;
            max-width: 720px;
            margin: 0 auto;
        }
        .institucion { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; }
        h1 { font-size: 1.75rem; margin: 1rem 0 0.5rem; color: #92400e; font-weight: normal; }
        .nombre-alumno { font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0; color: #0f172a; }
        .texto { font-size: 1rem; line-height: 1.6; margin: 0.75rem 0; color: #334155; }
        .materia { font-size: 1.15rem; font-weight: bold; color: #1e40af; margin: 0.5rem 0; }
        .meta { font-size: 0.8rem; color: #64748b; margin-top: 2rem; line-height: 1.5; }
        .firma { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid #cbd5e1; font-size: 0.85rem; color: #475569; }
        @media print { body { padding: 1rem; } @page { margin: 1.5cm; } }
    </style>
</head>
<body>
    <div class="diploma">
        <p class="institucion">Facultad — Gestión Académica</p>
        <h1>Certificado de aprobación</h1>
        <p class="texto">Se certifica que</p>
        <p class="nombre-alumno">${escapeHtml(ins.estudiante)}</p>
        <p class="texto">DNI ${escapeHtml(ins.dni)} — ha completado satisfactoriamente la cursada de</p>
        <p class="materia">${escapeHtml(materia)}</p>
        <p class="texto">Carrera: ${escapeHtml(carrera)} · Código: ${escapeHtml(codigo)} · Carga horaria: ${escapeHtml(horas)}</p>
        <p class="meta">
            Inscripción Nº ${escapeHtml(String(ins.id))} · Estado: ${escapeHtml(ins.estado)}<br>
            Fecha de emisión: ${escapeHtml(fechaEmision)}
        </p>
        <p class="firma">Documento emitido por el sistema de gestión académica.</p>
    </div>
</body>
</html>`;
}

/**
 * Emite el diploma de un alumno (PDF vía impresión del navegador).
 * Solo si la cursada seleccionada está en estado Finalizado.
 */
function emitirDiplomaAlumno(ins) {
    if (!ins) return;

    if (!puedeEmitirDiplomaCursadaActual()) {
        alert(
            "Solo se pueden emitir diplomas cuando la cursada está en estado Finalizado.\n\n" +
                `Estado actual: ${window.cursoSeleccionado?.estado || "desconocido"}.`
        );
        return;
    }

    const curso = window.cursoSeleccionado;
    const materia = getMateriaActual() || ins.materia || curso?.nombre || ins.curso;
    const html = generarHtmlDiploma(ins, curso, materia);

    imprimirHtmlEnIframe(html, "iframe-impresion-diploma-alumno", "Impresión diploma");
}

function configurarBotonDiploma(btn, ins) {
    if (!btn) return;

    const habilitado = puedeEmitirDiplomaCursadaActual();

    btn.disabled = !habilitado;
    btn.title = habilitado
        ? `Emitir diploma PDF de ${ins.estudiante}`
        : "Disponible solo cuando la cursada está Finalizada";

    if (habilitado) {
        btn.classList.remove("opacity-50", "cursor-not-allowed");
        btn.onclick = (e) => {
            e.preventDefault();
            emitirDiplomaAlumno(ins);
        };
    } else {
        btn.classList.add("opacity-50", "cursor-not-allowed");
        btn.onclick = (e) => {
            e.preventDefault();
            alert("Solo se pueden emitir diplomas cuando la cursada está en estado Finalizado.");
        };
    }
}

/**
 * Listado imprimible con todos los alumnos de la materia activa (iframe, sin pop-up).
 * En el diálogo del navegador: destino "Guardar como PDF".
 */
function imprimirListadoAlumnosMateria() {
    asegurarCampoMateriaEnInscripciones();

    const materia = getMateriaActual();
    if (!materia) {
        alert("No hay materia seleccionada para imprimir.");
        return;
    }

    const alumnos = getAlumnosPorMateria(materia);
    const curso = window.cursoSeleccionado || {};
    const codigo = curso.codigo || "S/C";
    const carrera = curso.carrera || "Sin carrera";
    const fechaEmision = new Date().toLocaleString("es-AR", {
        dateStyle: "long",
        timeStyle: "short"
    });

    const filasHtml =
        alumnos.length === 0
            ? `<tr><td colspan="5" style="text-align:center;padding:1rem;color:#64748b;">No hay alumnos inscriptos en esta materia.</td></tr>`
            : alumnos
                  .map(
                      (ins, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHtml(ins.estudiante)}</td>
                    <td>${escapeHtml(ins.dni)}</td>
                    <td>${escapeHtml(ins.fechaHora)}</td>
                    <td>${escapeHtml(ins.estado)}</td>
                </tr>`
                  )
                  .join("");

    const documentoHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado — ${escapeHtml(materia)}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #1e293b; margin: 2rem; }
        h1 { font-size: 1.35rem; margin: 0 0 0.25rem; }
        .meta { font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem; line-height: 1.5; }
        .meta strong { color: #334155; }
        table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        th, td { border: 1px solid #cbd5e1; padding: 0.45rem 0.6rem; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.03em; }
        tr:nth-child(even) td { background: #f8fafc; }
        .pie { margin-top: 1rem; font-size: 0.75rem; color: #64748b; }
        @media print {
            body { margin: 1rem; }
            @page { margin: 1.2cm; }
        }
    </style>
</head>
<body>
    <h1>Listado de alumnos — ${escapeHtml(materia)}</h1>
    <p class="meta">
        <strong>Código:</strong> ${escapeHtml(codigo)} &nbsp;|&nbsp;
        <strong>Carrera:</strong> ${escapeHtml(carrera)}<br>
        <strong>Total de alumnos:</strong> ${alumnos.length} &nbsp;|&nbsp;
        <strong>Emitido:</strong> ${escapeHtml(fechaEmision)}
    </p>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Alumno</th>
                <th>DNI</th>
                <th>Fecha de inscripción</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>${filasHtml}</tbody>
    </table>
    <p class="pie">Gestión Académica — listado generado automáticamente.</p>
</body>
</html>`;

    imprimirHtmlEnIframe(documentoHtml, "iframe-impresion-listado-alumnos", "Impresión listado de alumnos");
}

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
    configurarBotonDiploma(btnDiploma, ins);

    return fila;
}

function actualizarEncabezadoCurso(curso) {
    const subtitulo = document.getElementById("curso-especifico-subtitulo");
    const nombreDetalle = document.getElementById("curso-detalle-nombre");

    setMateriaActivaEnDom(curso.nombre);
    if (subtitulo) subtitulo.textContent = `Código: ${curso.codigo || "S/C"} - ${curso.carrera || "Sin carrera"}`;
    if (nombreDetalle) nombreDetalle.textContent = curso.nombre;
    actualizarEstadoCursoEnDom(curso);
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
                        <div class="font-medium text-slate-800">${escapeHtml(ins.estudiante)}</div>
                        <div class="text-xs text-slate-500">Inscripción #${escapeHtml(String(ins.id))}</div>
                    </td>
                    <td class="px-6 py-4 text-slate-600 font-mono text-sm">${escapeHtml(ins.dni)}</td>
                    <td class="px-6 py-4 text-slate-600">${escapeHtml(ins.fechaHora)}</td>
                    <td class="px-6 py-4 text-center">${badgeEstadoAlumno(ins.estado)}</td>
                    <td class="px-6 py-4 text-right"></td>
                `;
                const celdaAcciones = fallback.querySelector("td:last-child");
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className =
                    "text-amber-600 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded text-xs font-medium btn-diploma-alumno disabled:opacity-50 disabled:cursor-not-allowed";
                btn.textContent = "Diploma";
                configurarBotonDiploma(btn, ins);
                celdaAcciones?.appendChild(btn);
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

    if (window.vistaActual === "curso_especifico") {
        window.currentPageAlumnosCurso = 1;
        initCursoEspecifico();
        return;
    }

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

    const btnImprimir = document.getElementById("btn-imprimir-listado-alumnos");
    if (btnImprimir) {
        btnImprimir.onclick = imprimirListadoAlumnosMateria;
    }

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
window.getMateriaActual = getMateriaActual;
window.getAlumnosPorMateria = getAlumnosPorMateria;
window.getInscripcionesPorCurso = getInscripcionesPorCurso;
window.cambiarPaginaAlumnos = cambiarPaginaAlumnos;
window.renderAlumnosInscriptos = renderAlumnosInscriptos;
window.imprimirListadoAlumnosMateria = imprimirListadoAlumnosMateria;
window.emitirDiplomaAlumno = emitirDiplomaAlumno;
window.isCursadaFinalizada = isCursadaFinalizada;
window.puedeEmitirDiplomaCursadaActual = puedeEmitirDiplomaCursadaActual;
