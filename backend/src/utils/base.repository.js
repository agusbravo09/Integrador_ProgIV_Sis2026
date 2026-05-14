import { query } from '../config/db.js';

export const findAll = async (tableName) => {
    return await query(`SELECT * FROM ${tableName}`);
}

export const findById = async (tableName, idColumn, id) => {
    const text = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
    return await query(text, [id]);
}

export const create = async (tableName, data, creationColumn = null, hasModificationDate = true) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    let placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    let columns = keys.join(', ');

    if (creationColumn) {
        columns += `, ${creationColumn}`;
        placeholders += `, NOW()`;
    }

    let text;
    if (hasModificationDate) {
        text = `INSERT INTO ${tableName} (${columns}, fecha_hora_modificacion) VALUES (${placeholders}, NOW()) RETURNING *`;
    } else {
        text = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    }

    return await query(text, values);
}


export const update = async (tableName, idColumn, id, data, hasModificationDate = true) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    let text;
    if (hasModificationDate) {
        text = `UPDATE ${tableName} SET ${setClause}, fecha_hora_modificacion = NOW() WHERE ${idColumn} = $${keys.length + 1} RETURNING *`;
    } else {
        text = `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${keys.length + 1} RETURNING *`;
    }

    return await query(text, [...values, id]);
}

export const remove = async (tableName, idColumn, id) => {
    const text = `DELETE FROM ${tableName} WHERE ${idColumn} = $1`;
    return await query(text, [id]);
}
