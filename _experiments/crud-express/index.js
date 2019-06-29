//INIT
const express = require("express");
const server = express();
server.use(express.json());

const database = {
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
  constructor(init) {
    this.init = init;
    this.CustomPostType();
    this.Pages();
  }
  CustomPostType() {
    for (const cpt in this.init) {
      this[cpt] = [];
      //DATABASE
      this[`${cpt}AI`] = 0; //Auto Increment
      //DATABASE
    }
  }
  Pages() {
    for (const cpt in this.init) {
      //CREATE
      server.post(
        `/${this.init[cpt]["details"]["slug-singular"]}`,
        (req, res) => {
          const post = {};
          for (const field in this.init[cpt]["body"]) {
            if (!req.body[field]) {
              if (!this.RequiredCheck(req, res, cpt, field)) {
                return res.status(400).json({
                  error: `${this.init[cpt]["body"][field]["label"]} is required`
                });
              }
            } else {
              post[field] = req.body[field];
            }
          }
          this.Add(cpt, post);
          return res.json(this.List(cpt));
        }
      );
      //LIST
      server.get(`/${this.init[cpt]["details"]["slug-plural"]}`, (req, res) => {
        return res.json(this.List(cpt));
      });
      //VIEW
      server.get(
        `/${this.init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          const post = this.View(cpt, id);
          if (!post) {
            return res.status(400).json({
              error: `${
                this.init[cpt]["details"]["title-singular"]
              } does not exists`
            });
          }
          return res.json(post);
        }
      );
      //UPDATE
      server.put(
        `/${this.init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          const postExists = this.View(cpt, id);
          if (!postExists) {
            return res.status(400).json({
              error: `${
                this.init[cpt]["details"]["title-singular"]
              } does not exists`
            });
          }
          const post = {};
          for (const field in this.init[cpt]["body"]) {
            if (!req.body[field]) {
              if (!this.RequiredCheck(req, res, cpt, field)) {
                return res.status(400).json({
                  error: `${this.init[cpt]["body"][field]["label"]} is required`
                });
              }
            } else {
              post[field] = req.body[field];
            }
          }
          this.Update(req, res, cpt, id, post);
          return res.json(this.List(cpt));
        }
      );
      //DELETE
      server.delete(
        `/${this.init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          const post = this.View(cpt, id);
          if (!post) {
            return res.status(400).json({
              error: `${
                this.init[cpt]["details"]["title-singular"]
              } does not exists`
            });
          }
          this.Delete(req, res, cpt, id);
          return res.json(this.List(cpt));
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
    if (this[cpt].length == 0) {
      return {
        error: `No ${this.init[cpt]["details"]["title-singular"]} created`
      };
    } else {
      return this[cpt];
    }
  }
  View(cpt, id) {
    return this[cpt].find(function(item) {
      return item["id"] == id;
    });
  }
  Update(req, res, cpt, id, post) {
    this[cpt].forEach((item, index) => {
      if (item["id"] == id) {
        for (const field in this.init[cpt]["body"]) {
          if (!req.body[field]) {
          } else {
            post[field] = req.body[field];
            this[cpt][index][field] = post[field];
          }
        }
      }
    });
  }
  Delete(req, res, cpt, id) {
    this[cpt].forEach((item, index) => {
      if (item["id"] == id) {
        this[cpt].splice(index, 1);
        return this[cpt];
      }
    });
  }
  RequiredCheck(req, res, cpt, field) {
    if (!req.body[field]) {
      if (this.init[cpt]["body"][field]["required"]) {
        return false;
      }
    }
  }
}
const Application = new App(database);

//LISTEN PORT
server.listen(3000);
