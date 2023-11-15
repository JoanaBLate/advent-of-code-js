"use strict"

// solving the puzzle takes (my computer) 0.060s

const ARQUIVE = [ ] 

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

var startXSlope = 0

var lengthSlope = 0


function main() {
  
    processInput()
    
    while (ARQUIVE.length < 1000) { ARQUIVE.push(0) }

 // show()    

    const pilot = getSegmentReading(300) // 300 is an arbitrary value
    
    startXSlope = pilot.startX / 300
    
    lengthSlope = (pilot.endX - pilot.startX + 1) / 300
    
    const deltaXPerHundredY = 100 * startXSlope
    
    const minSegmentLength = 100 + deltaXPerHundredY
    
    let y = Math.floor(minSegmentLength / lengthSlope)
    
    //
    
    let solution = 0

    while (true) {
        
        let topSegment = getSegmentGuessing(y)

        let bottomSegment = getSegmentGuessing(y + 100 - 1)
                
        const minTopSegmentEndX = bottomSegment.startX + 100 - 1 
        
        const success = topSegment.endX >= minTopSegmentEndX
        
        if (success) {
        
            const candidate = 10000 * bottomSegment.startX + y
            
            if (solution == 0) { solution = candidate; y -= 1; continue }
            
            if (candidate < solution) { solution = candidate; y -= 1 } else { break } // cannot get better        
        }
        
        else { // failure

            if (solution != 0) { break } // cannot get better

            y += 1        
        }
    }
    
    console.log("the answer is", solution)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { ARQUIVE.push(parseInt(token)) }
}

function createSegment(y, startX, endX) {

    return { "y": y, "startX": startX, "endX": endX }
}    

function getSegmentReading(y) {
    
    let startX = 0
    let endX = 0
    
    let segementStarted = false
    
    let x = -1
    
    while(true) {
    
        x += 1
        
        if (runProgram(x, y) == 1) {
        
            if (! segementStarted) { segementStarted = true; startX = x }                
        }
        else {
        
            if (segementStarted) { endX = x - 1; break }
        }
    }
        
    return createSegment(y, startX, endX)
}

function getSegmentGuessing(y) {

    let startX = Math.round(y * startXSlope)
    
    while (runProgram(startX, y) == 0) { startX += 1 }
    
    while (startX > 0  &&  runProgram(startX - 1, y) == 1) { startX -= 1 }
    
    let endX = startX + Math.round(y * lengthSlope)
    
    while (runProgram(endX, y) == 0) { endX -= 1 }    
    
    while (runProgram(endX + 1, y) == 1) { endX += 1 }
    
    return createSegment(y, startX, endX)
}

///////////////////////////////////////////////////////////

function runProgram(x, y) {

    return runProgramCore(ARQUIVE.slice(), [x, y])
}

function runProgramCore(DATA, inputs) {

    let pointer = 0

    let relativeBase = 0

    let output = 0
  
    while (true) {
    
        const rawHeader = DATA[pointer]
        
        const header = rawHeader.toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break }
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = DATA[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
        if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = inputs.shift(); continue }
        
        if (opcode == "04") { output = valueA; continue }
            
        if (opcode == "09") { relativeBase += valueA; continue }
            
        const paramB = DATA[pointer]    
        pointer += 1
        const valueB = getValue(modeB, paramB, relativeBase)
        
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0) { pointer = valueB }
            continue 
        }
    
        if (opcode == "06") { // jump-if-false
        
            if (valueA == 0) { pointer = valueB }
            continue 
        }
    
        const paramC = DATA[pointer]    
        pointer += 1
        const addressC = getAddress(modeC, paramC, relativeBase)
        
        if (opcode == "01") { DATA[addressC] = valueA + valueB; continue }
        
        if (opcode == "02") { DATA[addressC] = valueA * valueB; continue }
        
        if (opcode == "07") { DATA[addressC] = valueA < valueB; continue } 
        
        if (opcode == "08") { DATA[addressC] = valueA == valueB; continue } 
    }
    
    return output


    function getAddress(mode, param, relativeBase) {
        
        if (mode == POSITION_MODE) { return param }
        
        return relativeBase + param // RELATIVE_MODE
    }

    function getValue(mode, param, relativeBase) {
        
        if (mode == IMMEDIATE_MODE) { return param }
        
        const address = getAddress(mode, param, relativeBase)
        
        if (address > DATA.length - 1) { return 0 }
      
        return DATA[address]
    }
}

///////////////////////////////////////////////////////////

function show() {

   for (let y = 0; y < 60; y++) {

        let s = ""
        for (let x = 0; x < 120; x++) { s += (runProgram(x, y) == 1) ? "#" : "." }

        console.log(s)
    }
}

main()

