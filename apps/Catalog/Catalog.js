function Catalog(){

    Catalog.super_.apply(this);
    var app = this.app(arguments.callee.name);

    function request(){
        app.appResponse = this.response;
        app.setType('web');
        app.layout('general');
        app.useWidget('Header', {});
        app.useWidget('Footer', {});

        app.view('request');
    }

    function resource(id){
        app.appResponse = this.response;
        app.setType('web');
        app.layout('general');
        app.useWidget('Header', {});
        app.useWidget('Footer', {});
        console.log(id);

        app.view('resource');
    }

    return {
        request : request,
        resource : resource
    }

}

util.inherits(Catalog, WebApplication);

exports.catalog = new Catalog();