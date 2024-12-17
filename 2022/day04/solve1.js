"use strict"

// solving the puzzle takes (my computer) 0.026s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    let count = 0
    
    for (const data of DATA) { if (oneContainsOther(data)) { count += 1 } }

    console.log("the answer is", count)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(",")
        
        const elfA = parts.shift().split("-").map(function (x) { return parseInt(x) })
        const elfB = parts.shift().split("-").map(function (x) { return parseInt(x) })
        
        DATA.push({ "aStart": elfA[0], "aEnd": elfA[1], "bStart": elfB[0], "bEnd": elfB[1] })
    }
}

function oneContainsOther(data) {

    if (aContainsB(data.aStart, data.aEnd, data.bStart, data.bEnd)) { return true }
    
    if (aContainsB(data.bStart, data.bEnd, data.aStart, data.aEnd)) { return true }

    return false
}

function aContainsB(aStart, aEnd, bStart, bEnd) {

    if (aStart > bStart) { return false }
    if (aEnd < bEnd) { return false }

    return true
}

main()

