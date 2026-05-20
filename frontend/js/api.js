const API_BASE_URL = 'http://localhost:3000/api';

// GET all cursos
//Retorna todos los cursos
async function getCursos() {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos`);
        const data = await response.json();
        console.log('GET /cursos response:', data);
        return data;
    } catch (error) {
        console.error('Error en getCursos:', error);
    }
}

// GET curso by id
// Retorna un curso por id
async function getCursoById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${id}`);
        const data = await response.json();
        console.log(`GET /cursos/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en getCursoById(${id}):`, error);
    }
}

// POST new curso
// DATOS REQUERIDOS
// nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max.
async function createCursoApi(cursoData) {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursoData)
        });
        const data = await response.json();
        console.log('POST /cursos response:', data);
        return data;
    } catch (error) {
        console.error('Error en createCursoApi:', error);
    }
}

// PUT (update) curso
// DATOS REQUERIDOS
// nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max
async function updateCursoApi(id, cursoData) {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursoData)
        });
        const data = await response.json();
        console.log(`PUT /cursos/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en updateCursoApi(${id}):`, error);
    }
}

// DELETE curso
async function deleteCursoApi(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log(`DELETE /cursos/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en deleteCursoApi(${id}):`, error);
    }
}

window.apiCursos = {
    getCursos,
    getCursoById,
    createCurso: createCursoApi,
    updateCurso: updateCursoApi,
    deleteCurso: deleteCursoApi
};