//EXPRESS
const express = require("express");
const server = express();
server.use(express.json());
//CRUD
import CRUD from './crud/crud.js';
//ROUTES
import CRUD_ROUTES from './crud/routes.js';

CRUD
  //Projetos
  .CustomPostType('project')
  .Details('project','projects','Projeto','Projetos','o')
  //Tarefas
  .CustomPostType('task')
  .Details('task','tasks','Tarefa','Tarefas','a')
  .Relation('project');

const init = CRUD.viewList();

server.get('/',(req, res) => {
  return res.json(init);
});

const routes = new CRUD_ROUTES( init, server );

//SERVER
server.listen(3000);