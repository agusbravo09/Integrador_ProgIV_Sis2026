function initInscripciones() {
    //console.log("INSCRIPCIONES JS CARGADO");

    function toggleModal(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.toggle("hidden");
        modal.classList.toggle("flex");

        // Limpiar errores al abrir/cerrar
        const errorBox = document.getElementById("errorBox");

        if (errorBox) {
            errorBox.classList.add("hidden");
            errorBox.textContent = "";
        }
    }


    // VALIDAR Y GUARDAR

    function validarYGuardarInscripcion() {

        const estudiante = document.getElementById("id_estudiante");
        const curso = document.getElementById("id_curso");
        const errorBox = document.getElementById("errorBox");

        // Limpiar errores previos
        errorBox.classList.add("hidden");
        errorBox.textContent = "";

        // Validación estudiante
        if (!estudiante.value) {

            mostrarError("Debe seleccionar un estudiante.");

            return;
        }

        // Validación curso
        if (!curso.value) {

            mostrarError("Debe seleccionar un curso.");

            return;
        }

        // Validar si está lleno
        const cursoSeleccionado = curso.options[curso.selectedIndex];
        const estadoCurso = cursoSeleccionado.dataset.estado;

        if (estadoCurso === "lleno") {

            mostrarError("No se puede realizar la inscripción porque el curso está lleno.");

            return;
        }

        // Simulación de guardado
        alert("Inscripción registrada correctamente.");

        // Limpiar formulario
        document.getElementById("inscripcionForm").reset();

        // Cerrar modal
        toggleModal("inscripcionModal");
    }

    // MOSTRAR ERRORES


    function mostrarError(mensaje) {

        const errorBox = document.getElementById("errorBox");

        errorBox.textContent = mensaje;

        errorBox.classList.remove("hidden");
    }


    // GENERAR DIPLOMA

    function imprimirDiplomaIndividual(estudiante, curso) {

        alert(`Generando diploma para:\n\n${estudiante}\nCurso: ${curso}`);
    }


    // ANULAR INSCRIPCIÓN

    document.querySelectorAll('[title="Anular Inscripción"]').forEach(btn => {

        btn.addEventListener("click", () => {

            const confirmar = confirm("¿Desea anular esta inscripción?");

            if (confirmar) {

                alert("Inscripción anulada correctamente.");

            }

        });

    });

    // Hacer funciones globales
    window.toggleModal = toggleModal;
    window.validarYGuardarInscripcion = validarYGuardarInscripcion;
    window.imprimirDiplomaIndividual = imprimirDiplomaIndividual;

}