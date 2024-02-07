"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    const dataA = JSON.parse("[[2]]")
    const dataB = JSON.parse("[[6]]")
    
    let beforeA = 0
    let beforeB = 0
    
    for (const data of DATA) {
            
        const resultA = compare(data, dataA)
        
        if (resultA == +1) { beforeA += 1; beforeB += 1; continue }
                
        const resultB = compare(data, dataB)
        
        if (resultB == +1) { beforeB += 1 }
    }
    
    const indexA = beforeA + 1 // +1 for base one
    const indexB = beforeB + 2 // +1 for base one, +1 for dataA (not inserted before)
    
    console.log("the answer is", indexA * indexB)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const rawLines = input.split("\n")
        
    for (const rawLine of rawLines) {
        
        const line = rawLine.trim()
        
        if (line == "") { continue }
        
        DATA.push(JSON.parse(line))
    }
} 

/////////////////////////////////////////////////////////// 

function compare(a, b) {

    if (typeof(a) == "number"  &&  typeof(b) == "number") { 

        if (a < b) { return +1 }
        if (a > b) { return -1 }
        
        return 0
    }
    
    const arrayA = (typeof(a) == "number") ? [ a ] : a
    const arrayB = (typeof(b) == "number") ? [ b ] : b
    
    const lengthA = arrayA.length
    const lengthB = arrayB.length
    
    const length = Math.min(lengthA, lengthB)
    
    for (let n = 0; n < length; n++) {
    
        const result = compare(arrayA[n], arrayB[n])
        
        if (result == -1) { return result }
        if (result == +1) { return result }    
    }
    
    if (lengthA < lengthB) { return +1 }
    if (lengthA > lengthB) { return -1 }
   
    return 0
}

///////////////////////////////////////////////////////////

main()

