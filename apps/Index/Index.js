function Index(){

    Index.super_.apply(this);
    var app = this.app(arguments.callee.name);

    function request(){
        app.appResponse = this.response;
        app.setType('web');
        app.layout('general');
        app.useWidget('Header', {});
        app.useWidget('Footer', {});

        app.view('request');
    }


    return {
        request : request
    }

}

util.inherits(Index, WebApplication);

exports.index = new Index();