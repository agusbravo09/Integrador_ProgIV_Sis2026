// Datos mockeados globalmente para la vista
window.cursosData = window.cursosData || [
    { nombre: "Programación I", descripcion: "Introducción a la programación algorítmica.", fecha_inicio: "2026-03-01", cantidad_horas: 120, inscriptos_max: 40, ocupados: 35, estado: "Activo" },
    { nombre: "Base de Datos", descripcion: "Bases de datos relacionales y SQL.", fecha_inicio: "2026-03-01", cantidad_horas: 90, inscriptos_max: 30, ocupados: 28, estado: "Activo" },
    { nombre: "Sistemas Operativos", descripcion: "Teoría y práctica de S.O.", fecha_inicio: "2026-03-15", cantidad_horas: 80, inscriptos_max: 30, ocupados: 15, estado: "Activo" },
    { nombre: "Matemática Discreta", descripcion: "Lógica matemática y grafos.", fecha_inicio: "2026-03-10", cantidad_horas: 100, inscriptos_max: 40, ocupados: 40, estado: "Lleno" },
    { nombre: "Redes y Comunicaciones", descripcion: "Protocolos y topologías de red.", fecha_inicio: "2026-04-01", cantidad_horas: 80, inscriptos_max: 25, ocupados: 20, estado: "Activo" },
    { nombre: "Desarrollo Web Frontend", descripcion: "HTML, CSS y JS moderno.", fecha_inicio: "2026-04-10", cantidad_horas: 60, inscriptos_max: 35, ocupados: 30, estado: "Activo" },
    { nombre: "Desarrollo Web Backend", descripcion: "APIs y servicios web.", fecha_inicio: "2026-04-15", cantidad_horas: 60, inscriptos_max: 30, ocupados: 25, estado: "Activo" },
    { nombre: "Ingeniería de Software", descripcion: "Patrones y metodologías ágiles.", fecha_inicio: "2026-05-01", cantidad_horas: 110, inscriptos_max: 40, ocupados: 10, estado: "Activo" },
    { nombre: "Programación II", descripcion: "Programación Orientada a Objetos.", fecha_inicio: "2026-08-01", cantidad_horas: 120, inscriptos_max: 40, ocupados: 0, estado: "Pausado" },
    { nombre: "Bases de Datos Avanzadas", descripcion: "NoSQL y optimización.", fecha_inicio: "2026-08-15", cantidad_horas: 80, inscriptos_max: 20, ocupados: 0, estado: "Pausado" },
    { nombre: "Seguridad Informática", descripcion: "Criptografía y redes seguras.", fecha_inicio: "2026-09-01", cantidad_horas: 60, inscriptos_max: 25, ocupados: 0, estado: "Activo" },
    { nombre: "Algoritmos y Estructuras", descripcion: "Estructuras de datos complejas.", fecha_inicio: "2026-08-10", cantidad_horas: 120, inscriptos_max: 45, ocupados: 0, estado: "Pausado" }
];

window.currentPageCursos = 1;

function renderCursos() {
    const tabla = document.getElementById("tablaCursos");
    if (!tabla) return;

    // Calcular items por página basado en el tamaño de la ventana
    const isMobile = window.innerWidth < 640;
    const itemsPerPage = isMobile ? 3 : 10;
    
    const totalItems = window.cursosData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Asegurarse de que la página actual sea válida al cambiar de tamaño
    if (window.currentPageCursos > totalPages) {
        window.currentPageCursos = totalPages || 1;
    }

    const startIndex = (window.currentPageCursos - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const cursosPaginados = window.cursosData.slice(startIndex, endIndex);

    tabla.innerHTML = "";

    cursosPaginados.forEach((curso) => {
        let colorEstado;
        if (curso.estado === "Lleno") colorEstado = "bg-red-100 text-red-700";
        else if (curso.estado === "Pausado") colorEstado = "bg-yellow-100 text-yellow-800";
        else if (curso.estado === "Finalizado") colorEstado = "bg-slate-100 text-slate-700";
        else colorEstado = "bg-emerald-100 text-emerald-700";

        const fila = document.createElement("tr");
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
                    <button onclick="cambiarVista('curso_especifico')" class="text-blue-600 hover:text-blue-800" title="Ver detalles">👁</button>
                    <button class="text-amber-600 hover:text-amber-800" title="Editar">✏</button>
                    <button class="text-red-600 hover:text-red-800" title="Eliminar">🗑</button>
                </div>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Actualizar controles de paginación
    const btnPrev = document.getElementById("btnPrevPage");
    const btnNext = document.getElementById("btnNextPage");
    const info = document.getElementById("paginacionInfo");

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

function initCursos() {
    window.currentPageCursos = 1; // Reiniciar a la primera página al cargar la vista
    renderCursos();
}

function toggleCursoModal() {
    const modal = document.getElementById("cursoModal");
    if (!modal) return;
    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
    document.body.classList.toggle("overflow-hidden");
}

function crearCurso() {
    const nombre = document.getElementById('nombreCurso').value.trim();
    const estadoSelect = document.getElementById('estadoCurso');
    const estadoTexto = estadoSelect.options[estadoSelect.selectedIndex].text;
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

    const nuevoCurso = {
        nombre: nombre,
        descripcion: descripcion,
        fecha_inicio: fechaInicio,
        cantidad_horas: cantidadHoras,
        inscriptos_max: inscriptosMax,
        ocupados: 0,
        estado: estadoTexto
    };

    // Agregar al inicio del array para verlo primero
    window.cursosData.unshift(nuevoCurso);

    // Limpiar formulario
    document.getElementById('nombreCurso').value = '';
    document.getElementById('estadoCurso').value = '1';
    document.getElementById('descripcionCurso').value = '';
    document.getElementById('fechaInicioCurso').value = '';
    document.getElementById('cantidadHorasCurso').value = '';
    document.getElementById('inscriptosMaximosCurso').value = '';

    // Cerrar modal y re-renderizar
    toggleCursoModal();
    window.currentPageCursos = 1; // Volver a la página 1 para ver el nuevo curso
    renderCursos();
}

window.toggleCursoModal = toggleCursoModal;
window.cambiarPaginaCursos = cambiarPaginaCursos;
window.crearCurso = crearCurso;