function Test(){

    Test.super_.apply(this, arguments);
    var app = this.app(arguments.callee.name);

    function request(){
        app.appResponse = this.response;
        app.setType('web');
        app.layout('general');


        app.view('request');
    }

    function uploadFile(){
        app.setType('ajax');

        var req = this.request;
        var response = this.response;

        app.ajax(response, {'x':1});

    }

    return {
        request: request,
        uploadFile: uploadFile
    }

}

util.inherits(Test, WebApplication);

exports.test = new Test();