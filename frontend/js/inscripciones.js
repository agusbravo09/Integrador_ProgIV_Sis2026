import { getHeaders } from './utils/headers.js';
import { API_BASE_URL } from './config.js';

let inscripcionesData = [];
let cursosDisponibles = [];
let todosLosCursos = [];
let carritoCursos = [];
let currentPageInscripciones = 1;
const ITEMS_PER_PAGE_INSCRIPCIONES = 5;
let currentSortColumnIns = 'fecha_hora_inscripcion';
let currentSortDirectionIns = 'desc';

window.sortInscripciones = function (col) {
    if (currentSortColumnIns === col) {
        currentSortDirectionIns = currentSortDirectionIns === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumnIns = col;
        currentSortDirectionIns = 'asc';
    }
    renderInscripciones();
};

async function initInscripciones() {
    await fetchInscripciones();
    await fetchCursosParaCarrito();
    setupInscripcionesEventListeners();
}

async function fetchInscripciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/inscripciones`, { headers: getHeaders() });
        const data = await response.json();
        inscripcionesData = data || [];
        renderInscripciones();
    } catch (error) {
        console.error('Error fetching inscripciones:', error);
    }
}

function renderInscripciones() {
    const tbody = document.getElementById('tabla-inscripciones-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filterCursoId = document.getElementById('filtroCurso')?.value;
    const filterAlumnoText = normalizeString(document.getElementById('filtroAlumno')?.value || '');

    let filtered = inscripcionesData;

    if (filterCursoId || filterAlumnoText) {
        filtered = inscripcionesData.filter(ins => {
            let matchesCurso = true;
            let matchesAlumno = true;

            if (filterCursoId) {
                matchesCurso = ins.id_curso.toString() === filterCursoId;
            }

            if (filterAlumnoText) {
                const fullName = normalizeString((ins.estudiante_nombre || '') + ' ' + (ins.apellido || ''));
                const dni = ins.dni || '';
                matchesAlumno = fullName.includes(filterAlumnoText) || dni.includes(filterAlumnoText);
            }

            return matchesCurso && matchesAlumno;
        });
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-8 text-center text-slate-500 italic">Sin alumnos inscriptos</td></tr>`;
        const infoPaginacion = document.getElementById('info-paginacion');
        if (infoPaginacion) infoPaginacion.textContent = 'Mostrando 0 inscripciones';
        const btnPrev = document.getElementById('btn-prev-page');
        const btnNext = document.getElementById('btn-next-page');
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;
        return;
    }

    const sorted = [...filtered].sort((a, b) => {
        let valA = a[currentSortColumnIns];
        let valB = b[currentSortColumnIns];

        if (currentSortColumnIns === 'fecha_hora_inscripcion') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB ? valB.toLowerCase() : '';
        }

        if (valA < valB) return currentSortDirectionIns === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortDirectionIns === 'asc' ? 1 : -1;
        return 0;
    });

    document.querySelectorAll('.sort-icon').forEach(icon => icon.innerHTML = '');
    const activeIcon = document.getElementById(`sort-icon-${currentSortColumnIns}`);
    if (activeIcon) {
        activeIcon.innerHTML = currentSortDirectionIns === 'asc' ? '↑' : '↓';
    }

    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_INSCRIPCIONES) || 1;

    if (currentPageInscripciones > totalPages) {
        currentPageInscripciones = totalPages;
    }

    const startIndex = (currentPageInscripciones - 1) * ITEMS_PER_PAGE_INSCRIPCIONES;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE_INSCRIPCIONES, totalItems);

    const pageItems = sorted.slice(startIndex, endIndex);

    const infoPaginacion = document.getElementById('info-paginacion');
    if (infoPaginacion) {
        infoPaginacion.textContent = `Mostrando ${startIndex + 1} - ${endIndex} de ${totalItems} inscripciones`;
    }

    const btnPrev = document.getElementById('btn-prev-page');
    const btnNext = document.getElementById('btn-next-page');
    if (btnPrev) btnPrev.disabled = currentPageInscripciones === 1;
    if (btnNext) btnNext.disabled = currentPageInscripciones === totalPages;

    pageItems.forEach(ins => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors border-b border-slate-100';

        const fecha = new Date(ins.fecha_hora_inscripcion).toLocaleString();

        let estadoClass = ins.id_inscripcion_estado === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800';
        let estadoText = ins.id_inscripcion_estado === 1 ? 'Confirmada' : 'Pendiente';
        if (ins.id_inscripcion_estado === 2 || ins.id_inscripcion_estado === 0) {
            estadoClass = 'bg-red-100 text-red-800';
            estadoText = 'Cancelada';
        }

        tr.innerHTML = `
            <td data-label="Nº Ins." class="px-6 py-4">${ins.id_inscripcion}</td>
            <td data-label="DNI" class="px-6 py-4">${ins.dni || '-'}</td>
            <td data-label="Apellido" class="px-6 py-4">${ins.apellido || '-'}</td>
            <td data-label="Nombre" class="px-6 py-4">${ins.estudiante_nombre || '-'}</td>
            <td data-label="Fecha/Hora" class="px-6 py-4 text-xs text-slate-500">${fecha}</td>
            <td data-label="Curso" class="px-6 py-4">${ins.curso_nombre || '-'}</td>
            <td data-label="Acciones" class="px-6 py-4 text-right">
                ${estadoText !== 'Cancelada' ? `
                <button onclick="eliminarInscripcion(${ins.id_inscripcion})" class="text-red-500 hover:text-red-700 transition" title="Cancelar Inscripción">
                    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// getHeaders importado desde utils/headers.js

function setupInscripcionesEventListeners() {
    const insDni = document.getElementById('insDni');
    const insBuscadorCurso = document.getElementById('insBuscadorCurso');
    const btnNuevoEstudiante = document.getElementById('btnNuevoEstudiante');
    const btnEditarEstudiante = document.getElementById('btnEditarEstudiante');

    // Control DNI: solo números, máximo 8 dígitos
    insDni.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 8) {
            valor = valor.slice(0, 8);
        }
        e.target.value = valor;
    });

    insDni.addEventListener('blur', () => {
        const valor = insDni.value.trim();
        if (valor && /^\d{1,8}$/.test(valor)) {
            buscarEstudiantePorDni(valor);
        } else if (!valor) {
            resetEstudianteForm();
        }
    });

    insDni.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const valor = insDni.value.trim();
            if (valor && /^\d{1,8}$/.test(valor)) {
                buscarEstudiantePorDni(valor);
            }
        }
    });

    insBuscadorCurso.addEventListener('input', (e) => {
        mostrarSugerenciasCursos(e.target.value);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#insBuscadorCurso') && !e.target.closest('#insSugerenciasCursos')) {
            document.getElementById('insSugerenciasCursos').classList.add('hidden');
        }
    });

    btnNuevoEstudiante.addEventListener('click', () => {
        Swal.fire({
            title: '¿Crear nuevo estudiante?',
            text: "Serás redirigido a la sección de estudiantes para registrarlo.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ir a crear'
        }).then((result) => {
            if (result.isConfirmed) {
                window.toggleModalInscripcion(); // Cerrar modal actual
                window.cambiarVista('estudiantes'); // Cambiar a la vista de estudiantes

                setTimeout(() => {
                    if (window.toggleModalEstudiante) {
                        window.toggleModalEstudiante('estudianteModal', 'Nuevo Estudiante');
                        setTimeout(() => {
                            const docInput = document.getElementById('documento');
                            if (docInput && insDni.value) {
                                docInput.value = insDni.value;
                            }
                        }, 100);
                    }
                }, 300); // Esperar que cargue la vista
            }
        });
    });

    btnEditarEstudiante.addEventListener('click', () => {
        const idEstudiante = document.getElementById('insIdEstudiante').value;
        if (idEstudiante && window.editarEstudiante) {
            Swal.fire({
                title: '¿Editar datos del estudiante?',
                text: "Serás redirigido a la sección de estudiantes para editar sus datos.",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, ir a editar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.toggleModalInscripcion(); // Cerrar modal actual
                    window.cambiarVista('estudiantes'); // Cambiar vista
                    setTimeout(() => {
                        window.editarEstudiante(parseInt(idEstudiante));
                    }, 300); // Esperar que cargue la vista
                }
            });
        }
    });

    // Search and pagination triggers
    document.getElementById('filtroCurso')?.addEventListener('change', () => {
        currentPageInscripciones = 1;
        renderInscripciones();
    });
    document.getElementById('filtroAlumno')?.addEventListener('input', () => {
        currentPageInscripciones = 1;
        renderInscripciones();
    });
    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
        if (currentPageInscripciones > 1) {
            currentPageInscripciones--;
            renderInscripciones();
        }
    });
    document.getElementById('btn-next-page')?.addEventListener('click', () => {
        currentPageInscripciones++;
        renderInscripciones();
    });

    const originalGuardarEstudiante = window.guardarEstudiante;
    if (originalGuardarEstudiante && !window._guardarEstudianteInterceptado) {
        window.guardarEstudiante = async function () {
            await originalGuardarEstudiante();
            const dniVal = document.getElementById('insDni').value;
            if (dniVal && document.getElementById('inscripciones') && !document.getElementById('inscripciones').classList.contains('hidden')) {
                setTimeout(() => buscarEstudiantePorDni(dniVal), 500);
            }
        };
        window._guardarEstudianteInterceptado = true;
    }
}

