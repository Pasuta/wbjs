var cluster = require('cluster');

if (cluster.isMaster) {
    var worker = cluster.fork();

    worker.send('wazzup');

    worker.on('message', function(d){
        if(d == 'wazzup received mzfk'){
            console.log('wazzup received');
            worker.kill();
        }
    });

} else if (cluster.isWorker) {
    process.on('message', function(msg) {
        if(msg == 'wazzup'){
            process.send('wazzup received mzfk');
        }
    });
}