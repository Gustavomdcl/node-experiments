import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req,res){
   const schema = Yup.object().shape({
     avatar: Yup.string(),
     name: Yup.string().required(),
     email: Yup.string().email().required(),
     password: Yup.string().required().min(6),
     role: Yup.string().required().oneOf(['Administrador','Gerente','Simples','Premium']),
   });
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({error:'Validation Fails'});
   }
   const emailExists = await User.findOne({ where: { email: req.body.email } });
   if(emailExists){
     return res.status(400).send({ error: 'Usuário already exists.' });
   }
   const {id,avatar,name,email,role} = await User.create(req.body);
   return res.json({id,avatar,name,email,role});
 }
  async update(req,res){
   const schema = Yup.object().shape({
     avatar: Yup.string(),
     name: Yup.string(),
     email: Yup.string().email(),
     oldPassword: Yup.string().min(6),
     password: Yup.string().min(6).when('oldPassword',(oldPassword,field)=>oldPassword?field.required():field),
     confirmPassword: Yup.string().when('password',(password,field)=>password?field.required().oneOf([Yup.ref('password')]):field),
     role: Yup.string().oneOf(['Administrador','Gerente','Simples','Premium']),
   });
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({error:'Validation Fails'});
   }
   const user = await User.findByPk(req.userId);
   const {email,oldPassword} = req.body;
   if(email!==user.email){
     const emailExists = await User.findOne({ where: { email } });
     if(emailExists){
       return res.status(400).send({ error: 'Usuário already exists.' });
     }
   }
   if(oldPassword && !(await user.checkPassword(oldPassword))){
     return res.status(401).send({ error: 'Password does not match' });
   }
   const {id,avatar,name,role} = await user.update(req.body);
   return res.json({id,avatar,name,email,role});
 }
}

export default new UserController;
