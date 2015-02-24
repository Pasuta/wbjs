function _adminAside(params, callback){

    var tablesBlockHTML = tablesBlock();

    callback({'variables':{'tablesBlockHTML':tablesBlockHTML}});
}

function tablesBlock(){
    var path = __basedir + 'config/table';
    var dir = fs.readdirSync(path);
    var iter = '';

    dir.forEach(function(e){
        var tables = fs.readdirSync(path + '/' + e);
        iter += "<fieldset style='width: 85%;border: 1px solid gray'>";
        iter += "<legend style='font-size: 10px'>" + e + "</legend>";

        tables.forEach(function(t){
            var table = fs.readFileSync(path + '/' + e + '/' + t);
            table = JSON.parse(table);
            iter += "<a href='/admin/struct/" + table.tablename + "' style='font-size: 14px;color:darkred'>" + table.tablename + "</a><br>";
        });

        iter +=  "</fieldset>";
    });

    return iter;
}

exports._adminAside = _adminAside;

