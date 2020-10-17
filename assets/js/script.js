
//Budget Data Creation, Storage and Manupulation 
var budget = (function(){
    //Function Constructors for Expenses and Incomes entries
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description,
        this.value = value
    }
    var Income = function(id, description, value){
        this.id = id;
        this.description = description,
        this.value = value
    }
    //For Data Storage
    var data = {
        //Storing newly created Entries (Objects of Expenses & Incomes) 
        allItems : {
            exp: [],
            inc: []
        },
        total : {
            exp: 0,
            inc: 0
        }
    }
    //Public Methods
    return {
        //Add new entries (new Objects) to data > allItems Object Arrays.
        addItem: function(type, desc, value){
            var newItem, id;

            //Create New ID
            if (data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1] + 1;
            }else{
                id = 0;
            }

            //Create New Item
            if(type === "exp"){
                newItem = new Expense(id, desc, value);
            }
            else if (type === "inc"){
                newItem = new Income(id, desc, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        //Just for Testing
        exposeData: function(){
            return data;
        }
    }

})();

//User Interface Handler
var ui = (function(){
    //Data Storage for DOM elements 
    var domStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        submitBtn: ".add__btn"
    }

    return {
        //Getting OR Fectching User Input
        inputParams: function(){
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            }
        },
        //Exposing DOM elements to public
        domStringsExport: function(){
            return domStrings;
        }
    }

})();
//App Handler
var app = (function(budgetctrl, uictrl){
    //Adding an Item to Budget App
    var addItem = function(){
        var input, newItem;
        //1. Get data from Input Field
        input = uictrl.inputParams();
        console.log(input);
        //2. Add new Item to the Budget 
        newItem = budgetctrl.addItem(input.type, input.description, input.value);
        console.log(budgetctrl.exposeData());
    }
    //Setting Up All Event Listeners
    function setupEventListeners(){
        var getDom = uictrl.domStringsExport();
        document.querySelector(getDom.submitBtn).addEventListener("click", addItem);
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 || event.which === 13){
                addItem();
            }
        });
    } 
    return {
        //App initialization Method and setting up listners
        init: function(){
            console.log("App Initialization.................");
            setupEventListeners();
        }
    }

})(budget, ui);
app.init();