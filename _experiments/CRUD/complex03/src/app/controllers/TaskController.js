import * as Yup from 'yup';
import Task from '../models/Task';
import User from '../models/User';
import File from '../models/File';
import Project from '../models/Project';

class TaskController {
  async index(req,res){
    var whereData = {};
    if(req.params.parent){
      whereData.project = req.params.parent;
    }
    const tasks = await Task.findAll({
      where: whereData,
      attributes: ['id','project','author','title','description','email'],
      include: [
        {
          model: Project,
          as: 'project_data',
          attributes: ['id','title','description','email'],
          include: [
          ],
        },
        {
          model: User,
          as: 'author_data',
          attributes: ['id','avatar','name','email','role'],
          include: [
            {
              model: File,
              as: 'avatar_data',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });
    
    return res.json(tasks);
  }
  async store(req,res){
   req.projectId = req.params.parent;
   if(!(req.projectId)){
     return res.status(401).json({error:'Projeto not found.'});
   }
   const projectIdExists = await Project.count({where:{id:req.projectId}});
   if(projectIdExists==0){
     return res.status(401).json({error:'Projeto not found.'});
   }
   const project = await Project.findByPk(req.projectId);
   const user = await User.findByPk(req.userId);
   if(project.author!=user.id){
     if(user.role=='Administrador'||user.role=='Gerente'){}else{
       return res.status(401).json({error:'User not allowed'});
     }
   }
   req.body.project = project.id;
   const schema = Yup.object().shape({
     title: Yup.string(),
     description: Yup.string().required(),
     email: Yup.string().email().required(),
   });
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({error:'Validation Fails'});
   }
   const emailExists = await Task.findOne({ where: { email: req.body.email } });
   if(emailExists){
     return res.status(400).send({ error: 'Tarefa already exists.' });
   }
   req.body.author = req.userId;
   const {id,title,description,email} = await Task.create(req.body);
   return res.json({id,title,description,email});
 }
  async update(req,res){
   req.projectId = req.params.parent;
   if(!(req.projectId)){
     return res.status(401).json({error:'Projeto not found.'});
   }
   const projectIdExists = await Project.count({where:{id:req.projectId}});
   if(projectIdExists==0){
     return res.status(401).json({error:'Projeto not found.'});
   }
   const project = await Project.findByPk(req.projectId);
   const user = await User.findByPk(req.userId);
   if(project.author!=user.id){
     if(user.role=='Administrador'||user.role=='Gerente'){}else{
       return res.status(401).json({error:'User not allowed'});
     }
   }
   const schema = Yup.object().shape({
     title: Yup.string(),
     description: Yup.string(),
     email: Yup.string().email(),
   });
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({error:'Validation Fails'});
   }
   req.taskId = req.params.id;
   if(!(req.taskId)){
     return res.status(401).json({error:'Tarefa not found.'});
   }
   const taskIdExists = await Task.count({where:{id:req.taskId}});
   if(taskIdExists==0){
     return res.status(401).json({error:'Tarefa not found.'});
   }
   const task = await Task.findByPk(req.taskId);
   if(project.id!=task.project){
     return res.status(401).json({error:'Projeto does not match'});
   }
   if(user.id!=task.author){
     if(user.role=='Administrador'||user.role=='Gerente'){}else{
       return res.status(401).json({error:'User not allowed'});
     }
   }
   const {email} = req.body;
   if(email!==task.email){
     const emailExists = await Task.findOne({ where: { email } });
     if(emailExists){
       return res.status(400).send({ error: 'Tarefa already exists.' });
     }
   }
   const {id,title,description} = await task.update(req.body);
   return res.json({id,title,description,email});
 }
}

export default new TaskController;
