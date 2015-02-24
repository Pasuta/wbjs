var fs = require('fs');
var pg = require('pg');
var promise = require('promise');
var p = JSON.parse(fs.readFileSync('../../config/db/production.json', 'utf8'));
var con =  "postgres://" + p.user + ":" + p.password +  "@" + p.host + "/" + p.database;

var path = '../../config/table';
var dir = fs.readdirSync(path);
var tables = {};
dir.forEach(function(e){
    var pathToFile = path + '/' + e;
    fs.readdirSync(pathToFile).forEach(function(t){
        var table = fs.readFileSync(pathToFile + '/' + t);
        tables[t.split('.json')[0]] = JSON.parse(table);
    });
});

var pgTableStructure = {};
var i = 0;

(function next(){

    var tablename = Object.keys(tables)[i];
    pgTableStructure[tablename] = {};

    new promise(function(resolve){
        pg.connect(con, function(err, client, done) {
            if(err) return console.error('error fetching client from pool', err);
            client.query("select column_name, data_type from INFORMATION_SCHEMA.COLUMNS where table_name = '" + tablename + "';", function(err, result) {
                done();
                if(err) return console.error('error running query', err);
                pg.end();
                pgTableStructure[tablename]['fields'] = result.rows;
                //console.log(result.rows);
                resolve();
            });
        });
    }).then(function(){
            return new promise(function(resolve){
                pg.connect(con, function(err, client, done) {
                    if(err) return console.error('error fetching client from pool', err);
                    client.query("select * from pg_indexes where tablename = '" + tablename + "';", function(err, result) {
                        done();
                        if(err) return console.error('error running query', err);
                        pg.end();
                        pgTableStructure[tablename]['indexes'] = result.rows;
                        resolve();
                    });
                });
            })
        }).then(function(){
            return new promise(function(resolve){
                pg.connect(con, function(err, client, done) {
                    if(err) return console.error('error fetching client from pool', err);

                    var query = "SELECT\
                                tc.constraint_name, tc.table_name, kcu.column_name,\
                                    ccu.table_name AS foreign_table_name,\
                                    ccu.column_name AS foreign_column_name\
                                FROM\
                                information_schema.table_constraints AS tc\
                                JOIN information_schema.key_column_usage AS kcu\
                                ON tc.constraint_name = kcu.constraint_name\
                                JOIN information_schema.constraint_column_usage AS ccu\
                                ON ccu.constraint_name = tc.constraint_name\
                                WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name='" + tablename + "';";

                    client.query(query, function(err, result) {
                        done();
                        if(err) return console.error('error running query', err);
                        pg.end();
                        pgTableStructure[tablename]['references'] = result.rows;
                        resolve();
                    });
                });
            });
        }).then(function(){
            ++i != Object.keys(tables).length ? next() : compareConfigAndPgTables(pgTableStructure, tables);
        })

})();


function compareConfigAndPgTables(pgTables, configTables){
    for (var obj in pgTables) {
        if(pgTables.hasOwnProperty(obj)){
            console.log(configTables[obj]);
            console.log('---------');
            console.log(pgTables[obj]);
            console.log('\n\n');
        }
    }
}