import * as EstudiantesService from '../services/estudiantes.service.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await EstudiantesService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await EstudiantesService.getById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await EstudiantesService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await EstudiantesService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await EstudiantesService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const pruebaBDD = async (req, res, next) => {
  try{
    const result = await EstudiantesService.pruebaBDD(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
