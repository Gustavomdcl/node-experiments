//INIT
const express = require("express");
const server = express();
server.use(express.json());

const init = {
  project: {
    details: {
      "slug-singular": "project",
      "slug-plural": "projects",
      "title-singular": "Projeto",
      "title-plural": "Projetos",
      gender: "o"
    },
    body: {
      name: {
        type: "text",
        required: true,
        label: "Nome",
        placeholder: "Insira seu nome"
      },
      smoke: {
        type: "radio",
        required: true,
        label: "Fumante",
        placeholder: "Você fuma?",
        options: ["Sim", "Não"]
      }
    }
  },
  task: {
    details: {
      "slug-singular": "task",
      "slug-plural": "tasks",
      "title-singular": "Tarefa",
      "title-plural": "Tarefas",
      gender: "a"
    },
    body: {
      name: {
        type: "text",
        required: true,
        label: "Nome",
        placeholder: "Insira seu nome"
      },
      smoke: {
        type: "radio",
        required: true,
        label: "Fumante",
        placeholder: "Você fuma?",
        options: ["Sim", "Não"]
      }
    }
  }
};

class App {
  constructor() {
    this.CustomPostType();
    this.Pages();
  }
  CustomPostType() {
    for (const cpt in init) {
      this[cpt] = [];
      //DATABASE
      this[`${cpt}AI`] = 0; //Auto Increment
      //DATABASE
    }
  }
  Pages() {
    for (const cpt in init) {
      //CREATE
      server.post(`/${init[cpt]["details"]["slug-singular"]}`, (req, res) => {
        const post = {};
        for (const field in init[cpt]["body"]) {
          if (!req.body[field]) {
            this.RequiredCheck(req, res, cpt, field);
          } else {
            post[field] = req.body[field];
          }
        }
        this.Add(cpt, post);
        return res.json(this.List(cpt));
      });
      //LIST
      server.get(`/${init[cpt]["details"]["slug-plural"]}`, (req, res) => {
        return res.json(this.List(cpt));
      });
      //VIEW
      server.get(
        `/${init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          this.checkPostIdExists(req, res, cpt, id);
        }
      );
    }
  }
  Add(cpt, data) {
    //DATABASE
    data["id"] = this[`${cpt}AI`];
    this[`${cpt}AI`]++;
    //DATABASE
    this[cpt].push(data);
  }
  List(cpt) {
    return this[cpt];
  }
  View(cpt, id) {
    return this[cpt].find(function(item) {
      return item["id"] == id;
    });
  }
  RequiredCheck(req, res, cpt, id) {
    if (!req.body[field]) {
      if (init[cpt]["body"][field]["required"]) {
        return res.status(400).json({
          error: `${init[cpt]["body"][field]["label"]} is required`
        });
      }
    }
  }
  checkPostIdExists(req, res, cpt, id) {
    const post = this.View(cpt, id);
    if (!post) {
      return res.status(400).json({
        error: `${init[cpt]["details"]["title-singular"]} does not exists`
      });
    }
    return res.json(post);
  }
}
const Application = new App();

//LISTEN PORT
server.listen(3000);
