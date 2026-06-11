import * as EstudianteApi from './api/api-estudiantes.js';

window.estudiantesData = [];
window.currentPageEstudiantes = 1;
window.editandoEstudianteId = null;

// --- Control numérico para el campo documento (solo números) ---
function controlarDocumentoNumerico(event) {
    let valor = event.target.value;
    let nuevoValor = valor.replace(/\D/g, '');
    if (valor !== nuevoValor) {
        event.target.value = nuevoValor;
    }
}

function validarDocumentoAlPegar(event) {
    event.preventDefault();
    const textoPegado = (event.clipboardData || window.clipboardData).getData('text');
    const soloNumeros = textoPegado.replace(/\D/g, '');
    document.getElementById("documento").value = soloNumeros;
}

// --- Control alfabético para nombres y apellidos (sin números) ---
function controlarCampoAlfabetico(event) {
    // Permite letras (incluyendo acentos y ñ), espacios y guiones (para apellidos compuestos)
    let valor = event.target.value;
    let nuevoValor = valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s\-]/g, '');
    if (valor !== nuevoValor) {
        event.target.value = nuevoValor;
    }
}

function validarPegadoAlfabetico(event) {
    event.preventDefault();
    const textoPegado = (event.clipboardData || window.clipboardData).getData('text');
    const soloLetras = textoPegado.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s\-]/g, '');
    event.target.value = soloLetras;
}
// ------------------------------------------------------------

