function _adminContentHeader(params, callback){

    //var tableMd = tablemodel[params.pagename];
    callback({'variables':params});
}

exports._adminContentHeader = _adminContentHeader;

