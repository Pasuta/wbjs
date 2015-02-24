var pg = require('pg');
var conString = "postgres://whitebride:123@localhost/whitebride";

pg.connect(conString, function(err, client, done) {

    if(err) return console.error('error fetching client from pool', err);

    client.query('select * from test;', function(err, result) {

        done(); //call `done()` to release the client back to the pool

        if(err) return console.error('error running query', err);

        //console.log(result.rows);
        console.log(result);

        pg.end();

    });

});