var http = require("http");
var path = require("path");
var session = require('sesh').magicSession();

function start(route, handle) {

    var port = CONFIG.SERVER.port;

    function onRequest(request, response) {

        var postData = "";
        var pathname = url.parse(request.url).pathname;

        var filePath = '.' + pathname;
        var extname = path.extname(filePath);

        var contentType = false;
        if(extname == '.js') contentType = 'text/javascript';
        if(extname == '.css') contentType = 'text/css';
        if(extname == '.png' || extname == '.svg' || extname == 'jpg') contentType = 'binary'; // TODO jpg
        if(extname == '.ttf') contentType = 'application/vnd.ms-fontobject';

        if(contentType){ // Если файл js или css или картинка
            fs.exists(filePath, function(exists) {
                if (exists) {
                    fs.readFile(filePath, function(error, content) {
                        if (error) {
                            response.writeHead(500);
                            response.end();
                        } else {
                            response.writeHead(200, { 'Content-Type': contentType });
                            response.end(content, 'utf-8');
                        }
                    });
                } else {
                    response.writeHead(404);
                    response.end();
                }
            });
        } else { // если app
            var str = "Request for " + pathname + " received.";
            console.log(str.magenta);

            request.setEncoding("utf8");

            request.addListener("data", function(postDataChunk) {
                postData += postDataChunk;
            });

            request.addListener("end", function() {
                route(handle, pathname, response, postData, request);
            });
        }
    }

    http.createServer(onRequest).listen(port);
    console.log("Server has started.".bgWhite.black);
}

exports.start = start;