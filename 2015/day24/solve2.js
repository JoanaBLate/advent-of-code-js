"use strict"

// solving the puzzle takes (my computer) 0.777s

// for this puzzle, a combination like [ 1, 3, 2 ] is the same as [ 1, 2, 3 ]

// if we don't abort wrong and/or redundant branches as soon as possible,
// we will end up with a HUGE number of combinations


const WEIGHTS = [ ]

var TARGET = 0 // target weight for each compartment

var lowestNumberOfPackages = 99999 

var lowestQuantumEntanglement = 0 // 0 means no combination was found yet


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
        
    let total = 0
    
    for (const rawLine of rawLines) { 
    
        const weight = parseInt(rawLine)
        
        if (WEIGHTS.includes(weight)) { console.log("Aborting due to input error: found duplicated package"); Deno.exit() }
        
        WEIGHTS.push(weight)
        
        total += weight        
    }
    
    TARGET = total / 4
    
    if (TARGET != Math.floor(TARGET)) { console.log("Aborting due to input error: total weight is not multiple of 4"); Deno.exit() }
    
    lowestNumberOfPackages = Math.floor(WEIGHTS.length / 4) + 1
    
    WEIGHTS.sort(function(a, b) { return b - a }) // decrescent order helps eliminating wrong branches sooner
       
    for (const weight of WEIGHTS) {

        const node = createNode(weight)
        
        search(node) 
    }
    
    console.log("smallest quantum entanglement is", lowestQuantumEntanglement)
}

function createNode(w) {
    
    return { "weights": [ w ], "lowestWeight": w, "totalWeight": w, "quantumE": 0 }
}

function cloneNode(source) {

    return { 
        
        "weights": source.weights.slice(),
     
        "lowestWeight": source.lowestWeight, 
     
        "totalWeight": source.totalWeight, 
     
        "quantumE": source.quantumE
    }
}

function calcQuantumE(node) {

    let qe = 1
    
    for (const weight of node.weights) { qe *= weight }
    
    return qe
}

function search(node) {  // recursive function (calls itself)
                         // fills the passenger compartment using few packages as possible
    
    if (node.weights.length > lowestNumberOfPackages) { return }

    if (node.totalWeight > TARGET) { return }

    if (node.totalWeight == TARGET) { search2(node); return } 
        
    
    for (const weight of WEIGHTS) {
    
        if (weight >= node.lowestWeight) { continue } // accepts [3,2,1]; avoids [3,1,2]
    
        const newNode = cloneNode(node) // necessary: the new branch must have exclusive data
                
        newNode.weights.push(weight)

        newNode.lowestWeight = weight

        newNode.totalWeight += weight
        
        search(newNode)
    }
}

function search2(frontNode) {

    frontNode.quantumE = calcQuantumE(frontNode)
    
    // checking whether side compartments are balanced

    const remainings = [ ] // weights not used in the passenger compartment 
    
    for (const weight of WEIGHTS) {
    
        if (frontNode.weights.includes(weight)) { continue }
        
        remainings.push(weight) 
    }
    
    if (fastCheckingForSide(remainings.slice())) { updateSolution(frontNode); return }
    
    // starting complete and slow checking on one side compartment
    for (const weight of remainings) {

        const sideNode = createNode(weight)
        
        search3(frontNode, remainings, sideNode)
    }
}    

function search3(frontNode, remainings, sideNode) { // recursive function (calls itself)
                                                    // checks if side compartments are balanced 
                                                    // if one side is Ok, the other is too
                                  
    if (frontNode.weights.length > lowestNumberOfPackages) { return }
    
    if (lowestQuantumEntanglement != 0) {
    
        if (frontNode.quantumE > lowestQuantumEntanglement) { return }
    }
    
    if (sideNode.totalWeight > TARGET) { return }

    if (sideNode.totalWeight == TARGET) { updateSolution(frontNode); return }


    for (const weight of remainings) {
    
        if (weight >= sideNode.lowestWeight) { continue } // accepts [3,2,1]; avoids [3,1,2]
    
        const newSideNode = cloneNode(sideNode) // necessary: the new branch must have exclusive data
                
        newSideNode.weights.push(weight)

        newSideNode.lowestWeight = weight

        newSideNode.totalWeight += weight
        
        search3(frontNode, remainings, newSideNode)
    }
}

function updateSolution(node) {

    if (lowestQuantumEntanglement == 0) { // first candidate
    
        lowestQuantumEntanglement = node.quantumE
        
        lowestNumberOfPackages = node.weights.length
        
        return
    }
    
    if (node.weights.length > lowestNumberOfPackages) { return } // too long
    
    if (node.weights.length < lowestNumberOfPackages) {
    
        lowestNumberOfPackages = node.weights.length
    
        lowestQuantumEntanglement = node.quantumE
    
        return
    }

    // same number of packages
    
    if (node.quantumE < lowestQuantumEntanglement) { lowestQuantumEntanglement = node.quantumE }
}

function fastCheckingForSide(list) {

    let total = 3 * TARGET // all remaining packages are in list
    
    const temp = [ ]
    
    while (total > TARGET) { 
    
        const weight = list.pop()
        
        total -= weight

        temp.push(weight)
    }    
    
    const missing = TARGET - total

    if (missing == 0) { return true }
    
    for (const weight of temp) { if (weight == missing) { return true } }
    
    return false
}

main()

