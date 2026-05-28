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
    
    // Filtro de búsqueda
    const terminoBusqueda = document.getElementById("buscadorCursos") ? document.getElementById("buscadorCursos").value.toLowerCase().trim() : "";
    
    let datosAFiltrar = window.cursosData;
    if (terminoBusqueda) {
        datosAFiltrar = datosAFiltrar.filter(curso => {
            const nom = (curso.nombre || "").toLowerCase();
            const desc = (curso.descripcion || "").toLowerCase();
            return nom.includes(terminoBusqueda) || desc.includes(terminoBusqueda);
        });
    }

    const totalItems = datosAFiltrar.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    // Asegurarse de que la página actual sea válida al cambiar de tamaño
    if (window.currentPageCursos > totalPages) {
        window.currentPageCursos = totalPages || 1;
    }

    const startIndex = (window.currentPageCursos - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const cursosPaginados = datosAFiltrar.slice(startIndex, endIndex);

    tabla.innerHTML = "";

    cursosPaginados.forEach((curso, index) => {
        let colorEstado;
        if (curso.estado === "Lleno") colorEstado = "bg-red-100 text-red-700";
        else if (curso.estado === "Pausado") colorEstado = "bg-yellow-100 text-yellow-800";
        else if (curso.estado === "Finalizado") colorEstado = "bg-slate-100 text-slate-700";
        else colorEstado = "bg-emerald-100 text-emerald-700";

        const fila = document.createElement("tr");
        const realIndex = startIndex + index;
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
                <div class="text-xs text-slate-500 font-normal hidden md:block mt-1 truncate max-w-[200px]" title="${curso.descripcion || ''}">${curso.descripcion || ''}</div>
            </td>
            <td data-label="Fecha Inicio" class="px-6 py-4 text-slate-600">${fechaMostrada}</td>
            <td data-label="Horas" class="px-6 py-4 text-slate-600">${curso.cantidad_horas} h</td>
            <td data-label="Inscriptos Máx" class="px-6 py-4 text-slate-600">${curso.inscriptos_max}</td>
            <td data-label="Estado" class="px-6 py-4 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${colorEstado}">${curso.estado}</span>
            </td>
            <td data-label="Acciones" class="px-6 py-4 text-right">
                <div class="flex justify-end gap-3">
                    <button onclick="verCursoEspecifico(${identifier})" class="text-blue-600 hover:text-blue-800" title="Ver detalles">👁</button>
                    <button onclick="editarCurso(${realIndex})" class="text-amber-600 hover:text-amber-800" title="Editar"> ✏ </button>
                    <button onclick="eliminarCurso(${realIndex})" class="text-red-600 hover:text-red-800" title="Eliminar"> 🗑 </button>
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
                //estado: mapEstado(c.id_curso_estado),
                estado: 'Activo',
                id_curso: c.id_curso
            }));
        }
    } catch (err) {
        console.error('Error cargando cursos desde API:', err);
    }

    renderCursos();
}

function toggleCursoModal() {
    const modal = document.getElementById("cursoModal");
    if (!modal) return;
    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
    document.body.classList.toggle("overflow-hidden");
}

async function crearCurso() {
    const nombre = document.getElementById('nombreCurso').value.trim();
    const descripcion = document.getElementById('descripcionCurso').value.trim();
    const fechaInicio = document.getElementById('fechaInicioCurso').value;
    const cantidadHoras = parseInt(document.getElementById('cantidadHorasCurso').value);
    const inscriptosMax = parseInt(document.getElementById('inscriptosMaximosCurso').value);

    // Validaciones básicas
    if (!nombre) {
        alert('Por favor, ingrese el Nombre del Curso.');
        return;
    }

    if (isNaN(cantidadHoras) || cantidadHoras <= 0) {
        alert('Por favor, ingrese una cantidad de horas válida.');
        return;
    }

    if (isNaN(inscriptosMax) || inscriptosMax <= 0) {
        alert('Por favor, ingrese un número máximo de inscriptos válido.');
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
            inscriptos_max: inscriptosMax
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
                        inscriptos_max: actualizado.inscriptos_max || inscriptosMax
                    };
                }
            } catch (error) {
                console.error('Error actualizando curso:', error);
                alert('No se pudo actualizar el curso. Revisa la consola para más detalles.');
                return;
            }
        } else {
            window.cursosData[window.editandoCursoIndex] = {
                ...cursoExistente,
                ...cursoEditado
            };
        }

        window.editandoCursoIndex = null;

        const botonCrear = document.querySelector('.bg-institucional-600');
        if (botonCrear) botonCrear.textContent = "Crear Curso";

        toggleCursoModal();
        renderCursos();
        return;
    }

    const nuevoCurso = {
        nombre,
        descripcion,
        fecha_inicio: fechaInicio,
        cantidad_horas: cantidadHoras,
        inscriptos_max: inscriptosMax
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
                estado: 'Activo',
                id_curso: creado.id_curso || creado.id
            });
        }
    } catch (error) {
        console.error('Error creando curso:', error);
        alert('No se pudo crear el curso. Revisa la consola para más detalles.');
        return;
    }

    document.getElementById('nombreCurso').value = '';
    document.getElementById('estadoCurso').value = '1';
    document.getElementById('descripcionCurso').value = '';
    document.getElementById('fechaInicioCurso').value = '';
    document.getElementById('cantidadHorasCurso').value = '';
    document.getElementById('inscriptosMaximosCurso').value = '';

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
            curso.estado = 'Eliminado';
        } catch (error) {
            console.error('Error eliminando curso:', error);
            alert('No se pudo eliminar el curso. Revisa la consola para más detalles.');
            return;
        }
    } else {
        curso.estado = 'Eliminado';
    }

    renderCursos();
}

function editarCurso(index) {

    const curso = window.cursosData[index];

    // Guardamos el índice del curso editado
    window.editandoCursoIndex = index;

    // Cargar datos en el modal
    document.getElementById('nombreCurso').value = curso.nombre;
    document.getElementById('descripcionCurso').value = curso.descripcion;
    document.getElementById('fechaInicioCurso').value = curso.fecha_inicio;
    document.getElementById('cantidadHorasCurso').value = curso.cantidad_horas;
    document.getElementById('inscriptosMaximosCurso').value = curso.inscriptos_max;

    // Seleccionar estado
    //const estadoSelect = document.getElementById('estadoCurso');

   // if (curso.estado === "Activo") estadoSelect.value = "1";
   // else if (curso.estado === "Pausado") estadoSelect.value = "2";
   // else if (curso.estado === "Finalizado") estadoSelect.value = "3";

    // Cambiar texto del botón
    const botonCrear = document.querySelector('.bg-institucional-600');

    botonCrear.textContent = "Cursos";

    // Abrir modal
    toggleCursoModal();
}

window.toggleCursoModal = toggleCursoModal;
window.cambiarPaginaCursos = cambiarPaginaCursos;
window.filtrarCursos = filtrarCursos;
window.crearCurso = crearCurso;
window.eliminarCurso = eliminarCurso;
window.editarCurso = editarCurso;
window.initCursos = initCursos;