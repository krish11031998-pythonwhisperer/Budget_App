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

    var data = {
        allItems: {  
            income_array : new Array(),
            expense_array : new Array()
        },
        total: {
            gross_income : 0,
            gross_expense : 0,
            gross_balance : 0,
            gross_exp_percent : 0,
            calc_balance : function(){
                this.gross_balance = this.gross_income-this.gross_expense;
            },
            exp_percent : function(){

                this.gross_exp_percent = Math.round((this.gross_expense/this.gross_income)*100);
            },
            update_exp_percent: function(arr,amount){
                if(this.gross_exp_percent == Infinity && this.gross_income!= 0){
                    this.gross_exp_percent = 0;
                    this.exp_percent();
                    arr.forEach(function(current,index,array){
                        console.log(current.exp_percent,current.amt,amount);
                        if(current.exp_percent == Infinity){
                            current.exp_percent = Math.round((current.amt/amount)*100);
                            console.log(current.exp_percent);
                            element = document.getElementById(current.id);
                            element = element.childNodes[1].childNodes;
                            for(var x=0;x<element.length;x++){
                                var data = element[x].childNodes[0].data;
                                console.log(data);
                                if (data == "Infinity %"){
                                    element[x].childNodes[0].data = current.exp_percent + '%';
                                    console.log(element[x].childNodes[0].data);
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    var income = function(description,income,id_counter){
        this.descr = description;
        this.income_amt = income;
        this.id = 'inc-'+id_counter;

    }

    income.prototype.push_income_Array = function(){
        data.allItems.income_array.push({id:this.id,descr: this.descr,amt: this.income_amt,type:'inc',log_in_UI:false});

    }

    var expense = function(description,expenses,expenses_percent,id_counter){
        this.descr = description;
        this.exp_amt = expenses;
        this.exp_percent = expenses_percent;
        this.id = 'exp-'+id_counter;
    }

    expense.prototype.push_expense_Array = function(){
       data.allItems.expense_array.push({id:this.id,exp_percent: this.exp_percent,amt: this.exp_amt,descr:this.descr,type: 'exp',log_in_UI:false});
    }

    var compute = function(){
        if (type == 'inc'){
            var income_tranc = new income(descriptn,transc_amt,inc_id_counter);
            inc_id_counter++;
            income_tranc.push_income_Array();
            console.log(data.allItems.income_array);
            data.total.gross_income+= transc_amt;
            data.total.update_exp_percent(data.allItems.expense_array,data.total.gross_income);
        }
        else if (type == 'exp'){
            var expense_percent = Math.round((transc_amt/data.total.gross_income)*100);
            var expense_tranc = new expense(descriptn,transc_amt,expense_percent,exp_id_counter);
            exp_id_counter++;
            expense_tranc.push_expense_Array();
            console.log(data.allItems.expense_array);
            data.total.gross_expense+= transc_amt;
            data.total.exp_percent();
        }
        data.total.calc_balance();
    }

    var delete_item = function(type,find_id){
        var targetarray;
        if(type == 'inc'){
            targetarray = data.allItems.income_array;
        }
        else if (type == 'exp'){
            targetarray = data.allItems.expense_array;
        }
        target_ids = targetarray.map(function(current){
            return current.id;
        });
        target_index = target_ids.indexOf(find_id);
        console.log(find_id,target_index);
        console.log('Before: ',data.allItems.income_array,data.allItems.expense_array);
        if(target_index !== -1){
            (type == 'inc') ? data.allItems.income_array.splice(target_index,1) : data.allItems.expense_array.splice(target_index,1);
            
        }
        console.log('After: ',data.allItems.income_array,data.allItems.expense_array);

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
            return {data:data,type:type};
        },
        del_item : function(type,id){
           delete_item(type,id);
           return {data : data}
        },
        compute : compute
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
        expense_container : '.expenses__list',
        container : '.container'
    }

    var html_for_list = function(obj){
        console.log("This is the object that was passed to the HTML parsing function");
        console.log(obj);
        var newhtml,element;
        
        if (obj.type == 'inc'){
            html = '<div class="item clearfix" id="%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = DOMstrs.income_container;
        }
        else if (obj.type == 'exp'){
            html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%exp_percent% %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = DOMstrs.expense_container;
            html = html.replace('%exp_percent%',obj.exp_percent);
        }

        newhtml = html.replace('%id%',obj.id);
        newhtml = newhtml.replace('%description%',obj.descr);
        newhtml = newhtml.replace('%value%',obj.amt);

        document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
    }
    var change_Income_UI = function(income){
        if(income.log_in_UI == false){
            html_for_list(income);
        }

    }

    var change_Expense_UI = function(expense){

        if(expense.log_in_UI == false){
            html_for_list(expense);
        }

    }
    var changeUI_summary = function(bobj){

        console.log(bobj);
        (bobj.data.total.gross_balance >=0) ? document.querySelector(DOMstrs.budget_value).textContent = "+ "+bobj.data.total.gross_balance : document.querySelector(DOMstrs.budget_value).textContent = bobj.data.total.gross_balance ;
        document.querySelector(DOMstrs.budget_income).textContent = ("+ "+bobj.data.total.gross_income);
        document.querySelector(DOMstrs.budget_expenses).textContent = ("- "+bobj.data.total.gross_expense);
        document.querySelector(DOMstrs.budget_expenses_percent).textContent = (bobj.data.total.gross_exp_percent+"%");
        (bobj.data.total.gross_exp_percent == Infinity) ? document.querySelector(DOMstrs.budget_expenses_percent).textContent = "---" : document.querySelector(DOMstrs.budget_expenses_percent).textContent = (bobj.data.total.gross_exp_percent+"%");
        if(bobj.type == 'inc'){
            change_Income_UI(bobj.data.allItems.income_array[bobj.data.allItems.income_array.length-1]);
        }
        else if (bobj.type == 'exp'){
            change_Expense_UI(bobj.data.allItems.expense_array[bobj.data.allItems.expense_array.length-1]);
        }
        
    }

    var delete_input_transaction = function(ID,bobj){
        var el = document.getElementById(ID);
        el.parentNode.removeChild(el);
        changeUI_summary(bobj);

    }

    var changeUI_summary_init = function(){

        document.querySelector(DOMstrs.budget_value).textContent = "0";
        document.querySelector(DOMstrs.budget_income).textContent = "0";
        document.querySelector(DOMstrs.budget_expenses).textContent = "0";
        document.querySelector(DOMstrs.budget_expenses_percent).textContent = "0";
    }

    var clearfields = function(){
        var fields, fieldsarr;
        fields = document.querySelectorAll(DOMstrs.add_descr+","+DOMstrs.add_val);
        fieldsarr = Array.prototype.slice.call(fields);

        fieldsarr.forEach(function(current,index,array){
            current.value = "";
        });

        fieldsarr[0].focus();
    }



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
            changeUI_summary(obj);
            clearfields();
        },
        screen_init : function(){
            changeUI_summary_init();
        },
        update_UI_expense : html_for_list,
        delete_item: function(id,bobj){
            delete_input_transaction(id,bobj)
        } 
    }
})();

var mainController = (function(budgetCtrl,UICtrl){
    var x = 0

    var setup_eventlistener = function(){
        document.querySelector('.add__btn').addEventListener('click',CtrlAddFunction);

        document.querySelector('.container').addEventListener('click',CtrlDelFunction)

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
        if((all_values.descr!== "") && !(isNaN(all_values.input)) && (all_values.value!=0)){
            budget_data= budgetCtrl.item(all_values);
            console.log(budget_data.data.income_array,budget_data.data.expense_array);
            UICtrl.getbudget_obj(budget_data);
        }

    }

    var CtrlDelFunction = function(event){
        var itemID, splitID,type,ID;
        itemID  = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID,typeof(itemID));
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = itemID;
            console.log(type,ID);
            budget_data = budgetCtrl.del_item(type,ID);
            console.log(budget_data.data);
            UICtrl.delete_item(ID,budget_data);

        }
    }


    return {
        init: function(){
            console.log('The Application has started.');
            setup_eventlistener();
            UICtrl.screen_init();
        }
    }

})(budgetController,UIcontroller);


mainController.init();