function Template(){

}

Template.prototype.makeTemlpate = function(template, params){

    if(params['variables']){
        template = this.variable(template, params['variables']);
    }

    if(params['widgets']){
        template = this.widget(template, params['widgets']);
    }

    if(params['lists']){
        template = this.lists(template, params['lists']);
    }

    return template;

};

Template.prototype.widget = function(template, params){

    for(var i in params){
        if(params.hasOwnProperty(i)){
            var reg = new RegExp("({{widget::)("+i+")(}})"); // /({{)(widget::)(}})/g;
            if(reg.test(template)){

                function replacer(substr) {
                    var r = new RegExp("({{widget::)(" + this.i + ")(}})");
                    substr = substr.match(r);
                    return params[substr[2]];
                }

                template = template.replace(reg, replacer.bind({'i':i}));
            }
        }
    }

    return template;

};

Template.prototype.variable = function(template, params){

    var reg = /({{)(\w+)(}})/g;

    function replacer(substr){
        substr = substr.match(/({{)(\w+)(}})/);
        return params[substr[2]]; // второй елемент есть внутреним значением внутри {{x}}
    }

    return template.replace(reg, replacer);
};

Template.prototype.lists = function(template, params){ // TODO make lists
    //console.log(params);

    for(var i in params){
        if(params.hasOwnProperty(i)){
            console.log(i);
            //var reg = new RegExp("({{list::)("+i+")(}})"); //
            //if(reg.test(template)){
            //
            //    function replacer(substr) {
            //        var r = new RegExp("({{list::)(" + this.i + ")(}})");
            //        substr = substr.match(r);
            //        return params[substr[2]];
            //    }
            //
            //    template = template.replace(reg, replacer.bind({'i':i}));
            //}
        }
    }

    return template;
};

exports.Template = Template;