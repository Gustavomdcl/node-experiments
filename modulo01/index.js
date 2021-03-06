const express = require("express");
const server = express();
server.use(express.json());//para funcionar o server.post() como json

// Query params = ?teste=1
server.get("/teste", (req, res) => {//Middleware
  /* http://localhost:3000/teste */
  //return res.send("Hello World");
  //return res.json({ message: "Hello World" });

  /* http://localhost:3000/teste?nome=Diego */
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome}` });
});

const users = ["Diego", "Marcelo", "Gustavo"];

//Middleware - Tudo o que trata dentro de uma requisição e retorna uma resposta

//Middleware global .use(), chama independente da rota, mas bloqueia o fluxo da aplicação
//Para não bloquear as próximas requisições, tem que chamar o next
server.use((req,res,next)=>{
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  //return res.json(users); //Bloqueia a continuidade dos outros requests
  //return next(); //Continua os próximos requests, mas bloqueia também
  next(); //Continua os próximos requests e chama funções depois.
  
  console.log('Depois do código');
  console.timeEnd('Request');
});
//Middleware local
function checkUserExists(req,res,next){
  if(!req.body.name){
    return res.status(400).json({error:'User name is required'});
  }
  return next();
}
function checkUserInArray(req,res,next){
  const user = users[req.params.index];
  if(!user){
    return res.status(400).json({error:"User does not exists"});
  }
  req.user=user;
  return next();
}

// Route params = /users/1
server.get("/users/:index",checkUserInArray, (req, res) => {//Middleware
  /* http://localhost:3000/users/1 */
  //const index = req.params.index;
  //ou
  const { index } = req.params;
  //return res.json({ message: `Buscando o usuário ${index}` });
  return res.json(users[index]);
  //ou
  //return res.json(req.user);// pois foi inserido no Middleware local checkUserInArray
});

// Request body (POST/PUT) = {"name":"Gustavo","email":"gustavomdcl@gmail.com"}
// CRUD - Create, Read, Update, Delete
server.get('/users',(req,res)=>{//Middleware
  return res.json(users);
});
server.post('/users',checkUserExists,(req,res)=>{//Middleware
  const {name} = req.body;
  users.push(name);
  return res.json(users);
});
server.put("/users/:index",checkUserInArray,checkUserExists, (req, res) => {//Middleware
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});
server.delete("/users/:index",checkUserInArray, (req, res) => {//Middleware
  const { index } = req.params;
  users.splice(index,1);
  return res.json(users);
});

server.listen(3000);
