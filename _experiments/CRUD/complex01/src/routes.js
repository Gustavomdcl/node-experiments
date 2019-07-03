import {Router} from 'express';
import CRUD from './crud/index.js';

const routes = new Router();

routes.get('/',(req,res)=>{
  return res.json(CRUD.Migration('user'));
});

export default routes;