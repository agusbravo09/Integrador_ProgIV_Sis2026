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

export const create = async (inscripcion) => {
    return BaseRepo.create(TABLE_NAME, inscripcion, 'fecha_hora_inscripcion');
}

export const eliminar = async (id) => {
    const text = `UPDATE ${TABLE_NAME} SET id_inscripcion_estado = ${ESTADOS.CANCELADA} WHERE ${ID_COLUMN} = $1 RETURNING *`;
    return await query(text, [id]);
}