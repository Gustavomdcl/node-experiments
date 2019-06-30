//EXPRESS
const express = require("express");
const server = express();
server.use(express.json());
//SEQUELIZE
import Sequelize, { Model } from "sequelize";
import databaseConfig from "./database/database";

//MODELS
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );
  }
}

//CONNECTION
const models = [User];
class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}
new Database();

//ROUTES
server.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});
server.get("/user/", async (req, res) => {
  const user = await User.create({
    name: "Gustavo Lima",
    email: "gustavomdcl@gmail.com",
    password_hash: "12345678"
  });
  return res.json(user);
});
server.listen(3000);
