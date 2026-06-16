import * as EstudiantesService from '../services/estudiantes.service.js';
import { estudianteDTO, validateEstudianteDTO } from '../dto/estudiante.dto.js';

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
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const dto = estudianteDTO(req.body);
    const errors = validateEstudianteDTO(dto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await EstudiantesService.create(dto);
    res.status(201).json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const dto = estudianteDTO(req.body);
    const errors = validateEstudianteDTO(dto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await EstudiantesService.update(req.params.id, dto);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado para actualizar" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await EstudiantesService.remove(req.params.id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json({ message: "Estudiante eliminado lógicamente (baja)" });
  } catch (err) {
    next(err);
  }
};

export const getByDni = async (req, res, next) => {
  try {
    const result = await EstudiantesService.getByDni(req.params.dni);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};
