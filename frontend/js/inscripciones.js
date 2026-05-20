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

    
    window.toggleModal = toggleModal;
    window.validarYGuardarInscripcion = validarYGuardarInscripcion;
    window.imprimirDiplomaIndividual = imprimirDiplomaIndividual;

}