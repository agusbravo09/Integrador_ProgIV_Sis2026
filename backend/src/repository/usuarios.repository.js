import * as BaseRepo from '../utils/base.repository.js';

const TABLE_NAME = 'usuarios';
const ID_COLUMN = 'id_usuario';

export const findAll = async () => {
    return BaseRepo.findAll(TABLE_NAME);
}

export const getById = async (id) => {
    return BaseRepo.findById(TABLE_NAME, ID_COLUMN, id);
}

export const create = async (usuario) => {
    return BaseRepo.create(TABLE_NAME, usuario, null, false);
}

export const update = async (id, usuario) => {
    return BaseRepo.update(TABLE_NAME, ID_COLUMN, id, usuario, false);
};

export const eliminar = async (id) => {
    return BaseRepo.remove(TABLE_NAME, ID_COLUMN, id);
}
