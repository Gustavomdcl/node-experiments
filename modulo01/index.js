const express = require("express");
const server = express();
server.use(express.json());//para funcionar o server.post() como json

// Query params = ?teste=1
server.get("/teste", (req, res) => {
  /* http://localhost:3000/teste */
  //return res.send("Hello World");
  //return res.json({ message: "Hello World" });

  /* http://localhost:3000/teste?nome=Diego */
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome}` });
});

// Route params = /users/1
const users = ["Diego", "Marcelo", "Gustavo"];
server.get("/users/:index", (req, res) => {
  /* http://localhost:3000/users/1 */
  //const index = req.params.index;
  //ou
  const { index } = req.params;
  //return res.json({ message: `Buscando o usuário ${index}` });
  return res.json(users[index]);
});

// Request body (POST/PUT) = {"name":"Gustavo","email":"gustavomdcl@gmail.com"}
// CRUD - Create, Read, Update, Delete
server.get('/users',(req,res)=>{
  return res.json(users);
});
server.post('/users',(req,res)=>{
  const {name} = req.body;
  users.push(name);
  return res.json(users);
});
server.put("/users/:index", (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});
server.delete("/users/:index", (req, res) => {
  const { index } = req.params;
  users.splice(index,1);
  return res.json(users);
});

server.listen(3000);
