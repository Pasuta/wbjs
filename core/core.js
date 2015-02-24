function Core(){

    GLOBAL.colors = require('colors');
    GLOBAL.fs = require('fs');
    GLOBAL.pg = require('pg');
    GLOBAL.url = require('url');
    GLOBAL.querystring = require('querystring');
    GLOBAL.promise = require('promise');
    GLOBAL.jsdom = require('jsdom').jsdom;
    GLOBAL.util = require('util');
    GLOBAL.formidable = require('formidable');
    //GLOBAL.multiparty = require('multiparty');
    util['lib'] = require('./js/lib.js');

    var routes = {};
    var server = require("./server");
    var router = require("./router");

    function Construct(){
        init();
        registerFunctions();
        registerApps();
        registerTables();
        server.start(router.route, routes);
    }

    function init(){
        GLOBAL.__basedir = __dirname + '/../';
        GLOBAL.CONFIG = JSON.parse(fs.readFileSync(__basedir + 'config/site.json'));
        GLOBAL.tablemodel = {};
    }

    function registerFunctions(){
        var dir = __dirname + '/framework';
        var framework = fs.readdirSync(dir);
        framework.forEach(function(e){
            var name = e.split('.')[0];
            GLOBAL[name] = require(dir + '/' + e)[name];
        });
    }

    function registerApps(){
        var parsedRoutes = JSON.parse(fs.readFileSync(__basedir + 'config/routes.json'));
        for(var i in parsedRoutes){
            if(parsedRoutes.hasOwnProperty(i)){
                routes[i] = require(__basedir + 'apps/' + parsedRoutes[i] + '/' + parsedRoutes[i]);
            }
        }
    }

    function registerTables(){

        var dirs = fs.readdirSync(__basedir + 'config/table');
        dirs.forEach(function(e){
            var tables = fs.readdirSync(__basedir + 'config/table/' + e);
            tables.forEach(function(t){
                var tablename = t.split('.json')[0];
                GLOBAL.tablemodel[tablename] = JSON.parse(fs.readFileSync(__basedir + '/config/table/' + e + '/' + t));
            });
        });

    }

    return new Construct();

}

exports.Core = Core;