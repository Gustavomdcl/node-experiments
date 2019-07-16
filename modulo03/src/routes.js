// const { Router } = require("express");
// OU (com sucrase)
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

// routes.post('/files', upload.single('file'), (req, res) => {
//   return res.json(req.file);
// });
routes.post('/files', upload.single('file'), FileController.store);

// module.exports = routes;
// OU (com sucrase)
export default routes;
