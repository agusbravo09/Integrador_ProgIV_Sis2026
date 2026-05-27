import * as EstudianteApi from './api/api-estudiantes.js';

window.estudiantesData = [];
window.currentPageEstudiantes = 1;
window.editandoEstudianteId = null;

function renderEstudiantes() {
    const tabla = document.getElementById("tablaEstudiantes");
    if (!tabla) return;

    const isMobile = window.innerWidth < 1054; // Mismo breakpoint que la CSS
    const itemsPerPage = isMobile ? 5 : 10;

    const totalItems = window.estudiantesData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (window.currentPageEstudiantes > totalPages) {
        window.currentPageEstudiantes = totalPages || 1;
    }

    const startIndex = (window.currentPageEstudiantes - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const estudiantesPaginados = window.estudiantesData.slice(startIndex, endIndex);

    tabla.innerHTML = "";

    estudiantesPaginados.forEach((est, index) => {
        let colorEstado = est.activo ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800";
        let textoEstado = est.activo ? "Activo" : "Inactivo";

        const fila = document.createElement("tr");
        fila.className = "hover:bg-slate-50 transition-colors";

        let fechaNac = "N/A";
        if (est.fecha_nacimiento) {
            const dateObj = new Date(est.fecha_nacimiento);
            if (!isNaN(dateObj)) fechaNac = dateObj.toLocaleDateString();
        }

        fila.innerHTML = `
            <td data-label="Documento" class="px-6 py-4 text-slate-600">${est.documento || ''}</td>
            <td data-label="Estudiante" class="px-6 py-4">
                <div class="font-medium text-slate-800">${est.apellido}, ${est.nombres}</div>
                <div class="text-xs text-slate-500">Nac: ${fechaNac}</div>
            </td>
            <td data-label="Email" class="px-6 py-4 text-slate-600">${est.email || ''}</td>
            <td data-label="Estado" class="px-6 py-4 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorEstado}">
                    ${textoEstado}
                </span>
            </td>
            <td data-label="Acciones" class="px-6 py-4 text-right space-x-2">
                <button onclick="editarEstudiante(${est.id_estudiante})" class="text-institucional-600 hover:text-institucional-900" title="Editar">
                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
                <button onclick="confirmarEliminar(${est.id_estudiante})" class="text-red-600 hover:text-red-900" title="Eliminar">
                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Paginacion
    const btnPrev = document.getElementById("btnPrevPageEstudiantes");
    const btnNext = document.getElementById("btnNextPageEstudiantes");
    const info = document.getElementById("paginacionInfoEstudiantes");

    if (btnPrev && btnNext && info) {
        btnPrev.disabled = window.currentPageEstudiantes === 1;
        btnNext.disabled = window.currentPageEstudiantes >= totalPages;

        if (totalItems === 0) {
            info.innerHTML = `Mostrando 0 estudiantes`;
        } else {
            info.innerHTML = `Mostrando <span class="font-medium text-slate-700">${startIndex + 1}</span> a <span class="font-medium text-slate-700">${endIndex}</span> de <span class="font-medium text-slate-700">${totalItems}</span> estudiantes`;
        }
    }
}

function cambiarPaginaEstudiantes(direction) {
    window.currentPageEstudiantes += direction;
    renderEstudiantes();
}

if (!window.estudiantesResizeListenerAdded) {
    window.addEventListener('resize', () => {
        if (document.getElementById("tablaEstudiantes")) {
            renderEstudiantes();
        }
    });
    window.estudiantesResizeListenerAdded = true;
}

async function initEstudiantes() {
    window.currentPageEstudiantes = 1;
    window.editandoEstudianteId = null;

    const tabla = document.getElementById("tablaEstudiantes");
    if (tabla) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-500">Cargando estudiantes...</td></tr>';
    }

    try {
        const datos = await EstudianteApi.getEstudiantes();
        if (Array.isArray(datos)) {
            // Ordenamos alfabéticamente por apellido (ignorando mayúsculas/minúsculas)
            window.estudiantesData = datos.sort((a, b) =>
                (a.apellido || '').localeCompare(b.apellido || '', undefined, { sensitivity: 'base' })
            );
        } else {
            window.estudiantesData = [];
        }
    } catch (err) {
        console.error('Error al inicializar estudiantes:', err);
        window.estudiantesData = [];
    }

    renderEstudiantes();
}

// Ojo: toggleModal parece existir globalmente para otras vistas, pero lo defino con otro nombre para aislar si es necesario,
// o uso el global si en main.js ya existe uno (en tu html llamas a `toggleModal`).
// Vamos a usar uno específico para evitar conflicto si se pisan.
window.toggleModalEstudiante = function (idModal, titulo = null) {
    const modal = document.getElementById(idModal);
    if (!modal) return;

    if (titulo) {
        const modalTitle = document.getElementById("modalTitle");
        if (modalTitle) modalTitle.textContent = titulo;
    }

    if (modal.classList.contains('hidden')) {
        // Abrir
        if (titulo === 'Nuevo Estudiante') {
            document.getElementById("estudianteForm").reset();
            window.editandoEstudianteId = null;
        }
        
        // Limpiar mensajes de error
        const errorFecha = document.getElementById("error_fecha");
        if (errorFecha) {
            errorFecha.classList.add("hidden");
            errorFecha.textContent = "";
        }
    }

    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
    document.body.classList.toggle("overflow-hidden");
}

async function guardarEstudiante() {
    const documento = document.getElementById("documento").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const apellido = document.getElementById("apellido").value.trim();
    const nombres = document.getElementById("nombres").value.trim();
    const email = document.getElementById("email").value.trim();
    const activo = document.getElementById("activo").checked ? 1 : 0;

    if (!documento || !apellido || !nombres) {
        alert("Por favor complete los campos obligatorios (*)");
        return;
    }

    // Validación de fecha de nacimiento
    const errorFecha = document.getElementById("error_fecha");
    if (errorFecha) errorFecha.classList.add("hidden");

    if (!fecha_nacimiento) {
        if (errorFecha) {
            errorFecha.textContent = "Ingrese una fecha válida";
            errorFecha.classList.remove("hidden");
        }
        return;
    }
    const dateObj = new Date(fecha_nacimiento);
    if (isNaN(dateObj.getTime()) || dateObj.getFullYear() < 1900 || dateObj.getFullYear() > new Date().getFullYear()) {
        if (errorFecha) {
            errorFecha.textContent = "Ingrese una fecha válida";
            errorFecha.classList.remove("hidden");
        }
        return;
    }

    const payload = {
        documento,
        apellido,
        nombres,
        email,
        activo,
        fecha_nacimiento: fecha_nacimiento || null
    };

    try {
        if (window.editandoEstudianteId) {
            // Edit
            const res = await EstudianteApi.updateEstudianteApi(window.editandoEstudianteId, payload);
            if (res) {
                // Actualizar array local
                const idx = window.estudiantesData.findIndex(e => e.id_estudiante === window.editandoEstudianteId);
                if (idx !== -1) {
                    window.estudiantesData[idx] = { ...window.estudiantesData[idx], ...payload, id_estudiante: window.editandoEstudianteId };
                }
            }
        } else {
            // Create
            const res = await EstudianteApi.createEstudianteApi(payload);
            if (res) {
                window.estudiantesData.unshift({ ...payload, id_estudiante: res.id_estudiante || res.id || Date.now() });
            }
        }

        // Re-ordenamos alfabéticamente por si se modificó o agregó un apellido
        window.estudiantesData.sort((a, b) =>
            (a.apellido || '').localeCompare(b.apellido || '', undefined, { sensitivity: 'base' })
        );

        window.toggleModalEstudiante('estudianteModal');
        renderEstudiantes();
    } catch (e) {
        alert("Error al guardar estudiante.");
        console.error(e);
    }
}

function editarEstudiante(id) {
    const est = window.estudiantesData.find(e => e.id_estudiante === id);
    if (!est) return;

    window.editandoEstudianteId = id;

    document.getElementById("documento").value = est.documento || '';
    if (est.fecha_nacimiento) {
        document.getElementById("fecha_nacimiento").value = est.fecha_nacimiento.split('T')[0];
    } else {
        document.getElementById("fecha_nacimiento").value = '';
    }
    document.getElementById("apellido").value = est.apellido || '';
    document.getElementById("nombres").value = est.nombres || '';
    document.getElementById("email").value = est.email || '';
    document.getElementById("activo").checked = est.activo == 1;

    window.toggleModalEstudiante('estudianteModal', 'Editar Estudiante');
}

async function confirmarEliminar(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) return;

    try {
        await EstudianteApi.deleteEstudianteApi(id);
        
        // En lugar de borrarlo del array (filter), lo marcamos como inactivo localmente 
        // para que se pinte de rojo y siga en la tabla.
        const idx = window.estudiantesData.findIndex(e => e.id_estudiante === id);
        if (idx !== -1) {
            window.estudiantesData[idx].activo = 0;
        }
        
        renderEstudiantes();
    } catch (e) {
        alert("Error al eliminar estudiante.");
        console.error(e);
    }
}

// Global exposure
window.initEstudiantes = initEstudiantes;
window.renderEstudiantes = renderEstudiantes;
window.cambiarPaginaEstudiantes = cambiarPaginaEstudiantes;
window.guardarEstudiante = guardarEstudiante;
window.editarEstudiante = editarEstudiante;
window.confirmarEliminar = confirmarEliminar;
