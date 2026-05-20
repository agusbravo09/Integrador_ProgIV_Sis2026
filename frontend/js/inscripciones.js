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


    

    function imprimirDiplomaIndividual(estudiante, curso) {

        alert(`Generando diploma para:\n\n${estudiante}\nCurso: ${curso}`);
    }


    

    document.querySelectorAll('[title="Anular Inscripción"]').forEach(btn => {

        btn.addEventListener("click", () => {

            const confirmar = confirm("¿Desea anular esta inscripción?");

            if (confirmar) {

                alert("Inscripción anulada correctamente.");

            }

        });

    });

    let currentPage = 1;
    const rowsPerPage = 10;

    function initPaginacion() {
        const filas = document.querySelectorAll('.fila-inscripcion');
        const totalPages = Math.ceil(filas.length / rowsPerPage);

        function mostrarPagina(page) {
            currentPage = page;
            const inicio = (currentPage - 1) * rowsPerPage;
            const fin = inicio + rowsPerPage;

            filas.forEach((fila, index) => {
                if (index >= inicio && index < fin) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });

            const info = document.getElementById('info-paginacion');
            if (info) {
                const endRow = Math.min(fin, filas.length);
                info.innerHTML = `Mostrando <span class="font-medium text-slate-700">${inicio + 1}</span> a <span class="font-medium text-slate-700">${endRow}</span> de <span class="font-medium text-slate-700">${filas.length}</span> inscripciones`;
            }

            const btnPrev = document.getElementById('btn-prev-page');
            const btnNext = document.getElementById('btn-next-page');
            if (btnPrev) btnPrev.disabled = currentPage === 1;
            if (btnNext) btnNext.disabled = currentPage === totalPages;
        }

        const btnPrev = document.getElementById('btn-prev-page');
        const btnNext = document.getElementById('btn-next-page');

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (currentPage > 1) mostrarPagina(currentPage - 1);
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (currentPage < totalPages) mostrarPagina(currentPage + 1);
            });
        }

        mostrarPagina(1);
    }

    initPaginacion();
    
    window.toggleModal = toggleModal;
    window.validarYGuardarInscripcion = validarYGuardarInscripcion;
    window.imprimirDiplomaIndividual = imprimirDiplomaIndividual;

}