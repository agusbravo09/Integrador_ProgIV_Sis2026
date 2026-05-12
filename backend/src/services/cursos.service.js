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
        id_cursos_estado: 1,
        id_cursos_estado: 1,
        id_usuario_modificacion: 1,
    }

    return CursosRepo.create(curso);
};

export const update = async (id, datos) => {
    const curso_nuevo = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        fecha_inicio: datos.fecha_inicio,
        cantidad_horas: datos.cantidad_horas,
        inscriptos_max: datos.inscriptos_max,
        id_cursos_estado: 1,
        id_usuarios_modificacion: 1
    }
    return CursosRepo.update(id, curso_nuevo);
};

export const remove = async (id) => {
    return CursosRepo.eliminar(id);
}