"use strict"

// solving the puzzle takes (my computer) 0.027s

const XMAS = [ ]

const WORKFLOWS = { }

const accepteds = [ ]


function main() {

    processInput()
    
    for (const xmas of XMAS) { processXmas(xmas) }
    
    let sum = 0
    
    for (const xmas of accepteds) { sum += xmas.x + xmas.m + xmas.a + xmas.s }
    
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const parts = input.split("\n\n")

    const xmasLines = parts.pop().split("\n")
    
    processXmasLines(xmasLines)
    
    const wfLines =  parts.pop().split("\n")
    
    processWorkflowLines(wfLines)
}
    
function processXmasLines(xmasLines) {

    for (const line of xmasLines) {
    
        const tokens = line.trim().replace("{", "").replace("}", "").split(",")
        
        const x = parseInt(tokens.shift().substr(2))
        const m = parseInt(tokens.shift().substr(2))
        const a = parseInt(tokens.shift().substr(2))
        const s = parseInt(tokens.shift().substr(2))
        
        XMAS.push({ "x": x, "m": m, "a": a, "s": s })
    }
}  

function processWorkflowLines(wfLines) {

    for (const _line of wfLines) {
    
        const line = _line.trim().replace("}", "")

        const index = _line.indexOf("{")
        
        const name = _line.substr(0, index)
            
        const conditions = [ ]
        
        const rawConditions = line.substr(index + 1).split(",")
        
        for (const rawCondition of rawConditions) { conditions.push(parseCondition(rawCondition)) }
        
        WORKFLOWS[name] = conditions
    }
}

function createCondition(varname, operator, operand, destiny) {

    return { "varname": varname, "operator": operator, "operand": operand, "destiny": destiny }
}

///////////////////////////////////////////////////////////

function parseCondition(source) {

    const operator = source[1]
    
    if (operator != "<"  &&  operator != ">") { return createCondition("", "", 0, source) }
    
    const varname = source[0]
    
    const operand = parseInt(source.substr(2))
    
    const destiny = source.split(":").pop()
    
    return createCondition(varname, operator, operand, destiny)    
}

///////////////////////////////////////////////////////////

function processXmas(xmas) {

   processWorkflow(xmas, "in")
}

function processWorkflow(xmas, name) {

    const conditions = WORKFLOWS[name]

    for (const condition of conditions) {
    
        if (processCondition(xmas, condition)) { return true }
    }
    return false
}

function processCondition(xmas, condition) {
    
     if (condition.operator == "<") {
     
        if (xmas[condition.varname] < condition.operand) { return go(xmas, condition.destiny) }
        
        return false     
     }
     
     if (condition.operator == ">") {
     
        if (xmas[condition.varname] > condition.operand) { return go(xmas, condition.destiny) }
        
        return false     
     }
     
     return go(xmas, condition.destiny)
}

function go(xmas, destiny) {
    
    if (destiny == "A") { accepteds.push(xmas); return true }
    
    if (destiny == "R") { return true }
        
    return processWorkflow(xmas, destiny)
}

main()

