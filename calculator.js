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
    expression: [], //used to store the expression in the form [term, operator, term, operator]
    term: "", //used to store the last term aka the term the user is working on.
    result : "",
    getExpressionString(){
      return this.expression.join("") + this.term
    },
    addArg(arg){
        //check if the new thing to be added is an operator
        if(arg === "+" || arg === "-" || arg === "*" || arg === "/"){
            if(this.term===""){
                //if previous operator was the same tell user
                if (this.expression[this.expression.length-1] === arg){
                    alert("No double operators")
                }

                //if it is an operator and term is "", this means that the previous term must be either empty
                //or an operator. in any case we don't want double operators so replace it.
                this.expression.pop()
                this.expression.push(arg)
            }else{
                //otherwise add the current term to the expression array and add the next operator
                this.expression.push(this.term)
                this.term = ""
                this.expression.push(arg)
            }
        } else{
            this.term =this.term + arg
        }
        console.log("Expression: " + this.getExpressionString())

        return this.getExpressionString()
    },
    back(){
        if (this.expression.length === 0 && this.term.length === 0){
            return ""
        } else if (this.term == ""){
            //if the term is empty,
            //remove the last operator and pop the previous term into the current term
            console.log("Popping arg: " + String(this.expression.slice(-1)))
            this.expression.pop()
            this.term = this.expression.pop()
        } else{
            console.log("Popping arg: " + String(this.term.slice(-1)))
            this.term = this.term.slice(0,-1)
        }
        // this.evaluate()
        console.log("Term: " + this.term)
        return this.getExpressionString()
    },    
    evaluate(){
        //if no term is supplied prompt the user 
        if (this.term ==""){
            return "\xa0" //this is nbsp in html. just here so the div doesn't collapse. i know its not ecapsulate but eh
        } else if(this.expression.length == 0){
            //if the expression is empty, but the term is full, return the tern
            this.result = this.term
            return this.term
        }else{
            //else actually do the non pemdas math
            console.log("Evaluating: " + String(this.getExpressionString()))
            let arr = this.expression.slice()
            arr.push(this.term)

            let total = arr[0]
            for (let i = 1; i<arr.length; i=i+2){
                let operator = arr[i]
                let operand = arr[i+1]
        
                total = operate(total, operator, operand)
                    
            }
            console.log(this.getExpressionString())
            console.log(`${this.getExpressionString()} = ${total}`)
            this.result = Math.round((total + Number.EPSILON)* 10000)/10000

            
        }
        
        return this.result
    },
    
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

const display = document.getElementById("expression-display")
const calculatorContainer = document.getElementById("calculator")
//get all buttons of the calculator
const keypad = getLeafNodes(calculatorContainer)
//create on click listeners for all buttons on the calculator that have a value attribute
for (let key of keypad){
    if(key.dataset.value){
        key.addEventListener("click", (e) =>{
            console.log("Button Pressed: " + key.dataset.value)
            display.value = calculator.addArg(key.dataset.value)
            // display.dispatchEvent(input)
        })
    }
    key.addEventListener("click", ()=>{
    display.dispatchEvent(input)
    })


}


const resultsDisplay = document.getElementById("results")
display.addEventListener("input",()=>{
    // calculator.evaluate()
    resultsDisplay.innerText=calculator.evaluate()

})


const enter = document.getElementById("enter")
const previousResult = document.getElementById("previous-result")
enter.addEventListener("click", ()=>{
    calculator.evaluate() //kinda useless now
    previousResult.innerText = calculator.result
})

// const clear = document.getElementById("clear"){

// }

const undo = document.getElementById("undo")
undo.addEventListener("click", ()=>{
    display.value = calculator.back()
    display.dispatchEvent(input)
})