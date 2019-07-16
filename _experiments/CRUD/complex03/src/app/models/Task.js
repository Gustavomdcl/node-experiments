import Sequelize, { Model } from 'sequelize';

class Task extends Model {
  static init(sequelize){
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'author', as: 'author_data' });
    this.belongsTo(models.Project, { foreignKey: 'project', as: 'project_data' });
  }
}

export default Task;
