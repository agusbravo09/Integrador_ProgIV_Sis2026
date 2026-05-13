import * as BaseRepo from "../utils/base.repository.js";

const TABLE_NAME = 'inscripciones';
const ID_COLUMN = 'id_inscripcion';

export const findAll = async () => {
    return BaseRepo.findAll(TABLE_NAME);
}

export const getById = async (id) => {
    return BaseRepo.findById(TABLE_NAME, ID_COLUMN, id);
}

export const create = async (inscripcion) => {
    return BaseRepo.create(TABLE_NAME, inscripcion, 'fecha_hora_inscripcion');
}

export const update = async (id, inscripcion) => {
    return BaseRepo.update(TABLE_NAME, ID_COLUMN, id, inscripcion);
};

export const eliminar = async (id) => {
    return BaseRepo.remove(TABLE_NAME, ID_COLUMN, id);
}