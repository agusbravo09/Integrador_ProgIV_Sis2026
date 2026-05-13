import * as InscripcionesService from '../services/inscripciones.service.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await InscripcionesService.findAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await InscripcionesService.getById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await InscripcionesService.create(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await InscripcionesService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await InscripcionesService.eliminar(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
