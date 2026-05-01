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
                <!-- Icono decorativo -->
                <div class="w-12 h-12 bg-institucional-50 text-institucional-600 rounded-xl flex items-center justify-center mb-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                
                <h2 class="text-xl font-bold text-slate-800 leading-tight">
                    ${curso.nombre}
                </h2>

                <p class="text-sm text-slate-500 line-clamp-2">
                    ${curso.descripcion}
                </p>

                <div class="flex justify-between items-center text-sm font-medium text-slate-500 mt-auto pt-4 border-t border-slate-100">
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
                        ${curso.horas} hs
                    </span>
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> 
                        ${curso.cupos} cupos
                    </span>
                </div>
            </div>

            <button 
                class="mt-2 w-full bg-institucional-600 text-white py-2.5 rounded-xl font-medium tracking-wide hover:bg-institucional-700 transition-all duration-200 shadow-sm active:scale-95"
                data-index="${index}">
                Inscribirme
            </button>
        `;

        contenedor.appendChild(card);
    });

    // Lógica para Inscribirse / Desinscribirse
    document.querySelectorAll("#cursosContainer button[data-index]").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.textContent.trim() === "Inscribirme") {
                // INSCRIBIRSE
                btn.textContent = "Inscripto";
                btn.classList.remove("bg-institucional-600", "hover:bg-institucional-700");
                btn.classList.add("bg-emerald-500", "hover:bg-emerald-600");
            } else {
                // DESINSCRIBIRSE
                btn.textContent = "Inscribirme";
                btn.classList.remove("bg-emerald-500", "hover:bg-emerald-600");
                btn.classList.add("bg-institucional-600", "hover:bg-institucional-700");
            }
        });
    });
}