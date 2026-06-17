import * as CursosRepo from '../repository/cursos.repository.js';

export const getAll = async () => {
    return CursosRepo.findAll();
}

export const getById = async (id) => {
    return CursosRepo.getById(id);
}

export const create = async (datos) => {

    const curso = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        fecha_inicio: datos.fecha_inicio,
        cantidad_horas: datos.cantidad_horas,
        inscriptos_max: datos.inscriptos_max,
        id_curso_estado: 1,
        id_usuario_modificacion: 1,
    }

    return CursosRepo.create(curso);
};

export const update = async (id, datos) => {
    const curso_editado = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        fecha_inicio: datos.fecha_inicio,
        cantidad_horas: datos.cantidad_horas,
        inscriptos_max: datos.inscriptos_max,
        id_usuario_modificacion: 1
    };

    if (datos.id_curso_estado) {
        curso_editado.id_curso_estado = datos.id_curso_estado;
    }

    return CursosRepo.update(id, curso_editado);
};

export const remove = async (id) => {
    return CursosRepo.eliminar(id);
}