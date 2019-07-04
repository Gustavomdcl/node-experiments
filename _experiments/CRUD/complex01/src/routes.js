import {Router} from 'express';
import CRUD from './crud/index.js';

const routes = new Router();

routes.get('/',(req,res)=>{
  return res.send(CRUD.Migration());
});

routes.get('/lista',(req,res)=>{
  return res.send(CRUD.List());
});

export default routes;