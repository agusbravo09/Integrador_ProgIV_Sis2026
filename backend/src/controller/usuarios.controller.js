import * as UsuariosService from '../services/usuarios.service.js';
import { usuarioDTO, validateUsuarioDTO } from '../dto/usuario.dto.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await UsuariosService.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await UsuariosService.getById(req.params.id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const dto = usuarioDTO(req.body);
    const errors = validateUsuarioDTO(dto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await UsuariosService.create(dto);
    res.status(201).json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const dto = usuarioDTO(req.body);
    const errors = validateUsuarioDTO(dto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await UsuariosService.update(req.params.id, dto);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado para actualizar" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await UsuariosService.remove(req.params.id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado lógicamente (baja)" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { nombre_usuario, contrasenia } = req.body;
    if (!nombre_usuario || !contrasenia) {
      return res.status(400).json({ message: "Se requiere nombre de usuario y contraseña" });
    }

    const result = await UsuariosService.login(nombre_usuario, contrasenia);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
