function Message(obj){
    if(obj){
        if(obj instanceof Object){
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    this[i] = obj[i];
                }
            }
        } else {
            throw new Error("Input param of message should be instanceof Object");
        }
    }
}

// TODO bool, timestamp
Message.prototype.deliver = function(callback){

    var query;
    var message = this;

    if(message.action == 'load'){ // Загрузка

        query = 'SELECT * FROM ' + message.table;

        if(Object.keys(message).length > 2) {
            query += ' WHERE ';
            for(var i in message){
                if(message.hasOwnProperty(i)){
                    if(i == 'action' || i == 'table') continue;

                    if(Object.prototype.toString.call(message[i]) === '[object Array]'){ // array incoming
                        query += i + '>=' + message[i][0] + ' AND ' + i + '<=' + message[i][1];
                    }

                    query += i + ' = ';
                    query += isNumeric(message[i]) ? message[i] : "'" + message[i] + "'";
                    query += ' AND ';

                }
            }

            query = query.substring(0, query.length - 5);
        }
    }

    if(message.action == 'delete'){ // Удаление

        query = 'DELETE FROM ' + message.table + ' WHERE ';

        for(var k in message){
            if(message.hasOwnProperty(k)){
                if(k == 'action' || k == 'table') continue;

                query += k + ' = ';
                query += isNumeric(message[k]) ? message[k] : "'" + message[k] + "'";
                query += ' AND ';
            }
        }

        query = query.substring(0, query.length - 5);

    }

    if(message.action == 'create'){ // Вставка


        query = 'INSERT INTO ' + message.table + ' ';
        var fields = '(';
        var values = '(';

        for(var j in message){
            if(message.hasOwnProperty(j)){
                if(j == 'action' || j == 'table') continue;
                fields += ' ' + j + ',';
                values += isNumeric(message[j]) ? ' ' + message[j] + ',' : " '" + message[j] + "',";
            }
        }

        fields = fields.substring(0, fields.length - 1) + ')';
        values = values.substring(0, values.length - 1) + ')';

        query += fields + ' VALUES ' + values;
    }

    if(message.action == 'update'){ // Обновление

        query = 'UPDATE ' + message.table;
        var addToQuery = '';
        for(var l in message){
            if(message.hasOwnProperty(l)){
                if(l == 'action' || l == 'table') continue;

                if(l == 'set') {
                    query += ' SET ';
                    var setParams = message[l];
                    for(var z in setParams){
                        if(setParams.hasOwnProperty(z)){
                            var param = typeof setParams[z] == 'number' ? setParams[z] : "'" + setParams[z] + "'";
                            query += z + '=' + param + ', ';
                        }
                    }
                    query = query.substring(0, query.length - 2);
                }

                if(l == 'where') {
                    addToQuery += ' WHERE ';
                    var setParams1 = message[l];
                    for(var z1 in setParams1){
                        if(setParams1.hasOwnProperty(z1)){
                            var param2 = typeof setParams1[z1] == 'number' ? setParams1[z1] : "'" + setParams1[z1] + "'";
                            addToQuery += z1 + '=' + param2 + ', ';
                        }
                    }
                    addToQuery = addToQuery.substring(0, addToQuery.length - 2);
                }
            }
        }

        query += addToQuery;
    }

    query += ';';
    console.log(query.bgWhite.black);

    var p = JSON.parse(fs.readFileSync('config/db/production.json', 'utf8'));
    var con =  "postgres://" + p.user + ":" + p.password +  "@" + p.host + "/" + p.database;

    pg.connect(con, function(err, client, done) {

        if(err) return console.error('error fetching client from pool', err);

        client.query(query, function(err, result) {

            done();

            if(err) return console.error('error running query', err);

            pg.end();

            var ret = {};
            ret['count'] = result.rowCount;
            ret['data'] = result.rows;

            callback(ret);

        });

    });
};

function isNumeric(num){
    return !isNaN(num)
}

exports.Message = Message;