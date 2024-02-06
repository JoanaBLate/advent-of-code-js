"use strict"

// solving the puzzle takes (my computer) 0.067s

const input = Deno.readTextFileSync("input.txt").trim()

const MONKEYS = [ ]

var MULTIPLE = 1


function main() {

    processInput()
   
    for (let n = 1; n <= 10000; n++) { playRound() }
    
    console.log("the answer is", findMonkeyBusiness())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const groups = input.split("\n\n")
    
    for (const group of groups) { 
    
        const lines = group.trim().split("\n")
        
        lines.shift() // Monkey x:
        
        const items = lines.shift().replace("Starting items:", "").trim().split(", ")
        
        const worries = items.map(function (x) { return parseInt(x) })
        
        const operation = lines.shift().trim().replace("Operation: new = ", "")
        
        const operationFunc = new Function("old", "return " + operation)
        
        const divisor = parseInt(lines.shift().trim().split(" ").pop())
        
        const ifTrue = parseInt(lines.shift().trim().split(" ").pop())
        
        const ifFalse = parseInt(lines.shift().trim().split(" ").pop())
        
        const monkey = createMonkey(worries, operationFunc, divisor, ifTrue, ifFalse)
        
        MONKEYS.push(monkey) 
        
        MULTIPLE *= divisor       
    }
}

function createMonkey(worries, operationFunc, divisor, ifTrue, ifFalse) {

    return { "worries": worries, "operation": operationFunc, "divisor": divisor, 
             
             "ifTrue": ifTrue, "ifFalse": ifFalse, "inspections": 0 }
}

///////////////////////////////////////////////////////////

function playRound() {

    for (const monkey of MONKEYS) { playMonkey(monkey) }
}

function playMonkey(monkey) {

    while (monkey.worries.length != 0) {
    
        monkey.inspections += 1
        
        let worry = monkey.worries.shift()
            
        worry = monkey.operation(worry)
        
        worry = worry % MULTIPLE
        
        const index = (worry % monkey.divisor == 0) ? monkey.ifTrue : monkey.ifFalse
    
        MONKEYS[index].worries.push(worry)    
    }
}

///////////////////////////////////////////////////////////

function findMonkeyBusiness() {

    const inspections = [ ]
    
    for (const monkey of MONKEYS) { inspections.push(monkey.inspections) }

    inspections.sort(function (a, b) { return b - a })

    return inspections[0] * inspections[1]
}

main()

