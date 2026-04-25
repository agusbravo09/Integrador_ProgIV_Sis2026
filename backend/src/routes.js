import { Router } from 'express';
import * as ctrl from './controller/estudiantes.controller.js';

const router = Router();

// estudiantes
router.get('/estudiantes', ctrl.getAll);
router.get('/estudiantes/:id', ctrl.getById);
router.post('/estudiantes', ctrl.create);
router.put('/estudiantes/:id', ctrl.update);
router.delete('/estudiantes/:id', ctrl.remove);

//cursos

//usuarios

export default router;
