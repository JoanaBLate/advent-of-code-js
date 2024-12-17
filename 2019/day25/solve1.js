 "use strict"

// solving the puzzle takes (my computer) 0.060s

// THE CURRENT SOLUTION ONLY WORKS FOR THIS SPECIFIC input.txt FILE DATA!!! //

const SHALL_DISPLAY = false // you may change this boolean 

const DATA = [ ]

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

const EOL = 10

const inputs = [ ]

var outputMessage = ""

const commands = [ 

    // Hull Breach: doors [east,south,west]

    "east", // Holodeck: doors [west]
    
    "west", // Hull Breach: doors [east,south,west]
    
    "west", // Sick Bay: doors [east,south,west] items [kein bottle]
    
    "take klein bottle",
    
    "south", // Hot Chocolate Fountain: doors [north,east,west]
    
    "east", // Gift Wrapping Center: doors [south,west] items [monolith]
    
    "take monolith",
    
    "south", // Crew Quarters: doors [north,west] items [fuel cell]
    
    "take fuel cell",
    
    "west", // Corridor: doors [east,west] items [escape pod]

   // "don't take escape pod", //
    
    "west", // Warp Drive Maintenance: doors [east] items [astrolabe]
    
    "take astrolabe",
    
    "east", // Corridor: doors [east,west] items [escape pod]
    
    "east", // Crew Quarters: doors [north,west]
    
    "north", // Gift Wrapping Center: doors [south,west]
    
    "west", // Hot Chocolate Fountain: doors [north,east,west]
    
    "west", // Hallway: doors [east] items [molten lava]
    
   // "don't take molten lava", //
    
    "east", // Hot Chocolate Fountain: doors [north,east,west]
    
    "north", // Sick Bay: doors [east,south,west]
    
    "west", // Storage: doors [north,east,west]
    
    "north", // Engineering: doors [south] items [tambourine]
    
    "take tambourine",
    
    "south", // Storage: doors [north,east,west]
    
    "west", // Navigation: doors [east,west] items [dark matter] == Please supply fifty stars
    
    "take dark matter",
    
    "west", // Security Checkpoint: doors [north, east] 
    
    "inv",
    
    "drop fuel cell",
    
    "drop klein bottle",
    
    "north"
]

///////////////////////////////////////////////////////////

function main() {
  
    processInput()

    while (DATA.length < 6000) { DATA.push(0) } // giving extra space
                    
    runProgram()
   
    if (SHALL_DISPLAY) { console.log(outputMessage) }
    
    const index = outputMessage.indexOf("get in by typing ")
    
    const answer = parseInt(outputMessage.substr(index).replace("get in by typing " , ""))
    
    console.log("the answer is", answer)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()

    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////

function outputThis(value) {

    outputMessage += String.fromCharCode(value)
    
    if (! outputMessage.endsWith("Command?\n")) { return }
    
    const msg = outputMessage.trim()
    
    outputMessage = ""
    
    if (SHALL_DISPLAY ) { console.log(msg) }
    
    const command = commands.shift()
    
    if (command != undefined) { pushToInputs(command); return }
}

function pushToInputs(source) {
    
    if (SHALL_DISPLAY ) { console.log("\n>>>", source.toUpperCase(), "\n") }

    for (const c of source) { inputs.push(c.charCodeAt(0)) }
    
    inputs.push(EOL)
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
        
        if (opcode == "04") { outputThis(valueA); continue }
            
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

main()

