
var budgetController = (function(){
    var gross_value,incomes,expenses,expenses_percent,type,descriptn,transc_amt,transc_amt_string;
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
        }
    }

    var income = function(description,income,id_counter,string){
        this.descr = description;
        this.income_amt = income;
        this.income_amt_string = string;
        this.id = 'inc-'+id_counter;

    }

    income.prototype.push_income_Array = function(){
        data.allItems.income_array.push({id:this.id,descr: this.descr,amt: this.income_amt,amt_string : this.income_amt_string,type:'inc',log_in_UI:false});

    }

    var expense = function(description,expenses,expenses_percent,id_counter,string){
        this.descr = description;
        this.exp_amt = expenses;
        this.exp_amt_string = string;
        this.exp_percent = expenses_percent;
        this.id = 'exp-'+id_counter;
    }

    expense.prototype.push_expense_Array = function(){
        data.allItems.expense_array.push({id:this.id,exp_percent: this.exp_percent,amt: this.exp_amt,amt_string : this.exp_amt_string,descr:this.descr,type: 'exp',log_in_UI:false});
    }

    var compute = function(){
        if (type == 'inc'){
            var income_tranc = new income(descriptn,transc_amt,inc_id_counter,transc_amt_string);
            inc_id_counter++;
            income_tranc.push_income_Array();
            console.log(data.allItems.income_array);
        }
        else if (type == 'exp'){
            var expense_percent = Math.round((transc_amt/data.total.gross_income)*100);
            var expense_tranc = new expense(descriptn,transc_amt,expense_percent,exp_id_counter,transc_amt_string);
            exp_id_counter++;
            expense_tranc.push_expense_Array();
            console.log(data.allItems.expense_array);
        }
        update_UI_data(type);
        data.total.gross_balance = data.total.gross_income-data.total.gross_expense;
    }


    var update_UI_data = function(type){

        if (type == 'inc'){
            data.total.gross_income = 0;
            for (var x= 0; x<data.allItems.income_array.length;x++){
                var amt = data.allItems.income_array[x].amt;
                data.total.gross_income+= amt;
            }
            // data.total.gross_income_string = inserting_commas(data.total.gross_income);
            update_exp_percent(data.allItems.expense_array,data.total.gross_income,data.total);
        }
        else if (type == 'exp'){
            data.total.gross_expense = 0;
            data.total.gross_exp_percent = 0;
            for (var x= 0; x<data.allItems.expense_array.length;x++){
                var amt = data.allItems.expense_array[x].amt;
                data.total.gross_expense+= amt;
            }
            // data.total.gross_expense_string = inserting_commas(data.total.gross_expense);
            data.total.gross_exp_percent = Math.round((data.total.gross_expense/data.total.gross_income)*100);
        }
        else{
            console.log('This loop is being entered')
            data.total.gross_income = 0;
            data.total.gross_expense = 0;
            data.total.gross_exp_percent = 0;
            for(var x =0; x<data.allItems.income_array.length;x++){
                var amt = data.allItems.income_array[x].amt;
                console.log(amt);
                data.total.gross_income+= amt;
            }
            for(var y=0; y<data.allItems.expense_array.length;y++){
                var amt = data.allItems.expense_array[y].amt;
                data.total.gross_expense+= amt;
            }
            data.total.gross_exp_percent = Math.round((data.total.gross_expense/data.total.gross_income)*100);
            // data.total.gross_expense_string = inserting_commas(data.total.gross_expense);
            // data.total.gross_income_string = inserting_commas(data.total.gross_income);
        }
        data.total.gross_balance = data.total.gross_income-data.total.gross_expense;
        // data.total.gross_balance_string = inserting_commas(data.total.gross_balance);
    }


    var update_exp_percent = function(arr,amount,total){
        if(total.gross_exp_percent == Infinity && total.gross_income!= 0){
            total.gross_exp_percent = 0;
            total.gross_exp_percent = Math.round((total.gross_expense/total.gross_income)*100);
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
        transc_amt_string = item.input;
        console.log(transc_amt_string);
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
           update_UI_data(type == 'delete');
           return {data : data}
        },
    }

    })();



