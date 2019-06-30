module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "docker",
  database: "simpledb",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
