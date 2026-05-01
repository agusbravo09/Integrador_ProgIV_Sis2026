import { query } from '../config/db.js';

export const findAll = async () => {
    return await query('SELECT * FROM estudiantes');
}

export const getById = async (id) => {
    return await query(`SELECT * FROM estudiantes WHERE id_estudiante = ${id}`);
}

export const create = async (estudiante) => {
    const text = `INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion)
                         VALUES($1, $2, $3, $4, $5, $6, $7, NOW())
                         RETURNING *`

    const values = [
        estudiante.documento, estudiante.apellido, estudiante.nombres,
        estudiante.email, estudiante.fecha_nacimiento,
        estudiante.activo, estudiante.id_usuario_modificacion
    ];

   return await query(text, values)
}

export const update = async (id, estudiante) => {
    const text = `UPDATE estudiantes 
        SET documento = $1, 
            apellido = $2, 
            nombres = $3, 
            email = $4, 
            fecha_nacimiento = $5, 
            activo = $6, 
            id_usuario_modificacion = $7, 
            fecha_hora_modificacion = NOW()
        WHERE id_estudiante = ${id}
        RETURNING *;`

    const values = [
        estudiante.documento, estudiante.apellido, estudiante.nombres,
        estudiante.email, estudiante.fecha_nacimiento,
        estudiante.activo, estudiante.id_usuario_modificacion
    ]

    return await query(text, values);
};

export const eliminar = async (id) => {
    const text = `DELETE FROM estudiantes WHERE id_estudiante = ${id}`;
    return await query(text);
}