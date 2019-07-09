import * as Yup from 'yup';
import Project from '../models/Project';

class ProjectController {
 async store(req,res){
   const schema = Yup.object().shape({
     title: Yup.string(),
     description: Yup.string().required(),
     email: Yup.string().email().required(),
   });
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({error:'Validation Fails'});
   }
   const emailExists = await Project.findOne({ where: { email: req.body.email } });
   if(emailExists){
     return res.status(400).send({ error: 'Projeto already exists.' });
   }
   const {id,title,description,email} = await Project.create(req.body);
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
   const project = await Project.findByPk(req.projectId);
   if(email!==project.email){
     const emailExists = await Project.findOne({ where: { email } });
     if(emailExists){
       return res.status(400).send({ error: 'Projeto already exists.' });
     }
   }
   const {id,title,description,email} = await project.update(req.body);
   return res.json({id,title,description,email});
 }
}

export default new ProjectController;
