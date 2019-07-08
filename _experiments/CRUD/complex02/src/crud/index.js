//CRUD
import CRUD from './crud.js';

CRUD
  //User
    .CustomPostType('user')
    .Details('user','users','Usuário','Usuários','o')
    .Field('name','text',true,'Nome','Preencha seu nome',false)
    .Field('email','email',true,'Email','Digite o seu email',false,true)
    .Field('password_hash','password',true,'Senha','Informe sua senha',false)
    .Field('role','checkbox',true,'Perfil','Escolha um perfil',['Administrador','Gerente','Simples','Premium'])
  //Projetos
    .CustomPostType('project')
    .Details('project','projects','Projeto','Projetos','o')
    .Field()
    .Field('description','text',true,'Descrição','Descreva seu projeto',false)
    .Field('email','email',true,'Email','Digite o seu email',false,true)
  //Tarefas
    .CustomPostType('task')
    .Details('task','tasks','Tarefa','Tarefas','a')
    .Relation('project')
    .Field()
    .Field('description','text',true,'Descrição','Descreva sua tarefa',false)
    .Field('email','email',true,'Email','Digite o seu email',false,true);


export default CRUD;