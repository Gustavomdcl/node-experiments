import { Router } from 'express';
import User from './app/models/User';
import Project from './app/models/Project';
import Task from './app/models/Task';
import CRUD from './crud';

const routes = new Router();

routes.get('/user', async (req, res) => {
  const user = await User.create({
    name: 'Totolis',
    email: 'totilus@bobo',
    password_hash: '1234',
    role: 'Administrador',
  });
  return res.json(user);
});

routes.get('/project', async (req, res) => {
  const project = await Project.create({
    author: 1,
    title: 'Totolis',
    description: 'Memei cheirosa',
  });
  return res.json(project);
});

routes.get('/task', async (req, res) => {
  const task = await Task.create({
    author: 1,
    project: 1,
    title: 'Totolis',
    description: 'Memei cheirosa',
  });
  return res.json(task);
});

routes.get('/lista',(req,res)=>{
  return res.send(CRUD.List());
});

export default routes;
