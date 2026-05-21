window.inscripcionesData = window.inscripcionesData || [
    { id: 1042, fechaHora: "10/05/2026 14:30", estudiante: "Perez, Juan Ignacio", dni: "35.123.456", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1043, fechaHora: "10/05/2026 15:15", estudiante: "Gomez, Maria Laura", dni: "36.987.654", curso: "Bases de Datos con MySQL", estado: "Pendiente" },
    { id: 1044, fechaHora: "11/05/2026 09:00", estudiante: "Rodriguez, Carlos", dni: "34.555.666", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1045, fechaHora: "11/05/2026 10:30", estudiante: "Fernandez, Ana", dni: "37.111.222", curso: "Bases de Datos con MySQL", estado: "Confirmada" },
    { id: 1046, fechaHora: "11/05/2026 11:45", estudiante: "Lopez, Martin", dni: "38.222.333", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1047, fechaHora: "12/05/2026 08:20", estudiante: "Martinez, Sofia", dni: "39.333.444", curso: "Bases de Datos con MySQL", estado: "Confirmada" },
    { id: 1048, fechaHora: "12/05/2026 14:10", estudiante: "Diaz, Lucas", dni: "40.444.555", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1049, fechaHora: "13/05/2026 09:30", estudiante: "Ruiz, Florencia", dni: "41.555.666", curso: "Bases de Datos con MySQL", estado: "Confirmada" },
    { id: 1050, fechaHora: "13/05/2026 11:00", estudiante: "Alvarez, Diego", dni: "42.666.777", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1051, fechaHora: "14/05/2026 15:20", estudiante: "Romero, Julieta", dni: "43.777.888", curso: "Bases de Datos con MySQL", estado: "Pendiente" },
    { id: 1052, fechaHora: "15/05/2026 10:15", estudiante: "Sosa, Nicolas", dni: "44.888.999", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1053, fechaHora: "15/05/2026 12:45", estudiante: "Torres, Valeria", dni: "45.999.000", curso: "Bases de Datos con MySQL", estado: "Confirmada" },
    { id: 1054, fechaHora: "16/05/2026 09:10", estudiante: "Gimenez, Pablo", dni: "46.000.111", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1055, fechaHora: "16/05/2026 14:00", estudiante: "Blanco, Camila", dni: "47.111.222", curso: "Bases de Datos con MySQL", estado: "Confirmada" },
    { id: 1056, fechaHora: "17/05/2026 10:30", estudiante: "Castro, Joaquin", dni: "48.222.333", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1057, fechaHora: "18/05/2026 08:45", estudiante: "Molina, Agustina", dni: "49.333.444", curso: "Desarrollo Web Frontend", estado: "Confirmada" },
    { id: 1058, fechaHora: "19/05/2026 11:20", estudiante: "Herrera, Tomas", dni: "50.444.555", curso: "Bases de Datos con MySQL", estado: "Pendiente" },
    { id: 1059, fechaHora: "20/05/2026 09:00", estudiante: "Vega, Luciana", dni: "51.555.666", curso: "Programación Java Avanzada", estado: "Confirmada" },
    { id: 1060, fechaHora: "01/06/2026 10:00", estudiante: "Acosta, Brenda", dni: "52.111.222", curso: "Matemática Discreta", materia: "Matemática Discreta", estado: "Confirmada" },
    { id: 1061, fechaHora: "01/06/2026 11:30", estudiante: "Ponce, Federico", dni: "53.222.333", curso: "Matemática Discreta", materia: "Matemática Discreta", estado: "Confirmada" },
    { id: 1062, fechaHora: "02/06/2026 09:15", estudiante: "Ibarra, Camila", dni: "54.333.444", curso: "Matemática Discreta", materia: "Matemática Discreta", estado: "Confirmada" }
];

window.currentPageInscripciones = 1;
const ROWS_PER_PAGE_INSCRIPCIONES = 10;

function badgeEstadoInscripcion(estado) {
    if (estado === "Pendiente") {
        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pendiente</span>';
    }
    return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Confirmada</span>';
}

