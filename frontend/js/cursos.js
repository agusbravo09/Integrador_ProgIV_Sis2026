import * as CursoApi from './api/api-cursos.js';
window.CursoApi = CursoApi; // porque usa window??
window.cursosData = window.cursosData || [];
window.currentPageCursos = 1;

function renderCursos() {
    const tabla = document.getElementById("tablaCursos");
    if (!tabla) return;

    // Calcular items por página basado en el tamaño de la ventana
    const isMobile = window.innerWidth < 640;
    const itemsPerPage = isMobile ? 3 : 10;

    const terminoBusqueda = document.getElementById("buscadorCursos") ? document.getElementById("buscadorCursos").value.toLowerCase().trim() : "";
    const filtroEstado = document.getElementById("filtroEstadoCursos") ? document.getElementById("filtroEstadoCursos").value : "";

    // Excluir cursos eliminados (estado 4)
    let datosAFiltrar = window.cursosData.filter(c => Number(c.id_curso_estado) !== 4);

    if (terminoBusqueda) {
        datosAFiltrar = datosAFiltrar.filter(c =>
            (c.nombre || "").toLowerCase().includes(terminoBusqueda) ||
            (c.descripcion || "").toLowerCase().includes(terminoBusqueda)
        );
    }

    if (filtroEstado) {
        datosAFiltrar = datosAFiltrar.filter(c => String(c.id_curso_estado) === filtroEstado);
    }

    const totalItems = datosAFiltrar.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Asegurarse de que la página actual sea válida al cambiar de tamaño o buscar
    if (window.currentPageCursos > totalPages) {
        window.currentPageCursos = totalPages || 1;
    }

    const startIndex = (window.currentPageCursos - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const cursosPaginados = datosAFiltrar.slice(startIndex, endIndex);

    tabla.innerHTML = "";

    cursosPaginados.forEach((curso, index) => {
        let colorEstado, textoEstado;
        switch (Number(curso.id_curso_estado)) {
            case 1: colorEstado = "bg-slate-100 text-slate-700"; textoEstado = "Borrador"; break;
            case 2: colorEstado = "bg-emerald-100 text-emerald-700"; textoEstado = "Inscripción abierta"; break;
            case 3: colorEstado = "bg-yellow-100 text-yellow-800"; textoEstado = "Inscripción cerrada"; break;
            case 4: colorEstado = "bg-red-100 text-red-700"; textoEstado = "Eliminado"; break;
            default: colorEstado = "bg-slate-100 text-slate-700"; textoEstado = "Activo";
        }

        const fila = document.createElement("tr");
        const realIndex = window.cursosData.indexOf(curso);
        const identifier = curso.id_curso != null ? curso.id_curso : realIndex;
        fila.className = "hover:bg-slate-50 transition-colors";

        // Formatear la fecha para que se vea linda
        let fechaMostrada = "N/A";
        if (curso.fecha_inicio) {
            const dateObj = new Date(curso.fecha_inicio);
            if (!isNaN(dateObj)) {
                fechaMostrada = dateObj.toLocaleDateString();
            }
        }

        fila.innerHTML = `
            <td data-label="Nombre" class="px-6 py-4 font-medium text-slate-800">
                ${curso.nombre}
                </td>
            <td data-label="Fecha Inicio" class="px-6 py-4 text-slate-600">${fechaMostrada}</td>
            <td data-label="Horas" class="px-6 py-4 text-slate-600">${curso.cantidad_horas} h</td>
            <td data-label="Inscriptos" class="px-6 py-4 text-slate-600">${curso.ocupados || 0} / ${curso.inscriptos_max}</td>
            <td data-label="Estado" class="px-6 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${colorEstado}">${textoEstado}</span>
            </td>
            <td data-label="Acciones" class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                <!-- BOTON DE VER -->
                    <button onclick="verCursoEspecifico(${identifier})" class="text-blue-600 hover:text-blue-900" title="Ver detalles">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                    <!-- BOTON DE IMPRIMIR -->
 <button onclick="imprimirCurso(${identifier})" class="text-slate-600 hover:text-slate-900" title="Imprimir">
    <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
</button>                
            <!-- BOTON DE EDITAR -->    
            <button onclick="editarCurso(${realIndex})" class="text-institucional-600 hover:text-institucional-900" title="Editar">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <!-- BOTON DE ELIMINAR -->
                    <button onclick="eliminarCurso(${realIndex})" class="text-red-600 hover:text-red-900" title="Eliminar">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Actualizar controles de paginación
    const btnPrev = document.getElementById("btnPrevPage");
    const btnNext = document.getElementById("btnNextPage");
    const info = document.getElementById("paginacionInfo");
    const totalTexto = document.getElementById("totalCursosTexto");

    if (totalTexto) {
        totalTexto.textContent = `Mostrando ${totalItems} cursos`;
    }

    if (btnPrev && btnNext && info) {
        btnPrev.disabled = window.currentPageCursos === 1;
        btnNext.disabled = window.currentPageCursos >= totalPages;

        info.innerHTML = `Mostrando <span class="font-medium text-slate-700">${totalItems === 0 ? 0 : startIndex + 1}</span> a <span class="font-medium text-slate-700">${endIndex}</span> de <span class="font-medium text-slate-700">${totalItems}</span> cursos`;
    }
}

function cambiarPaginaCursos(direction) {
    window.currentPageCursos += direction;
    renderCursos();
}

function filtrarCursos() {
    window.currentPageCursos = 1;
    renderCursos();
}

// Configurar listener de resize (solo una vez)
if (!window.cursosResizeListenerAdded) {
    window.addEventListener('resize', () => {
        // Solo re-renderizar si la tabla está en el DOM
        if (document.getElementById("tablaCursos")) {
            renderCursos();
        }
    });
    window.cursosResizeListenerAdded = true;
}

async function initCursos() {
    window.currentPageCursos = 1; // Reiniciar a la primera página al cargar la vista
    window.editandoCursoIndex = null;

    try {
        const apiCursos = await CursoApi.getCursos();
        if (Array.isArray(apiCursos) && apiCursos.length > 0) {
            const mapEstado = (id) => {
                switch (Number(id)) {
                    case 1: return 'Borrador';
                    case 2: return 'Inscripción abierta';
                    case 3: return 'Inscripción cerrada';
                    case 4: return 'Eliminado';
                    default: return 'Activo';
                }
            };

            window.cursosData = apiCursos.map(c => ({
                nombre: c.nombre,
                descripcion: c.descripcion,
                fecha_inicio: c.fecha_inicio,
                cantidad_horas: c.cantidad_horas,
                inscriptos_max: c.inscriptos_max,
                ocupados: c.ocupados || 0,
                id_curso_estado: c.id_curso_estado || 1,
                id_curso: c.id_curso
            }));
        }
    } catch (err) {
        console.error('Error cargando cursos desde API:', err);
    }

    renderCursos();
}

function toggleCursoModal(titulo = null) {
    const modal = document.getElementById("cursoModal");
    if (!modal) return;

    if (titulo) {
        const modalTitle = document.getElementById("modalTitleCursos");
        if (modalTitle) modalTitle.textContent = titulo;
    }

    if (modal.classList.contains('hidden')) {
        // Al abrir
        const btnGuardar = document.getElementById("btnGuardarCurso");

        if (titulo === 'Nuevo Curso') {
            const form = document.getElementById("cursoForm");
            if (form) form.reset();
            window.editandoCursoIndex = null;
            if (btnGuardar) {
                btnGuardar.textContent = "Crear Curso";
                btnGuardar.disabled = true; // Empieza deshabilitado
            }
            const estadoSelect = document.getElementById('estadoCurso');
            if (estadoSelect) estadoSelect.value = "1";
        } else {
            // Si es edición, el formulario ya se llenó y asumimos que está válido inicialmente
            if (btnGuardar) btnGuardar.disabled = false;
        }

        const errorGeneral = document.getElementById("error_general_curso");
        if (errorGeneral) {
            errorGeneral.classList.add("hidden");
            errorGeneral.textContent = "";
        }

        // Limpiar errores individuales
        mostrarErrorCampo('errorNombreCurso', '');
        mostrarErrorCampo('errorDescripcionCurso', '');
        mostrarErrorCampo('errorFechaInicioCurso', '');
        mostrarErrorCampo('errorCantidadHorasCurso', '');
        mostrarErrorCampo('errorInscriptosMaximosCurso', '');
    }

    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
    document.body.classList.toggle("overflow-hidden");
}

function mostrarErrorCampo(idError, mensaje) {
    const el = document.getElementById(idError);
    if (el) {
        if (mensaje) {
            el.textContent = mensaje;
            el.classList.remove('hidden');
        } else {
            el.textContent = '';
            el.classList.add('hidden');
        }
    }
}

function validarFormularioCurso() {
    let isValid = true;

    // Nombre
    const nombre = document.getElementById('nombreCurso').value.trim();
    if (!nombre) {
        mostrarErrorCampo('errorNombreCurso', 'El nombre es obligatorio.');
        isValid = false;
    } else if (nombre.length < 3) {
        mostrarErrorCampo('errorNombreCurso', 'Debe tener al menos 3 caracteres.');
        isValid = false;
    } else if (nombre.length > 100) {
        mostrarErrorCampo('errorNombreCurso', 'No puede exceder los 100 caracteres.');
        isValid = false;
    } else if (/<|>|script/i.test(nombre)) {
        mostrarErrorCampo('errorNombreCurso', 'Contiene caracteres no permitidos.');
        isValid = false;
    } else {
        mostrarErrorCampo('errorNombreCurso', '');
    }

    // Descripción
    const descripcion = document.getElementById('descripcionCurso').value.trim();
    if (descripcion && descripcion.length > 500) {
        mostrarErrorCampo('errorDescripcionCurso', 'No puede exceder los 500 caracteres.');
        isValid = false;
    } else {
        mostrarErrorCampo('errorDescripcionCurso', '');
    }

    // Fecha de Inicio
    const fechaInicioStr = document.getElementById('fechaInicioCurso').value;
    if (!fechaInicioStr) {
        mostrarErrorCampo('errorFechaInicioCurso', 'La fecha de inicio es obligatoria.');
        isValid = false;
    } else {
        // En Firefox/Chrome type=date siempre da YYYY-MM-DD
        const [y, m, d] = fechaInicioStr.split('-');
        const dateObj = new Date(y, m - 1, d);
        const currentYear = new Date().getFullYear();

        // Verificar si la fecha es válida (manejo de bisiestos y meses de 31)
        if (dateObj.getFullYear() != y || dateObj.getMonth() != m - 1 || dateObj.getDate() != d) {
            mostrarErrorCampo('errorFechaInicioCurso', 'Fecha inválida para el calendario.');
            isValid = false;
        } else if (y < 1954) {
            mostrarErrorCampo('errorFechaInicioCurso', 'El año debe ser 1954 o posterior.');
            isValid = false;
        } else if (y > currentYear + 2) {
            mostrarErrorCampo('errorFechaInicioCurso', `El año no puede ser mayor a ${currentYear + 2}.`);
            isValid = false;
        } else {
            mostrarErrorCampo('errorFechaInicioCurso', '');
        }
    }

    // Cantidad de Horas
    const cantidadHorasStr = document.getElementById('cantidadHorasCurso').value;
    const cantidadHoras = parseInt(cantidadHorasStr, 10);
    if (!cantidadHorasStr) {
        mostrarErrorCampo('errorCantidadHorasCurso', 'La cantidad de horas es obligatoria.');
        isValid = false;
    } else if (isNaN(cantidadHoras) || cantidadHoras < 1 || cantidadHoras > 1000) {
        mostrarErrorCampo('errorCantidadHorasCurso', 'Debe ser un número entero entre 1 y 1000.');
        isValid = false;
    } else {
        mostrarErrorCampo('errorCantidadHorasCurso', '');
    }

    // Inscriptos Máximos
    const inscriptosMaxStr = document.getElementById('inscriptosMaximosCurso').value;
    const inscriptosMax = parseInt(inscriptosMaxStr, 10);
    if (!inscriptosMaxStr) {
        mostrarErrorCampo('errorInscriptosMaximosCurso', 'La cantidad máxima es obligatoria.');
        isValid = false;
    } else if (isNaN(inscriptosMax) || inscriptosMax < 1 || inscriptosMax > 999) {
        mostrarErrorCampo('errorInscriptosMaximosCurso', 'Debe ser un número entero entre 1 y 999.');
        isValid = false;
    } else {
        mostrarErrorCampo('errorInscriptosMaximosCurso', '');
    }

    // Activar o desactivar botón
    const btnGuardar = document.getElementById('btnGuardarCurso');
    if (btnGuardar) {
        btnGuardar.disabled = !isValid;
    }

    return isValid;
}

async function crearCurso() {
    const errorGeneral = document.getElementById("error_general_curso");
    if (errorGeneral) {
        errorGeneral.classList.add("hidden");
        errorGeneral.textContent = "";
    }

    function mostrarError(msg) {
        if (errorGeneral) {
            errorGeneral.textContent = msg;
            errorGeneral.classList.remove("hidden");
        } else {
            alert(msg);
        }
    }

    const nombre = document.getElementById('nombreCurso').value.trim();
    const descripcion = document.getElementById('descripcionCurso').value.trim();
    const fechaInicio = document.getElementById('fechaInicioCurso').value;
    const cantidadHoras = parseInt(document.getElementById('cantidadHorasCurso').value);
    const inscriptosMax = parseInt(document.getElementById('inscriptosMaximosCurso').value);
    const idCursoEstado = parseInt(document.getElementById('estadoCurso').value) || 1;

    if (!validarFormularioCurso()) {
        return;
    }

    // Chequear duplicados (Mismo nombre y fecha)
    const cursoDuplicado = window.cursosData.find((c, idx) => {
        if (window.editandoCursoIndex === idx) return false;

        let mismaFecha = false;
        if (c.fecha_inicio && fechaInicio) {
            const date1 = new Date(c.fecha_inicio).toISOString().split('T')[0];
            const date2 = new Date(fechaInicio).toISOString().split('T')[0];
            mismaFecha = date1 === date2;
        }

        return (c.nombre || '').toLowerCase().trim() === nombre.toLowerCase() && mismaFecha;
    });

    if (cursoDuplicado) {
        mostrarError('Ya existe un curso con este nombre y fecha de inicio.');
        return;
    }

    // Si estamos editando
    if (window.editandoCursoIndex !== null) {
        const cursoExistente = window.cursosData[window.editandoCursoIndex];
        const cursoEditado = {
            nombre,
            descripcion,
            fecha_inicio: fechaInicio,
            cantidad_horas: cantidadHoras,
            inscriptos_max: inscriptosMax,
            id_curso_estado: idCursoEstado
        };

        if (cursoExistente?.id_curso != null) {
            try {
                const actualizado = await CursoApi.updateCursoApi(cursoExistente.id_curso, cursoEditado);
                if (actualizado) {
                    window.cursosData[window.editandoCursoIndex] = {
                        ...cursoExistente,
                        ...actualizado,
                        fecha_inicio: actualizado.fecha_inicio || fechaInicio,
                        cantidad_horas: actualizado.cantidad_horas || cantidadHoras,
                        inscriptos_max: actualizado.inscriptos_max || inscriptosMax,
                        id_curso_estado: actualizado.id_curso_estado || idCursoEstado
                    };
                }
            } catch (error) {
                console.error('Error actualizando curso:', error);
                mostrarError('No se pudo actualizar el curso. Revisa la consola para más detalles.');
                return;
            }
        } else {
            window.cursosData[window.editandoCursoIndex] = {
                ...cursoExistente,
                ...cursoEditado
            };
        }

        window.editandoCursoIndex = null;
        toggleCursoModal();
        renderCursos();
        return;
    }

    const nuevoCurso = {
        nombre,
        descripcion,
        fecha_inicio: fechaInicio,
        cantidad_horas: cantidadHoras,
        inscriptos_max: inscriptosMax,
        id_curso_estado: idCursoEstado
    };

    try {
        const creado = await CursoApi.createCursoApi(nuevoCurso);
        if (creado) {
            window.cursosData.unshift({
                nombre: creado.nombre || nombre,
                descripcion: creado.descripcion || descripcion,
                fecha_inicio: creado.fecha_inicio || fechaInicio,
                cantidad_horas: creado.cantidad_horas || cantidadHoras,
                inscriptos_max: creado.inscriptos_max || inscriptosMax,
                ocupados: creado.ocupados || 0,
                id_curso_estado: creado.id_curso_estado || idCursoEstado,
                id_curso: creado.id_curso || creado.id
            });
        }
    } catch (error) {
        console.error('Error creando curso:', error);
        mostrarError('No se pudo crear el curso. Revisa la consola para más detalles.');
        return;
    }

    toggleCursoModal();
    window.currentPageCursos = 1;
    renderCursos();
}

async function eliminarCurso(index) {
    const curso = window.cursosData?.[index];
    if (!curso) return;

    const confirmar = confirm('¿Está seguro de que desea eliminar este curso?');
    if (!confirmar) return;

    if (curso.id_curso != null) {
        try {
            await CursoApi.deleteCursoApi(curso.id_curso);
            curso.id_curso_estado = 4; // Estado 4 es ELIMINADO en tu base de datos
        } catch (error) {
            console.error('Error eliminando curso:', error);
            alert('No se pudo eliminar el curso. Revisa la consola para más detalles.');
            return;
        }
    } else {
        curso.id_curso_estado = 4;
    }

    renderCursos();
}

function editarCurso(index) {
    const curso = window.cursosData[index];
    window.editandoCursoIndex = index;

    // Cargar datos en el modal
    document.getElementById('nombreCurso').value = curso.nombre || '';
    document.getElementById('descripcionCurso').value = curso.descripcion || '';
    if (curso.fecha_inicio) {
        document.getElementById('fechaInicioCurso').value = curso.fecha_inicio.split('T')[0];
    } else {
        document.getElementById('fechaInicioCurso').value = '';
    }
    document.getElementById('cantidadHorasCurso').value = curso.cantidad_horas || '';
    document.getElementById('inscriptosMaximosCurso').value = curso.inscriptos_max || '';

    // Seleccionar estado
    const estadoSelect = document.getElementById('estadoCurso');
    if (estadoSelect && curso.id_curso_estado) {
        estadoSelect.value = curso.id_curso_estado;
    }

    // Cambiar texto del botón
    const btnGuardar = document.getElementById("btnGuardarCurso");
    if (btnGuardar) btnGuardar.textContent = "Guardar Cambios";

    // Abrir modal con título correcto
    toggleCursoModal('Editar Curso');
}

window.validarFormularioCurso = validarFormularioCurso;
window.toggleCursoModal = toggleCursoModal;
window.cambiarPaginaCursos = cambiarPaginaCursos;
window.filtrarCursos = filtrarCursos;
window.crearCurso = crearCurso;
window.eliminarCurso = eliminarCurso;
window.editarCurso = editarCurso;
window.initCursos = initCursos;