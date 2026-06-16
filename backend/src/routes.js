import { Router } from 'express';
import { verificarToken } from './middleware/auth.middleware.js';
import * as ctrl from './controller/estudiantes.controller.js';
import * as ctrlCursos from './controller/cursos.controller.js';
import * as ctrlInscripciones from './controller/inscripciones.controller.js';
import * as ctrlUsuarios from './controller/usuarios.controller.js';

const router = Router();

//Rutas publicas
router.post('/login', ctrlUsuarios.login);

//A partir de esta linea, toda ruta requiere un token jwt valido
router.use(verificarToken);

// estudiantes
router.get('/estudiantes', ctrl.getAll);
router.get('/estudiantes/dni/:dni', ctrl.getByDni);
router.get('/estudiantes/:id', ctrl.getById);
router.post('/estudiantes', ctrl.create);
router.put('/estudiantes/:id', ctrl.update);
router.delete('/estudiantes/:id', ctrl.remove);


//cursos
router.get('/cursos', ctrlCursos.getAll);
router.get('/cursos/:id', ctrlCursos.getById);
router.get('/cursos/:id/inscripciones', ctrlInscripciones.getByCurso);
router.post('/cursos', ctrlCursos.create);
router.put('/cursos/:id', ctrlCursos.update);
router.delete('/cursos/:id', ctrlCursos.remove);

//usuarios
router.get('/usuarios', ctrlUsuarios.getAll);
router.get('/usuarios/:id', ctrlUsuarios.getById);
router.post('/usuarios', ctrlUsuarios.create);
router.put('/usuarios/:id', ctrlUsuarios.update);
router.delete('/usuarios/:id', ctrlUsuarios.remove);

// inscripciones
router.get('/inscripciones', ctrlInscripciones.getAll);
router.get('/inscripciones/:id', ctrlInscripciones.getById);
router.post('/inscripciones', ctrlInscripciones.create);
router.delete('/inscripciones/:id', ctrlInscripciones.remove);

export default router;
