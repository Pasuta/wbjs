function WebApplication(){

    var template = require('./Template');
    var widget = require('./Widget');

    this.appResponse = false;
    this.appType = false;
    this.appName = false;
    this.appView = false;
    this.appLayout = false;
    this.appWindow = false;
    this.viewName = [];
    this.appVariables = {};
    this.appWidgets = {};
    this.registredWidgets = [];
    this.exportToViewParams = {};

    this.setType = function(type){
        this.appType = type;
    };

    this.giveResponse = function(){

        if(this.appType == 'web'){
            this.web();
        } else if (this.appType == 'ajax'){

        } else {
            console.log('wrong type');
        }

    };

    this.web = function(){
        this.appResponse.writeHead(200, {"Content-Type": "text/html"});
        this.appResponse.end(this.appWindow.document.documentElement.outerHTML);
    };

    this.ajax = function(response, ret){
        ret = util.lib.convertToString(ret);

        var headers = {"Content-Type": "text/html", 'Content-Length': ret.length};
        response.writeHead(200, headers);
        response.write(ret);
        response.end();
    };

    this.view = function(viewName){

        promise.all(this.registredWidgets).then(function(){
            try {
                var appView = fs.readFileSync(__basedir + 'apps/' + this.appName + '/view/' + viewName + '.html', 'utf8');
                var documentView = jsdom(appView);

                this.exportToViewParams['variables'] = this.appVariables;
                this.exportToViewParams['widgets'] = this.appWidgets;

                var Template = new template.Template();
                this.appWindow.document.getElementById('view').innerHTML = Template.makeTemlpate(documentView.documentElement.outerHTML, this.exportToViewParams);

                this.giveResponse();
            } catch (e) {
                console.log(e);
            }
        }.bind(this));

    };

    this.layout = function(layoutName){
        var html = '';
        try {
            html = fs.readFileSync(__basedir + '/view/' + layoutName + '.html', 'utf8');
            var document = jsdom(html);
            this.appWindow = document.parentWindow;
        } catch (e) {
            console.log(e);
        }
    };

    this.useWidget = function(name, params){

        this.registredWidgets.push(regWidget(name, params, this));

        function regWidget(name, params, that){

            return new promise(function(resolve){
                var w = new widget.Widget();
                w.register(name, params, response);

                function response(html){
                    var obj = {};
                    obj[name] = html;
                    that.appWidgets = util['lib'].jsonMergeRecursive(obj, that.appWidgets);
                    resolve(name);
                }
            })

        }

    };

    this.error = function(){ // TODO error headers

    };

    this.exportToView = function(params){
        this.appVariables = util['lib'].jsonMergeRecursive(params, this.appVariables);
    };

    this.app = function(appName){

        this.appName = appName;

        return {
            'appResponse': this.appResponse,
            'setType': this.setType,
            'giveResponse': this.giveResponse,
            'appType': this.appType,
            'web': this.web,
            'ajax': this.ajax,
            'view': this.view,
            'layout': this.layout,
            'registredWidgets': this.registredWidgets,
            'exportToView': this.exportToView,
            'viewName': this.viewName,
            'useWidget': this.useWidget,
            'appName': this.appName,
            'appView': this.appView,
            'appLayout': this.appLayout,
            'appWindow': this.appWindow,
            'exportToViewParams': this.exportToViewParams
        };

    };
}

exports.WebApplication = WebApplication;