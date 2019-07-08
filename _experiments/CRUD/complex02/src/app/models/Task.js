import Sequelize, { Model } from 'sequelize';

class Task extends Model {
  static init(sequelize){
    super.init(
      {
        author: Sequelize.INTEGER,
        project: Sequelize.INTEGER,
        title: Sequelize.STRING,
        author: Sequelize.INTEGER,
        project: Sequelize.INTEGER,
        description: Sequelize.STRING,
        author: Sequelize.INTEGER,
        project: Sequelize.INTEGER,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Task;
