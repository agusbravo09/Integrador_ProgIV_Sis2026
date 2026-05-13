import * as UsuariosService from '../services/usuarios.service.js';

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
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await UsuariosService.create(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await UsuariosService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await UsuariosService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
