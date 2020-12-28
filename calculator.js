//function to return an array of elements at the end of the dom tree
//aks leaf nodes
function getLeafNodes(master) {
    var results = [];
    //get the child nodes of the root
    var children = master.childNodes;

    //for each child
    for (var i = 0; i < children.length; i++) {
        //if the child is an element
        if (children[i].nodeType == 1) {
            //check for children
            var childLeafs = getLeafNodes(children[i]);
            if (childLeafs.length) {
                // if we had child leafs, then concat them onto our current results
                results = results.concat(childLeafs);
            } else {
                // if we didn't have child leafs, then this must be a leaf
                results.push(children[i]);
            }
        }
    }
    // if we didn't find any leaves at this level, then this must be a leaf
    if (!results.length) {
        results.push(master);
    }
    return results;
}

//event to trigger on display changes
const input = new Event('input', {
    bubbles: true,
    cancelable: true,
})


//calculator object
let calculator = {
    expression: "",
    result : "", 
    addSymbol(symbol){
        this.expression = this.expression + symbol
        return this.expression
    },
    back(){
        this.expression=this.expression.slice(0,-1)
    },    
    evaluate(){
        function checkOperator(operator){
            let operations = ["+","-","*","/"]
            if (operations.includes(operator)){ 
                return true
            } else {
                return false
            }
        }
        
        function chunkExpression(expression){
            let splitExpression = []
            let term = ""
            for(let i of expression){
                if (checkOperator(i)){
                    if(i === "-" && term === ""){
                        //if the negative is at the start of the term, don't split
                        term = "-"
                    }else{
                        //split on operators
                        splitExpression.push(term)
                        term = ""
                        splitExpression.push(i)
                    }
                } else{
                    term = term + i
                }
            }
        
            splitExpression.push(term)
        
            console.log(splitExpression)
            return splitExpression
        }
        
        function operate(op1, oper, op2){
            let value = null;
            switch(oper){
                case "+":
                    value = Number(op1) + Number(op2)
                    break;
        
                case "-":
                    value = op1 - op2
                    break;
        
                case "*":
                    value = op1 * op2
                    break;
        
                case "/":
                    if (op2 == 0){
                        value = undefined
                    }else{
                    value = op1 / op2
                    }
                    break;
            
            }
            return value
        }

        const chunk = chunkExpression(this.expression)

        //go through each chuck and perferm operations on it
        let total = chunk[0]
        for(let i = 1; i< chunk.length; i=i+2){
            if(chunk[i+1] === ""){
                //if at any point our chunked epxression has an empty string as the operand, 
                //we know that the user has entered too many operators
                return "ERROR"
            }

            total = operate(total, chunk[i], chunk[i+1])
        }

        return total
        
    },
    setResult(){
        this.result = this.evaluate()
    }
}

const display = document.getElementById("expression-display")
const keypad = getLeafNodes(document.getElementById("calculator"))

//create on click listeners for all buttons on the calculator that have a value attribute
for (let key of keypad){
    //events to add values to calculator expression
    if(key.dataset.value){
        key.addEventListener("click", (e) =>{
            console.log("Button Pressed: " + key.dataset.value)
            display.value = calculator.addSymbol(key.dataset.value)
        })
    }
    //event to trigger display update
    key.addEventListener("click", ()=>{
    display.dispatchEvent(input)
    })
}


const resultsDisplay = document.getElementById("results")
display.addEventListener("input",()=>{
    //anytime an input is given, calulate the expresison and put results into html
    display.value = calculator.expression
    resultsDisplay.innerText= calculator.evaluate()

})


const enter = document.getElementById("enter")
enter.addEventListener("click", ()=>{
    calculator.setResult()
    const previousResult = document.getElementById("previous-result")
    previousResult.innerText = calculator.result
})

const clear = document.getElementById("clear")
clear.addEventListener('click', ()=>{
    calculator.expression = ""
    display.dispatchEvent(input)
})


const undo = document.getElementById("undo")
undo.addEventListener("click", ()=>{
    calculator.back()
    display.dispatchEvent(input)
})