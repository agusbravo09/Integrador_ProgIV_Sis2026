import * as BaseRepo from "../utils/base.repository.js";
import { query } from '../config/db.js';

const TABLE_NAME = 'inscripciones';
const ID_COLUMN = 'id_inscripcion';

const ESTADOS = {
    CONFIRMADA: 1,
    CANCELADA: 2
};

export const findAll = async () => {
    return BaseRepo.findActives(TABLE_NAME, `id_inscripcion_estado != ${ESTADOS.CANCELADA}`);
}

export const getById = async (id) => {
    return BaseRepo.findActivesById(TABLE_NAME, ID_COLUMN, id, `id_inscripcion_estado != ${ESTADOS.CANCELADA}`);
}

//Lo pidio el front.
export const findByCourse = async (id_curso) => {
    const text = `
        SELECT 
            i.*, 
            (e.nombres || ' ' || e.apellido) AS nombre_alumno, 
            e.documento AS dni_alumno 
        FROM ${TABLE_NAME} i
        INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
        WHERE i.id_curso = $1 AND i.id_inscripcion_estado != ${ESTADOS.CANCELADA}
    `;
    return await query(text, [id_curso]);
}

export const create = async (inscripcion) => {
    return BaseRepo.create(TABLE_NAME, inscripcion, 'fecha_hora_inscripcion');
}

export const eliminar = async (id) => {
    const text = `UPDATE ${TABLE_NAME} SET id_inscripcion_estado = ${ESTADOS.CANCELADA} WHERE ${ID_COLUMN} = $1 RETURNING *`;
    return await query(text, [id]);
}