import * as Yup from 'yup';
import Task from '../models/Task';

class TaskController {
 async store(req,res){
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
   const {id,title,description,email} = await Task.create(req.body);
   return res.json({id,title,description,email});
 }
 async update(req,res){
   const schema = Yup.object().shape({
     title: Yup.string(),
     description: Yup.string(),
     email: Yup.string().email(),
   });
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({error:'Validation Fails'});
   }
   const {email} = req.body;
   const task = await Task.findByPk(req.taskId);
   if(email!==task.email){
     const emailExists = await Task.findOne({ where: { email } });
     if(emailExists){
       return res.status(400).send({ error: 'Tarefa already exists.' });
     }
   }
   const {id,title,description,email} = await task.update(req.body);
   return res.json({id,title,description,email});
 }
}

export default new TaskController;
