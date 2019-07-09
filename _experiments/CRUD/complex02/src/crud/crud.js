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
    Controllers() {
      var controller = {};
      var breakLine = "\n";
      const types = this.crud;
      for (let type in types) {
        var controllerName = this.crud[type]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[type]['details']['slugSingular'].slice(1);
        controller[`${controllerName}Controller.js`] = '';
        controller[`${controllerName}Controller.js`] += `import * as Yup from 'yup';`+breakLine;
        controller[`${controllerName}Controller.js`] += `import ${controllerName} from '../models/${controllerName}';`+breakLine;
        controller[`${controllerName}Controller.js`] += ``+breakLine;
        controller[`${controllerName}Controller.js`] += `class ${controllerName}Controller {`+breakLine;
        //STORE
        controller[`${controllerName}Controller.js`] += ` async store(req,res){`+breakLine;
        controller[`${controllerName}Controller.js`] += `   const schema = Yup.object().shape({`+breakLine;
        const fields = types[type]['body'];
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
        controller[`${controllerName}Controller.js`] += `   const {${fieldAll}} = await ${controllerName}.create(req.body);`+breakLine;
        controller[`${controllerName}Controller.js`] += `   return res.json({${fieldAll}});`+breakLine;
        controller[`${controllerName}Controller.js`] += ` }`+breakLine;
        //STORE
        //UPDATE
        controller[`${controllerName}Controller.js`] += ` async update(req,res){`+breakLine;
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
        controller[`${controllerName}Controller.js`] += `   const {${uniqueAll}} = req.body;`+breakLine;
        controller[`${controllerName}Controller.js`] += `   const ${this.crud[type]['details']['slugSingular']} = await ${controllerName}.findByPk(req.${this.crud[type]['details']['slugSingular']}Id);`+breakLine;
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
        controller[`${controllerName}Controller.js`] += `   const {${fieldAll}} = await ${this.crud[type]['details']['slugSingular']}.update(req.body);`+breakLine;
        controller[`${controllerName}Controller.js`] += `   return res.json({${fieldAll}});`+breakLine;
        controller[`${controllerName}Controller.js`] += ` }`+breakLine;
        //UPDATE
        controller[`${controllerName}Controller.js`] += `}`+breakLine;
        controller[`${controllerName}Controller.js`] += ``+breakLine;
        controller[`${controllerName}Controller.js`] += `export default new ${controllerName}Controller;`+breakLine;
      }
      for (let file in controller) {
        var path = "./src/app";
        CreateFile.GenerateDir(path);
        path += "/controllers";
        CreateFile.GenerateDir(path);
        path += '/'+file;
        var message = controller[file];
        CreateFile.GenerateFile(path,message);
      }
      return controller;
    }
  //READ
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