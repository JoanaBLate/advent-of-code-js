"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]


function main() {

    processInput()
   
    let sum = 0
    
    for (const expression of DATA) { sum += evaluateExpression(expression) }
     
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()

    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(tokenizeExpression(line)) }
}

function tokenizeExpression(expression) {

    const rawTokens = expression.trim().split(" ")
    
    const tokens = [ ]

    while (rawTokens.length > 0) {
    
        let token = rawTokens.shift()
        
        if (token.length == 1) { tokens.push(token); continue }
        
        if ("()*+".includes(token[0])) { 
            
            tokens.push(token[0])
        
            rawTokens.unshift(token.substr(1))
        
            continue 
        }
        
        let number = ""
        
        while (token[0] >= "0"  &&  token[0] <= "9") { number += token[0]; token = token.substr(1) }
        
        tokens.push(number)
        
        if (token != "") { rawTokens.unshift(token) }
    }
    
    return tokens
}

///////////////////////////////////////////////////////////

function evaluateExpression(expression) {

    while (true) {
        
        const coords = findInnerSegment(expression)
        
        if (coords == null) { 
        
            const value = evaluatePlainExpression(expression) 
            
            return parseInt(value)    
        }
        
        const start = coords.start
        const end = coords.end
        
        const segment = expression.slice(start, end + 1)
        
        segment.shift() // (
        segment.pop()   // )
        
        const value = evaluatePlainExpression(segment)
        
        expression.splice(start, end - start + 1, value)
    }
}

function findInnerSegment(expression) {

    let start = 0
    
    for (let n = 0; n < expression.length; n++) {
    
        if (expression[n] == "(") { start = n; continue }
        
        if (expression[n] == ")") { return { "start": start, "end": n } }    
    }
    
    return null
}

function evaluatePlainExpression(expression) {
    
    while (expression.length > 1) { 
        
        const a = parseInt(expression.shift())
        
        const operator = expression.shift()
        
        const b = parseInt(expression.shift())
        
        const value = (operator == "+") ? (a + b) : (a * b)
        
        expression.unshift(value.toString())
    }
    
    return expression[0]
}

main()

