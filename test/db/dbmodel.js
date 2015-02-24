var fs = require('fs');
var pg = require('pg');

var dir = fs.readdirSync('../config/table');
var tables = [];
dir.forEach(function(e){
    fs.readdirSync('../config/table/' + e).forEach(function(t){
        var table = fs.readFileSync('../config/table/' + e + '/' + t);
        tables.push(JSON.parse(table))
    });
});

var p = JSON.parse(fs.readFileSync('../config/db/production.json', 'utf8'));
var con =  "postgres://" + p.user + ":" + p.password +  "@" + p.host + "/" + p.database;

pg.connect(con, function(err, client, done) {
    if(err) return console.error('error fetching client from pool', err);
    client.query("\\d+ category", function(err, result) {
        done();
        if(err) return console.error('error running query', err);
        pg.end();
        //checkTableInDatabase(result.rows);
        //convertResultToJSON(result.rows);
    });
});

//pg.connect(con, function(err, client, done) {
//    if(err) return console.error('error fetching client from pool', err);
//    client.query("SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';", function(err, result) {
//        done();
//        if(err) return console.error('error running query', err);
//        pg.end();
//        //checkTableInDatabase(result.rows);
//        convertResultToJSON(result.rows);
//    });
//});
//
//function convertResultToJSON(pgtables){
//    console.log(pgtables);
//}
//
//function checkTableInDatabase(pgtables) {
//
//    var inDb = [];
//    var inConfig = [];
//
//    tables.forEach(function (e) {
//
//        //console.log(e['tablename']);
//        pgtables.forEach(function (t) {
//            if(e['tablename'] != t['tablename']) inConfig.push(t['tablename']);
//        });
//
//    });
//
//    console.log(inConfig);
//
//
//}
//
////SELECT category FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');