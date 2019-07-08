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
    Field(field='title',format='text',required=false,label='Title',placeholder='Type your title',options=false,type=this.type) {
      if(!this.crud[type]['body']){
        this.crud[type]['body']={};
      }
      this.crud[type]['body'][field] = {
        format,
        required,
        label,
        placeholder,
        options
      };
      return this;
    }
  //READ
    List() {
      return this.crud;
    }
    Migration() {
      var migration = {};
      var breakLine = "\n";
      var migrationCount = 9;
      var migrationName = '';
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
          migration[migrationName] += '        allowNull: false,'+breakLine;
          migration[migrationName] += '      },'+breakLine;
        }

        if(types[type]['relation']!=false){
          migration[migrationName] += `      ${types[type]['relation']}: {`+breakLine;
          migration[migrationName] += '        type: Sequelize.INTEGER,'+breakLine;//Linka com o elemento pai
          migration[migrationName] += '        allowNull: false,'+breakLine;
          migration[migrationName] += '      },'+breakLine;
        }

        const fields = types[type]['body'];
        for (let field in fields) {
          //migration[field] = fields[field];
          migration[migrationName] += `      ${field}: {`+breakLine;
          if(fields[field]['format']=='different'){} else {
            migration[migrationName] += '        type: Sequelize.STRING,'+breakLine;
          }
          if(fields[field]['required']==true){
            migration[migrationName] += '        allowNull: false,'+breakLine;
          } else {
            migration[migrationName] += '        allowNull: true,'+breakLine;
          }
          if((field=='password_hash')){
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
        var path = "./src/database";
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
      var models = '[';
      var imports = '';
      var model_count = 0;
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
          if(type!='user'){//usuários não recebem author
            model[`${modelName}.js`] += '        author: Sequelize.INTEGER,'+breakLine;
          }
          if(types[type]['relation']!=false){
            model[`${modelName}.js`] += `        ${types[type]['relation']}: Sequelize.INTEGER,`+breakLine;
          }
          if(field=='password_hash'&&type=='user'){
            model[`${modelName}.js`] += '        password: Sequelize.VIRTUAL,'+breakLine;
          }
          if(fields[field]['format']=='different'){} else {
            model[`${modelName}.js`] += `        ${field}: Sequelize.STRING,`+breakLine;
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
      model['index.js'] += imports;
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
      model['index.js'] += '    models.map(model => model.init(this.connection));'+breakLine;
      model['index.js'] += '  }'+breakLine;
      model['index.js'] += '}'+breakLine;
      model['index.js'] += ''+breakLine;
      model['index.js'] += 'export default new Database();'+breakLine;
      for (let file in model) {
        if(file=='index.js'){
          var path = "./src/database";
          CreateFile.GenerateDir(path);
          path += '/'+file;
          message = model[file];
          CreateFile.GenerateFile(path,message);
        } else {
          var path = "./src/app";
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