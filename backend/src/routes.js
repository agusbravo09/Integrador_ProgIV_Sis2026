import { Router } from 'express';
import * as ctrl from './controller/estudiantes.controller.js';
import * as ctrlCursos from './controller/cursos.controller.js';
import * as ctrlInscripciones from './controller/inscripciones.controller.js';

const router = Router();

// estudiantes
router.get('/estudiantes', ctrl.getAll);
router.get('/estudiantes/:id', ctrl.getById);
router.post('/estudiantes', ctrl.create);
router.put('/estudiantes/:id', ctrl.update);
router.delete('/estudiantes/:id', ctrl.remove);

//cursos
router.get('/cursos', ctrlCursos.getAll);
router.get('/cursos/:id', ctrlCursos.getById);
router.post('/cursos', ctrlCursos.create);
router.put('/cursos/:id', ctrlCursos.update);
router.delete('/cursos/:id', ctrlCursos.remove);    

//usuarios

// inscripciones
router.get('/inscripciones', ctrlInscripciones.getAll);
router.get('/inscripciones/:id', ctrlInscripciones.getById);
router.post('/inscripciones', ctrlInscripciones.create);
router.put('/inscripciones/:id', ctrlInscripciones.update);
router.delete('/inscripciones/:id', ctrlInscripciones.remove);

export default router;
