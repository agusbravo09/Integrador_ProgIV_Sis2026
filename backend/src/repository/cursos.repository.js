import * as BaseRepo from '../utils/base.repository.js';
import { query } from '../config/db.js';

const TABLE_NAME = 'cursos';
const ID_COLUMN = 'id_curso';

const ESTADOS = {
    BORRADOR: 1,
    INSCRIPCION_ABIERTA: 2,
    INSCRIPCION_CERRADA: 3,
    ELIMINADO: 4
};

export const findAll = async () => {
    const text = `
        SELECT c.*, 
               (SELECT COUNT(*)::int FROM inscripciones i WHERE i.id_curso = c.id_curso AND i.id_inscripcion_estado != 2) as ocupados
        FROM ${TABLE_NAME} c
        WHERE c.id_curso_estado != ${ESTADOS.ELIMINADO}
    `;
    return await query(text);
}

export const getById = async (id) => {
    const text = `
        SELECT c.*, 
               (SELECT COUNT(*)::int FROM inscripciones i WHERE i.id_curso = c.id_curso AND i.id_inscripcion_estado != 2) as ocupados
        FROM ${TABLE_NAME} c
        WHERE c.id_curso_estado != ${ESTADOS.ELIMINADO} AND c.${ID_COLUMN} = $1
    `;
    return await query(text, [id]);
}

export const create = async (curso) => {
    return BaseRepo.create(TABLE_NAME, curso);
}

export const update = async (id, curso) => {
    return BaseRepo.update(TABLE_NAME, ID_COLUMN, id, curso);
};

export const eliminar = async (id) => {
    const text = `UPDATE ${TABLE_NAME} SET id_curso_estado = ${ESTADOS.ELIMINADO} WHERE ${ID_COLUMN} = $1 RETURNING *`;
    return await query(text, [id]);
}