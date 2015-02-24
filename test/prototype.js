//function WebApplication(par1, par2){
//    this.parentField1 = par1;
//    this.parentField2 = par2;
//}
//
//WebApplication.prototype = {};
//
//exports.WebApplication = WebApplication;

var util = require('util');

// Определение классов

function ParentClass(par1, par2) {
    this.parentField1 = par1;
    this.parentField2 = par2;
}

ParentClass.prototype.end = function(){
    console.log(1);
};

function ChildClass(par1, par2) {
    ChildClass.super_.apply(this, arguments);
    this.childField1 = par1;
    this.childField2 = par2;
}

// Наследование

util.inherits(ChildClass, ParentClass);

// Создание объекта дочернего класса и проверка результата

var obj = new ChildClass('Hello', 'World');
obj.end();