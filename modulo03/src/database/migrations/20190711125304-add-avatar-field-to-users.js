module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // tabela
      'avatar_id', // nome da coluna
      {
        type: Sequelize.INTEGER,
        references: {
          // chave estrangeira
          model: 'files', // nome da tabela
          key: 'id', // coluna
        },
        onUpdate: 'CASCADE', // nao obrigatorio: se for alterado, também ocorra aqui
        onDelete: 'SET NULL', // nao obrigatorio: se for deletado na tabela files ele virará nulo
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
