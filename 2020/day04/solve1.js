"use strict"

// solving the puzzle takes (my computer) 0.030s

const objects = [ ]


function main() {

    processInput()
    
    let count = 0
    
    for (const obj of objects) { if (objectIsOk(obj)) { count += 1 } }
     
    console.log("the answer is", count)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const segments = input.split("\n\n")
    
    for (const segment of segments) { parseSegment(segment) }
}

function parseSegment(segment) {

    const obj = { }
    
    objects.push(obj)

    const parts = segment.split("\n")
    
    for (const part of parts) {
    
        const tokens = part.split(" ")
        
        for (const token of tokens) {
        
            const subTokens = token.split(":")
            
            obj[subTokens.shift()] = subTokens.shift()        
        }    
    }
}

function objectIsOk(obj) {

    if (obj["byr"] == undefined) { return false }
    if (obj["iyr"] == undefined) { return false }
    if (obj["eyr"] == undefined) { return false }
    if (obj["hgt"] == undefined) { return false }
    if (obj["hcl"] == undefined) { return false }
    if (obj["ecl"] == undefined) { return false }
    if (obj["pid"] == undefined) { return false }
    
    return true
}

main()

