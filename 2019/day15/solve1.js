 "use strict"

// solving the puzzle takes (my computer) 0.040s

const DATA = [ ]

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

const map = { }

const states = { }

const WALL = 0
const PATH = 1
const OXYGEN = 2

const NORTH = 1
const SOUTH = 2
const WEST = 3
const EAST = 4


function main() {
  
    processInput()
    
    const coord = createCoord(0, 0)
    
    states[coord] = createProgramState()
    
    console.log("the answer is", walk())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function createProgramState() {

    return { "data": DATA.slice(), "pointer": 0, "relativeBase": 0, "output": 1 }
}

function cloneProgramState(src) {

    return { "data": src.data.slice(), "pointer": src.pointer, "relativeBase": src.relativeBase, "output": src.output }
}

function runProgram(state, joystick) {

    const data = state.data.slice()

    let pointer = state.pointer

    let relativeBase = state.relativeBase
    
  
    while (true) {

        const header = data[pointer].toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
    //  if (opcode == "99") { break } // not used in this puzzle
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = data[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
        if (opcode == "03") { data[getAddress(modeA, paramA, relativeBase)] = joystick; continue }
        
        if (opcode == "04") { 
        
            state.data = data // not needed (reference value)
        
            state.pointer = pointer

            state.relativeBase = relativeBase
            
            state.output = valueA
            
            return state
        }
            
        if (opcode == "09") { relativeBase += valueA; continue }
            
        const paramB = data[pointer]    
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
    
        const paramC = data[pointer]    
        pointer += 1
        const addressC = getAddress(modeC, paramC, relativeBase)
        
        if (opcode == "01") { data[addressC] = valueA + valueB; continue }
        
        if (opcode == "02") { data[addressC] = valueA * valueB; continue }
        
        if (opcode == "07") { data[addressC] = valueA < valueB; continue } 
        
        if (opcode == "08") { data[addressC] = valueA == valueB; continue } 
    }
    
    function getAddress(mode, param, relativeBase) {

        if (mode == POSITION_MODE) { return param }
        
        return relativeBase + param // RELATIVE_MODE
    }

    function getValue(mode, param, relativeBase) {
        
        if (mode == IMMEDIATE_MODE) { return param }
        
        const address = getAddress(mode, param, relativeBase)
        
        if (address > data.length - 1) { return 0 }
        
        return data[address]
    }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function walk() {

    let futureCoords = [ createCoord(0, 0) ]
    
    let distance = 0

    while (true) {        

        const currentCoords = futureCoords
        
        futureCoords = [ ]
        
        for (const coord of currentCoords) {
            
            const state = states[coord]
            
            if (state.output == OXYGEN) { map[coord] = "O"; return distance }
            
            if (state.output == WALL) { map[coord] = "#"; continue }
            
            map[coord] = "."
            
            const row = parseInt(coord)
            const col = parseInt(coord.replace(row + "~", ""))
            
            grabNeighbor(NORTH, row-1, col, state, futureCoords)
            grabNeighbor(SOUTH, row+1, col, state, futureCoords)
            grabNeighbor(WEST,  row, col-1, state, futureCoords)
            grabNeighbor(EAST,  row, col+1, state, futureCoords)
        }

     // if (futureCoords.length == 0) { return }
        
        distance += 1
    }
}
      
function grabNeighbor(direction, row, col, _state, futureCoords) {
      
    const coord = createCoord(row, col)
    
    if (map[coord] != undefined) { return }
    
    map[coord] = "r" // reserved
    
    futureCoords.push(coord)
    
    const state = cloneProgramState(_state)
    
    states[coord] = runProgram(state, direction)
}

function createCoord(row, col) {

    return row + "~" + col
}

main()

