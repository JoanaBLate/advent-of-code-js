"use strict"

// solving the puzzle takes (my computer) 0.032s

const input = Deno.readTextFileSync("input.txt").trim()

const WORKFLOWS = { }

var TOTAL = 0


function main() {

    processInput()
    
    walk("in", createRange())
        
    console.log("the answer is", TOTAL)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.split("\n\n")

    const wfLines =  parts.shift().split("\n")

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

function parseCondition(source) {

    const operator = source[1]
    
    if (operator != "<"  &&  operator != ">") { return createCondition("", "", 0, source) }
    
    const varname = source[0]
    
    const operand = parseInt(source.substr(2))
    
    const destiny = source.split(":").pop()
    
    return createCondition(varname, operator, operand, destiny)    
}

function createCondition(varname, operator, operand, destiny) {

    return { "varname": varname, "operator": operator, "operand": operand, "destiny": destiny, "range": createRange() }
}

///////////////////////////////////////////////////////////

function createRange() {

    return { "x": createSubrange(), "m": createSubrange(), "a": createSubrange(), "s": createSubrange() }
}

function createSubrange() {

    return { "low": 1, "high": 4000 }
}

function cloneRange(source) {

    const range = createRange()

    range.x.low = source.x.low
    range.m.low = source.m.low
    range.a.low = source.a.low
    range.s.low = source.s.low

    range.x.high = source.x.high
    range.m.high = source.m.high
    range.a.high = source.a.high
    range.s.high = source.s.high
    
    return range
}

///////////////////////////////////////////////////////////

function walk(wfName, range) {

    const conditions = WORKFLOWS[wfName]
    
    for (const condition of conditions) { 
    
        processCondition(range, condition) 
    
        range = condition.range    
    }
}

function processCondition(baseRange, condition) {

    condition.range = cloneRange(baseRange)
    
    const range = condition.range
    const operand = condition.operand
    const operator = condition.operator
    
    const newRange = cloneRange(range)
        
    if (condition.varname == "x") { updateSubRanges(operator, operand, range.x, newRange.x) }
    if (condition.varname == "m") { updateSubRanges(operator, operand, range.m, newRange.m) }
    if (condition.varname == "a") { updateSubRanges(operator, operand, range.a, newRange.a) }
    if (condition.varname == "s") { updateSubRanges(operator, operand, range.s, newRange.s) }
    
    if (condition.destiny == "R") { return }
    
    if (condition.destiny == "A") { TOTAL += calcArrangements(newRange); return }
    
    walk(condition.destiny, newRange)
}

function updateSubRanges(operator, operand, range, newRange) {

    if (operator == "<") {

        newRange.high = operand - 1

        range.low = operand
    }

    else if (operator == ">") {

        newRange.low = operand + 1

        range.high = operand
    }
}

function calcArrangements(range) {

    let result = 1
    
    result *= range.x.high - range.x.low + 1
    result *= range.m.high - range.m.low + 1
    result *= range.a.high - range.a.low + 1
    result *= range.s.high - range.s.low + 1
    
    return result
}

main()

