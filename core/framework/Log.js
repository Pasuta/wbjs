function Log(){

    function info(name, data){

        var time = new Date();
        var month = time.getMonth() + 1;
        time = '[' + time.getDate() + '.' + month + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ']';
        data = time + ' ' + data + '\n';

        fs.appendFile(__basedir + 'log/' + name + '.log', data, function (err) {
            if (err) throw err;
        });

    }

    function error(name, data){ // TODO

    }

    return {
        info: info
    }

}

exports.Log = Log();