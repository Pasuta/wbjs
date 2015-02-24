function route(handle, pathname, response, postData, request) { // !!!  /app/method/param

    var path = pathname.split('/');
    var toBind = {'request': request, 'response': response, 'postData': postData};
    path.shift();

    if(path[0] == '' && handle.hasOwnProperty('index')){ // index '/'
        if(handle['index']['index']['request']){
            handle['index']['index']['request'].bind(toBind).call();
        } else {
            error404();
        }
    } else {
        if (handle.hasOwnProperty(path[0])){ // есть такой app

            //if(handle[path[0]]['system'] == true) { // системный app
            //    if(request.session.data.user != "admin" && pathname != '/admin/login' && pathname != '/admin/ajaxLogin'){
            //        response.writeHead(302, { 'Location': '/admin/login' });
            //        response.end();
            //        return;
            //    }
            //}

            if(path.length == 1) { // /app
                if(handle[path[0]][path[0]]['request']){
                    handle[path[0]][path[0]]['request'].bind(toBind).call();
                } else {
                    error404();
                }
            }

            if(path.length == 2) { // /app/method
                if(handle[path[0]][path[0]].hasOwnProperty(path[1])){
                    handle[path[0]][path[0]][path[1]].bind(toBind).call();
                } else if(handle[path[0]][path[0]].hasOwnProperty('resource')){
                    handle[path[0]][path[0]]['resource'].bind(toBind).call('', path[1]);
                } else {
                    error404();
                }
            }

            if(path.length == 3) { // app/method/param
                if(handle[path[0]][path[0]].hasOwnProperty(path[1])){
                    handle[path[0]][path[0]][path[1]].bind(toBind).call('', path[2]);
                } else {
                    error404();
                }
            }

        } else {
            error404();
        }
    }



    function error404(){
        var str = "No request handler found for " + pathname;
        console.log(str.bgRed.white);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }

}

exports.route = route;