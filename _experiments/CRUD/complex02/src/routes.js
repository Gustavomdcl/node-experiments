import { Router } from 'express';
import User from './app/models/User';
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

routes.get('/lista',(req,res)=>{
  return res.send(CRUD.List());
});

export default routes;
