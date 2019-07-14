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
    this.belongsTo(models.User, { foreignKey: 'author' });
    this.belongsTo(models.Project, { foreignKey: 'project' });
  }
}

export default Task;