function renderEstudiantes() {
    const tabla = document.getElementById("tablaEstudiantes");
    if (!tabla) return;

    const isMobile = window.innerWidth < 1054;
    const itemsPerPage = isMobile ? 5 : 10;

    const terminoBusqueda = document.getElementById("buscadorEstudiantes") ? document.getElementById("buscadorEstudiantes").value.toLowerCase().trim() : "";

    // Excluir estudiantes con estado 0 (inactivos)
    let datosAFiltrar = window.estudiantesData.filter(est => est.activo !== 0);

    if (terminoBusqueda) {
        datosAFiltrar = datosAFiltrar.filter(est => {
            const doc = (est.documento || "").toLowerCase();
            const nom = (est.nombres || "").toLowerCase();
            const ape = (est.apellido || "").toLowerCase();
            return doc.includes(terminoBusqueda) || nom.includes(terminoBusqueda) || ape.includes(terminoBusqueda);
        });
    }

    const totalItems = datosAFiltrar.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (window.currentPageEstudiantes > totalPages) {
        window.currentPageEstudiantes = totalPages || 1;
    }

    const startIndex = (window.currentPageEstudiantes - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const estudiantesPaginados = datosAFiltrar.slice(startIndex, endIndex);

    tabla.innerHTML = "";

    estudiantesPaginados.forEach((est) => {
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

function filtrarEstudiantes() {
    window.currentPageEstudiantes = 1;
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

window.toggleModalEstudiante = function (idModal, titulo = null) {
    const modal = document.getElementById(idModal);
    if (!modal) return;

    if (titulo) {
        const modalTitle = document.getElementById("modalTitle");
        if (modalTitle) modalTitle.textContent = titulo;
    }

    if (modal.classList.contains('hidden')) {
        // Al abrir el modal
        if (titulo === 'Nuevo Estudiante') {
            document.getElementById("estudianteForm").reset();
            window.editandoEstudianteId = null;
        }

        const errorFecha = document.getElementById("error_fecha");
        if (errorFecha) {
            errorFecha.classList.add("hidden");
            errorFecha.textContent = "";
        }
        const errorGeneral = document.getElementById("error_general");
        if (errorGeneral) {
            errorGeneral.classList.add("hidden");
            errorGeneral.textContent = "";
        }

        // Ocultar el campo "activo" y su etiqueta para que no aparezca en el modal
        const activoInput = document.getElementById("activo");
        if (activoInput) {
            activoInput.style.display = "none";
            const label = document.querySelector('label[for="activo"]');
            if (label) label.style.display = "none";
        }

        // Documento: solo números
        const campoDocumento = document.getElementById("documento");
        if (campoDocumento) {
            campoDocumento.removeEventListener('input', controlarDocumentoNumerico);
            campoDocumento.removeEventListener('paste', validarDocumentoAlPegar);
            campoDocumento.addEventListener('input', controlarDocumentoNumerico);
            campoDocumento.addEventListener('paste', validarDocumentoAlPegar);
        }

        // Apellido: solo letras, espacios y guiones
        const campoApellido = document.getElementById("apellido");
        if (campoApellido) {
            campoApellido.removeEventListener('input', controlarCampoAlfabetico);
            campoApellido.removeEventListener('paste', validarPegadoAlfabetico);
            campoApellido.addEventListener('input', controlarCampoAlfabetico);
            campoApellido.addEventListener('paste', validarPegadoAlfabetico);
        }

        // Nombres: solo letras, espacios y guiones
        const campoNombres = document.getElementById("nombres");
        if (campoNombres) {
            campoNombres.removeEventListener('input', controlarCampoAlfabetico);
            campoNombres.removeEventListener('paste', validarPegadoAlfabetico);
            campoNombres.addEventListener('input', controlarCampoAlfabetico);
            campoNombres.addEventListener('paste', validarPegadoAlfabetico);
        }
    }

    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
    document.body.classList.toggle("overflow-hidden");
}

async function guardarEstudiante() {
    const errorGeneral = document.getElementById("error_general");
    const errorFecha = document.getElementById("error_fecha");

    if (errorGeneral) {
        errorGeneral.classList.add("hidden");
        errorGeneral.textContent = "";
    }
    if (errorFecha) {
        errorFecha.classList.add("hidden");
        errorFecha.textContent = "";
    }

    let documento = document.getElementById("documento").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    let apellido = document.getElementById("apellido").value.trim();
    let nombres = document.getElementById("nombres").value.trim();
    const email = document.getElementById("email").value.trim();

    // Determinar el valor de "activo"
    let activo;
    if (window.editandoEstudianteId) {
        // Edición: se mantiene el estado actual
        const estudianteActual = window.estudiantesData.find(e => e.id_estudiante === window.editandoEstudianteId);
        activo = estudianteActual ? estudianteActual.activo : 1; // fallback seguro
    } else {
        // Nuevo estudiante: siempre activo
        activo = 1;
    }

    // Validación de documento
    if (!documento) {
        if (errorGeneral) {
            errorGeneral.textContent = "El número de documento es obligatorio";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }
    if (!/^\d+$/.test(documento)) {
        if (errorGeneral) {
            errorGeneral.textContent = "El documento debe contener solo números";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }
    if (documento.length < 6 || documento.length > 15) {
        if (errorGeneral) {
            errorGeneral.textContent = "El documento debe tener entre 6 y 15 dígitos";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }

    // Validación de DNI duplicado
    const existingEstudiante = window.estudiantesData.find(e =>
        String(e.documento) === documento && e.id_estudiante !== window.editandoEstudianteId
    );
    if (existingEstudiante) {
        if (errorGeneral) {
            errorGeneral.textContent = "Ya existe un estudiante registrado con ese documento";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }

    // Validación de apellido (solo letras, espacios y guiones)
    if (!apellido) {
        if (errorGeneral) {
            errorGeneral.textContent = "El apellido es obligatorio";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-]+$/.test(apellido)) {
        if (errorGeneral) {
            errorGeneral.textContent = "El apellido solo puede contener letras, espacios y guiones";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }

    // Validación de nombres (solo letras, espacios y guiones)
    if (!nombres) {
        if (errorGeneral) {
            errorGeneral.textContent = "Los nombres son obligatorios";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-]+$/.test(nombres)) {
        if (errorGeneral) {
            errorGeneral.textContent = "Los nombres solo pueden contener letras, espacios y guiones";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }

    // Validación de email
    if (!email) {
        if (errorGeneral) {
            errorGeneral.textContent = "El email es obligatorio";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        if (errorGeneral) {
            errorGeneral.textContent = "Ingrese un correo electrónico válido";
            errorGeneral.classList.remove("hidden");
        }
        return;
    }

    // Validación de fecha de nacimiento
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
            const res = await EstudianteApi.updateEstudianteApi(window.editandoEstudianteId, payload);
            if (res) {
                const idx = window.estudiantesData.findIndex(e => e.id_estudiante === window.editandoEstudianteId);
                if (idx !== -1) {
                    window.estudiantesData[idx] = { ...window.estudiantesData[idx], ...payload, id_estudiante: window.editandoEstudianteId };
                }
            }
        } else {
            const res = await EstudianteApi.createEstudianteApi(payload);
            if (res) {
                window.estudiantesData.unshift({ ...payload, id_estudiante: res.id_estudiante || res.id || Date.now() });
            }
        }

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
    // Ya no se manipula el checkbox "activo"

    window.toggleModalEstudiante('estudianteModal', 'Editar Estudiante');
}

async function confirmarEliminar(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) return;

    try {
        await EstudianteApi.deleteEstudianteApi(id);
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

// Exposición global
window.initEstudiantes = initEstudiantes;
window.renderEstudiantes = renderEstudiantes;
window.cambiarPaginaEstudiantes = cambiarPaginaEstudiantes;
window.filtrarEstudiantes = filtrarEstudiantes;
window.guardarEstudiante = guardarEstudiante;
window.editarEstudiante = editarEstudiante;
window.confirmarEliminar = confirmarEliminar;