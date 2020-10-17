
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
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                id = 0;
            }
            console.log(id);
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
        submitBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
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
        },
        //Add new Item in the list
        addListItem: function(obj, type){
            var html, newHtml, element;

            //Create New HTML String
            if(type === "exp"){
                element = domStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if (type === "inc"){
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace Placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            //insert new HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);           
        },
        resetFields: function(){
            var fields, fieldArray;
            //queryselector uses css selectors
            fields= document.querySelectorAll(domStrings.inputDescription + "," + domStrings.inputValue);
            //queryselector doesnt return array, only list
            //use prototype array to slice and use call method "Conversion to Array"
            fieldArray = Array.prototype.slice.call(fields);
            //Loop over the array to delete the values
            fieldArray.forEach(function(current){
                current.value = "";
            });
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
        //3. Add new Item to UI
        uictrl.addListItem(newItem, input.type);
        //4. Reset the input fields
        uictrl.resetFields();
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