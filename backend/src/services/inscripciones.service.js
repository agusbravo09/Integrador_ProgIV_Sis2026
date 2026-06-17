import * as InscripcionesRepo from '../repository/inscripciones.repository.js';
import * as CursosRepo from '../repository/cursos.repository.js';

export const findAll = async () => {
    return InscripcionesRepo.findAll();
}

export const getById = async (id) => {
    return InscripcionesRepo.getById(id);
}

export const getByCurso = async (id_curso) => {
    return InscripcionesRepo.findByCourse(id_curso);
}

export const create = async (datos) => {

    const cursos = await CursosRepo.getById(datos.id_curso);
    if (!cursos || cursos.length === 0) {
        const error = new Error('El curso no existe');
        error.status = 404;
        throw error;
    }
    const curso = cursos[0];

    if (curso.id_curso_estado !== 2) {
        const error = new Error('El curso no tiene la inscripción abierta');
        error.status = 400;
        throw error;
    }

    const ocupados = await InscripcionesRepo.countActivasByCurso(datos.id_curso);
    if (ocupados >= curso.inscriptos_max) {
        const error = new Error('El curso ya alcanzó el cupo máximo de inscriptos');
        error.status = 400;
        throw error;
    }

    const duplicada = await InscripcionesRepo.findDuplicada(datos.id_curso, datos.id_estudiante);
    if (duplicada && duplicada.length > 0) {
        const error = new Error('El estudiante ya está inscripto en este curso');
        error.status = 409;
        throw error;
    }

    const inscripcion = {
        id_curso: datos.id_curso,
        id_estudiante: datos.id_estudiante,
        id_inscripcion_estado: datos.id_inscripcion_estado,
        id_usuario_modificacion: datos.id_usuario_modificacion,
    }

    return InscripcionesRepo.create(inscripcion);
}


export const eliminar = async (id) => {
    return InscripcionesRepo.eliminar(id);
}

