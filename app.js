var budgetController = (function(){
    var gross_value,incomes,expenses,expenses_percent,type,descriptn,transc_amt;
    gross_value = 0;
    incomes = 0;
    expenses = 0;
    expenses_percent = 0;
    type = 0;
    transc_amt = 0;
    inc_id_counter = 0;
    exp_id_counter = 0;
    var budgetitem={
        /* 
        gr_value: gross value,
        income: income,
        expenses: expense,
        exp_percent: expenses percent,
        descr: description,
        tranc_type: type,
        t_amt: transacion amount
        */
       gross_income : 0,
       gross_expense : 0,
       gross_expense_percent : 0,
       income_array : new Array(),
       expenses_array : new Array(),

       //creating a income ojbect using a function constructor
       income : function(description,income){
           this.descr = description;
           this.income_amt = income;
           this.id = 'inc_'+inc_id_counter;
           this.income_array.push({id:this.id,descr: this.descr,amt: this.income_amt,type:'inc',log_in_UI:false});
           this.gross_income += income;
           inc_id_counter++;
       },
       //creating a expense object using a fucntion constructor
       expense: function(description,expenses,expenses_percent){
           this.descr = description;
           this.exp_amt = expenses;
           this.exp_percent = expenses_percent;
           this.id = 'inc_'+inc_id_counter;
           this.expenses_array.push({id:this.id,exp_percent: this.exp_percent,amt: this.exp_amt,desrc:this.descr,type: 'exp',log_in_UI:false});
           this.gross_expense += expenses;
           exp_id_counter++;
       },

       //creating a gross values objects using a function constructor
       gross_value : function(){
           this.gross_balance = this.gross_income - this.gross_expense;
           this.gross_expense_percent = Math.round((this.gross_expense/this.gross_income)*100);
       }
    }

    var compute = function(){
        if (type == 'inc'){
            budgetitem.income(descriptn,transc_amt);
        } 
        else{
            exp_percent = (transc_amt/budgetitem.gross_income)*100;
            budgetitem.expense(descriptn,transc_amt,exp_percent); 
        }
        budgetitem.gross_value();
    }

    var getitem = function(item){
        transc_amt = parseInt(item.input);
        descriptn = item.descr;
        type = item.type;
        compute();
    }

    return {
        item : function(obj){
            getitem(obj);
            return budgetitem;
        }
    }

    })();



var UIcontroller = (function(){

    var DOMstrs = {
        inp_type: '.add__type',
        add_descr: '.add__description',
        add_val: '.add__value',
        budget_value: '.budget__value',
        budget_income: '.budget__income--value',
        budget_expenses: '.budget__expenses--value',
        budget_expenses_percent : '.budget__expenses--percentage',
        income_container : '.income__list',
        expense_container : '.expenses__list'
    }

    var html_for_list = function(obj){
        var newhtml,element;
        
        if (obj.type == 'inc'){
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            html.replace('%id%',obj.id);
            html.replace('%description%',obj.descr);
            html.replace('%value%',obj.income_amt);
            element = DOMstrs.income_container;
            newhtml =html;
        }
        else if (obj.type == 'exp'){
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            html.replace('%id%',obj.id);
            html.replace('%description%',obj.descr);
            html.replace('%value%',obj.income_amt);
            element = DOMstrs.expense_container;
            newhtml = html;

        }

        document.querySelector(element).append(html);
    }
    var change_Income_UI = function(income_arr){
        console.log(income_arr);
        if(income_arr.log_in_UI == false){
            html_for_list(income_arr);
        }

    }

    var change_Expense_UI = function(expense_arr){

        if(expense_arr[expense_arr.length-1].log_in_UI == 'false'){
            html_for_list(expense_arr[expense_arr.length - 1]);
        }

    }
    var changeUI_sumamry = function(bobj){

        (bobj.gross_balance >=0) ? document.querySelector(DOMstrs.budget_value).textContent = "+ "+bobj.gross_balance : document.querySelector(DOMstrs.budget_value).textContent = bobj.gross_balance ;
        document.querySelector(DOMstrs.budget_income).textContent = ("+ "+bobj.gross_income);
        document.querySelector(DOMstrs.budget_expenses).textContent = ("- "+bobj.gross_expense);
        document.querySelector(DOMstrs.budget_expenses_percent).textContent = (bobj.gross_expense_percent+"%");
        change_Income_UI(bobj.income_array[bobj.income_array.length-1]);
        // change_Expense_UI(bobj.expenses_array[bobj.income_arr.length-1]);
        
    }



    // var input_list_fields = function(item){

    // }
    return {
        getinput : function(){
            var type = document.querySelector(DOMstrs.inp_type).value;
            var description = document.querySelector(DOMstrs.add_descr).value;
            var input = document.querySelector(DOMstrs.add_val).value;

            return {
                type:type,
                descr:description,
                input:input
            }
        },
        getbudget_obj: function(obj){
            changeUI_sumamry(obj);
        }
        
    }
})();

var mainController = (function(budgetCtrl,UICtrl){
    var x = 0

    var setup_eventlistener = function(){
        document.querySelector('.add__btn').addEventListener('click',CtrlAddFunction);

        document.addEventListener('keypress',function (key_event){
            
            if(key_event.keycode === 13 || key_event.which === 13){
                CtrlAddFunction();
            }
    
        });
    }

    var CtrlAddFunction = function(){
        /*Get the input field
          Add item to the budgetController
          Add item to the UI
          Calculate Budget and add it to the UI
          Display Budget on the UI*/
        // console.log("this works");
        var all_values = UIcontroller.getinput();
        console.log(all_values);
        budgetitem = budgetCtrl.item(all_values);
        console.log(budgetitem);
        UICtrl.getbudget_obj(budgetitem);
    }

    return {
        init: function(){
            console.log('The Application has started.')
            setup_eventlistener();
        }
    }

})(budgetController,UIcontroller);


mainController.init();