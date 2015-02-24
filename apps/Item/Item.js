function Item(){

    Item.super_.apply(this);
    var app = this.app(arguments.callee.name);

    function request(){
        app.layout('general');

        app.exportToView({'x': 1});
        app.exportToView({'y': 'Вот это да!'});

        app.useWidget('News', {'n1': 1, 'n2': 2});
        app.useWidget('Hot', {'x1': 'hot'});

        app.view('request');
        app.web(this.response);
    }

    function loadCatalog(){
        var post = util.lib.convertToObject(this.postData);
        var ret = {};

        ret['post'] = post['data'];
        ret['status'] = "OK";
        ret['message'] = "Добро пожаловать!";

        app.ajax(this.response, ret);
    }

    function buy(){

        var response = this.response;

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("buy");
        response.end();

    }

    function order(x){

        app.layout('general');

        app.exportToView({'x': x});

        app.view('order');

        app.web(this.response);
    }

    return {
        request : request,
        loadCatalog : loadCatalog,
        order : order,
        buy : buy
    }

}

util.inherits(Item, WebApplication);

exports.item = new Item();