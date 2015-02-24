function Widget(){

    var template = require('./Template');

    this.widgetName = '';
    this.widgetParams = '';

    this.register = function(name, params, callback){

        this.widgetName = name;
        this.widgetParams = params;

        var dirPath = this.widgetName[0] == '_' ? __basedir + 'core/widget/' : __basedir + 'widget/';
        dirPath += this.widgetName;

        try{
            var dir = fs.readdirSync(dirPath);
            if(dir.length){
                var handler = require(dirPath + '/' + this.widgetName);
                handler[this.widgetName](this.widgetParams, function(obj){

                    var path = dirPath + '/view.html';
                    var html = fs.readFileSync(path, 'utf8');

                    var Template = new template.Template();
                    html = Template.makeTemlpate(html, obj);
                    callback(html);

                }.bind(this));
            } else {
                Log.info('error', 'Widget error no files in dir');
            }

        }catch (e){
            Log.info('error', e);
        }

    };

}

exports.Widget = Widget;