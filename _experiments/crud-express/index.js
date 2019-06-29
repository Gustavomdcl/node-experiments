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
    relation: false,
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
    relation: "project",
    body: {
      // project: {
      //   type: "relation",
      //   required: true,
      //   label: "Projeto",
      //   placeholder: "Escolha o projeto para essa tarefa"
      // },
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
      var RelationHeader = "";
      var { relation } = this.init[cpt];
      if (this.init[cpt]["relation"] != false) {
        RelationHeader = `${this.init[cpt]["relation"]}/:parent/`;
      }
      //CREATE
      server.post(
        `/${RelationHeader}${this.init[cpt]["details"]["slug-singular"]}`,
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
          var parent = "";
          if (relation != "") {
            parent = req.params.parent;
            post[relation] = parent;
          }
          this.Add(cpt, post);
          return res.json(this.List(cpt, parent, relation));
        }
      );
      //LIST
      server.get(
        `/${RelationHeader}${this.init[cpt]["details"]["slug-plural"]}`,
        (req, res) => {
          var parent = "";
          if (relation != "") {
            parent = req.params.parent;
          }
          return res.json(this.List(cpt, parent, relation));
        }
      );
      //VIEW
      server.get(
        `/${RelationHeader}${this.init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          var parent = "";
          if (relation != "") {
            parent = req.params.parent;
          }
          const post = this.View(cpt, id, parent, relation);
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
        `/${RelationHeader}${this.init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          var parent = "";
          if (relation != "") {
            parent = req.params.parent;
          }
          const postExists = this.View(cpt, id, parent, relation);
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
          if (relation != "") {
            post[relation] = parent;
          }
          this.Update(req, res, cpt, id, post);
          return res.json(this.List(cpt, parent, relation));
        }
      );
      //DELETE
      server.delete(
        `/${RelationHeader}${this.init[cpt]["details"]["slug-singular"]}/:id`,
        (req, res) => {
          const { id } = req.params;
          var parent = "";
          if (relation != "") {
            parent = req.params.parent;
          }
          const post = this.View(cpt, id, parent, relation);
          if (!post) {
            return res.status(400).json({
              error: `${
                this.init[cpt]["details"]["title-singular"]
              } does not exists`
            });
          }
          this.Delete(req, res, cpt, id);
          return res.json(this.List(cpt, parent, relation));
        }
      );
    }
  }
  Add(cpt, data, parent) {
    //DATABASE
    data["id"] = this[`${cpt}AI`];
    this[`${cpt}AI`]++;
    //DATABASE
    this[cpt].push(data);
  }
  List(cpt, parent, relation) {
    var list = this[cpt];
    if (parent != "") {
      list = this[cpt].filter(function(item) {
        return item[relation] == parent;
      });
    }
    if (list.length == 0) {
      return {
        error: `No ${this.init[cpt]["details"]["title-singular"]} created`
      };
    } else {
      return list;
    }
  }
  View(cpt, id, parent, relation) {
    var list = this[cpt];
    if (parent != "") {
      list = this[cpt].filter(function(item) {
        return item[relation] == parent;
      });
    }
    return list.find(function(item) {
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
