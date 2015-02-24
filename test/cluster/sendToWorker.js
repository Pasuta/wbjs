var cluster = require('cluster');

if (cluster.isMaster) {
    var worker = cluster.fork();
    console.log('master');
    worker.send('hi there');

} else if (cluster.isWorker) {
    process.on('message', function(msg) {
        console.log(msg);
        process.send(msg);
    });
}