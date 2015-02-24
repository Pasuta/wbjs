function _adminTableView(params, callback){

    var tmodel = tablemodel[params.tablename];

    var adminFieldView = new AdminFieldView();
    var html = adminFieldView.makeFieldView(tmodel.field);
    html += adminFieldView.makeHasManyView(tmodel.hasmany);
    html += adminFieldView.makeBelongsToView(tmodel.belongsto);

    var redirect = '/admin/struct/' + params.tablename;
    callback({'variables':{'html':html, 'tablename': params.tablename, 'redirect': redirect}});

}

exports._adminTableView = _adminTableView;

