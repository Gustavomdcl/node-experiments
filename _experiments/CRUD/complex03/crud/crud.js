import CreateFile from "./generate";

class CRUD {
  constructor() {
    this.crud = {};
    this.type;
  }
  //CREATE
    CustomPostType(type) {
      this.type = type;
      this.crud[type] = {};
      this.Details();
      this.Relation();
      //this.Field();
      return this;
    }
    Details(slugSingular='module',slugPlural='modules',titleSingular='Module',titlePlural='Modules',gender='o',type=this.type) {
      this.crud[type]['details'] = {
        slugSingular,
        slugPlural,
        titleSingular,
        titlePlural,
        gender
      };
      return this;
    }
    Relation(relation=false,type=this.type) {//relation = false or string;
      this.crud[type]['relation'] = relation;
      return this;
    }
    Field(field='title',format='text',required=false,label='Title',placeholder='Type your title',options=false,unique=false,type=this.type) {
      if(!this.crud[type]['body']){
        this.crud[type]['body']={};
      }
      this.crud[type]['body'][field] = {
        format,
        required,
        label,
        placeholder,
        options,
        unique
      };
      return this;
    }
  //SETUP
    Config(secret,days,dialect,host,username,password,database) {
      var config = {};
      var breakLine = "\n";
      config['auth.js'] = '';
      config['auth.js'] += `export default {`+breakLine;
      config['auth.js'] += `  secret: '${secret}',`+breakLine;
      config['auth.js'] += `  expiresIn: '${days}',`+breakLine;
      config['auth.js'] += `};`+breakLine;

      config['database.js'] = '';
      config['database.js'] += `module.exports = {`+breakLine;
      config['database.js'] += `  dialect: '${dialect}',`+breakLine;
      config['database.js'] += `  host: '${host}',`+breakLine;
      config['database.js'] += `  username: '${username}',`+breakLine;
      config['database.js'] += `  password: '${password}',`+breakLine;
      config['database.js'] += `  database: '${database}',`+breakLine;
      config['database.js'] += `  define: {`+breakLine;
      config['database.js'] += `    timestamps: true,`+breakLine;
      config['database.js'] += `    underscored: true,`+breakLine;
      config['database.js'] += `    underscoredAll: true,`+breakLine;
      config['database.js'] += `  },`+breakLine;
      config['database.js'] += `};`+breakLine;

      config['multer.js'] = '';
      config['multer.js'] += `import multer from 'multer';`+breakLine;
      config['multer.js'] += `import crypto from 'crypto';`+breakLine;
      config['multer.js'] += `import { extname, resolve } from 'path';`+breakLine;
      config['multer.js'] += ``+breakLine;
      config['multer.js'] += `export default {`+breakLine;
      config['multer.js'] += `  storage: multer.diskStorage({`+breakLine;
      config['multer.js'] += `    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),`+breakLine;
      config['multer.js'] += `    filename: (req, file, cb) => {`+breakLine;
      config['multer.js'] += `      crypto.randomBytes(16, (err, res) => {`+breakLine;
      config['multer.js'] += `        if (err) return cb(err);`+breakLine;
      config['multer.js'] += `        `+breakLine;
      config['multer.js'] += `        return cb(null, res.toString('hex') + extname(file.originalname));`+breakLine;
      config['multer.js'] += `      });`+breakLine;
      config['multer.js'] += `    },`+breakLine;
      config['multer.js'] += `  }),`+breakLine;
      config['multer.js'] += `};`+breakLine;
      CreateFile.GenerateDir('./tmp');
      CreateFile.GenerateDir('./tmp/uploads');
      for (let file in config) {
        var path = "./src";
        CreateFile.GenerateDir(path);
        path += "/config";
        CreateFile.GenerateDir(path);
        path += '/'+file;
        var message = config[file];
        CreateFile.GenerateFile(path,message);
      }
      return config;
    }
    Server() {
      var server = {};
      var breakLine = "\n";
      server['app.js'] = '';
      server['app.js'] += `import express from 'express';`+breakLine;
      server['app.js'] += `import path from 'path';`+breakLine;
      server['app.js'] += `import routes from './routes';`+breakLine;
      server['app.js'] += ``+breakLine;
      server['app.js'] += `import './database';`+breakLine;
      server['app.js'] += ``+breakLine;
      server['app.js'] += `class App {`+breakLine;
      server['app.js'] += `  constructor() {`+breakLine;
      server['app.js'] += `    this.server = express();`+breakLine;
      server['app.js'] += `    this.middlewares();`+breakLine;
      server['app.js'] += `    this.routes();`+breakLine;
      server['app.js'] += `  }`+breakLine;
      server['app.js'] += `  middlewares() {`+breakLine;
      server['app.js'] += `    this.server.use(express.json());`+breakLine;
      server['app.js'] += `    this.server.use('/files',express.static(path.resolve(__dirname,'..','tmp','uploads')));`+breakLine;
      server['app.js'] += `  }`+breakLine;
      server['app.js'] += `  routes() {`+breakLine;
      server['app.js'] += `    this.server.use(routes);`+breakLine;
      server['app.js'] += `  }`+breakLine;
      server['app.js'] += `}`+breakLine;
      server['app.js'] += ``+breakLine;
      server['app.js'] += `export default new App().server;`+breakLine;

      server['server.js'] = '';
      server['server.js'] += `import App from './app';`+breakLine;
      server['server.js'] += ``+breakLine;
      server['server.js'] += `App.listen(3333);`+breakLine;

      const types = this.crud;
      var controllers = `import FileController from './app/controllers/FileController';`+breakLine;
      var routes = '';
      for (let type in types) {
        var typeName = this.crud[type]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[type]['details']['slugSingular'].slice(1);
        //CONTROLLER
          controllers += `import ${typeName}Controller from './app/controllers/${typeName}Controller';`+breakLine;
          if(type=='user'){
            controllers += `import SessionController from './app/controllers/SessionController';`+breakLine;
            controllers += `import authMiddleware from './app/middlewares/auth';`+breakLine;
          }
        //ROUTES
          if(type=='user'){
            routes += `routes.post('/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.store);`+breakLine;
            routes += `routes.post('/sessions', SessionController.store);`+breakLine;
            routes += `routes.use(authMiddleware);`+breakLine;
            routes += `routes.put('/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.update);`+breakLine;
            routes += `routes.get('/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.index);`+breakLine;
          } else {
            if(types[type]['relation']==false){
              routes += `routes.post('/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.store);`+breakLine;
              routes += `routes.put('/${this.crud[type]['details']['slugPlural']}/:id', ${typeName}Controller.update);`+breakLine;
              routes += `routes.get('/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.index);`+breakLine;
            } else {
              routes += `routes.post('/${types[type]['relation']}/:parent/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.store);`+breakLine;
              routes += `routes.put('/${types[type]['relation']}/:parent/${this.crud[type]['details']['slugPlural']}/:id', ${typeName}Controller.update);`+breakLine;
              routes += `routes.get('/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.index);`+breakLine;
              routes += `routes.get('/${types[type]['relation']}/:parent/${this.crud[type]['details']['slugPlural']}', ${typeName}Controller.index);`+breakLine;
            }
          }
          routes += ``+breakLine;
      }
      server['routes.js'] = '';
      server['routes.js'] += `import { Router } from 'express';`+breakLine;
      server['routes.js'] += `import multer from 'multer';`+breakLine;
      server['routes.js'] += `import multerConfig from './config/multer';`+breakLine;
      server['routes.js'] += ``+breakLine;
      server['routes.js'] += controllers;
      server['routes.js'] += ``+breakLine;
      server['routes.js'] += `const routes = new Router();`+breakLine;
      server['routes.js'] += `const upload = multer(multerConfig);`+breakLine;
      server['routes.js'] += ``+breakLine;
      server['routes.js'] += routes;
      server['routes.js'] += `routes.post('/files', upload.single('file'), FileController.store);`+breakLine;
      server['routes.js'] += ``+breakLine;
      server['routes.js'] += `export default routes;`+breakLine;
      for (let file in server) {
        var path = "./src";
        CreateFile.GenerateDir(path);
        path += '/'+file;
        var message = server[file];
        CreateFile.GenerateFile(path,message);
      }
      return server;
    }
    Migration() {
      var migration = {};
      var breakLine = "\n";
      var migrationCount = 10;
      var migrationName = '';
      migrationName = `201811031030${migrationCount}-create-files.js`;
      migration[migrationName] = `module.exports = {`+breakLine;
      migration[migrationName] += `  up: (queryInterface, Sequelize) => {`+breakLine;
      migration[migrationName] += `    return queryInterface.createTable('files', {`+breakLine;
      migration[migrationName] += `      id: {`+breakLine;
      migration[migrationName] += `        type: Sequelize.INTEGER,`+breakLine;
      migration[migrationName] += `        allowNull: false,`+breakLine;
      migration[migrationName] += `        autoIncrement: true,`+breakLine;
      migration[migrationName] += `        primaryKey: true,`+breakLine;
      migration[migrationName] += `      },`+breakLine;
      migration[migrationName] += `      name: {`+breakLine;
      migration[migrationName] += `        type: Sequelize.STRING,`+breakLine;
      migration[migrationName] += `        allowNull: false,`+breakLine;
      migration[migrationName] += `      },`+breakLine;
      migration[migrationName] += `      path: {`+breakLine;
      migration[migrationName] += `        type: Sequelize.STRING,`+breakLine;
      migration[migrationName] += `        allowNull: false,`+breakLine;
      migration[migrationName] += `        unique: true,`+breakLine;
      migration[migrationName] += `      },`+breakLine;
      migration[migrationName] += `      created_at: {`+breakLine;
      migration[migrationName] += `        type: Sequelize.DATE,`+breakLine;
      migration[migrationName] += `        allowNull: false,`+breakLine;
      migration[migrationName] += `      },`+breakLine;
      migration[migrationName] += `      updated_at: {`+breakLine;
      migration[migrationName] += `        type: Sequelize.DATE,`+breakLine;
      migration[migrationName] += `        allowNull: false,`+breakLine;
      migration[migrationName] += `      },`+breakLine;
      migration[migrationName] += `    });`+breakLine;
      migration[migrationName] += `  },`+breakLine;
      migration[migrationName] += `  down: queryInterface => {`+breakLine;
      migration[migrationName] += `    return queryInterface.dropTable('files');`+breakLine;
      migration[migrationName] += `  },`+breakLine;
      migration[migrationName] += `};`+breakLine;
      migrationCount++;
      const types = this.crud;
      for (let type in types) {
        migrationCount++;
        migrationName = `201811031030${migrationCount}-create-${this.crud[type]['details']['slugPlural']}.js`;
        migration[migrationName] = 'module.exports = {'+breakLine;
        migration[migrationName] += '  up: (queryInterface, Sequelize) => {'+breakLine;
        migration[migrationName] += `    return queryInterface.createTable('${this.crud[type]['details']['slugPlural']}', {`+breakLine;

        migration[migrationName] += '      id: {'+breakLine;
        migration[migrationName] += '        type: Sequelize.INTEGER,'+breakLine;
        migration[migrationName] += '        allowNull: false,'+breakLine;
        migration[migrationName] += '        autoIncrement: true,'+breakLine;
        migration[migrationName] += '        primaryKey: true,'+breakLine;
        migration[migrationName] += '      },'+breakLine;

        if(type!='user'){//usuários não recebem author
          migration[migrationName] += '      author: {'+breakLine;
          migration[migrationName] += '        type: Sequelize.INTEGER,'+breakLine;//Linka com o id do author
          migration[migrationName] += '        references: {'+breakLine;
          migration[migrationName] += `          model: '${this.crud['user']['details']['slugPlural']}',`+breakLine;
          migration[migrationName] += `          key: 'id',`+breakLine;
          migration[migrationName] += '        },'+breakLine;
          migration[migrationName] += `        onUpdate: 'CASCADE',`+breakLine;
          migration[migrationName] += `        onDelete: 'SET NULL',`+breakLine;
          migration[migrationName] += '        allowNull: false,'+breakLine;
          migration[migrationName] += '      },'+breakLine;
        }

        if(types[type]['relation']!=false){
          migration[migrationName] += `      ${types[type]['relation']}: {`+breakLine;
          migration[migrationName] += '        type: Sequelize.INTEGER,'+breakLine;//Linka com o elemento pai
          migration[migrationName] += '        references: {'+breakLine;
          migration[migrationName] += `          model: '${this.crud[types[type]['relation']]['details']['slugPlural']}',`+breakLine;
          migration[migrationName] += `          key: 'id',`+breakLine;
          migration[migrationName] += '        },'+breakLine;
          migration[migrationName] += `        onUpdate: 'CASCADE',`+breakLine;
          migration[migrationName] += `        onDelete: 'SET NULL',`+breakLine;
          migration[migrationName] += '        allowNull: false,'+breakLine;
          migration[migrationName] += '      },'+breakLine;
        }

        const fields = types[type]['body'];
        for (let field in fields) {
          //migration[field] = fields[field];
          migration[migrationName] += `      ${field}: {`+breakLine;
          if(fields[field]['format']=='file'){
            migration[migrationName] += '        type: Sequelize.INTEGER,'+breakLine;
            migration[migrationName] += '        references: {'+breakLine;
            migration[migrationName] += `          model: 'files',`+breakLine;
            migration[migrationName] += `          key: 'id',`+breakLine;
            migration[migrationName] += '        },'+breakLine;
            migration[migrationName] += `        onUpdate: 'CASCADE',`+breakLine;
            migration[migrationName] += `        onDelete: 'SET NULL',`+breakLine;
          } else if(fields[field]['format']=='different'){} else {
            migration[migrationName] += '        type: Sequelize.STRING,'+breakLine;
          }
          if(fields[field]['required']==true){
            migration[migrationName] += '        allowNull: false,'+breakLine;
          } else {
            migration[migrationName] += '        allowNull: true,'+breakLine;
          }
          if((fields[field]['unique']==true)){
            migration[migrationName] += '        unique: true,'+breakLine;
          }
          migration[migrationName] += '      },'+breakLine;
        }

        migration[migrationName] += '      created_at: {'+breakLine;
        migration[migrationName] += '        type: Sequelize.DATE,'+breakLine;
        migration[migrationName] += '        allowNull: false,'+breakLine;
        migration[migrationName] += '      },'+breakLine;
        migration[migrationName] += '      updated_at: {'+breakLine;
        migration[migrationName] += '        type: Sequelize.DATE,'+breakLine;
        migration[migrationName] += '        allowNull: false,'+breakLine;
        migration[migrationName] += '      },'+breakLine;

        migration[migrationName] += '    });'+breakLine;
        migration[migrationName] += '  },'+breakLine;
        migration[migrationName] += '  down: (queryInterface, Sequelize) => {'+breakLine;
        migration[migrationName] += `    return queryInterface.dropTable('${this.crud[type]['details']['slugPlural']}');`+breakLine;
        migration[migrationName] += '  }'+breakLine;
        migration[migrationName] += '};'+breakLine;
      }
      for (let file in migration) {
        var path = "./src";
        CreateFile.GenerateDir(path);
        path += "/database";
        CreateFile.GenerateDir(path);
        path += "/migrations";
        CreateFile.GenerateDir(path);
        path += '/'+file;
        var message = migration[file];
        CreateFile.GenerateFile(path,message);
      }
      return migration;
    }
    Models() {
      var model = {};
      var breakLine = "\n";
      const types = this.crud;
      var models = '[File,';
      var imports = '';
      var model_count = 0;

      model[`File.js`] = '';
      model[`File.js`] += `import Sequelize, { Model } from 'sequelize';`+breakLine;
      model[`File.js`] += ``+breakLine;
      model[`File.js`] += `class File extends Model {`+breakLine;
      model[`File.js`] += `  static init(sequelize) {`+breakLine;
      model[`File.js`] += `    super.init(`+breakLine;
      model[`File.js`] += `      {`+breakLine;
      model[`File.js`] += `        name: Sequelize.STRING,`+breakLine;
      model[`File.js`] += `        path: Sequelize.STRING,`+breakLine;
      model[`File.js`] += `        url: {`+breakLine;
      model[`File.js`] += `          type: Sequelize.VIRTUAL,`+breakLine;
      model[`File.js`] += `          get(){`+breakLine;
      model[`File.js`] += `            return 'http://localhost:3333/files/'+this.path;`+breakLine;
      model[`File.js`] += `          }`+breakLine;
      model[`File.js`] += `        }`+breakLine;
      model[`File.js`] += `      },`+breakLine;
      model[`File.js`] += `      {`+breakLine;
      model[`File.js`] += `        sequelize,`+breakLine;
      model[`File.js`] += `      }`+breakLine;
      model[`File.js`] += `    );`+breakLine;
      model[`File.js`] += `    return this;`+breakLine;
      model[`File.js`] += `  }`+breakLine;
      model[`File.js`] += `}`+breakLine;
      model[`File.js`] += ``+breakLine;
      model[`File.js`] += `export default File;`+breakLine;

      for (let type in types) {
        var modelName = this.crud[type]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[type]['details']['slugSingular'].slice(1);
        imports += `import ${modelName} from '../app/models/${modelName}';`+breakLine;
        if(model_count!=0){
          models += ',';
        }
        model_count++;
        models += modelName;
        model[`${modelName}.js`] = '';
        model[`${modelName}.js`] += `import Sequelize, { Model } from 'sequelize';`+breakLine;
        if(type=='user'){//Para senhas de usuários
          model[`${modelName}.js`] += `import bcrypt from 'bcryptjs';`+breakLine;
        }
        model[`${modelName}.js`] += ''+breakLine;

        model[`${modelName}.js`] += `class ${modelName} extends Model {`+breakLine;
        model[`${modelName}.js`] += '  static init(sequelize){'+breakLine;
        model[`${modelName}.js`] += '    super.init('+breakLine;
        model[`${modelName}.js`] += '      {'+breakLine;
        const fields = types[type]['body'];
        for (let field in fields) {
          if(fields[field]['format']=='file'){} else {
            // if(type!='user'){//usuários não recebem author
            //   model[`${modelName}.js`] += '        author: Sequelize.INTEGER,'+breakLine;
            // }
            // if(types[type]['relation']!=false){
            //   model[`${modelName}.js`] += `        ${types[type]['relation']}: Sequelize.INTEGER,`+breakLine;
            // }
            if(field=='password_hash'&&type=='user'){
              model[`${modelName}.js`] += '        password: Sequelize.VIRTUAL,'+breakLine;
            }
            if(fields[field]['format']=='different'){} else {
              model[`${modelName}.js`] += `        ${field}: Sequelize.STRING,`+breakLine;
            }
          }
        }
        model[`${modelName}.js`] += '      },'+breakLine;
        model[`${modelName}.js`] += '      {'+breakLine;
        model[`${modelName}.js`] += '        sequelize,'+breakLine;
        model[`${modelName}.js`] += '      }'+breakLine;
        model[`${modelName}.js`] += '    );'+breakLine;
        if(type=='user'){
          model[`${modelName}.js`] += `    this.addHook('beforeSave', async user => {`+breakLine;
          model[`${modelName}.js`] += '      if (user.password) {'+breakLine;
          model[`${modelName}.js`] += '        user.password_hash = await bcrypt.hash(user.password, 8);'+breakLine;
          model[`${modelName}.js`] += '      }'+breakLine;
          model[`${modelName}.js`] += '    });'+breakLine;
        }
        model[`${modelName}.js`] += '    return this;'+breakLine;
        model[`${modelName}.js`] += '  }'+breakLine;
        model[`${modelName}.js`] += `  static associate(models) {`+breakLine;
        if(type!='user'){
          model[`${modelName}.js`] += `    this.belongsTo(models.User, { foreignKey: 'author', as: 'author_data' });`+breakLine;
        }
        if(types[type]['relation']!=false){
          var relationName = this.crud[types[type]['relation']]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[types[type]['relation']]['details']['slugSingular'].slice(1);
          model[`${modelName}.js`] += `    this.belongsTo(models.${relationName}, { foreignKey: '${types[type]['relation']}', as: '${types[type]['relation']}_data' });`+breakLine;
        }
        for (let field in fields) {
          if(fields[field]['format']=='file'){
            model[`${modelName}.js`] += `    this.belongsTo(models.File, { foreignKey: '${field}', as: '${field}_data' });`+breakLine;
          }
        }
        model[`${modelName}.js`] += `  }`+breakLine;
        if(type=='user'){
          model[`${modelName}.js`] += '  checkPassword(password) {'+breakLine;
          model[`${modelName}.js`] += '    return bcrypt.compare(password, this.password_hash);'+breakLine;
          model[`${modelName}.js`] += '  }'+breakLine;
        }
        model[`${modelName}.js`] += '}'+breakLine;
        model[`${modelName}.js`] += ''+breakLine;

        model[`${modelName}.js`] += `export default ${modelName};`+breakLine;
      }
      models += ']';
      model['index.js'] = '';
      model['index.js'] += `import Sequelize from 'sequelize';`+breakLine;
      model['index.js'] += ``+breakLine;
      model['index.js'] += `import File from '../app/models/File';`+breakLine;
      model['index.js'] += imports;
      model['index.js'] += ``+breakLine;
      model['index.js'] += `import databaseConfig from '../config/database';`+breakLine;
      model['index.js'] += ''+breakLine;
      model['index.js'] += `const models = ${models};`+breakLine;
      model['index.js'] += ''+breakLine;
      model['index.js'] += 'class Database {'+breakLine;
      model['index.js'] += '  constructor(){'+breakLine;
      model['index.js'] += '    this.init();'+breakLine;
      model['index.js'] += '  }'+breakLine;
      model['index.js'] += '  init(){'+breakLine;
      model['index.js'] += '    this.connection = new Sequelize(databaseConfig);'+breakLine;
      model['index.js'] += '    models'+breakLine;
      model['index.js'] += '      .map(model => model.init(this.connection))'+breakLine;
      model['index.js'] += '      .map(model => model.associate && model.associate(this.connection.models));'+breakLine;
      model['index.js'] += '  }'+breakLine;
      model['index.js'] += '}'+breakLine;
      model['index.js'] += ''+breakLine;
      model['index.js'] += 'export default new Database();'+breakLine;
      for (let file in model) {
        if(file=='index.js'){
          var path = "./src";
          CreateFile.GenerateDir(path);
          path += "/database";
          CreateFile.GenerateDir(path);
          path += '/'+file;
          message = model[file];
          CreateFile.GenerateFile(path,message);
        } else {
          var path = "./src";
          CreateFile.GenerateDir(path);
          path += "/app";
          CreateFile.GenerateDir(path);
          path += "/models";
          CreateFile.GenerateDir(path);
          path += '/'+file;
          var message = model[file];
          CreateFile.GenerateFile(path,message);
        }
      }
      return model;
    }
    Controllers() {
      var controller = {};
      var breakLine = "\n";
      controller[`FileController.js`] = '';
      controller[`FileController.js`] += `import File from '../models/File';`+breakLine;
      controller[`FileController.js`] += ``+breakLine;
      controller[`FileController.js`] += `class FileController {`+breakLine;
      controller[`FileController.js`] += `  async store(req, res) {`+breakLine;
      controller[`FileController.js`] += `    const { originalname: name, filename: path } = req.file;`+breakLine;
      controller[`FileController.js`] += `    `+breakLine;
      controller[`FileController.js`] += `    const file = await File.create({`+breakLine;
      controller[`FileController.js`] += `      name,`+breakLine;
      controller[`FileController.js`] += `      path,`+breakLine;
      controller[`FileController.js`] += `    });`+breakLine;
      controller[`FileController.js`] += `    `+breakLine;
      controller[`FileController.js`] += `    return res.json(file);`+breakLine;
      controller[`FileController.js`] += `  }`+breakLine;
      controller[`FileController.js`] += `}`+breakLine;
      controller[`FileController.js`] += ``+breakLine;
      controller[`FileController.js`] += `export default new FileController();`+breakLine;
      const types = this.crud;
      for (let type in types) {
        const fields = types[type]['body'];
        var controllerName = this.crud[type]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[type]['details']['slugSingular'].slice(1);
        controller[`${controllerName}Controller.js`] = '';
        controller[`${controllerName}Controller.js`] += `import * as Yup from 'yup';`+breakLine;
        controller[`${controllerName}Controller.js`] += `import ${controllerName} from '../models/${controllerName}';`+breakLine;
        if(type!='user') {
          controller[`${controllerName}Controller.js`] += `import User from '../models/User';`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `import File from '../models/File';`+breakLine;
        var relation = types[type]['relation'];
        var relationName;
        if(relation!=false){
          relationName = this.crud[relation]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[relation]['details']['slugSingular'].slice(1);
          controller[`${controllerName}Controller.js`] += `import ${relationName} from '../models/${relationName}';`+breakLine;
        }
        //INCLUDES
        var includeHead = '      include: ['+breakLine;
        var includeFoot = '      ],'+breakLine;
        var includes = includeHead;
        if(relation!=false){
          var relationAttributes = ``;
          var relationIncludes = '    '+includeHead;
          for (let field in types[relation]['body']) {
            if(field!='password_hash'){
              if(!relationAttributes==``){
                relationAttributes += `,`;
              } else {
                relationAttributes += `'id',`;
                if(relation!='user') {
                  fieldAttributes += `'author',`;
                }
              }
              relationAttributes += `'${field}'`;
            }
            if(types[relation]['body'][field]['format']=='file'){
              relationIncludes += `            {`+breakLine;
              relationIncludes += `              model: File,`+breakLine;
              relationIncludes += `              as: '${field}_data',`+breakLine;
              relationIncludes += `              attributes: ['name', 'path', 'url'],`+breakLine;
              relationIncludes += `            },`+breakLine;
            }
          }
          relationIncludes += '    '+includeFoot;
          includes += `        {`+breakLine;
          includes += `          model: ${relationName},`+breakLine;
          includes += `          as: '${relation}_data',`+breakLine;
          includes += `          attributes: [${relationAttributes}],`+breakLine;
          includes += relationIncludes;
          includes += `        },`+breakLine;
        }
        if(type!='user') {
          var userAttributes = ``;
          var userIncludes = '    '+includeHead;
          for (let field in types['user']['body']) {
            if(field!='password_hash'){
              if(!userAttributes==``){
                userAttributes += `,`;
              } else {
                userAttributes += `'id',`;
              }
              userAttributes += `'${field}'`;
            }
            if(types['user']['body'][field]['format']=='file'){
              userIncludes += `            {`+breakLine;
              userIncludes += `              model: File,`+breakLine;
              userIncludes += `              as: '${field}_data',`+breakLine;
              userIncludes += `              attributes: ['name', 'path', 'url'],`+breakLine;
              userIncludes += `            },`+breakLine;
            }
          }
          userIncludes += '    '+includeFoot;
          includes += `        {`+breakLine;
          includes += `          model: User,`+breakLine;
          includes += `          as: 'author_data',`+breakLine;
          includes += `          attributes: [${userAttributes}],`+breakLine;
          includes += userIncludes;
          includes += `        },`+breakLine;
        }
        for (let field in fields) {
          if(fields[field]['format']=='file'){
            includes += `        {`+breakLine;
            includes += `          model: File,`+breakLine;
            includes += `          as: '${field}_data',`+breakLine;
            includes += `          attributes: ['name', 'path', 'url'],`+breakLine;
            includes += `        },`+breakLine;
          }
        }
        includes += includeFoot;
        //INCLUDES
        controller[`${controllerName}Controller.js`] += ``+breakLine;
        controller[`${controllerName}Controller.js`] += `class ${controllerName}Controller {`+breakLine;
        //INDEX
        controller[`${controllerName}Controller.js`] += `  async index(req,res){`+breakLine;
        controller[`${controllerName}Controller.js`] += `    var whereData = {};`+breakLine;
        if(relation!=false){
          controller[`${controllerName}Controller.js`] += `    if(req.params.parent){`+breakLine;
          controller[`${controllerName}Controller.js`] += `      whereData.${relation} = req.params.parent;`+breakLine;
          controller[`${controllerName}Controller.js`] += `    }`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `    const ${this.crud[type]['details']['slugPlural']} = await ${controllerName}.findAll({`+breakLine;
        var fieldAttributes = ``;
        for (let field in fields) {
          if(field!='password_hash'){
            if(!fieldAttributes==``){
              fieldAttributes += `,`;
            } else {
              fieldAttributes += `'id',`;
              if(relation!=false){
                fieldAttributes += `'${relation}',`;
              }
              if(type!='user') {
                fieldAttributes += `'author',`;
              }
            }
            fieldAttributes += `'${field}'`;
          }
        }
        controller[`${controllerName}Controller.js`] += `      where: whereData,`+breakLine;
        controller[`${controllerName}Controller.js`] += `      attributes: [${fieldAttributes}],`+breakLine;
        controller[`${controllerName}Controller.js`] += includes;
        controller[`${controllerName}Controller.js`] += `    });`+breakLine;
        controller[`${controllerName}Controller.js`] += `    `+breakLine;
        controller[`${controllerName}Controller.js`] += `    return res.json(${this.crud[type]['details']['slugPlural']});`+breakLine;
        controller[`${controllerName}Controller.js`] += `  }`+breakLine;
        //INDEX
        //STORE
        controller[`${controllerName}Controller.js`] += `  async store(req,res){`+breakLine;
        if(relation!=false){
          controller[`${controllerName}Controller.js`] += `   req.${relation}Id = req.params.parent;`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(!(req.${relation}Id)){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[relation]['details']['titleSingular']} not found.'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;

          controller[`${controllerName}Controller.js`] += `   const ${relation}IdExists = await ${relationName}.count({where:{id:req.${relation}Id}});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(${relation}IdExists==0){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[relation]['details']['titleSingular']} not found.'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;

          controller[`${controllerName}Controller.js`] += `   const ${relation} = await ${relationName}.findByPk(req.${relation}Id);`+breakLine;
          controller[`${controllerName}Controller.js`] += `   const user = await User.findByPk(req.userId);`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(${relation}.author!=user.id){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     if(user.role=='Administrador'||user.role=='Gerente'){}else{`+breakLine;
          controller[`${controllerName}Controller.js`] += `       return res.status(401).json({error:'User not allowed'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `     }`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;

          controller[`${controllerName}Controller.js`] += `   req.body.${relation} = ${relation}.id;`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `   const schema = Yup.object().shape({`+breakLine;
        for (let field in fields) {
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `     password: Yup.string()`;
          } else {
            controller[`${controllerName}Controller.js`] += `     ${field}: Yup.string()`;
          }
          if(field=='email'){
            controller[`${controllerName}Controller.js`] += `.email()`;
          }
          if(fields[field]['required']==true){
            controller[`${controllerName}Controller.js`] += `.required()`;
          }
          if(fields[field]['options']!=false){
            if(fields[field]['format']=='radio'||fields[field]['format']=='select'){
              var optionsAll = '';
              for (let option in fields[field]['options']) {
                if(!(optionsAll=='')){
                  optionsAll += `,`;
                }
                optionsAll += `'`+fields[field]['options'][option]+`'`;
              }
              controller[`${controllerName}Controller.js`] += `.oneOf([${optionsAll}])`;
            }
          }
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `.min(6)`;
          }
          controller[`${controllerName}Controller.js`] += `,`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `   });`+breakLine;
        controller[`${controllerName}Controller.js`] += `   if(!(await schema.isValid(req.body))){`+breakLine;
        controller[`${controllerName}Controller.js`] += `     return res.status(400).json({error:'Validation Fails'});`+breakLine;
        controller[`${controllerName}Controller.js`] += `   }`+breakLine;
        for (let field in fields) {
          if(fields[field]['unique']==true){
            controller[`${controllerName}Controller.js`] += `   const ${field}Exists = await ${controllerName}.findOne({ where: { ${field}: req.body.${field} } });`+breakLine;
            controller[`${controllerName}Controller.js`] += `   if(${field}Exists){`+breakLine;
            controller[`${controllerName}Controller.js`] += `     return res.status(400).send({ error: '${this.crud[type]['details']['titleSingular']} already exists.' });`+breakLine;
            controller[`${controllerName}Controller.js`] += `   }`+breakLine;
          }
        }
        var fieldAll = '';
        for (let field in fields) {
          if(field!='password_hash'){
            if(!fieldAll==''){
              fieldAll += ',';
            } else {
              fieldAll += 'id,';
            }
            fieldAll += field;
          }
        }
        if(type!='user'){
          controller[`${controllerName}Controller.js`] += `   req.body.author = req.userId;`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `   const {${fieldAll}} = await ${controllerName}.create(req.body);`+breakLine;
        controller[`${controllerName}Controller.js`] += `   return res.json({${fieldAll}});`+breakLine;
        controller[`${controllerName}Controller.js`] += ` }`+breakLine;
        //STORE
        //UPDATE
        controller[`${controllerName}Controller.js`] += `  async update(req,res){`+breakLine;
        if(relation!=false){
          controller[`${controllerName}Controller.js`] += `   req.${relation}Id = req.params.parent;`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(!(req.${relation}Id)){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[relation]['details']['titleSingular']} not found.'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;

          controller[`${controllerName}Controller.js`] += `   const ${relation}IdExists = await ${relationName}.count({where:{id:req.${relation}Id}});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(${relation}IdExists==0){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[relation]['details']['titleSingular']} not found.'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;

          controller[`${controllerName}Controller.js`] += `   const ${relation} = await ${relationName}.findByPk(req.${relation}Id);`+breakLine;
          controller[`${controllerName}Controller.js`] += `   const user = await User.findByPk(req.userId);`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(${relation}.author!=user.id){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     if(user.role=='Administrador'||user.role=='Gerente'){}else{`+breakLine;
          controller[`${controllerName}Controller.js`] += `       return res.status(401).json({error:'User not allowed'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `     }`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `   const schema = Yup.object().shape({`+breakLine;
        for (let field in fields) {
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `     oldPassword: Yup.string().min(6),`+breakLine;
            controller[`${controllerName}Controller.js`] += `     password: Yup.string()`;
          } else {
            controller[`${controllerName}Controller.js`] += `     ${field}: Yup.string()`;
          }
          if(field=='email'){
            controller[`${controllerName}Controller.js`] += `.email()`;
          }
          if(fields[field]['options']!=false){
            var optionsAll = '';
            for (let option in fields[field]['options']) {
              if(!(optionsAll=='')){
                optionsAll += `,`;
              }
              optionsAll += `'`+fields[field]['options'][option]+`'`;
            }
            controller[`${controllerName}Controller.js`] += `.oneOf([${optionsAll}])`;
          }
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `.min(6)`;
          }
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `.when('oldPassword',(oldPassword,field)=>oldPassword?field.required():field)`;
          }
          controller[`${controllerName}Controller.js`] += `,`+breakLine;
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `     confirmPassword: Yup.string().when('password',(password,field)=>password?field.required().oneOf([Yup.ref('password')]):field),`+breakLine;
          }
        }
        controller[`${controllerName}Controller.js`] += `   });`+breakLine;
        controller[`${controllerName}Controller.js`] += `   if(!(await schema.isValid(req.body))){`+breakLine;
        controller[`${controllerName}Controller.js`] += `     return res.status(400).json({error:'Validation Fails'});`+breakLine;
        controller[`${controllerName}Controller.js`] += `   }`+breakLine;
        var uniqueAll = '';
        for (let field in fields) {
          if(fields[field]['unique']==true){
            if(!uniqueAll==''){
              uniqueAll += ',';
            }
            uniqueAll += field;
          }
          if(field=='password_hash'){
            if(!uniqueAll==''){
              uniqueAll += ',';
            }
            uniqueAll += 'oldPassword';
          }
        }
        if(type!='user') {
          controller[`${controllerName}Controller.js`] += `   req.${this.crud[type]['details']['slugSingular']}Id = req.params.id;`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(!(req.${this.crud[type]['details']['slugSingular']}Id)){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[type]['details']['titleSingular']} not found.'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;
          controller[`${controllerName}Controller.js`] += `   const ${this.crud[type]['details']['slugSingular']}IdExists = await ${controllerName}.count({where:{id:req.${this.crud[type]['details']['slugSingular']}Id}});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   if(${this.crud[type]['details']['slugSingular']}IdExists==0){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[type]['details']['titleSingular']} not found.'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `   const ${this.crud[type]['details']['slugSingular']} = await ${controllerName}.findByPk(req.${this.crud[type]['details']['slugSingular']}Id);`+breakLine;
        if(relation!=false){
          controller[`${controllerName}Controller.js`] += `   if(${relation}.id!=${this.crud[type]['details']['slugSingular']}.${relation}){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     return res.status(401).json({error:'${this.crud[relation]['details']['titleSingular']} does not match'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;
        }
        if(type!='user') {
          if(relation==false){
            controller[`${controllerName}Controller.js`] += `   const user = await User.findByPk(req.userId);`+breakLine;
          }
          controller[`${controllerName}Controller.js`] += `   if(user.id!=${this.crud[type]['details']['slugSingular']}.author){`+breakLine;
          controller[`${controllerName}Controller.js`] += `     if(user.role=='Administrador'||user.role=='Gerente'){}else{`+breakLine;
          controller[`${controllerName}Controller.js`] += `       return res.status(401).json({error:'User not allowed'});`+breakLine;
          controller[`${controllerName}Controller.js`] += `     }`+breakLine;
          controller[`${controllerName}Controller.js`] += `   }`+breakLine;
        }
        controller[`${controllerName}Controller.js`] += `   const {${uniqueAll}} = req.body;`+breakLine;
        for (let field in fields) {
          if(fields[field]['unique']==true){
            controller[`${controllerName}Controller.js`] += `   if(${field}!==${this.crud[type]['details']['slugSingular']}.${field}){`+breakLine;
            controller[`${controllerName}Controller.js`] += `     const ${field}Exists = await ${controllerName}.findOne({ where: { ${field} } });`+breakLine;
            controller[`${controllerName}Controller.js`] += `     if(${field}Exists){`+breakLine;
            controller[`${controllerName}Controller.js`] += `       return res.status(400).send({ error: '${this.crud[type]['details']['titleSingular']} already exists.' });`+breakLine;
            controller[`${controllerName}Controller.js`] += `     }`+breakLine;
            controller[`${controllerName}Controller.js`] += `   }`+breakLine;
          }
          if(field=='password_hash'){
            controller[`${controllerName}Controller.js`] += `   if(oldPassword && !(await ${this.crud[type]['details']['slugSingular']}.checkPassword(oldPassword))){`+breakLine;
            controller[`${controllerName}Controller.js`] += `     return res.status(401).send({ error: 'Password does not match' });`+breakLine;
            controller[`${controllerName}Controller.js`] += `   }`+breakLine;
          }
        }
        var fieldAllNoUnique = '';
        for (let field in fields) {
          if(field!='password_hash'&&fields[field]['unique']!=true){
            if(!fieldAllNoUnique==''){
              fieldAllNoUnique += ',';
            } else {
              fieldAllNoUnique += 'id,';
            }
            fieldAllNoUnique += field;
          }
        }
        controller[`${controllerName}Controller.js`] += `   const {${fieldAllNoUnique}} = await ${this.crud[type]['details']['slugSingular']}.update(req.body);`+breakLine;
        controller[`${controllerName}Controller.js`] += `   return res.json({${fieldAll}});`+breakLine;
        controller[`${controllerName}Controller.js`] += ` }`+breakLine;
        //UPDATE
        controller[`${controllerName}Controller.js`] += `}`+breakLine;
        controller[`${controllerName}Controller.js`] += ``+breakLine;
        controller[`${controllerName}Controller.js`] += `export default new ${controllerName}Controller;`+breakLine;
      }
      if(types['user']){
        controller[`SessionController.js`] = `import jwt from 'jsonwebtoken';`+breakLine;
        controller[`SessionController.js`] += `import * as Yup from 'yup';`+breakLine;
        controller[`SessionController.js`] += `import User from '../models/User';`+breakLine;
        controller[`SessionController.js`] += `import authConfig from '../../config/auth';`+breakLine;
        controller[`SessionController.js`] += ``+breakLine;
        controller[`SessionController.js`] += `class SessionController {`+breakLine;
        controller[`SessionController.js`] += `  async store(req,res){`+breakLine;
        controller[`SessionController.js`] += `    const schema = Yup.object().shape({`+breakLine;
        controller[`SessionController.js`] += `      email: Yup.string().email().required(),`+breakLine;
        controller[`SessionController.js`] += `      password: Yup.string().required(),`+breakLine;
        controller[`SessionController.js`] += `    });`+breakLine;
        controller[`SessionController.js`] += `    if(!(await schema.isValid(req.body))){`+breakLine;
        controller[`SessionController.js`] += `      return res.status(400).json({error:'Validation Fails'});`+breakLine;
        controller[`SessionController.js`] += `    }`+breakLine;
        controller[`SessionController.js`] += `    const {email,password} = req.body;`+breakLine;
        controller[`SessionController.js`] += `    const user = await User.findOne({where:{email}});`+breakLine;
        controller[`SessionController.js`] += `    if(!user){`+breakLine;
        controller[`SessionController.js`] += `      return res.status(401).json({error:'User not found'});`+breakLine;
        controller[`SessionController.js`] += `    }`+breakLine;
        controller[`SessionController.js`] += `    if(!(await user.checkPassword(password))){`+breakLine;
        controller[`SessionController.js`] += `      return res.status(401).json({error:'Password does not match'});`+breakLine;
        controller[`SessionController.js`] += `    }`+breakLine;
        controller[`SessionController.js`] += `    const {id,name} = user;`+breakLine;
        controller[`SessionController.js`] += `    return res.json({`+breakLine;
        controller[`SessionController.js`] += `      user: {`+breakLine;
        controller[`SessionController.js`] += `        id,`+breakLine;
        controller[`SessionController.js`] += `        name,`+breakLine;
        controller[`SessionController.js`] += `        email,`+breakLine;
        controller[`SessionController.js`] += `      },`+breakLine;
        controller[`SessionController.js`] += `      token: jwt.sign({id},authConfig.secret,{`+breakLine;
        controller[`SessionController.js`] += `        expiresIn: authConfig.expiresIn,`+breakLine;
        controller[`SessionController.js`] += `      }),`+breakLine;
        controller[`SessionController.js`] += `    });`+breakLine;
        controller[`SessionController.js`] += `  }`+breakLine;
        controller[`SessionController.js`] += `}`+breakLine;
        controller[`SessionController.js`] += ``+breakLine;
        controller[`SessionController.js`] += `export default new SessionController();`+breakLine;

        controller[`auth.js`] = `import jwt from 'jsonwebtoken';`+breakLine;
        controller[`auth.js`] += `import {promisify} from 'util';`+breakLine;
        controller[`auth.js`] += `import authConfig from '../../config/auth';`+breakLine;
        controller[`auth.js`] += ``+breakLine;
        controller[`auth.js`] += `export default async (req,res,next)=>{`+breakLine;
        controller[`auth.js`] += `  const authHeader = req.headers.authorization;`+breakLine;
        controller[`auth.js`] += `  if(!authHeader){`+breakLine;
        controller[`auth.js`] += `    return res.status(401).json({error: 'Token not provided'});`+breakLine;
        controller[`auth.js`] += `  }`+breakLine;
        controller[`auth.js`] += `  const [, token] = authHeader.split(' ');`+breakLine;
        controller[`auth.js`] += `  try {`+breakLine;
        controller[`auth.js`] += `    const decoded = await promisify(jwt.verify)(token,authConfig.secret);`+breakLine;
        controller[`auth.js`] += `    req.userId = decoded.id;`+breakLine;
        controller[`auth.js`] += `    return next();`+breakLine;
        controller[`auth.js`] += `  } catch(err) {`+breakLine;
        controller[`auth.js`] += `    return res.status(401).json({error: 'Token invalid'});`+breakLine;
        controller[`auth.js`] += `  }`+breakLine;
        controller[`auth.js`] += `};`+breakLine;
      }
      for (let file in controller) {
        if(file=='auth.js'){
          var path = "./src";
          CreateFile.GenerateDir(path);
          path += "/app";
          CreateFile.GenerateDir(path);
          path += "/middlewares";
          CreateFile.GenerateDir(path);
          path += '/'+file;
          var message = controller[file];
          CreateFile.GenerateFile(path,message);
        } else {
          var path = "./src";
          CreateFile.GenerateDir(path);
          path += "/app";
          CreateFile.GenerateDir(path);
          path += "/controllers";
          CreateFile.GenerateDir(path);
          path += '/'+file;
          var message = controller[file];
          CreateFile.GenerateFile(path,message);
        }
      }
      return controller;
    }
  //READ
    List() {
      return this.crud;
    }
    //Details
      slugSingular(type=this.type) {
        return this.crud[type]['details']['slugSingular'];
      }
      slugPlural(type=this.type) {
        return this.crud[type]['details']['slugPlural'];
      }
      titleSingular(type=this.type) {
        return this.crud[type]['details']['titleSingular'];
      }
      titlePlural(type=this.type) {
        return this.crud[type]['details']['titlePlural'];
      }
      Gender(type=this.type) {
        return this.crud[type]['details']['gender'];
      }
    //Relation
      viewRelation(type=this.type) {
        return this.crud[type]['relation'];
      }
    //Field
      Body(type=this.type) {
        return this.crud[type]['body'];
      }
      viewField(name='title',type=this.type) {
        return this.crud[type]['body'][name];
      }
      FieldFormat(name='title',type=this.type) {
        return this.crud[type]['body'][name]['format'];
      }
      FieldRequired(name='title',type=this.type) {
        return this.crud[type]['body'][name]['required'];
      }
      FieldLabel(name='title',type=this.type) {
        return this.crud[type]['body'][name]['label'];
      }
      FieldPlaceholder(name='title',type=this.type) {
        return this.crud[type]['body'][name]['placeholder'];
      }
      FieldOptions(name='title',type=this.type) {
        return this.crud[type]['body'][name]['options'];
      }
}

export default new CRUD();