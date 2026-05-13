import * as BaseRepo from '../utils/base.repository.js';
 
const TABLE_NAME = 'cursos';
const ID_COLUMN = 'id_curso';

export const findAll = async () => {
    return BaseRepo.findAll(TABLE_NAME);
}

export const getById = async (id) => {
    return BaseRepo.findById(TABLE_NAME, ID_COLUMN, id);
}

export const create = async (curso) => {
    return BaseRepo.create(TABLE_NAME, curso);
}

export const update = async (id, curso) => {
    return BaseRepo.update(TABLE_NAME, ID_COLUMN, id, curso);
};

export const eliminar = async (id) => {
    return BaseRepo.delete(TABLE_NAME, ID_COLUMN, id);
}