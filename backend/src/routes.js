import { Router } from 'express';
import * as ctrl from './controller/estudiantes.controller.js';
import * as ctrlCursos from './controller/cursos.controller.js';

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

export default router;
