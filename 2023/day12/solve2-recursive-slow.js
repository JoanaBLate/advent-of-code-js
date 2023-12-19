"use strict"

const DATA = [ ]

const memories = { }


function main() {

    processInput()

    let sum = 0    
    
    for (const data of DATA) { 
    
        enlargeData(data)
        
        sum += calc(data.string, data.blueprint)
    } 
    
    console.log("the answer is ", sum) 
}

function calc(string, blueprint) {

    // console.log(string, blueprint.join())

    const tokens = tokenize(string)
    
    const result = calcPermutations(tokens.join(" "), blueprint)
    
    return result
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")

    for (const line of lines) { 
    
        const parts = line.trim().split(" ")
        
        const string = parts.shift()
        
        const blueprint = [ ]
        
        for (const token of parts.shift().split(",")) { blueprint.push(parseInt(token)) }        
        
        DATA.push({ "string": string, "blueprint": blueprint })
    }
}

function enlargeData(data) {

   const s = data.string
   
   data.string = [s, s, s, s, s].join("?")
   
   const blueprint = data.blueprint.slice()
   
   for (let n = 0; n < 4; n++) { data.blueprint = data.blueprint.concat(blueprint) }
}

function tokenize(source) { // excludes dots ('.')

    const tokens = [ ]
    
    let token = ""
    
    for (const c of source) { 
    
        if (c != ".") { token += c; continue } // joins '#' with '?'
        
         if (token != "") { tokens.push(token); token = "" }
    }
    
    if (token != "") { tokens.push(token) }
    
    return tokens
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function calcPermutations(string, blueprint) {
    
    if (memories[string] == undefined) { memories[string] = { } }

    const memory = memories[string]
       
    const key = blueprint.join(",")
    
    if (memory[key] == undefined) { memory[key] = calcPermutationsCore(string, blueprint) }

    return memory[key]
}
    
function calcPermutationsCore(string, blueprint) {      
    
    const index = string.indexOf(" ")

    if (index == -1) { return calcPermutationsOfBlock(string, blueprint) }
    
    const head = string.substr(0, index)
    
    const body = string.substr(index + 1)
    
    let sum = 0
    
    for (let n = 0; n < blueprint.length + 1; n++) {
    
        const a = calcPermutations(head, blueprint.slice(0, n))
        
        if (a == 0) { continue }
        
        const b = calcPermutations(body, blueprint.slice(n))  
        
        sum += a * b
    }
        
    return sum
}

///////////////////////////////////////////////////////////

function calcPermutationsOfBlock(token, blueprint) {
    
    if (memories[token] == undefined) { memories[token] = { } }

    const memory = memories[token]
       
    const key = blueprint.join(",")
    
    if (memory[key] == undefined) { memory[key] = calcPermutationsOfBlockCore(token, blueprint) }

    return memory[key]
}

function calcPermutationsOfBlockCore(token, blueprint) {

    const sharps = countSharps(token)
    
    const jokers = token.length - sharps
    
    const expectedSharps = sumList(blueprint) 
    
    const minimumBlanks = Math.max(blueprint.length - 1, 0) // a blank is the separator between 2 sharp groups
    
    //
    
    if (sharps > expectedSharps) { return 0  }
        
    if (sharps + jokers < expectedSharps) { return 0 }
    
    if (jokers < minimumBlanks) { return 0 }
    
    if (token.length < expectedSharps + minimumBlanks) { return 0 }
    
    //    
    
    if (expectedSharps == sharps  &&  jokers == 0) { return 1 } // good    
    
    let total = 0
    
    for (let n = 0; n < token.length; n++) {
    
        if (token[n] != "?") { continue }

        total += calcPermutations(token.slice(0, n) + " " + token.slice(n + 1), blueprint)
        total += calcPermutations(token.slice(0, n) + "#" + token.slice(n + 1), blueprint)
        
        break
    }
    return total
}

///////////////////////////////////////////////////////////

function countSharps(token) { 
    
    let count = 0
    
    for (const c of token) { if (c == "#") { count += 1 } }

    return count
}

function sumList(list) {

    let sum = 0
    
    for (const n of list) { sum += n }
    
    return sum
}

main()


