// frontend/js/cursos.js

const cursos = [
    {
        nombre: "Programación 1",
        descripcion: "Introducción a la programación y algoritmos básicos.",
        horas: 60,
        cupos: 30
    },
    {
        nombre: "Base de Datos",
        descripcion: "Modelado relacional y sentencias SQL.",
        horas: 40,
        cupos: 25
    },
    {
        nombre: "Desarrollo Web",
        descripcion: "Maquetado avanzado con HTML, CSS y JavaScript.",
        horas: 50,
        cupos: 35
    }
];

// Envolvemos todo en una función que main.js va a llamar
function initCursos() {
    const contenedor = document.getElementById("cursosContainer");
    
    // Si por alguna razón el contenedor no existe, abortamos para no dar error
    if (!contenedor) return;

    contenedor.innerHTML = "";

    cursos.forEach((curso, index) => {
        const card = document.createElement("div");

        // Clases de la tarjeta (Adaptadas para que combinen con la UI clara)
        card.className = `
            bg-white border border-slate-200
            rounded-2xl shadow-sm
            p-6 flex flex-col gap-4
            hover:shadow-lg hover:-translate-y-1 hover:border-institucional-300
            transition-all duration-300
        `;

            card.innerHTML = `
                <div class="flex flex-col gap-2 flex-grow">

                    <!-- Icono -->
                    <div class="w-12 h-12 bg-institucional-50 text-institucional-600 rounded-xl flex items-center justify-center mb-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                            </path>
                        </svg>
                    </div>

                    <!-- Nombre -->
                    <h2 class="text-xl font-bold text-slate-800 leading-tight">
                        ${curso.nombre}
                    </h2>

                    <!-- Descripción -->
                    <p class="text-sm text-slate-500">
                        ${curso.descripcion}
                    </p>

                    <!-- Info -->
                    <div class="flex justify-between items-center text-sm font-medium text-slate-500 mt-auto pt-4 border-t border-slate-100">

                        <span class="flex items-center gap-1">
                            ⏱ ${curso.horas} hs
                        </span>

                        <span class="flex items-center gap-1">
                            👥 ${curso.cupos} cupos
                        </span>

                    </div>
                </div>

                <!-- Botones -->
                <div class="flex gap-2 mt-2">

                    <button 
                        class="flex-1 bg-institucional-600 text-white py-2.5 rounded-xl font-medium
                        hover:bg-institucional-700 transition-all duration-200 shadow-sm active:scale-95"
                        data-index="${index}">
                        Gestionar
                    </button>

                    <button 
                        class="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium
                        hover:bg-red-600 transition-all duration-200 shadow-sm active:scale-95"
                        data-delete="${index}">
                        Eliminar
                    </button>

                </div>
            `;

            contenedor.appendChild(card);
        });

        // BOTÓN GESTIONAR
        document.querySelectorAll("button[data-index]").forEach(btn => {

            btn.addEventListener("click", () => {

                const i = btn.getAttribute("data-index");
                // Temporal hasta conectar con backend
                alert(`Gestionando curso: ${cursos[i].nombre}`);

            });

        });

        // BOTÓN ELIMINAR
        document.querySelectorAll("button[data-delete]").forEach(btn => {

            btn.addEventListener("click", () => {

                const i = btn.getAttribute("data-delete");

                const confirmar = confirm(`¿Eliminar ${cursos[i].nombre}?`);

                if (confirmar) {

                    cursos.splice(i, 1);

                    renderCursos();

                }

            });

        });

    }

    // Render inicial
    function renderCursos() {
        initCursos();
    }

renderCursos();