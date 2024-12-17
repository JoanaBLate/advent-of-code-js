"use strict"

const DATA = [ ]

var olddata = null

var data = null


function main() {

    processInput()

    let sum = 0    
    
    let index = -1
    
    for (const data of DATA) { 
    
        index += 1
        
        enlargeData(data)
        
        sum += calc(data.string, data.guide)
    } 
    
    console.log("the answer is ", sum) 
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")

    for (const line of lines) { 
    
        const parts = line.trim().split(" ")
        
        const string = parts.shift()
        
        const guide = [ ]
        
        for (const token of parts.shift().split(",")) { guide.push(parseInt(token)) }        
        
        DATA.push({ "string": string, "guide": guide })
    }
}

function enlargeData(data) {

   const s = data.string
   
   data.string = [s, s, s, s, s].join("?")
   
   const guide = data.guide.slice()
   
   for (let n = 0; n < 4; n++) { data.guide = data.guide.concat(guide) }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function calc(map, guide) {

    const scheme = guideToString(guide)
    
    const size = scheme.length
    
    olddata = { "0": 1 }
    
    data = { }
 
    for (const char of map) {
    
        for (const key of Object.keys(olddata)) {
        
            const index = parseInt(key)
            
            const nextIndex = index + 1
            
            const symbol = scheme[index]
            const nextSymbol = scheme[nextIndex]
            
            const previous = olddata[index]
            
            if (char == ".") {
                
                if (symbol == ".") { increaseData(index, previous) }
            
                if (nextSymbol == ".") { increaseData(nextIndex, previous) }
                
                continue
            }
            
            if (char == "#") {
            
                if (nextSymbol == "#") { increaseData(nextIndex, previous) }
                
                continue
            }
            
            if (char == "?") {
            
                if (symbol == ".") { increaseData(index, previous) }
                
                if (nextIndex < size) { increaseData(nextIndex, previous) }
                
                continue
            }
        }
        olddata = data
        data = {}
    }
    
    const a = olddata[size - 1]  ||  0
    const b = olddata[size - 2]  ||  0
    
    return a + b
}

///////////////////////////////////////////////////////////

function guideToString(guide) { 
    
    let sharps = [ ]
    
    for (const len of guide) { sharps.push("#".repeat(len)) }

    return "." + (sharps.join(".")) + "."
}

function increaseData(index, value) {

    if (data[index] == undefined) { data[index] = 0 }
                
    data[index] += value
}

main()


