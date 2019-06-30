// const { Router } = require("express");
// OU (com sucrase)
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

// routes.get('/', async (req, res) => {
//   const user = await User.create({
//     name: 'Gustavo Lima',
//     email: 'gustavomdcl@gmail.com',
//     password_hash: '12345678',
//   });
//   return res.json(user);
// });

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// module.exports = routes;
// OU (com sucrase)
export default routes;
