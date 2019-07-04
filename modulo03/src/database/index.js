import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Conecta com a base de dados e carrega os models
    this.connection = new Sequelize(databaseConfig); // database connection

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
