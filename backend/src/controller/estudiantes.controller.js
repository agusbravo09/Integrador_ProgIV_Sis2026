import * as EstudiantesService from '../services/estudiantes.service.js';

export const getAll = async (req, res, next) => {
  try {
    const result = await EstudiantesService.getAll(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await EstudiantesService.getById(req.params.id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const result = await EstudiantesService.create(req.body);
    res.status(201).json(result[0]);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await EstudiantesService.update(req.params.id, req.body);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado para actualizar" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await EstudiantesService.remove(req.params.id);
    res.status(200).json({ message: "Estudiante eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

export const pruebaBDD = async (req, res, next) => {
  try {
    const result = await EstudiantesService.pruebaBDD(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
