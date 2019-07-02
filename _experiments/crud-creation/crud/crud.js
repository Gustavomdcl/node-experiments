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
      this.Field();
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
    viewList() {
      return this.crud;
    }
    //Details
      viewslugSingular(type=this.type) {
        return this.crud[type]['details']['slugSingular'];
      }
      viewslugPlural(type=this.type) {
        return this.crud[type]['details']['slugPlural'];
      }
      viewtitleSingular(type=this.type) {
        return this.crud[type]['details']['titleSingular'];
      }
      viewtitlePlural(type=this.type) {
        return this.crud[type]['details']['titlePlural'];
      }
      viewGender(type=this.type) {
        return this.crud[type]['details']['gender'];
      }
    //Relation
      viewRelation(type=this.type) {
        return this.crud[type]['relation'];
      }
    //Field
      viewBody(type=this.type) {
        return this.crud[type]['body'];
      }
      viewField(name='title',type=this.type) {
        return this.crud[type]['body'][name];
      }
      viewFieldFormat(name='title',type=this.type) {
        return this.crud[type]['body'][name]['format'];
      }
      viewFieldRequired(name='title',type=this.type) {
        return this.crud[type]['body'][name]['required'];
      }
      viewFieldLabel(name='title',type=this.type) {
        return this.crud[type]['body'][name]['label'];
      }
      viewFieldPlaceholder(name='title',type=this.type) {
        return this.crud[type]['body'][name]['placeholder'];
      }
      viewFieldOptions(name='title',type=this.type) {
        return this.crud[type]['body'][name]['options'];
      }
}

export default new CRUD();
