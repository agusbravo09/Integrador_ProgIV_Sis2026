import { query } from '../config/db.js';

export const findAll = async (tableName) => {
    return await query(`SELECT * FROM ${tableName}`);
}

export const findById = async (tableName, idColumn, id) => {
    const text = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
    return await query(text, [id]);
}

export const create = async (tableName, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');

    const text = `INSERT INTO ${tableName} (${columns}, fecha_hora_modificacion) VALUES (${placeholders}, NOW()) RETURNING *`;

    return await query(text, values);
}

export const update = async (tableName, idColumn, id, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const text = `UPDATE ${tableName} SET ${setClause}, fecha_hora_modificacion = NOW() WHERE ${idColumn} = $${keys.length + 1} RETURNING *`;

    return await query(text, [...values, id]);
}

export const remove = async (tableName, idColumn, id) => {
    const text = `DELETE FROM ${tableName} WHERE ${idColumn} = $1`;
    return await query(text, [id]);
}
