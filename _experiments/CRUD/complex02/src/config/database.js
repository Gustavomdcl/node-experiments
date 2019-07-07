module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'complex02',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
