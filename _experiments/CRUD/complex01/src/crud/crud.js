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
      var migration = '<pre style="background-color:#666;margin:-15px -8px;">';
      const types = this.crud;
      for (let type in types) {
        migration += `<p style="background-color:#000;color:#fff;">yarn sequelize migration:create --name=create-${this.crud[type]['details']['slugPlural']}</p>`;
        migration += 'module.exports = {<br>';
        migration += '  up: (queryInterface, Sequelize) => {<br>';
        migration += `    return queryInterface.createTable('${this.crud[type]['details']['slugPlural']}', {<br>`;

        migration += '      id: {<br>';
        migration += '        type: Sequelize.INTEGER,<br>';
        migration += '        allowNull: false,<br>';
        migration += '        autoIncrement: true,<br>';
        migration += '        primaryKey: true,<br>';
        migration += '      },<br>';

        if(type!='user'){//usuários não recebem author
          migration += '      author: {<br>';
          migration += '        type: Sequelize.INTEGER,<br>';//Linka com o id do author
          migration += '        allowNull: false,<br>';
          migration += '      },<br>';
        }

        if(types[type]['relation']!=false){
          migration += `      ${types[type]['relation']}: {<br>`;
          migration += '        type: Sequelize.INTEGER,<br>';//Linka com o elemento pai
          migration += '        allowNull: false,<br>';
          migration += '      },<br>';
        }

        const fields = types[type]['body'];
        for (let field in fields) {
          //migration[field] = fields[field];
          migration += `      ${field}: {<br>`;
          if(fields[field]['format']=='different'){} else {
            migration += '        type: Sequelize.STRING,<br>';
          }
          if(fields[field]['required']==true){
            migration += '        allowNull: false,<br>';
          } else {
            migration += '        allowNull: true,<br>';
          }
          if((field=='password_hash')){
            migration += '        unique: true,<br>';
          }
          migration += '      },<br>';
        }

        migration += '      created_at: {<br>';
        migration += '        type: Sequelize.DATE,<br>';
        migration += '        allowNull: false,<br>';
        migration += '      },<br>';
        migration += '      updated_at: {<br>';
        migration += '        type: Sequelize.DATE,<br>';
        migration += '        allowNull: false,<br>';
        migration += '      },<br>';

        migration += '    });<br>';
        migration += '  },<br>';
        migration += '  down: (queryInterface, Sequelize) => {<br>';
        migration += `    return queryInterface.dropTable('${this.crud[type]['details']['slugPlural']}');<br>`;
        migration += '  }<br>';
        migration += '};<br><br>';
      }
      migration += '<p style="background-color:#000;color:red;">yarn sequelize db:migrate</p>';
      migration += '</pre>';
      return migration;
    }
    Models() {
      var model = '<pre style="background-color:#666;margin:-15px -8px;">';
      const types = this.crud;
      var models = '[';
      var imports = '';
      var model_count = 0;
      for (let type in types) {
        var modelName = this.crud[type]['details']['slugSingular'].charAt(0).toUpperCase() + this.crud[type]['details']['slugSingular'].slice(1);
        imports += `import User from '../app/models/${modelName}';<br>`;
        if(model_count!=0){
          models += ',';
        }
        model_count++;
        models += modelName;
        model += `<p style="background-color:#000;color:#fff;">${modelName}.js</p>`;
        model += `import Sequelize, { Model } from 'sequelize';<br>`;
        if(type=='user'){//Para senhas de usuários
          model += `import bcrypt from 'bcryptjs';<br>`;
        }
        model += '<br>';

        model += `class ${modelName} extends Model {<br>`;
        model += '  static init(sequelize){<br>';
        model += '    super.init(<br>';
        model += '      {<br>';
        const fields = types[type]['body'];
        for (let field in fields) {
          if(type!='user'){//usuários não recebem author
            model += '        author: Sequelize.INTEGER,<br>';
          }
          if(types[type]['relation']!=false){
            model += `        ${types[type]['relation']}: Sequelize.INTEGER,<br>`;
          }
          if(field=='password_hash'&&type=='user'){
            model += '        password: Sequelize.STRING,<br>';
          }
          if(fields[field]['format']=='different'){} else {
            model += `        ${field}: Sequelize.STRING,<br>`;
          }
        }
        model += '      },<br>';
        model += '      {<br>';
        model += '        sequelize,<br>';
        model += '      }<br>';
        model += '    );<br>';
        if(type=='user'){
          model += `    this.addHook('beforeSave', async user => {<br>`;
          model += '      if (user.password) {<br>';
          model += '        user.password_hash = await bcrypt.hash(user.password, 8);<br>';
          model += '      }<br>';
          model += '    });<br>';
        }
        model += '  }<br>';
        if(type=='user'){
          model += '  checkPassword(password) {<br>';
          model += '    return bcrypt.compare(password, this.password_hash);<br>';
          model += '  }<br>';
        }
        model += '}<br>';
        model += '<br>';

        model += `export default ${modelName};<br><br>`;
      }
      models += ']';
      model += '<p style="background-color:#000;color:red;">database/index.js</p>';
      model += `import Sequelize from 'sequelize';<br>`;
      model += imports;
      model += `import databaseConfig from '../config/database';<br>`;
      model += '<br>';
      model += `const models = ${models};<br>`;
      model += '<br>';
      model += 'class Database {<br>';
      model += '  constructor(){<br>';
      model += '    this.init();<br>';
      model += '  }<br>';
      model += '  init(){<br>';
      model += '    this.connection = new Sequelize(databaseConfig);<br>';
      model += '    models.map(model => model.init(this.connection));<br>';
      model += '  }<br>';
      model += '}<br>';
      model += '<br>';
      model += 'export default new Database();<br><br><br>';
      model += '</pre>';
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