import {Router} from 'express';
//import User from './app/models/User';
import CRUD from './crud/index.js';

const routes = new Router();

// routes.get('/user', async (req,res) => {
//   const user = await User.create({
//     name: 'Totolis',
//     email: 'totilus@bobo',
//     password_hash: '1234',
//     role: 'Administrador',
//   });
//   return res.json(user);
// });

routes.get('/migration',(req,res)=>{
  return res.send(CRUD.Migration());
});

routes.get('/model',(req,res)=>{
  return res.json(CRUD.Models());
});

routes.get('/lista',(req,res)=>{
  return res.send(CRUD.List());
});

export default routes;