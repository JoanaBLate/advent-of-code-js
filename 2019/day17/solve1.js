 "use strict"

// solving the puzzle takes (my computer) 0.045s

const DATA = [ ]

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

const SCAFFOLD = "#".charCodeAt(0)
const SPACE    = ".".charCodeAt(0)

const outputs = [ ]

var joystick = 0 // unused

const map = [ ]


function main() {
  
    processInput()
    
    runProgram()

    fillMap()
    
// show()
   console.log("the answer is", getCamerasCalibration())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function runProgram() { 

    let pointer = 0

    let relativeBase = 0   
  
    while (true) {

        const header = DATA[pointer].toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break } 
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = DATA[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
         if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = joystick; continue }
        
        if (opcode == "04") { outputs.push(valueA); continue }
            
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
///////////////////////////////////////////////////////////

function fillMap() {

    if (outputs.at(-1) == 10) { outputs.pop() }

    let row = -1
    
    while (outputs.length > 0) {
    
        row += 1

        const line = [ ]
        map.push(line)
        
        let col = -1
        
        while (outputs.length > 0) {
        
            col += 1
            let item = outputs.shift()
            
            if (item == undefined) { return }
            
            if (item == 10) { break }
            
            if (item != SPACE)  { item = SCAFFOLD } // ignoring droid
                    
            line.push(item)
        }
    }
}

function getCamerasCalibration() {

    let calibration = 0
    
    let row = -1
    
    for (const line of map) {
    
        row += 1
        let col = -1
        
        for (const __item of line) {
        
            col += 1

            if (isIntersection(row, col)) { calibration += row * col }
        }
    }
    return calibration
}

function isIntersection(row, col) {

    if (! isScaffold(row, col))   { return false }
    
    if (! isScaffold(row-1, col)) { return false }
    if (! isScaffold(row+1, col)) { return false }
    if (! isScaffold(row, col-1)) { return false }
    if (! isScaffold(row, col+1)) { return false }
    
    return true
}

function isScaffold(row, col) {

    const line = map[row]
    
    if (line == undefined) { return false }
    
    return line[col] == SCAFFOLD
}

///////////////////////////////////////////////////////////

function show() {

    let s = ""
    
    for (let n = 0; n < map[0].length; n++) { s += n % 10 }
    
    console.log(s + "\n")

    let row = -1
    for (const line of map) {
    
        row += 1
        
        let col = -1
        
        let s = ""
        
        for (const item of line) { 

            col += 1
            s += String.fromCharCode(item) 
        }

        console.log(s + "  " + row % 10)
    }
}

main()

