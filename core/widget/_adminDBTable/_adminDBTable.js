function _adminDBTable(params, callback){

    var tableModel = tablemodel[params.tablename];

    var thead = '<td>№</td>';
    var field = tableModel.field;
    var fieldName = [];
    for(var i in field){
        if(field.hasOwnProperty(i)){
            if(field[i].adminview) {
                fieldName.push(i);
                thead += "<td>" + field[i].name + "</td>";
            }
        }
    }

    //var hasmany = tableModel.hasmany;
    //if(hasmany){
    //    if(hasmany.length){
    //        hasmany.forEach(function(e){
    //            var tModel = tablemodel[e];
    //            thead += "<td class='nephritis'>" + tModel.tablenameAdmin + "</td>";
    //        });
    //    }
    //}

    //var belongsto = tableModel.belongsto;
    //if(belongsto){
    //    if(belongsto.length){
    //        belongsto.forEach(function(e){
    //            var tModel = tablemodel[e];
    //            thead += "<td class='peterriver' style='color:white;'>" + tModel.tablenameAdmin + "&#8593;</td>";
    //        });
    //    }
    //}

    var tbody = '';

    var m = new Message();
    m.action = 'load';
    m.table = params.tablename;
    m.deliver(responseHandler);

    function responseHandler(x){

        var number = 0;
        x.data.forEach(function(e){
            tbody += '<tr class="linkRow" data-id='+ e.id + ' data-table=' + params.tablename + '>';
            tbody += "<td>" + ++number + "</td>";
            fieldName.forEach(function(f){
                var data = e[f];
                if(data == null) data = "-";
                tbody += "<td>" + data + "</td>";
            });
            tbody += "</tr>";
        });

        callback({'variables':{'thead':thead, 'tbody': tbody}});
    }

}

exports._adminDBTable = _adminDBTable;

