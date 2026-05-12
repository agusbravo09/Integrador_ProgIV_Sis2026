import e from 'express';
import {query } from '../config/db.js';

export const findAll = async () => {
    return await query('SELECT * FROM cursos');
}

export const getById = async (id) => {
    return await query(`SELECT * FROM cursos WHERE id_curso = ${id}`);
}

export const create = async (curso) => {
    const text = `INSERT INTO cursos (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion)
                         VALUES($1, $2, $3, $4, $5, $6, $7, NOW())
                         RETURNING *`

    const values = [
        curso.nombre, curso.descripcion, curso.fecha_inicio,
        curso.cantidad_horas, curso.inscriptos_max,
        curso.id_curso_estado, curso.id_usuario_modificacion
    ];

   return await query(text, values)
}

export const update = async (id, curso) => {
    const text = `UPDATE cursos
        SET nombre = $1,
            descripcion = $2,
            fecha_inicio = $3,
            cantidad_horas = $4,
            inscriptos_max = $5,
            id_curso_estado = $6,
            id_usuario_modificacion = $7,
            fecha_hora_modificacion = NOW()
        WHERE id_curso = ${id}
        RETURNING *;`
    const values = [
        curso.nombre, curso.descripcion, curso.fecha_inicio,
        curso.cantidad_horas, curso.inscriptos_max,
        curso.id_curso_estado, curso.id_usuario_modificacion
    ]
    return await query(text, values);
};

export const eliminar = async (id) => {
    const text = 'DELETE FROM cursos WHERE id_curso = ${id}';
    return await query(text);
}