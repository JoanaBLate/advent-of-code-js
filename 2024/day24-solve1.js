// solution for https://adventofcode.com/2024/day/24 part 1

"use strict"

const input = Deno.readTextFileSync("day24-input.txt").trim()

const allWires = { }

var gatesToRun = [ ]


function main() {

    processInput()     
        
    runCircuit()
      
    console.log("the answer is", calcResult())
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
    
    const sections = input.split("\n\n")
    
    const rawGates = sections.pop().trim().split("\n") // doing gates first, some wires will be overriden
    
    for (const rawGate of rawGates) {
    
        const parts = rawGate.trim().split(" ")
        
        const wire1 = parts.shift()
        const kind  = parts.shift()
        const wire2 = parts.shift()
        parts.shift() // ->
        const wire3 = parts.shift()
        
        gatesToRun.push(createGateObj(kind, wire1, wire2, wire3))
        
        allWires[wire1] = -1
        allWires[wire2] = -1
        allWires[wire3] = -1
    }
    
    const rawWires = sections.pop().trim().split("\n")
    
    for (const rawWire of rawWires) {
    
        const parts = rawWire.split(": ")
        
        const wire = parts.shift()
        
        const value = parseInt(parts.shift())
        
        allWires[wire] = value
    }
}

function createGateObj(kind, wire1, wire2, wire3) {

    return { 
        "kind": kind, 
        "wire1": wire1, 
        "wire2": wire2, 
        "wire3": wire3
    }
}   

///////////////////////////////////////////////////////////////////////////////

function runCircuit() {

    while (gatesToRun.length != 0) {
    
        gatesToRun = runCircuitOnce()
    }
}

function runCircuitOnce() {

    const remainingGatesToRun = [ ]
    
    for (const gate of gatesToRun) {
        
        const value1 = allWires[gate.wire1]
        
        if (value1 == -1) { remainingGatesToRun.push(gate); continue }
        
        const value2 = allWires[gate.wire2]
        
        if (value2 == -1) { remainingGatesToRun.push(gate); continue }
        
        const sum = value1 + value2
        
        let output = 0
        
        if (gate.kind == "AND") {  if (sum == 2) { output = 1 } }
        
        else if (gate.kind == "OR") { if (sum != 0) { output = 1 } }
        
        else if (gate.kind == "XOR") { if (sum == 1) { output = 1 } }
        
        allWires[gate.wire3] = output
    }
    
    return remainingGatesToRun
}

///////////////////////////////////////////////////////////////////////////////

function calcResult() {

    let binary = ""
    
    let reversedPos = -1
    
    while (true) {
    
        reversedPos += 1
        
        const prefix = (reversedPos < 10) ? "0" : ""
        
        const wire = "z" + prefix + reversedPos
        
        const value = allWires[wire]
     
        if (value == undefined) { break }
        
        binary = value + binary
    }

    return parseInt(binary, 2)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

