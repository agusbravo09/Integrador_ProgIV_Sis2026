import * as InscripcionesRepo from '../repository/inscripciones.repository.js';

export const findAll = async () => {
    return InscripcionesRepo.findAll();
}

export const getById = async (id) => {
    return InscripcionesRepo.getById(id);
}

export const create = async (datos) => {

    const inscripcion = {
        id_curso: datos.id_curso,
        id_estudiante: datos.id_estudiante,
        id_inscripcion_estado: datos.id_inscripcion_estado,
        id_usuario_modificacion: datos.id_usuario_modificacion,
    }

    return InscripcionesRepo.create(inscripcion);
}

export const update = async (id, datos) => {
    const inscripcion = {
        id_curso: datos.id_curso,
        id_estudiante: datos.id_estudiante,
        id_inscripcion_estado: datos.id_inscripcion_estado,
        id_usuario_modificacion: datos.id_usuario_modificacion,
    }
    return InscripcionesRepo.update(id, inscripcion);
};

export const eliminar = async (id) => {
    return InscripcionesRepo.eliminar(id);
}

