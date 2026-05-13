import * as CursosService from '../services/cursos.service.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await CursosService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await CursosService.getById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await CursosService.create(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await CursosService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await CursosService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};