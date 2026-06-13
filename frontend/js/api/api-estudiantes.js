const API_BASE_URL = 'http://localhost:3000/api';

// GET all estudiantes
async function getEstudiantes() {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes`);
        const data = await response.json();
        console.log('GET /estudiantes response:', data);
        return data;
    } catch (error) {
        console.error('Error en getEstudiantes:', error);
    }
}

// GET estudiante by id
async function getEstudianteById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`);
        const data = await response.json();
        console.log(`GET /estudiantes/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en getEstudianteById(${id}):`, error);
    }
}

// POST new estudiante
async function createEstudianteApi(estudianteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudianteData)
        });
        const data = await response.json();
        console.log('POST /estudiantes response:', data);
        return data;
    } catch (error) {
        console.error('Error en createEstudianteApi:', error);
    }
}

// PUT (update) estudiante
async function updateEstudianteApi(id, estudianteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudianteData)
        });
        const data = await response.json();
        console.log(`PUT /estudiantes/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en updateEstudianteApi(${id}):`, error);
    }
}

// DELETE estudiante
async function deleteEstudianteApi(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log(`DELETE /estudiantes/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en deleteEstudianteApi(${id}):`, error);
    }
}

export { getEstudiantes, getEstudianteById, createEstudianteApi, updateEstudianteApi, deleteEstudianteApi, API_BASE_URL };
