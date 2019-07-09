controller[`SessionController.js`] += `import jwt from 'jsonwebtoken';`+breakLine
controller[`SessionController.js`] += `import * as Yup from 'yup';`+breakLine
controller[`SessionController.js`] += `import User from '../models/User';`+breakLine
controller[`SessionController.js`] += `import authConfig from '../../config/auth';`+breakLine
controller[`SessionController.js`] += ``+breakLine
controller[`SessionController.js`] += `class SessionController {`+breakLine
controller[`SessionController.js`] += `  async store(req,res){`+breakLine
controller[`SessionController.js`] += `    const schema = Yup.object().shape({`+breakLine
controller[`SessionController.js`] += `      email: Yup.string().email().required(),`+breakLine
controller[`SessionController.js`] += `      password: Yup.string().required(),`+breakLine
controller[`SessionController.js`] += `    });`+breakLine
controller[`SessionController.js`] += `    if(!(await schema.isValid(req.body))){`+breakLine
controller[`SessionController.js`] += `      return res.status(400).json({error:'Validation Fails'});`+breakLine
controller[`SessionController.js`] += `    }`+breakLine
controller[`SessionController.js`] += `    const {email,password} = req.body;`+breakLine
controller[`SessionController.js`] += `    const user = await User.findOne({where:{email}});`+breakLine
controller[`SessionController.js`] += `    if(!user){`+breakLine
controller[`SessionController.js`] += `      return res.status(401).json({error:'User not found'});`+breakLine
controller[`SessionController.js`] += `    }`+breakLine
controller[`SessionController.js`] += `    if(!(await user.checkPassword(password))){`+breakLine
controller[`SessionController.js`] += `      return res.status(401).json({error:'Password does not match'});`+breakLine
controller[`SessionController.js`] += `    }`+breakLine
controller[`SessionController.js`] += `    const {id,name} = user;`+breakLine
controller[`SessionController.js`] += `    return res.json({`+breakLine
controller[`SessionController.js`] += `      user: {`+breakLine
controller[`SessionController.js`] += `        id,`+breakLine
controller[`SessionController.js`] += `        name,`+breakLine
controller[`SessionController.js`] += `        email,`+breakLine
controller[`SessionController.js`] += `      },`+breakLine
controller[`SessionController.js`] += `      token: jwt.sign({id},authConfig.secret,{`+breakLine
controller[`SessionController.js`] += `        expiresIn: authConfig.expiresIn,`+breakLine
controller[`SessionController.js`] += `      }),`+breakLine
controller[`SessionController.js`] += `    });`+breakLine
controller[`SessionController.js`] += `  }`+breakLine
controller[`SessionController.js`] += `}`+breakLine
controller[`SessionController.js`] += ``+breakLine
controller[`SessionController.js`] += `export default new SessionController();`+breakLine