// api/api-inscripciones.js
import { API_BASE_URL } from './api-cursos.js';

async function getInscripcionesByCurso(idCurso) {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${idCurso}/inscripciones`);
        const data = await response.json();
        console.log(`GET /cursos/${idCurso}/inscripciones response:`, data);
        return data;
    } catch (error) {
        console.error('Error en getInscripcionesByCurso:', error);
        return [];
    }
}

export { getInscripcionesByCurso };