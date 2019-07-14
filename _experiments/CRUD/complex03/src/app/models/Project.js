import Sequelize, { Model } from 'sequelize';

class Project extends Model {
  static init(sequelize){
    super.init(
      {
        author: Sequelize.INTEGER,
        title: Sequelize.STRING,
        author: Sequelize.INTEGER,
        description: Sequelize.STRING,
        author: Sequelize.INTEGER,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Project;
