var budget = (function(){
    var x = 23
    var addition = function(a){
        return x + a;
    }
    return {
        publicMethod: function(b){
            return addition(b);
        }
    }
})();

var ui = (function(){

    //some code

})();

var app = (function(budgetctrl, uictrl){

    var z = budgetctrl.publicMethod(5);
    //console.log(z);

    return {
        anotherMethod: function(){
            console.log(z);
        }
    }
})(budget, ui);