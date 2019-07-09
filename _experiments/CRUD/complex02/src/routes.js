import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import ProjectController from './app/controllers/ProjectController';
import TaskController from './app/controllers/TaskController';
import CRUD from './crud';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/projects', ProjectController.store);
routes.put('/projects/:id', ProjectController.update);

routes.post('/projects/:parent/tasks', TaskController.store);
routes.put('/projects/:parent/tasks/:id', TaskController.update);

// routes.get('/user', async (req, res) => {
//   const user = await User.create({
//     name: 'Totolis',
//     email: 'totilus@bobo',
//     password_hash: '1234',
//     role: 'Administrador',
//   });
//   return res.json(user);
// });

// routes.get('/project', async (req, res) => {
//   const project = await Project.create({
//     author: 1,
//     title: 'Totolis',
//     description: 'Memei cheirosa',
//   });
//   return res.json(project);
// });

// routes.get('/task', async (req, res) => {
//   const task = await Task.create({
//     author: 1,
//     project: 1,
//     title: 'Totolis',
//     description: 'Memei cheirosa',
//   });
//   return res.json(task);
// });

routes.get('/lista',(req,res)=>{
  return res.send(CRUD.List());
});

export default routes;
