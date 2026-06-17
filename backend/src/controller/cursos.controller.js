import * as CursosService from '../services/cursos.service.js';
import { cursoDTO, validateCursoDTO } from '../dto/curso.dto.js';

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
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const dto = cursoDTO(req.body);
    const errors = validateCursoDTO(dto);

    if (errors.length > 0) {
        return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await CursosService.create(dto);
    res.status(201).json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const dto = cursoDTO(req.body);
    const errors = validateCursoDTO(dto);

    if (errors.length > 0) {
        return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await CursosService.update(req.params.id, dto);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Curso no encontrado para actualizar" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await CursosService.remove(req.params.id);
    if (!result || result.length === 0) {
        return res.status(404).json({ message: "Curso no encontrado" });
    }
    res.json({ message: "Curso eliminado lógicamente (baja)" });
  } catch (err) {
    next(err);
  }
};