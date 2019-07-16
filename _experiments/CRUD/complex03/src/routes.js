import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import ProjectController from './app/controllers/ProjectController';
import TaskController from './app/controllers/TaskController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.post('/projects', ProjectController.store);
routes.put('/projects/:id', ProjectController.update);
routes.get('/projects', ProjectController.index);

routes.post('/project/:parent/tasks', TaskController.store);
routes.put('/project/:parent/tasks/:id', TaskController.update);
routes.get('/tasks', TaskController.index);
routes.get('/project/:parent/tasks', TaskController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
