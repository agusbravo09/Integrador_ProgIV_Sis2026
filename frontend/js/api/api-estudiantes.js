const API_BASE_URL = 'http://localhost:3000/api';

// Obtiene el token y crea las cabeceras requeridas
function getHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...extraHeaders
    };
}

// GET all estudiantes
async function getEstudiantes() {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes`, {
            headers: getHeaders()
        });
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
        const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
            headers: getHeaders()
        });
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
            headers: getHeaders(),
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
            headers: getHeaders(),
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
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await response.json();
        console.log(`DELETE /estudiantes/${id} response:`, data);
        return data;
    } catch (error) {
        console.error(`Error en deleteEstudianteApi(${id}):`, error);
    }
}

export { getEstudiantes, getEstudianteById, createEstudianteApi, updateEstudianteApi, deleteEstudianteApi, API_BASE_URL };
