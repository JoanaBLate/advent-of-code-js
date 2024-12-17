"use strict"

// solving the puzzle takes (my computer) 0.780s


// We must optimize the data structure and the algorithms or else the computer will
// take too much time to finish and/or crash before finish.

// Each node (possible state) will be represented by a string of 11 digits:
// ELEVATOR G1 M1 G2 M2 G3 M3 G4 M4 G5 M5

// The first digit stores the floor of the elevator,
// the second digit stores the floor of the generator G1, and so on.
// For example, considering floors 0 to 3 instead of 1 to 4, because 
// smaller numbers mean more efficiency: "23122013301"

// We must memorize the already tried nodes in order to not repeat them again.
// We can create a list where we store the the used nodes. But as this list grows,
// comparing each of its items against some node (searching for a match) becomes
// very slow. Also, it takes memory.

// Because the node string is like a base 4 number, we can convert it to a decimal
// number, and use its decimal number as an index for an array of booleans: 
//
//   parseInt("23122013301", 4) --> 2990577
//   if list[2990557] == true, node "23122013301" was already used 


var triedNodes = [ ] // each item is a boolean which index corresponds to a node

// using this fixed global array is more efficient
// than creating and destroying local arrays
const NODE = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

var currentQueue = [ ]

var nextQueue = [ ]

var numberOfQueueResets = 0

var foundSolution = false

// STARTING ///////////////////////////////////////////////////////////////////

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    if (rawLines.length != 4) { 
    
        console.log("Aborting due to input error: number of floors is not 4")
        Deno.exit() 
    }

    triedNodes = new Array(4194304) // 4 ^11 - covers all possible (good and bad) combinations

    triedNodes.fill(false)

    const zero = createNodeZero(rawLines)

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

// PARSING THE INPUT //////////////////////////////////////////////////////////

function createNodeZero(rawLines) {
        
    const names = [ ]

    const nodeAsArray = "0xxxxxxxxxx".split("")
    
    for (let floor = 0; floor < 4; floor++) {
           
        const components = parseRawLine(rawLines[floor]) 
        
        for (const component of components) {
        
            const tokens = component.split("-")
            const name = tokens.shift()
            const kind = tokens.shift()
        
            if (! names.includes(name)) { names.push(name) }
            
            const index = 1 + 2 * names.indexOf(name) + (kind == "microchip" ? 1 : 0) // first '1' for elevator
        
            nodeAsArray[index] = floor
        }        
    }
    
    const node = nodeAsArray.join("")
    
    if (! node.includes("x")) { return node }
    
    console.log("Aborting due to input (or parser) error on generators and microchips")
    Deno.exit() 
}
    
function parseRawLine(rawLine) {
    
    const tokens = rawLine.trim().toLowerCase().split(" ")
    
    const data = [ ]
        
    for (let i = 1; i < tokens.length; i ++) {
    
        const current = tokens[i]
        const previous = tokens[i - 1]
        
        if (current == "generator" || current == "generator," || current == "generator.") { 
            
            data.push(previous + "-generator")
        }
        
        else if (current == "microchip" || current == "microchip," || current == "microchip.") { 
            
            data.push(previous.replace("-compatible", "-microchip"))
        }
    }
    
    return data
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
    
    if (! schemeIsSafe()) { 
    
     // show(newNode, "new node  rejected: unsafe")    
        return 
    }
    
 // show(newNode, "new node  APROVED")
    
    nextQueue.push(newNode)
}

function schemeIsSafe() {

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

