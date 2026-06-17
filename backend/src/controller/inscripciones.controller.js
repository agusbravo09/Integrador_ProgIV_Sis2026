import * as InscripcionesService from '../services/inscripciones.service.js';
import { inscripcionDTO, validateInscripcionDTO } from '../dto/inscripcion.dto.js';

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
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }
    res.json(result[0] || result);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const dto = inscripcionDTO(req.body);
    const errors = validateInscripcionDTO(dto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Errores de validación", errors });
    }

    const result = await InscripcionesService.create(dto);
    res.status(201).json(result[0] || result);
  } catch (err) {
    next(err);
  }
};


export const remove = async (req, res, next) => {
  try {
    const result = await InscripcionesService.eliminar(req.params.id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }
    res.json({ message: "Inscripción eliminada lógicamente (baja)" });
  } catch (err) {
    next(err);
  }
};

export const getByCurso = async (req, res, next) => {
  try {
    const result = await InscripcionesService.getByCurso(req.params.id);
    res.json(result || []);
  } catch (err) {
    next(err);
  }
};