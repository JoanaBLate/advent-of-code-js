// solution for https://adventofcode.com/2024/day/24 part 2

// *NOT* EXPECTING TWO GATES TO HAVE THE SAME OUTPUT WIRE 

// this puzzle is about a circuit for binary sum (x + y = z);
// for each set of three bits (x,y,z) there is a small standard
// circuit of wires and gates that is repeated many times (45 in my input)

// this small *standard* circuit always starts by connecting a xy bit pair to
// a pair of bottom gates (one gate is AND, the other gate is XOR); any error
// only happens after this part

// this solution compares each part of the small circuits, searching for the 
// misplaced output wires that breaks the *pattern*, level by level


"use strict"

const input = Deno.readTextFileSync("day24-input.txt").trim()

var xySlotsLength = 0

const gatesByOutput = { } 

const gatesByInput = { }

const misplacedOutputWires = [ ] 


function main() {

    processInput()
    
    let gates = processBottomGates() 
    
    while (true) {
    
        searchMisplacedWires(gates)
        
        if (misplacedOutputWires.length == 8) { break }
    
        gates = processNextLevelGates(gates)
    }
    
    console.log("the answer is", misplacedOutputWires.sort().join(","))
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
    
    const sections = input.split("\n\n")    
    
    xySlotsLength = sections.shift().trim().split("\n").length

    // despising xyWires
    
    const rawGates = sections.shift().trim().split("\n")
    
    for (const rawGate of rawGates) {
        
        const parts = rawGate.trim().split(" ")
        
        const wire1 = parts.shift()
        const kind  = parts.shift()
        const wire2 = parts.shift()
        parts.shift() // ->
        const wire3 = parts.shift()
        
        processThisInput(kind, wire1, wire2, wire3)
    }
}

function processThisInput(kind, wire1, wire2, wire3) {
        
    const gate = createGateObj(kind, wire1, wire2, wire3)
    
    gatesByOutput[wire3] = gate
    
    if (gatesByInput[wire1] == undefined) { gatesByInput[wire1] = [ ] }
    if (gatesByInput[wire2] == undefined) { gatesByInput[wire2] = [ ] }
            
    gatesByInput[wire1].push(gate)
    gatesByInput[wire2].push(gate)
}    

function createGateObj(kind, wire1, wire2, wire3) {

    return { "kind": kind, "wire1": wire1, "wire2": wire2, "wire3": wire3, "paste": "", "forward": "" }
} 

///////////////////////////////////////////////////////////////////////////////  

function processBottomGates() { 

    const bottomGates = new Array(xySlotsLength)
    
    for (const gate of Object.values(gatesByOutput)) {

        if (gate.wire1[0] != "x"  &&  gate.wire1[0] != "y") { continue }
                
        const xySlot = gate.wire1.substr(1)
        
        const index = (2 * parseInt(xySlot)) + (gate.kind == "AND" ? 0 : 1)
        
        bottomGates[index] = gate
        
        gate.paste = "xy"
        
        gate.forward = findGateForward(gate.wire3)
     }
     
     return bottomGates
} 

///////////////////////////////////////////////////////////////////////////////

function processNextLevelGates(parentList) {

    const childrenList = [ ]

    for (const parent of parentList) {
    
        const wire = parent.wire3
        
        if (wire[0] == "z") { continue }
        
        if (misplacedOutputWires.includes(wire)) { continue }
    
        const nextGates = gatesByInput[wire]
        
        for (const nextGate of nextGates) {
        
            nextGate.paste = parent.paste + " " + parent.kind
        
            nextGate.forward = findGateForward(nextGate.wire3)
            
            childrenList.push(nextGate)
        }    
    }
    
    return childrenList
}

///////////////////////////////////////////////////////////////////////////////  

function findGateForward(wire) { 
        
    if (wire[0] == "z") { return "FINAL" }
    
    const list = [ ]
            
    for (const destinyGate of gatesByInput[wire]) { list.push(destinyGate.kind) }
    
    return list.sort().join("-")
}

///////////////////////////////////////////////////////////////////////////////

function searchMisplacedWires(gates) {

    const patterns = { }

    for (const gate of gates) {
    
        const pattern = [ gate.paste, gate.kind, gate.forward ].join(" . ")
        
        if (isSpecialCase(gate, pattern)) { continue }
        
        if (patterns[pattern] == undefined) { patterns[pattern] = [ ] }
        
        patterns[pattern].push(gate.wire3)    
    }

    for (const list of Object.values(patterns)) {
    
        if (list.length > 8) { continue }
    
        for (const wire of list) { misplacedOutputWires.push(wire) }
    }
}

function isSpecialCase(gate, pattern) {
        
    if (pattern == "xy . XOR . FINAL")    { return isFirstXYSlot(gate) }
    if (pattern == "xy . AND . AND-XOR")  { return isFirstXYSlot(gate) }

    if (pattern == "xy AND . OR . FINAL") { return isLastZSlot(gate) }
    
    return false
}

function isFirstXYSlot(gate) {

    return gate.wire1.substr(1) == "00"
}
    
function isLastZSlot(gate) { 
    
    if (gate.wire3[0] != "z") { return false }
    
    const zSlot = parseInt(gate.wire3.substr(1))

    return zSlot == xySlotsLength / 2
}

///////////////////////////////////////////////////////////////////////////////

function show(gates) {
    
    console.log("")
    for (const gate of gates) { showGate(gate) }
}

function showGate(gate) {
        
    console.log({ "slot": gate.wire1.substr(1), "kind": gate.kind, "paste": gate.paste, "forward": gate.forward })    
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

