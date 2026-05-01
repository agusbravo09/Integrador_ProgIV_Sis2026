const cursos = [
    {
        nombre: "Programación 1",
        descripcion: "Introducción a la programación",
        horas: 60,
        cupos: 30
    },
    {
        nombre: "Base de Datos",
        descripcion: "Modelado y SQL",
        horas: 40,
        cupos: 25
    },
    {
        nombre: "Desarrollo Web",
        descripcion: "HTML, CSS y JavaScript",
        horas: 50,
        cupos: 35
    }
];

const contenedor = document.getElementById("cursosContainer");

function renderCursos() {
    contenedor.innerHTML = "";

    cursos.forEach((curso, index) => {

        const card = document.createElement("div");

        card.className = `
            bg-white/70 backdrop-blur-md
            rounded-3xl shadow-lg
            p-6 flex flex-col gap-4
            hover:shadow-2xl hover:-translate-y-2
            transition-all duration-300
        `;

        card.innerHTML = `
            <div class="flex flex-col gap-2">
                <h2 class="text-xl font-bold text-slate-800">
                    ${curso.nombre}
                </h2>

                <p class="text-sm text-slate-600">
                    ${curso.descripcion}
                </p>

                <div class="flex justify-between text-sm text-slate-500 mt-2">
                    <span>⏱ ${curso.horas} hs</span>
                    <span>👥 ${curso.cupos} cupos</span>
                </div>
            </div>

            <button 
                class="mt-2 w-full bg-institucional-600 text-white py-2.5 rounded-xl font-semibold tracking-wide
                hover:bg-institucional-700 transition-all duration-200
                shadow-lg hover:shadow-2xl border border-institucional-700
                active:scale-95"
                data-index="${index}">
                Inscribirme
            </button>
        `;

        contenedor.appendChild(card);
    });
document.querySelectorAll("button[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {

        const i = btn.getAttribute("data-index");
        const curso = cursos[i];

        if (btn.textContent === "Inscribirme") {

            // INSCRIBIRSE
            btn.textContent = "Inscripto";

            btn.classList.remove("bg-institucional-600", "hover:bg-institucional-700");
            btn.classList.add("bg-green-500", "text-white", "shadow-lg");

        } else {

            // DESINSCRIBIRSE
            btn.textContent = "Inscribirme";

            btn.classList.remove("bg-green-500", "shadow-lg");
            btn.classList.add("bg-institucional-600", "hover:bg-institucional-700");

        }

    });
});
}

renderCursos();