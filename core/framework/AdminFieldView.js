function AdminFieldView(){

    this.template = require('./Template');
    this.html = '';
    this.tamplateViewDir = __basedir + 'core/fieldview/';

}

AdminFieldView.prototype.makeFieldView = function(fields){

    var types = {
        'integer': this.integerView.bind(this),
        'boolean': this.booleanView.bind(this),
        'character varying': this.varcharView.bind(this),
        'real': this.realView.bind(this),
        'text': this.textView.bind(this),
        'timestamp without time zone': this.timestampView.bind(this)
    };

    for(var i in fields){
        if(fields.hasOwnProperty(i)){
            var fieldParams = fields[i];
            this.html += types[fieldParams.type](i, fieldParams);
        }
    }

    return this.html;
};

AdminFieldView.prototype.makeHasManyView = function(hasmany){

    console.log(hasmany);

    var html = fs.readFileSync(this.tamplateViewDir + '/hasmany/photo.html', 'utf8');
    var variables = {'name':1};

    var Template = new this.template.Template();
    return Template.makeTemlpate(html, {'variables': variables});

};

AdminFieldView.prototype.makeBelongsToView = function(belongsto){

    return 1;
};

AdminFieldView.prototype.integerView = function(name, params){

    var paramsEnv = CONFIG.ENV == 'development' ? JSON.stringify(params) : '';

    var html = fs.readFileSync(this.tamplateViewDir + 'integer.html', 'utf8');
    var variables = {'name': name, 'fieldName': params.name, 'params': paramsEnv};

    var Template = new this.template.Template();
    return Template.makeTemlpate(html, {'variables': variables});

};

AdminFieldView.prototype.varcharView = function(name, params){
    var paramsEnv = CONFIG.ENV == 'development' ? JSON.stringify(params) : '';

    var html = fs.readFileSync(this.tamplateViewDir + 'varchar.html', 'utf8');
    var variables = {'name': name, 'fieldName': params.name, 'params': paramsEnv};

    var Template = new this.template.Template();
    return Template.makeTemlpate(html, {'variables': variables});

};

AdminFieldView.prototype.booleanView = function(name, params){ // TODO boolean
    return '';
};

AdminFieldView.prototype.textView = function(name, params){
    var paramsEnv = CONFIG.ENV == 'development' ? JSON.stringify(params) : '';

    var html = fs.readFileSync(this.tamplateViewDir + 'text.html', 'utf8');
    var variables = {'name': name, 'fieldName': params.name, 'params': paramsEnv};

    var Template = new this.template.Template();
    return Template.makeTemlpate(html, {'variables': variables});
};

AdminFieldView.prototype.realView = function(name, params){ //
    return '';
};

AdminFieldView.prototype.timestampView = function(name, params){
    return '';
};

exports.AdminFieldView = AdminFieldView;