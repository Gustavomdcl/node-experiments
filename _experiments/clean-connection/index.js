import express from 'express';
import User from './database/models/User';
import './database';

const server = express();
server.use(express.json());

server.get('/', async (req,res) => {
  return res.json({message:'hello world'});
});

server.get('/user', async (req,res) => {
  const user = await User.create({
    name: 'Totolis',
    email: 'totolis@bobo.com',
    password_hash: '1234',
    role: 'Administrador',
  });
  return res.json(user);
});

server.listen(3000);