var UIcontroller = (function(){
    var DOMstrs = {
        inp_type: '.add__type',
        add_descr: '.add__description',
        add_val: '.add__value',
        add_btn: '.add__btn',
        budget_value: '.budget__value',
        budget_income: '.budget__income--value',
        budget_expenses: '.budget__expenses--value',
        budget_expenses_percent : '.budget__expenses--percentage',
        income_container : '.income__list',
        expense_container : '.expenses__list',
        container : '.container',
        dateLabel : '.budget__title--month'
    }
    
    var inserting_commas = function(value,type){
        var type_str,value_string,int,num_split;
        console.log(value,typeof(value));
        if (value.length > 3 && value != 0)
        {
            int = value.substr(0,value.length-3)+','+value.substr(value.length -3 ,3);
        }
        else if(value == 0)
        {
            int = value;
        }
        else{
            int = value;
        }
        (type == 'inc') ? type_str = '+ ' : type_str = '- ';
        console.log(type_str+int)
        return type_str+int;        
    }


    var date_month = function(){

        var now,month_index,month,year,date;
        month_index = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        now  = new Date();
        month = month_index[now.getMonth()];
        year = now.getFullYear();
        date = now.getDate();
        document.querySelector(DOMstrs.dateLabel).textContent = (month+' '+year);
        console.log(date,month,year);

    }

    var html_for_list = function(obj){
        console.log("This is the object that was passed to the HTML parsing function");
        console.log(obj);
        var newhtml,element,atr;
        
        if (obj.type == 'inc'){
            html = '<div class="item clearfix" id="%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = DOMstrs.income_container;
        }
        else if (obj.type == 'exp'){
            html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%exp_percent% %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = DOMstrs.expense_container;
            html = html.replace('%exp_percent%',obj.exp_percent);
        }
        var formatted_amt_string = inserting_commas(JSON.stringify(Math.abs(obj.amt)),obj.type);
        newhtml = html.replace('%id%',obj.id);
        newhtml = newhtml.replace('%description%',obj.descr);
        newhtml = newhtml.replace('%value%',formatted_amt_string);

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
        (bobj.data.total.gross_balance >=0) ? document.querySelector(DOMstrs.budget_value).textContent = inserting_commas(JSON.stringify(bobj.data.total.gross_balance),'inc') : document.querySelector(DOMstrs.budget_value).textContent = inserting_commas(JSON.stringify(Math.abs(bobj.data.total.gross_balance)),'exp');
        document.querySelector(DOMstrs.budget_income).textContent = (inserting_commas(JSON.stringify(bobj.data.total.gross_income),'inc'));
        document.querySelector(DOMstrs.budget_expenses).textContent = (inserting_commas(JSON.stringify(bobj.data.total.gross_expense),'exp'));
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
        date_month();
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

    var charts = function(){
        var chart = new CanvasJS
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
        }, 
        change_type : function(){

            document.querySelector(DOMstrs.inp_type).classList.toggle('red-focus');
            document.querySelector(DOMstrs.add_descr).classList.toggle('red-focus');
            document.querySelector(DOMstrs.add_val).classList.toggle('red-focus');
            document.querySelector(DOMstrs.add_btn).classList.toggle('red');

        }
    }
})();


var mainController = (function(budgetCtrl,UICtrl){
    var x = 0

    var setup_eventlistener = function(){
        document.querySelector('.add__btn').addEventListener('click',CtrlAddFunction);

        document.querySelector('.container').addEventListener('click',CtrlDelFunction);

        document.addEventListener('keypress',function (key_event){
            
            if(key_event.keycode === 13 || key_event.which === 13){
                CtrlAddFunction();
            }
    
        });

        document.querySelector('.add__type').addEventListener('change',UICtrl.change_type);
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