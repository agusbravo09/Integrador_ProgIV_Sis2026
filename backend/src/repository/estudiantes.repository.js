import * as BaseRepo from '../utils/base.repository.js';
import { query } from '../config/db.js';

const TABLE_NAME = 'estudiantes';
const ID_COLUMN = 'id_estudiante';

export const findAll = async () => {
    return BaseRepo.findAll(TABLE_NAME);
}

export const getById = async (id) => {
    return BaseRepo.findById(TABLE_NAME, ID_COLUMN, id);
}

export const create = async (estudiante) => {
    return BaseRepo.create(TABLE_NAME, estudiante);
}

export const update = async (id, estudiante) => {
    return BaseRepo.update(TABLE_NAME, ID_COLUMN, id, estudiante);
};

export const eliminar = async (id) => {
    return BaseRepo.remove(TABLE_NAME, ID_COLUMN, id);
}
