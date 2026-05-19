function initCursos() {

    const cursos = [
        {
            codigo: "PROG-101",
            nombre: "Programación I",
            carrera: "Tecnicatura Web",
            docente: "Dr. García",
            comision: "Com. A - Mañana",
            ocupados: 35,
            cupos: 40,
            estado: "Activo"
        },
        {
            codigo: "BD-301",
            nombre: "Base de Datos",
            carrera: "Licenciatura en Sistemas",
            docente: "Ing. López",
            comision: "Com. B - Tarde",
            ocupados: 28,
            cupos: 30,
            estado: "Activo"
        },
        {
            codigo: "SO-302",
            nombre: "Sistemas Operativos",
            carrera: "Licenciatura en Sistemas",
            docente: "Ing. Torres",
            comision: "Com. C - Noche",
            ocupados: 15,
            cupos: 30,
            estado: "Activo"
        }
    ];

    const tabla = document.getElementById("tablaCursos");

    if (!tabla) return;

    tabla.innerHTML = "";

    cursos.forEach((curso, index) => {

        const porcentaje = Math.round((curso.ocupados / curso.cupos) * 100);

        let colorBarra = "bg-green-500";

        if (porcentaje >= 85) {
            colorBarra = "bg-red-500";
        } else if (porcentaje >= 70) {
            colorBarra = "bg-yellow-500";
        }

        const fila = document.createElement("tr");

        fila.className = "hover:bg-slate-50 transition-colors";

        fila.innerHTML = `
            <td class="px-6 py-4 font-semibold text-slate-700">
                ${curso.codigo}
            </td>

            <td class="px-6 py-4 font-medium text-slate-800">
                ${curso.nombre}
            </td>

            <td class="px-6 py-4 text-slate-600">
                ${curso.carrera}
            </td>

            <td class="px-6 py-4 text-slate-600">
                ${curso.docente}
            </td>

            <td class="px-6 py-4 text-slate-600">
                ${curso.comision}
            </td>

            <td class="px-6 py-4">

                <div class="flex flex-col gap-2">

                    <div class="flex justify-between text-xs text-slate-500">
                        <span>${curso.ocupados}/${curso.cupos}</span>
                        <span>${porcentaje}%</span>
                    </div>

                    <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">

                        <div
                            class="${colorBarra} h-full rounded-full"
                            style="width:${porcentaje}%">
                        </div>

                    </div>

                </div>

            </td>

            <td class="px-6 py-4">

                <span class="px-3 py-1 rounded-full text-xs font-medium
                    bg-emerald-100 text-emerald-700">

                    ${curso.estado}

                </span>

            </td>

            <td class="px-6 py-4">

                <div class="flex justify-center gap-3">

                    <button onclick="cambiarVista('curso_especifico')" class="text-blue-600 hover:text-blue-800">
                        👁
                    </button>

                    <button class="text-amber-600 hover:text-amber-800">
                        ✏
                    </button>

                    <button class="text-red-600 hover:text-red-800">
                        🗑
                    </button>

                </div>

            </td>
        `;

        tabla.appendChild(fila);

    });

    function toggleCursoModal() {

    const modal = document.getElementById("cursoModal");

    if (!modal) return;

    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
    }

    window.toggleCursoModal = toggleCursoModal;

}