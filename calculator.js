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

const input = new Event('input', {
    bubbles: true,
    cancelable: true,
})

const calculator = document.getElementById("calculator")
const display = document.getElementById("expression-display")

//get all buttons of the calculator
const keypad = getLeafNodes(calculator)

//create on click listeners for all button on the calculator that have a value attribute
for (let key of keypad){
    if(key.dataset.value){
        key.addEventListener("click", (e) =>{
            console.log(key.dataset.value)

            //change teh value of the display
            display.value = display.value + key.dataset.value
            
            //trigger event to indicate the value has changed
            display.dispatchEvent(input)
        })
    }
}

//when the display changes 
display.addEventListener("input", (e) =>{
    console.log(e)
})