function Admin(){

    Admin.super_.apply(this, arguments);
    var app = this.app(arguments.callee.name);

    function login(){
        app.layout('login');

        app.view('login');
        app.web(this.response);
    }

    function request(){
        app.appResponse = this.response;
        app.setType('web');
        app.layout('admin');

        app.view('request');
        //var m = new Message();
        //m.action = 'update';
        //m.table = 'product';
        //m.where = {'id': 100};
        //m.set = {'price': 2000, 'text': 'text123'};
        //m.deliver(function(){
        //
        //    app.useWidget('_adminHeader', {});
        //    app.useWidget('_adminAside', {});
        //    app.useWidget('_adminFooter', {});
        //    app.useWidget('_adminContentHeader', {'pagename': "Главная"});
        //
        //    app.view('request');
        //});

    }

    function struct(tablename){
        app.appResponse = this.response;
        app.setType('web');
        app.layout('admin');

        app.useWidget('_adminHeader', {});
        app.useWidget('_adminAside', {});
        app.useWidget('_adminFooter', {});
        app.useWidget('_adminContentHeader', {'pagename': tablename});
        app.useWidget('_adminDBTable', {'tablename': tablename});

        app.view('struct');
    }

    function recordload(tablename){

        var query = querystring.parse(url.parse(this.request.url).query);

        app.appResponse = this.response;
        app.setType('web');
        app.layout('admin');

        var m = new Message();
        m.action = 'load';
        m.table = tablename;
        m.id = query.id;
        m.deliver(response);

        function response(e){

            console.log(e);

            app.useWidget('_adminHeader', {});
            app.useWidget('_adminAside', {});
            app.useWidget('_adminFooter', {});
            app.useWidget('_adminContentHeader', {'pagename': tablename});
            app.useWidget('_adminTableView', {'tablename': tablename, 'recorddata': e.data});

            app.view('recordload');
        }

    }

    function recordcreate(tablename) {

        app.appResponse = this.response;
        app.setType('web');
        app.layout('admin');

        app.useWidget('_adminHeader', {});
        app.useWidget('_adminAside', {});
        app.useWidget('_adminFooter', {});
        app.useWidget('_adminContentHeader', {'tablename': tablename});
        app.useWidget('_adminTableView', {'tablename': tablename});

        app.view('recordcreate');

    }

    function fileUpload(){
        app.setType('ajax');
        app.ajax(this.response, {'x':1});

        //var response = this.response;
        //var request = this.request;
        //
        ////var post = util.lib.convertToObject(this.postData);
        ////console.log(post);
        //
        //var form = new formidable.IncomingForm();
        //var files = [];
        //var fields = [];
        //
        //form
        //    .on('field', function(field, value) {
        //        console.log(field, value);
        //        fields.push([field, value]);
        //    })
        //    .on('file', function(field, file) {
        //        console.log(field, file);
        //        files.push([field, file]);
        //    })
        //    .on('end', function() {
        //        console.log('-> upload done');
        //        console.log(util.inspect(fields));
        //        console.log(util.inspect(files));
        //        app.ajax(response, {'x':1});
        //    });
        //
        //form.parse(request);

        //form.parse(request, function(err, fields, files) {
        //
        //    console.log(err);
        //    console.log(files);
        //    console.log(fields);
        //
        //    //fs.rename(files.upload.path, "test.jpg", function(err) {
        //    //    if (err) {
        //    //        fs.unlink("test.jpg");
        //    //        fs.rename(files.upload.path, "test.jpg");
        //    //    }
        //    //});
        //
        //    //app.ajax(response, {'x':1});
        //
        //});

    }

    function deliverMessage(){
        app.setType('ajax');

        var post = util.lib.convertToObject(this.postData);
        var response = this.response;

        var m = new Message(post);
        console.log(m);
        m.deliver(function(){
            app.ajax(response, {});
        });

    }

    return {
        login: login,
        struct : struct,
        fileUpload : fileUpload,
        recordload : recordload,
        recordcreate : recordcreate,
        request: request,
        deliverMessage: deliverMessage
    }

}

util.inherits(Admin, WebApplication);

exports.admin = new Admin();
exports.system = true;