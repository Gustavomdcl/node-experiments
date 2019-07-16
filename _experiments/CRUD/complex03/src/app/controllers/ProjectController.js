import * as Yup from 'yup';
import Project from '../models/Project';
import User from '../models/User';
import File from '../models/File';

class ProjectController {
  async index(req,res){
    var whereData = {};
    const projects = await Project.findAll({
      where: whereData,
      attributes: ['id','author','title','description','email'],
      include: [
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
    
    return res.json(projects);
  }
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
   req.body.author = req.userId;
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
   req.projectId = req.params.id;
   if(!(req.projectId)){
     return res.status(401).json({error:'Projeto not found.'});
   }
   const projectIdExists = await Project.count({where:{id:req.projectId}});
   if(projectIdExists==0){
     return res.status(401).json({error:'Projeto not found.'});
   }
   const project = await Project.findByPk(req.projectId);
   const user = await User.findByPk(req.userId);
   if(user.id!=project.author){
     if(user.role=='Administrador'||user.role=='Gerente'){}else{
       return res.status(401).json({error:'User not allowed'});
     }
   }
   const {email} = req.body;
   if(email!==project.email){
     const emailExists = await Project.findOne({ where: { email } });
     if(emailExists){
       return res.status(400).send({ error: 'Projeto already exists.' });
     }
   }
   const {id,title,description} = await project.update(req.body);
   return res.json({id,title,description,email});
 }
}

export default new ProjectController;
