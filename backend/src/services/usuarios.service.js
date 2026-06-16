import crypto from 'crypto';
import * as UsuariosRepo from '../repository/usuarios.repository.js';
import jwt from 'jsonwebtoken';

const removeContrasenia = (usuarios) => {
    return usuarios.map(u => {
        const { contrasenia, ...resto } = u;
        return resto;
    });
};

export const getAll = async () => {
    const usuarios = await UsuariosRepo.findAll();
    return removeContrasenia(usuarios);
}

export const getById = async (id) => {
    const usuarios = await UsuariosRepo.getById(id);
    return removeContrasenia(usuarios);
}

export const create = async (datos) => {

    const contraseniaHash = crypto.createHash('sha256').update(datos.contrasenia).digest('hex');

    const usuario = {
        apellido: datos.apellido,
        nombre: datos.nombre,
        nombre_usuario: datos.nombre_usuario,
        contrasenia: contraseniaHash,
        activo: datos.activo !== undefined ? datos.activo : 1
    }

    const usuarios = await UsuariosRepo.create(usuario);
    return removeContrasenia(usuarios);
};

export const update = async (id, datos) => {

    const usuario_nuevo = {
        apellido: datos.apellido,
        nombre: datos.nombre,
        nombre_usuario: datos.nombre_usuario,
        activo: datos.activo !== undefined ? datos.activo : 1
    }

    if (datos.contrasenia && datos.contrasenia.trim() !== '') {
        usuario_nuevo.contrasenia = crypto.createHash('sha256').update(datos.contrasenia).digest('hex');
    }

    const usuarios = await UsuariosRepo.update(id, usuario_nuevo);
    return removeContrasenia(usuarios);
};

export const remove = async (id) => {
    return UsuariosRepo.eliminar(id);
};

export const login = async (nombre_usuario, contrasenia) => {
    //Buscar el usuario
    const usuarios = await UsuariosRepo.getByUsername(nombre_usuario);
    if (!usuarios || usuarios.length === 0) {
        throw new Error('Usuario o contraseña incorrectos');
    }

    const usuario = usuarios[0];

    //Comparar el hash de la contraseña recibida
    const contraseniaHash = crypto.createHash('sha256').update(contrasenia).digest('hex');
    if (usuario.contrasenia !== contraseniaHash) {
        throw new Error('Usuario o contraseña incorrectos');
    }

    //Crear el token JWT
    const token = jwt.sign(
        { id_usuario: usuario.id_usuario, nombre_usuario: usuario.nombre_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );

    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            nombre_usuario: usuario.nombre_usuario
        }
    };
};