async function buscarEstudiantePorDni(dni) {
    dni = dni.trim();
    if (!dni || !/^\d{1,8}$/.test(dni)) {
        resetEstudianteForm();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes/dni/${dni}`, {
            headers: getHeaders()
        });
        if (response.ok) {
            const estudiante = await response.json();
            document.getElementById('insIdEstudiante').value = estudiante.id_estudiante;
            document.getElementById('insNombre').value = estudiante.nombres || '';
            document.getElementById('insApellido').value = estudiante.apellido || '';
            document.getElementById('insEmail').value = estudiante.email || '';
            document.getElementById('insFechaNac').value = estudiante.fecha_nacimiento ? estudiante.fecha_nacimiento.split('T')[0] : '';

            document.getElementById('insDniError').classList.add('hidden');
            document.getElementById('btnNuevoEstudiante').classList.add('hidden');
            document.getElementById('btnEditarEstudiante').classList.remove('hidden');
            document.getElementById('insBuscadorCurso').disabled = false;
        } else {
            resetEstudianteForm();
            document.getElementById('insDni').value = dni;
            document.getElementById('insDniError').classList.remove('hidden');
            document.getElementById('btnNuevoEstudiante').classList.remove('hidden');
            document.getElementById('btnEditarEstudiante').classList.add('hidden');
            document.getElementById('insBuscadorCurso').disabled = true;
        }
        checkConfirmButton();
    } catch (error) {
        console.error('Error buscando DNI:', error);
    }
}

function resetEstudianteForm() {
    document.getElementById('insIdEstudiante').value = '';
    document.getElementById('insNombre').value = '';
    document.getElementById('insApellido').value = '';
    document.getElementById('insEmail').value = '';
    document.getElementById('insFechaNac').value = '';
    document.getElementById('insDniError').classList.add('hidden');
    document.getElementById('btnNuevoEstudiante').classList.add('hidden');
    document.getElementById('btnEditarEstudiante').classList.add('hidden');
    document.getElementById('insBuscadorCurso').disabled = true;
    checkConfirmButton();
}

async function fetchCursosParaCarrito() {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos`, { headers: getHeaders() });
        const data = await response.json();

        todosLosCursos = data;

        // Poblar el filtro global de cursos
        const selectFiltro = document.getElementById('filtroCurso');
        if (selectFiltro) {
            const prevVal = selectFiltro.value;
            selectFiltro.innerHTML = '<option value="">Todos los cursos</option>';
            todosLosCursos.forEach(c => {
                const textoAñadido = c.ocupados === 0 ? ' (Sin alumnos)' : '';
                selectFiltro.innerHTML += `<option value="${c.id_curso}">${c.nombre}${textoAñadido}</option>`;
            });
            selectFiltro.value = prevVal;
        }

        cursosDisponibles = data
            .filter(c => c.id_curso_estado === 2) // Estado: Inscripción abierta
            .map(c => {
                const cupoDisponible = (c.inscriptos_max || 0) - (c.ocupados || 0);
                return { ...c, cupoDisponible };
            })
            .filter(c => c.cupoDisponible > 0);
    } catch (error) {
        console.error('Error fetching cursos:', error);
    }
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function mostrarSugerenciasCursos(texto) {
    const ul = document.getElementById('insSugerenciasCursos');
    ul.innerHTML = '';

    if (!texto.trim()) {
        ul.classList.add('hidden');
        return;
    }

    const searchNormalized = normalizeString(texto);

    const idEstudianteSeleccionado = parseInt(document.getElementById('insIdEstudiante').value);

    const sugerencias = cursosDisponibles.filter(c => {
        const tieneCupoYNombre = c.cupoDisponible > 0 && normalizeString(c.nombre).includes(searchNormalized);
        const estaEnCarrito = carritoCursos.find(carritoC => carritoC.id_curso === c.id_curso);

        // Verificar que no tenga ya una inscripcion activa (estado 1) en este curso
        const yaInscripto = inscripcionesData.some(ins =>
            ins.id_estudiante === idEstudianteSeleccionado &&
            ins.id_curso === c.id_curso &&
            ins.id_inscripcion_estado === 1
        );

        return tieneCupoYNombre && !estaEnCarrito && !yaInscripto;
    });

    if (sugerencias.length === 0) {
        const li = document.createElement('li');
        li.className = 'p-2 text-sm text-slate-500 italic';
        li.textContent = 'No se encontraron cursos disponibles con ese nombre.';
        ul.appendChild(li);
    } else {
        sugerencias.forEach(c => {
            const li = document.createElement('li');
            li.className = 'p-2 hover:bg-institucional-50 cursor-pointer text-sm border-b border-slate-100 flex justify-between';
            li.innerHTML = `<span>${c.nombre}</span> <span class="text-xs text-slate-400">Cupo: ${c.cupoDisponible}</span>`;
            li.addEventListener('click', () => {
                agregarCursoAlCarrito(c);
                document.getElementById('insBuscadorCurso').value = '';
                ul.classList.add('hidden');
            });
            ul.appendChild(li);
        });
    }

    ul.classList.remove('hidden');
}

