import * as EstudiantesRepo from '../repository/estudiantes.repository.js';

export const getAll = async () => {
    return EstudiantesRepo.findAll();
}

export const getById = async (id) => {
    return EstudiantesRepo.getById(id);
}


export const create = async (datos) => {

    const estudiante = {
        documento: datos.documento,
        apellido: datos.apellido,
        nombres: datos.nombres,
        email: datos.email,
        fecha_nacimiento: datos.fecha_nacimiento,
        activo: 1,
        id_usuario_modificacion: 1,
    }

    return EstudiantesRepo.create(estudiante);
};

export const update = async (id, datos) => {

    const estudiante_nuevo = {
        documento: datos.documento,
        apellido: datos.apellido,
        nombres: datos.nombres,
        email: datos.email,
        fecha_nacimiento: datos.fecha_nacimiento,
        activo: 1,
        id_usuario_modificacion: 1
    }

    return EstudiantesRepo.update(id, estudiante_nuevo);

};

export const remove = async (id) => {
    return EstudiantesRepo.eliminar(id);
};
