// const { Router } = require("express");
// OU (com sucrase)
import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

// module.exports = routes;
// OU (com sucrase)
export default routes;
