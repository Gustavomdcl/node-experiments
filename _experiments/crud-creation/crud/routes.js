export default class CRUD_ROUTES {
  constructor(init,server) {
    this.init = init;
    this.server = server;
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
      this.server.post(
        `/${RelationHeader}${this.init[cpt]["details"]["slugSingular"]}`,
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
      this.server.get(
        `/${RelationHeader}${this.init[cpt]["details"]["slugPlural"]}`,
        (req, res) => {
          var parent = "";
          if (relation != "") {
            parent = req.params.parent;
          }
          return res.json(this.List(cpt, parent, relation));
        }
      );
      //VIEW
      this.server.get(
        `/${RelationHeader}${this.init[cpt]["details"]["slugSingular"]}/:id`,
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
                this.init[cpt]["details"]["titleSingular"]
              } does not exists`
            });
          }
          return res.json(post);
        }
      );
      //UPDATE
      this.server.put(
        `/${RelationHeader}${this.init[cpt]["details"]["slugSingular"]}/:id`,
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
                this.init[cpt]["details"]["titleSingular"]
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
      this.server.delete(
        `/${RelationHeader}${this.init[cpt]["details"]["slugSingular"]}/:id`,
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
                this.init[cpt]["details"]["titleSingular"]
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
        error: `No ${this.init[cpt]["details"]["titleSingular"]} created`
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