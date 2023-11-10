 "use strict"

// solving the puzzle takes (my computer) 0.060s

// THE CURRENT SOLUTION ONLY WORKS FOR THIS SPECIFIC input.txt FILE DATA!!! //


/*

    this puzzle is easier to solve than it appears at first sight, 
    IF YOU GO THE HANDMADE SOLUTION WAY:
    
    GOLDEN HINTS:
    
    1. you must visualize the output (function show)
    
    2. the solution is just a sequence of steps: TURN and WALK TO THE END 
       (never stop in the middle of the line)
       
    3. don't try something like "A handles left side, B handles center and
       C handles right side", each routine would be too big
       
    4. each (sub) routine has around 4 steps, and not all steps are left (or right)
    
    5. you don't need to think which side to turn (because the path is linear, if 
       you walk to the end): YOU JUST NEED TO CORRECTLY GUESS HOW MANY MOVEMENTS EACH (SUB)
       ROUTINE HAS
       
    6. create the routine A as you walk, then create routine B; then try to continue using both
       as long as possible; then you create the routine C
       
    7. if routines A, B, and C are correct, just keep walking using each time the routine
       that works fine
*/

const DATA = [ ]

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

const NORTH = "^".charCodeAt(0)
const SOUTH = "v".charCodeAt(0)
const WEST =  "<".charCodeAt(0)
const EAST =  ">".charCodeAt(0)

const SCAFFOLD = "#".charCodeAt(0)
const SPACE    = ".".charCodeAt(0)

const EOL = 10

const inputs = [ ]
const outputs = [ ]

const map = [ ]

// hand made solution for the current specific input:

const routineMain = "A,B,A,C,B,C,A,B,A,C"
const routineA = "R,6,L,10,R,8,R,8"
const routineB = "R,12,L,8,L,10" 
const routineC = "R,12,L,10,R,6,L,10"


function main() {
  
    processInput()
        
    DATA[0] = 2
        
    pushToInputs(routineMain)
    pushToInputs(routineA)
    pushToInputs(routineB)
    pushToInputs(routineC)
    pushToInputs("n")
    
    runProgram()
   
    const answer = outputs.pop()
    
  //  fillMap(); show()

    console.log("the answer is", answer)
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
        
         if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = inputs.shift(); continue }
        
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
    
    pointer = 0
    relativeBase = 0
    return // unnecessary
    
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
            const item = outputs.shift()
            
            if (item == undefined) { return }
            
            if (item == 10) { break }
            
            line.push(item)
        }
    }
}

function pushToInputs(source) {
    
    for (const c of source) { inputs.push(c.charCodeAt(0)) }
    
    inputs.push(EOL)
}

///////////////////////////////////////////////////////////

function show() {

    let s = ""
    
    for (let n = 0; n < map[0].length; n++) { s += n % 10 }
    
    console.log(s + "\n")

    let row = -1
    for (const line of map) {
    
        const isMapLine = [SPACE, SCAFFOLD, NORTH, SOUTH, WEST, EAST].includes(line[0])
        
        row = isMapLine ? row + 1 : -1
        
        let col = -1
        
        let s = ""
        
        for (const item of line) { 

            col += 1
            
            s += String.fromCharCode(item) 
        }

        const border = isMapLine ? ("  " + row % 10) : ""

        console.log(s + border)
    }
}

main()