function renderInscripciones() {
    const tbody = document.getElementById("tabla-inscripciones-body");
    if (!tbody) return;

    const total = window.inscripcionesData.length;
    const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE_INSCRIPCIONES));

    if (window.currentPageInscripciones > totalPages) {
        window.currentPageInscripciones = totalPages;
    }

    const inicio = (window.currentPageInscripciones - 1) * ROWS_PER_PAGE_INSCRIPCIONES;
    const fin = Math.min(inicio + ROWS_PER_PAGE_INSCRIPCIONES, total);
    const pagina = window.inscripcionesData.slice(inicio, fin);

    tbody.innerHTML = "";

    pagina.forEach((ins) => {
        const fila = document.createElement("tr");
        fila.className = "hover:bg-slate-50 transition-colors fila-inscripcion";
        fila.innerHTML = `
            <td class="px-6 py-4 text-slate-500 font-mono">#${ins.id}</td>
            <td class="px-6 py-4 text-slate-600">${ins.fechaHora}</td>
            <td class="px-6 py-4">
                <div class="font-medium text-slate-800">${ins.estudiante}</div>
                <div class="text-xs text-slate-500">${ins.dni}</div>
            </td>
            <td class="px-6 py-4 text-slate-800 font-medium">${ins.curso}</td>
            <td class="px-6 py-4 text-center">${badgeEstadoInscripcion(ins.estado)}</td>
            <td class="px-6 py-4 text-right space-x-2">
                <button type="button"
                    class="text-amber-600 hover:text-amber-800 bg-amber-50 p-1.5 rounded"
                    title="Generar Diploma"
                    onclick="imprimirDiplomaIndividual('${ins.estudiante.replace(/'/g, "\\'")}', '${ins.curso.replace(/'/g, "\\'")}')">PDF</button>
                <button type="button"
                    class="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded btn-anular-inscripcion"
                    title="Anular Inscripción"
                    data-id="${ins.id}">X</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    const info = document.getElementById("info-paginacion");
    if (info) {
        const endRow = fin;
        const startRow = total === 0 ? 0 : inicio + 1;
        info.innerHTML = `Mostrando <span class="font-medium text-slate-700">${startRow}</span> a <span class="font-medium text-slate-700">${endRow}</span> de <span class="font-medium text-slate-700">${total}</span> inscripciones`;
    }

    const btnPrev = document.getElementById("btn-prev-page");
    const btnNext = document.getElementById("btn-next-page");
    if (btnPrev) btnPrev.disabled = window.currentPageInscripciones === 1;
    if (btnNext) btnNext.disabled = window.currentPageInscripciones >= totalPages;
}

function imprimirDiplomaIndividual(estudiante, curso) {
    const ins =
        window.inscripcionesData?.find(
            (i) =>
                i.estudiante === estudiante &&
                (i.curso === curso || i.materia === curso)
        ) || { estudiante, curso, dni: "—", id: "—", fechaHora: "—", estado: "Confirmada" };

    if (typeof window.emitirDiplomaAlumno === "function") {
        window.emitirDiplomaAlumno(ins);
        return;
    }

    alert(`Generando diploma para:\n\n${estudiante}\nCurso: ${curso}`);
}

function cambiarPaginaInscripciones(direction) {
    const totalPages = Math.max(1, Math.ceil(window.inscripcionesData.length / ROWS_PER_PAGE_INSCRIPCIONES));
    const nueva = window.currentPageInscripciones + direction;
    if (nueva < 1 || nueva > totalPages) return;
    window.currentPageInscripciones = nueva;
    renderInscripciones();
}

function initInscripciones() {

    function toggleModal(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.toggle("hidden");
        modal.classList.toggle("flex");
        document.body.classList.toggle("overflow-hidden");

        const errorBox = document.getElementById("errorBox");

        if (errorBox) {
            errorBox.classList.add("hidden");
            errorBox.textContent = "";
        }
    }

    function validarYGuardarInscripcion() {

        const estudiante = document.getElementById("id_estudiante");
        const curso = document.getElementById("id_curso");
        const errorBox = document.getElementById("errorBox");

        errorBox.classList.add("hidden");
        errorBox.textContent = "";

        if (!estudiante.value) {

            mostrarError("Debe seleccionar un estudiante.");

            return;
        }

        if (!curso.value) {

            mostrarError("Debe seleccionar un curso.");

            return;
        }

        const cursoSeleccionado = curso.options[curso.selectedIndex];
        const estadoCurso = cursoSeleccionado.dataset.estado;

        if (estadoCurso === "lleno") {

            mostrarError("No se puede realizar la inscripción porque el curso está lleno.");

            return;
        }

        alert("Inscripción registrada correctamente.");

        document.getElementById("inscripcionForm").reset();

        toggleModal("inscripcionModal");
    }

    function mostrarError(mensaje) {

        const errorBox = document.getElementById("errorBox");

        errorBox.textContent = mensaje;

        errorBox.classList.remove("hidden");
    }

    if (!window.inscripcionesListenersAdded) {
        const btnPrev = document.getElementById("btn-prev-page");
        const btnNext = document.getElementById("btn-next-page");

        if (btnPrev) {
            btnPrev.addEventListener("click", () => cambiarPaginaInscripciones(-1));
        }

        if (btnNext) {
            btnNext.addEventListener("click", () => cambiarPaginaInscripciones(1));
        }

        document.addEventListener("click", (e) => {
            const btnAnular = e.target.closest(".btn-anular-inscripcion");
            if (!btnAnular) return;

            const confirmar = confirm("¿Desea anular esta inscripción?");
            if (!confirmar) return;

            const id = parseInt(btnAnular.dataset.id, 10);
            const index = window.inscripcionesData.findIndex((ins) => ins.id === id);
            if (index !== -1) {
                window.inscripcionesData.splice(index, 1);
                const totalPages = Math.max(1, Math.ceil(window.inscripcionesData.length / ROWS_PER_PAGE_INSCRIPCIONES));
                if (window.currentPageInscripciones > totalPages) {
                    window.currentPageInscripciones = totalPages;
                }
                renderInscripciones();
            }

            alert("Inscripción anulada correctamente.");
        });

        window.inscripcionesListenersAdded = true;
    }

    window.currentPageInscripciones = 1;
    renderInscripciones();

    window.toggleModal = toggleModal;
    window.validarYGuardarInscripcion = validarYGuardarInscripcion;
}

window.cambiarPaginaInscripciones = cambiarPaginaInscripciones;
window.renderInscripciones = renderInscripciones;
window.imprimirDiplomaIndividual = imprimirDiplomaIndividual;