function agregarCursoAlCarrito(curso) {
    carritoCursos.push(curso);
    renderCarrito();
    checkConfirmButton();
}

function quitarCursoDelCarrito(id_curso) {
    carritoCursos = carritoCursos.filter(c => c.id_curso !== id_curso);
    renderCarrito();
    checkConfirmButton();
}

function renderCarrito() {
    const tbody = document.getElementById('insCarritoCursos');
    tbody.innerHTML = '';

    if (carritoCursos.length === 0) {
        tbody.innerHTML = `
            <tr id="insCarritoVacio">
                <td colspan="2" class="px-4 py-4 text-center text-slate-400 italic">No hay cursos seleccionados</td>
            </tr>
        `;
        return;
    }

    carritoCursos.forEach(c => {
        const tr = document.createElement('tr');
        if (c._failed) {
            tr.className = 'bg-red-50 transition-colors';
        } else {
            tr.className = 'hover:bg-slate-50 transition-colors';
        }

        tr.innerHTML = `
            <td class="px-4 py-3">
                <div class="font-medium">${c.nombre}</div>
                ${c._failed ? `<div class="text-xs text-red-500 mt-1">❌ Falló la inscripción (Posiblemente sin cupo)</div>` : ''}
            </td>
            <td class="px-4 py-3 text-center">
                <button type="button" onclick="quitarCursoDelCarrito(${c.id_curso})" class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition" title="Quitar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function checkConfirmButton() {
    const idEstudiante = document.getElementById('insIdEstudiante').value;
    const btn = document.getElementById('btnConfirmarInscripcion');
    if (idEstudiante && carritoCursos.length > 0) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function limpiarFormularioInscripcion() {
    document.getElementById('insDni').value = '';
    document.getElementById('insBuscadorCurso').value = '';
    resetEstudianteForm();
    carritoCursos = [];
    renderCarrito();
}

async function confirmarInscripcion() {
    const idEstudiante = document.getElementById('insIdEstudiante').value;
    if (!idEstudiante || carritoCursos.length === 0) return;

    carritoCursos.forEach(c => c._failed = false);
    renderCarrito();

    const btn = document.getElementById('btnConfirmarInscripcion');
    btn.disabled = true;
    btn.innerHTML = 'Procesando...';

    let exitosos = [];
    let fallidos = [];

    for (const curso of carritoCursos) {
        try {
            const payload = {
                id_curso: curso.id_curso,
                id_estudiante: parseInt(idEstudiante),
                id_inscripcion_estado: 1,
                id_usuario_modificacion: 1
            };

            const response = await fetch(`${API_BASE_URL}/inscripciones`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                exitosos.push(curso);
            } else {
                curso._failed = true;
                fallidos.push(curso);
            }
        } catch (error) {
            curso._failed = true;
            fallidos.push(curso);
            console.error('Error en inscripción:', error);
        }
    }

    await fetchInscripciones();
    await fetchCursosParaCarrito();

    if (fallidos.length === 0) {
        Swal.fire({
            title: '¡Inscripción confirmada!',
            text: `Se inscribió al estudiante en ${exitosos.length} curso(s) correctamente.`,
            icon: 'success',
            confirmButtonColor: '#10b981'
        });
        limpiarFormularioInscripcion();
        window.toggleModalInscripcion();
    } else {
        if (exitosos.length > 0) {
            Swal.fire({
                title: 'Inscripción parcial',
                text: `Se inscribió en ${exitosos.length} curso(s), pero fallaron ${fallidos.length}. Verifique el carrito.`,
                icon: 'warning',
                confirmButtonColor: '#f59e0b'
            });
        } else {
            Swal.fire({
                title: 'Error de inscripción',
                text: `No se pudo inscribir en ninguno de los cursos seleccionados. Verifique el carrito.`,
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }

        carritoCursos = fallidos;
        renderCarrito();
    }

    btn.innerHTML = 'Confirmar Inscripción';
    checkConfirmButton();
}

async function eliminarInscripcion(id) {
    Swal.fire({
        title: '¿Cancelar Inscripción?',
        text: "La inscripción cambiará de estado y el cupo se liberará.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/inscripciones/${id}`, {
                    method: 'DELETE',
                    headers: getHeaders()
                });
                if (res.ok) {
                    Swal.fire({
                        title: 'Cancelada',
                        text: 'La inscripción ha sido cancelada.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    await fetchInscripciones();
                    await fetchCursosParaCarrito();
                } else {
                    Swal.fire('Error', 'No se pudo cancelar la inscripción.', 'error');
                }
            } catch (e) {
                console.error(e);
                Swal.fire('Error', 'Problema de conexión.', 'error');
            }
        }
    });
}

window.toggleModalInscripcion = function () {
    const modal = document.getElementById('inscripcionModal');
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        limpiarFormularioInscripcion();
    }

    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
    document.body.classList.toggle('overflow-hidden');
};

window.initInscripciones = initInscripciones;
window.renderInscripciones = renderInscripciones;
window.eliminarInscripcion = eliminarInscripcion;
window.quitarCursoDelCarrito = quitarCursoDelCarrito;
window.confirmarInscripcion = confirmarInscripcion;