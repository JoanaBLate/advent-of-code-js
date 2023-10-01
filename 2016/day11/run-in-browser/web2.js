"use strict"

console.time("program")

// JS heap size: 3.6 MB !!!!!!


// new scheme:
// ELEVATOR G1 M1 G2 M2 G3 M3 G4 M4 G5 M5 G6 M6 G7 M7

const NODE = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

var triedNodes = null  // each bit (not byte) represents a node

var currentPool = new Uint32Array(250000)

var nextPool = new Uint32Array(250000)

var nextPoolIndex = -1

var numberOfSteps = -1

var foundSolution = false

const targetAsDecimal = decimalFromNode("333333333333333") // the final objective

const subIndexTable = { "0": 128, "1": 64, "2": 32, "3": 16, "4": 8, "5": 4, "6": 2, "7": 1 }


// STARTING ///////////////////////////////////////////////////////////////////

function main() {
    
    const allPossibleStates = Math.pow(4, 15) //  1,073,741,824 (just the levator means 4 combinations;
                                              //  the elevator and the generator A mean 16 combinations...)

    const triedNodesLength = allPossibleStates / 8 // 134,217,728
    
    triedNodes = new Uint8Array(triedNodesLength)

    //

    const zero = "001000100000000"
    
 // show(zero, "node zero")
 
    const decimal = decimalFromNode(zero)
 
    setDecimalAsUsed(decimal)
    
    nextPool[0] = decimal
    nextPoolIndex = 0
    
    //
    
    while (true) { 
    
        const temp = currentPool
        
        currentPool = nextPool
        const off = nextPoolIndex + 1
        
        nextPool = temp
        nextPoolIndex = -1
        
        numberOfSteps += 1
    
        if (off != 1) { console.log("starting to search a queue with", off, "nodes") }
        
        for (let i = 0; i < off; i++) {

            if (foundSolution) { break }

            const decimal = currentPool[i]
            
            search(decimal)
        }
        
        if (foundSolution) { break }
    }

    console.log("minimum number of steps is", numberOfSteps)
}

// SEARCHING /////////////////////////////////////////////////////////////////////////////

function search(decimal) {

    if (decimal == targetAsDecimal) { foundSolution = true; return }
    
    const node = nodeFromDecimal(decimal)

    const elevator = node[0]

    if (elevator != "0") { planToMove(node, -1) }
    if (elevator != "3") { planToMove(node, +1) }
}

function planToMove(node, deltaElevator) {

    const elevator = node[0]
    const nextElevator = (parseInt(elevator) + deltaElevator).toString()
    
    for (let a = 1; a < 15; a++) {
        
        if (node[a] != elevator) { continue }
        
        move(node, nextElevator, a) // taking one item

        for (let b = a + 1; b < 15; b++) {
        
            if (node[b] != elevator) { continue }
            
            move(node, nextElevator, a, b) // taking two items
        }
    }
}

function move(node, nextElevator, indexA, indexB) {

 // console.log("")
 // show(node, "moving to floor " + nextElevator + " taking " + indexA + (indexB == undefined ? "" : "  and  " + indexB))

    NODE[0] = nextElevator
    NODE[1] = node[1]
    NODE[2] = node[2]
    NODE[3] = node[3]
    NODE[4] = node[4]
    NODE[5] = node[5]
    NODE[6] = node[6]
    NODE[7] = node[7]
    NODE[8] = node[8]
    NODE[9] = node[9]
    NODE[10] = node[10]
    NODE[11] = node[11]
    NODE[12] = node[12]
    NODE[13] = node[13]
    NODE[14] = node[14]
    
    NODE[indexA] = nextElevator
    
    if (indexB != undefined) { NODE[indexB] = nextElevator }
    
    if (! schemeIsSafe()) { // checking correctness is much faster than checking already used
    
     // show(newNode, "new node  rejected: unsafe")    
        return 
    }
    
    const newNode = NODE.join("")
    
    const decimal = decimalFromNode(newNode, 4)

    if (decimalIsUsed(decimal)) { 
    
     // show(newNode, "new node  rejected: already searched")
        return 
    }
    
    setDecimalAsUsed(decimal)
    
 // show(newNode, "new node  APROVED")
    
    nextPoolIndex += 1
    nextPool[nextPoolIndex] = decimal
}

