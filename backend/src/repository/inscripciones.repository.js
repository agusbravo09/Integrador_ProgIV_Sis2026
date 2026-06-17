import * as BaseRepo from "../utils/base.repository.js";
import { query } from '../config/db.js';

const TABLE_NAME = 'inscripciones';
const ID_COLUMN = 'id_inscripcion';

const ESTADOS = {
    CONFIRMADA: 1,
    CANCELADA: 2
};

export const findAll = async () => {
    const text = `
        SELECT 
            i.id_inscripcion,
            i.id_estudiante,
            e.documento AS dni,
            e.apellido,
            e.nombres AS estudiante_nombre,
            i.id_curso,
            c.nombre AS curso_nombre,
            i.fecha_hora_inscripcion,
            i.id_inscripcion_estado
        FROM ${TABLE_NAME} i
        INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
        INNER JOIN cursos c ON i.id_curso = c.id_curso
        WHERE i.id_inscripcion_estado != ${ESTADOS.CANCELADA}
    `;
    return await query(text);
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

export const countActivasByCurso = async (id_curso) => {
    const text = `SELECT COUNT(*)::int AS total FROM ${TABLE_NAME} WHERE id_curso = $1 AND id_inscripcion_estado != ${ESTADOS.CANCELADA}`;
    const rows = await query(text, [id_curso]);
    return rows[0].total;
}

export const findDuplicada = async (id_curso, id_estudiante) => {
    const text = `SELECT * FROM ${TABLE_NAME} WHERE id_curso = $1 AND id_estudiante = $2 AND id_inscripcion_estado != ${ESTADOS.CANCELADA}`;
    return await query(text, [id_curso, id_estudiante]);
}

export const eliminar = async (id) => {
    const text = `UPDATE ${TABLE_NAME} SET id_inscripcion_estado = ${ESTADOS.CANCELADA} WHERE ${ID_COLUMN} = $1 RETURNING *`;
    return await query(text, [id]);
}