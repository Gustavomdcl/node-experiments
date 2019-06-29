//INIT
const express = require("express");
const server = express();
server.use(express.json());

//APP VARS
{
  class Projects {
    constructor() {
      this.projects = [];
      this.autoIncrement = 0;
    }
    add(project) {
      project["id"] = this.autoIncrement;
      this.autoIncrement++;
      this.projects.push(project);
    }
    list() {
      return this.projects;
    }
    view(id) {
      return this.projects.find(function(item) {
        return item["id"] == id;
      });
    }
    update(id, title) {
      this.projects.forEach((item, index) => {
        if (item["id"] == id) {
          this.projects[index]["title"] = title;
          return this.projects[index];
        }
      });
    }
    delete(id) {
      this.projects.forEach((item, index) => {
        if (item["id"] == id) {
          this.projects.splice(index, 1);
          return this.projects;
        }
      });
    }
  }
  class ProjectsTasks extends Projects {
    constructor() {
      super();
    }
    addTask(id, title) {
      this.projects.forEach((item, index) => {
        if (item["id"] == id) {
          this.projects[index]["tasks"].push(title);
          return this.projects[index]["tasks"];
        }
      });
    }
  }
  var MeusProjetos = new ProjectsTasks();
}

//MIDDLEWARE GLOBAL
{
  const requires = {
    total: 0,
    logs: []
  };
  server.use((req, res, next) => {
    next();
    requires["total"]++;
    if (!requires[req.method]) {
      requires[req.method] = 1;
    } else {
      requires[req.method]++;
    }
    requires["logs"] = req.url;
    console.log("Requisições:");
    console.log(requires);
  });
}

//MIDDLEWARE LOCAL
{
  function checkProjectTitleEmpty(req, res, next) {
    if (!req.body.title) {
      return res.status(400).json({ error: "Project title is required" });
    }
    return next();
  }
  function checkProjectIdExists(req, res, next) {
    const project = MeusProjetos.view(req.params.id);
    if (!project) {
      return res.status(400).json({ error: "Project does not exists" });
    }
    req.project = project;
    return next();
  }
}

//ROUTES
{
  server.post("/projects", checkProjectTitleEmpty, (req, res) => {
    const { title } = req.body;
    MeusProjetos.add({
      title,
      tasks: []
    });
    return res.json(MeusProjetos.list());
  });
  server.get("/projects", (req, res) => {
    return res.json(MeusProjetos.list());
  });
  server.get("/project/:id", checkProjectIdExists, (req, res) => {
    return res.json(req.project);
  });
  server.put(
    "/projects/:id",
    checkProjectTitleEmpty,
    checkProjectIdExists,
    (req, res) => {
      const { id } = req.params;
      const { title } = req.body;
      MeusProjetos.update(id, title);
      return res.json(MeusProjetos.list());
    }
  );
  server.delete("/projects/:id", checkProjectIdExists, (req, res) => {
    const { id } = req.params;
    MeusProjetos.delete(id);
    return res.json(MeusProjetos.list());
  });
  server.post(
    "/projects/:id/tasks",
    checkProjectTitleEmpty,
    checkProjectIdExists,
    (req, res) => {
      const { id } = req.params;
      const { title } = req.body;
      MeusProjetos.addTask(id, title);
      return res.json(MeusProjetos.list());
    }
  );
}

//LISTEN PORT
server.listen(3000);
