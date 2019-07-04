module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'cleandb',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};