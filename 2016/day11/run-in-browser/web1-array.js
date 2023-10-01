"use strict"

console.time("program")

var triedNodes = [ ] // each item is a boolean which index corresponds to a node

const NODE = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

var currentQueue = [ ]

var nextQueue = [ ]

var numberOfQueueResets = 0

var foundSolution = false

// STARTING ///////////////////////////////////////////////////////////////////

function main() {

    triedNodes = new Array(4194304) // 4 ^11 - covers all possible (good and bad) combinations

    triedNodes.fill(false)

    const zero = "00100010000"
    
 // show(zero, "node zero")
    
    const decimal = parseInt(zero, 4)
    
    triedNodes[decimal] = true
    
    currentQueue.push(zero)
    
    while (true) { 
    
        console.log("starting to search a queue with", currentQueue.length, "nodes")
        
        for (const node of currentQueue) {

            if (foundSolution) { break }

            search(node)
        }
        
        if (foundSolution) { break }
        
        currentQueue = nextQueue 
        nextQueue = [ ]
        numberOfQueueResets += 1
    }

    console.log("minimum number of steps is", numberOfQueueResets)
}

function show(node, label) {

    const s = node[0] + "  " +
              node.substr(1, 2) + " " +
              node.substr(3, 2) + " " +
              node.substr(5, 2) + " " +
              node.substr(7, 2) + " " +
              node.substr(9, 2)
              
      const index = parseInt(node, 4).toString().padStart(12)
      
      console.log(s, index, "  ", label)
}

// SEARCHING /////////////////////////////////////////////////////////////////////////////

function search(node) {

    if (node == "33333333333") { foundSolution = true; return }

    const elevator = node[0]

    if (elevator != "0") { planToMove(node, -1) }
    if (elevator != "3") { planToMove(node, +1) }
}

function planToMove(node, deltaElevator) {

    const elevator = node[0]
    const nextElevator = (parseInt(elevator) + deltaElevator).toString()
    
    for (let a = 1; a < 11; a++) {
        
        if (node[a] != elevator) { continue }
        
        move(node, nextElevator, a) // taking one item

        for (let b = a + 1; b < 11; b++) {
        
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
    
    NODE[indexA] = nextElevator
    
    if (indexB != undefined) { NODE[indexB] = nextElevator }
    
    const newNode = NODE.join("")
    
    const decimal = parseInt(newNode, 4)

    if (triedNodes[decimal]) { 
    
     // show(newNode, "new node  rejected: already searched")
        return 
    }
    
    triedNodes[decimal] = true
    
    if (! schemIsSafe()) { 
    
     // show(newNode, "new node  rejected: unsafe")    
        return 
    }
    
 // show(newNode, "new node  APROVED")
    
    nextQueue.push(newNode)
}

function schemIsSafe() {

    if (NODE[2] != NODE[1]) { // microchipA not connected to generatorA
    
        if (NODE[2] == NODE[3]) { return false } // incompatible generator in the same floor
        if (NODE[2] == NODE[5]) { return false } 
        if (NODE[2] == NODE[7]) { return false }
        if (NODE[2] == NODE[9]) { return false }
    }
    
    if (NODE[4] != NODE[3]) { 
    
        if (NODE[4] == NODE[1]) { return false } 
        if (NODE[4] == NODE[5]) { return false } 
        if (NODE[4] == NODE[7]) { return false }
        if (NODE[4] == NODE[9]) { return false }
    }
    
    if (NODE[6] != NODE[5]) { 
    
        if (NODE[6] == NODE[1]) { return false } 
        if (NODE[6] == NODE[3]) { return false } 
        if (NODE[6] == NODE[7]) { return false }
        if (NODE[6] == NODE[9]) { return false }
    }
    
    if (NODE[8] != NODE[7]) { 
    
        if (NODE[8] == NODE[1]) { return false } 
        if (NODE[8] == NODE[3]) { return false } 
        if (NODE[8] == NODE[5]) { return false }
        if (NODE[8] == NODE[9]) { return false }
    }
    
    if (NODE[10] != NODE[9]) { 
    
        if (NODE[10] == NODE[1]) { return false } 
        if (NODE[10] == NODE[3]) { return false } 
        if (NODE[10] == NODE[5]) { return false }
        if (NODE[10] == NODE[7]) { return false }
    }
    
    return true
}

main()

console.timeEnd("program")