function schemeIsSafe() {

    if (NODE[2] != NODE[1]) { // microchipA not connected to generatorA
    
        if (NODE[2] == NODE[3]) { return false } // incompatible generator in the same floor
        if (NODE[2] == NODE[5]) { return false } 
        if (NODE[2] == NODE[7]) { return false }
        if (NODE[2] == NODE[9]) { return false }
        if (NODE[2] == NODE[11]) { return false }
        if (NODE[2] == NODE[13]) { return false }
    }
    
    if (NODE[4] != NODE[3]) { 
    
        if (NODE[4] == NODE[1]) { return false } 
        if (NODE[4] == NODE[5]) { return false } 
        if (NODE[4] == NODE[7]) { return false }
        if (NODE[4] == NODE[9]) { return false }
        if (NODE[4] == NODE[11]) { return false }
        if (NODE[4] == NODE[13]) { return false }
    }
    
    if (NODE[6] != NODE[5]) { 
    
        if (NODE[6] == NODE[1]) { return false } 
        if (NODE[6] == NODE[3]) { return false } 
        if (NODE[6] == NODE[7]) { return false }
        if (NODE[6] == NODE[9]) { return false }
        if (NODE[6] == NODE[11]) { return false }
        if (NODE[6] == NODE[13]) { return false }
    }
    
    if (NODE[8] != NODE[7]) { 
    
        if (NODE[8] == NODE[1]) { return false } 
        if (NODE[8] == NODE[3]) { return false } 
        if (NODE[8] == NODE[5]) { return false }
        if (NODE[8] == NODE[9]) { return false }
        if (NODE[8] == NODE[11]) { return false }
        if (NODE[8] == NODE[13]) { return false }
    }
    
    if (NODE[10] != NODE[9]) { 
        if (NODE[10] == NODE[1]) { return false } 
        if (NODE[10] == NODE[3]) { return false } 
        if (NODE[10] == NODE[5]) { return false }
        if (NODE[10] == NODE[7]) { return false }
        if (NODE[10] == NODE[11]) { return false }
        if (NODE[10] == NODE[13]) { return false }
    }
    
    if (NODE[12] != NODE[11]) { 
        if (NODE[12] == NODE[1]) { return false } 
        if (NODE[12] == NODE[3]) { return false } 
        if (NODE[12] == NODE[5]) { return false }
        if (NODE[12] == NODE[7]) { return false }
        if (NODE[12] == NODE[9]) { return false }
        if (NODE[12] == NODE[13]) { return false }
    }
    
    if (NODE[14] != NODE[13]) { 
        if (NODE[14] == NODE[1]) { return false } 
        if (NODE[14] == NODE[3]) { return false } 
        if (NODE[14] == NODE[5]) { return false }
        if (NODE[14] == NODE[7]) { return false }
        if (NODE[14] == NODE[9]) { return false }
        if (NODE[14] == NODE[11]) { return false }
    }
    
    return true
}

// HELPERS ////////////////////////////////////////////////////////////////////
 
function decimalFromNode(node) { // for 15 characters!

    const a = parseInt(node.substr(0, 7), 4)
    const b = parseInt(node.substr(7, 8), 4)
    
    return a * (256 * 256) + b
}

function nodeFromDecimal(decimal) { // for 15 characters!

    const block = 256 * 256

    const intA = Math.floor(decimal / block)
    const intB = decimal % block    
    
    const strA = intA.toString(4).padStart(7, "0")
    const strB = intB.toString(4).padStart(8, "0")
    
    return strA + strB
}

function setDecimalAsUsed(decimal) { // for Uint8Array

    const index = Math.floor(decimal / 8)

    const subIndex = decimal % 8
    
    triedNodes[index] += subIndexTable[subIndex]
}

function decimalIsUsed(decimal) { // for Uint8Array

    const index = Math.floor(decimal / 8)

    const subIndex = decimal % 8

    const expected = subIndexTable[subIndex]
    
    return (triedNodes[index]  &  expected) == expected
}

function show(node, label) {

    const s = node[0] + "  " +
              node.substr(1, 2) + " " +
              node.substr(3, 2) + " " +
              node.substr(5, 2) + " " +
              node.substr(7, 2) + " " +
              node.substr(9, 2) + " " +
              node.substr(11, 2) + " " +
              node.substr(13, 2)
              
      const index = decimalFromNode(node).toString().padStart(14)
      
      console.log(s, index, "  ", label)
}

main()

console.timeEnd("program")

