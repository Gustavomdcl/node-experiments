import Sequelize, { Model } from 'sequelize';

class Project extends Model {
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
  }
}

export default Project;
