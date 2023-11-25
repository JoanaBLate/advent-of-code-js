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

///////////////////////////////////////////////////////////

function objectIsOk(obj) {

    if (! yearIsOk(obj, "byr", 1920, 2002)) { return false }
    
    if (! yearIsOk(obj, "iyr", 2010, 2020)) { return false }
    
    if (! yearIsOk(obj, "eyr", 2020, 2030)) { return false }

    if (! hgtIsOk(obj)) { return false }
    if (! hclIsOk(obj)) { return false }
    if (! eclIsOk(obj)) { return false }
    if (! pidIsOk(obj)) { return false }

    return true
}

function yearIsOk(obj, code, min, max) {

    const data = obj[code]
    
    if (data == undefined) { return false }

    if (data.length != 4) { return false }
    
    const number = parseInt(data)
    
    if (isNaN(number)) { return false }
    
    if (number.toString() != data) { return false }

    if (number < min) { return false }
    if (number > max) { return false }

    return true
}

function hgtIsOk(obj) {

    const data = obj["hgt"]
    
    if (data == undefined) { return false }
    
    //
    
    const tail = data.substr(data.length - 2)
    
    let min = 0 
    let max = 0 
    
    if (tail == "cm") {
        
        min = 150; max = 193    
    }
    else if (tail == "in") {
        
        min = 59; max = 76 
    }
    else {
    
        return false
    }
    
    //
    
    const head = data.replace(tail, "")
    
    const number = parseInt(head)
    
    if (isNaN(number)) { return false }
    
    if (number.toString() != head) { return false }

    if (number < min) { return false }
    if (number > max) { return false }
    
    return true    
}

function hclIsOk(obj) {

    const data = obj["hcl"]
    
    if (data == undefined) { return false }
    
    if (data[0] != "#") { return false }
    
    const color = data.substr(1)
    
    if (color.length != 6) { return false }
    
    for (const char of color) {

        if (char >= "0"  &&  char <= "9") { continue }
        if (char >= "a"  &&  char <= "f") { continue }    
    
        return false
    }
    
    return true
}    

function eclIsOk(obj) {

    const data = obj["ecl"]

    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(data)
}

function pidIsOk(obj) {

    const data = obj["pid"]
    
    if (data == undefined) { return false }
    
    if (data.length != 9) { return false }
    
    for (const char of data) {

        if (char >= "0"  &&  char <= "9") { continue }
    
        return false
    }
    
    return true
}

main()

