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
      var migration = '<pre>';
      const types = this.crud;
      for (let type in types) {
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
          if((field=='email'&&type=='user')||(field=='username'&&type=='user')){
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
        migration += '};<br><br><br>';
      }
      migration += '</pre>';
      return migration;
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