
//Budget Data Creation, Storage and Manupulation 
var budget = (function(){
    //Function Constructors for Expenses and Incomes entries
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description,
        this.value = value,
        this.percentage = -1
    }
    Expense.prototype.percentCalc = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    }
    Expense.prototype.getPecent = function(){
        return this.percentage;
    }
    var Income = function(id, description, value){
        this.id = id;
        this.description = description,
        this.value = value
    }
    var totalCalculate = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value; 
        });
        return sum;
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
        },
        balance : 0,
        percentage : -1
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
        },
        calculate: function(){
            //calculating total income and total expenses
            data.total.exp = totalCalculate("exp");
            data.total.inc = totalCalculate("inc");
            //calculating total budget > income - expenses
            data.balance = data.total.inc - data.total.exp;
            //calculate percentage of income used
            if(data.total.inc > 0){
                data.percentage = Math.round((data.total.exp / data.total.inc)*100);
            }else{
                data.percentage = -1
            }
        },
        percentageCalc: function(){
            //Loop over expenses array and calculate percentage for all objects
            data.allItems.exp.forEach(function(current){
                current.percentCalc(data.total.inc);
            });
        },
        retrievePercentage: function(){
            var percArray;
            //Loop over expenses array and create an array for all percentages
            percArray = data.allItems.exp.map(function(current){
                return current.getPecent();
            });
            return percArray;
        },
        retrieveBudget: function(){
            return {
                //returning the budget
                totalExpense : data.total.exp,
                totalIncome : data.total.inc,
                balance : data.balance,
                percentage : data.percentage 
            }
        },
        deleteItemData: function(type, id){
            var allIds, indexToDelete;
            //creating an array of all ids of the [type] Objects
            allIds = data.allItems[type].map(function(current){
                //maping only ids of [type] Object to the new array
                return current.id;
            });
            //Finding the index to delete
            indexToDelete = allIds.indexOf(id);
            //Delete the data at the found Index
            if(indexToDelete !== -1){
                data.allItems[type].splice(indexToDelete, 1);
            }
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
        expenseContainer: ".expenses__list",
        balanceLabel: ".budget__value",
        totalIncomeLabel: ".budget__income--value",
        totalExpenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        itemContainer: ".container",
        expensePercentLabel: ".item__percentage"
    }
    var formatNum = function(num, type){
        var splitNum, int, dec;
        //1. getting the absolute value of the number |num|
        num = Math.abs(num);
        //2. storing number as a string with two places after decimal
        num = num.toFixed(2);
        //3. split integers and decimal points
        splitNum = num.split(".");
        int = splitNum[0];
        dec = splitNum[1];
        //4. adding commas
        function format(x, formatInt){
            var counter = "";
            if(x.length > 3){
                counter = x.substr(0,x.length-3);
                formatInt = "," + x.substr(x.length-3, 3) + formatInt;
                return format(counter, formatInt);
            }else{
                var result = "";
                result = x + formatInt;
                return result;
            }
        }
        //5. Generating string based on income or expenses
        if (type === "inc"){
            num = "+ " + format(int, "") + "." + dec;
            return num;
        }else{
            num = "- " + format(int, "") + "." + dec;
            return num;
        }
    }
    //Creating my own for Each function for Node Lists
    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    }
    return {
        //Getting OR Fectching User Input
        inputParams: function(){
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
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
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if (type === "inc"){
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //Replace Placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNum(obj.value, type));
            //insert new HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);           
        },
        deleteListItem: function(domId){
            var el = document.getElementById(domId);
            el.parentNode.removeChild(el);
        },
        resetFields: function(){
            var fields, fieldArray;
            //queryselector uses css selectors
            fields= document.querySelectorAll(domStrings.inputDescription + "," + domStrings.inputValue);
            //queryselector doesnt return array, only list
            //use prototype array to slice and use call method "Conversion to Array"
            fieldArray = Array.prototype.slice.call(fields);
            //Loop over the array to delete the values
            fieldArray.forEach(function(curr){
                curr.value = "";
            });
            //focus back to description field for easier input
            fieldArray[0].focus();
        },
        displayBudget: function(obj){
            //DOM Selection and Setting Budget Values
            if(obj.balance > 0){
                document.querySelector(domStrings.balanceLabel).textContent = formatNum(obj.balance, "inc");
            }else if (obj.balance < 0){
                document.querySelector(domStrings.balanceLabel).textContent = formatNum(obj.balance, "exp");
            }
            else{
                document.querySelector(domStrings.balanceLabel).textContent = obj.balance;
            }
            document.querySelector(domStrings.totalIncomeLabel).textContent = formatNum(obj.totalIncome, "inc");
            document.querySelector(domStrings.totalExpenseLabel).textContent = formatNum(obj.totalExpense, "exp");
            if(obj.percentage > 0){
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + "%";
            }else{
                document.querySelector(domStrings.percentageLabel).textContent = "---";
            }    
        },
        displayPercentages: function(percentage){
            var domList;
            //Selecting all relevant dom Elements
            domList =  document.querySelectorAll(domStrings.expensePercentLabel);
            //Calling my own for each function
            nodeListForEach(domList, function(current, index){               
                if(percentage[index] > 0){
                    current.textContent = percentage[index] + "%";
                }else{
                    current.textContent = "---";
                }
            });
        },
        typeChange: function(){
            //Change the CSS class when user changes input type to expenses
            var chElements, btn;
            //Fetching all the fields from DOM
            chElements = document.querySelectorAll(
                domStrings.inputType + "," +
                domStrings.inputDescription + "," +
                domStrings.inputValue
            );
            //Calling my own for each function
            nodeListForEach(chElements, function(current){
                current.classList.toggle("red-focus");
            });
            //Fetching Submit btn DOM
            btn = document.querySelector(domStrings.submitBtn);
            btn.classList.toggle("red");
        }
    }
})();
//App Handler
var app = (function(budgetctrl, uictrl){
    //Updating Budget
    var budgetUpdate = function(){
        var budget;
        //5. Calculating the Budget
        budgetctrl.calculate();
        //6. Return Budget
        budget = budgetctrl.retrieveBudget();
        //7. Add the Calculated Budget to UI
        uictrl.displayBudget(budget);
    }
    //Updating Percentages
    var percentUpdate = function(){
        var percentage;
        //Calculating Percentages
        budgetctrl.percentageCalc();
        //Return Percentages in array
        percentage = budgetctrl.retrievePercentage();
        //Display Percentages to UI
        uictrl.displayPercentages(percentage);
    }
    //Adding an Item to Budget App
    var addItem = function(){
        var input, newItem;
        //1. Get data from Input Field
        input = uictrl.inputParams();
        if (input.description !== "" && input.value > 0 && !isNaN(input.value)){
            //2. Add new Item to the Budget 
            newItem = budgetctrl.addItem(input.type, input.description, input.value);
            //3. Add new Item to UI
            uictrl.addListItem(newItem, input.type);
            //4. Reset the input fields
            uictrl.resetFields();
            //Updating Budget
            budgetUpdate();
            //Updating Percentages
            percentUpdate();

        }
    }
    //Delete Item from App
    var deleteItem = function(event){
        var itemLog, splitID, type, ID;
        //retrieve the parent id of list item
        itemLog = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //split the id string into array
        splitID = itemLog.split("-");
        //Storing values in type and ID
        type = splitID[0];
        ID = parseInt(splitID[1]),
        //1. Delete Item from Data Structure
        budgetctrl.deleteItemData(type, ID);
        //2. Recalculate and Update Budget
        budgetUpdate();
        //3. Delete Item from UI
        uictrl.deleteListItem(itemLog);
        //4. Updating Percentages
        percentUpdate();

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
        document.querySelector(getDom.itemContainer).addEventListener("click", deleteItem);
        document.querySelector(getDom.inputType).addEventListener("change", uictrl.typeChange);
    } 
    return {
        //App initialization Method and setting up listners
        init: function(){
            console.log("App Initialization.................");
            uictrl.displayBudget({
                totalExpense : 0,
                totalIncome : 0,
                balance : 0,
                percentage : -1
            });
            setupEventListeners();
        }
    }
})(budget, ui);
app.init();