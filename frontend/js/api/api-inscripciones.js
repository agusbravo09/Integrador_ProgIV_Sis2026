import { API_BASE_URL } from '../config.js';
import { getHeaders } from '../utils/headers.js';

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