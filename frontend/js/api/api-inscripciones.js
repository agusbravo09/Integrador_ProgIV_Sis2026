// api/api-inscripciones.js
import { API_BASE_URL } from './api-cursos.js';

// Obtiene el token y crea las cabeceras requeridas
function getHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...extraHeaders
    };
}

async function getInscripcionesByCurso(idCurso) {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${idCurso}/inscripciones`,{ headers: getHeaders()});
        const data = await response.json();
        console.log(`GET /cursos/${idCurso}/inscripciones response:`, data);
        return data;
    } catch (error) {
        console.error('Error en getInscripcionesByCurso:', error);
        return [];
    }
}

export { getInscripcionesByCurso };