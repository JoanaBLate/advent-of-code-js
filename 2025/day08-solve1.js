// solution for https://adventofcode.com/2025/day/8 part 1

"use strict"

const input = Deno.readTextFileSync("day08-input.txt").trim()

const allBoxes = [ ] 

const allDistances = { }

const sortedDistances = [ ]

const allCircuits = [ ]

function main() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { processInputLine(rawLine.trim()) }
    
    fillAllDistances()
    
    sortedDistances.sort(function (a,b) { return a - b })
    
    for (let n = 0; n < 1000; n++) { createCircuitOrMerge() }    
    
    const lengths = [ ]
    
    for (const circuit of allCircuits) { lengths.push(circuit.length) }
    
    lengths.sort(function (a,b) { return b - a })

    console.log("the answer is", lengths[0] * lengths[1] * lengths[2])
}

function processInputLine(line) {

    const tokens = line.split(",")
    
    const x = parseInt(tokens.shift())
    const y = parseInt(tokens.shift())
    const z = parseInt(tokens.shift())
    
    const box = { "x": x, "y": y, "z": z }
    
    allBoxes.push(box)
}

function fillAllDistances() {

    const len = allBoxes.length
    
    for (let indexA = 0; indexA < len; indexA++) {
    
        for (let indexB = indexA + 1; indexB < len; indexB++) {
                
            const boxA = allBoxes[indexA]
            const boxB = allBoxes[indexB]

            const distance = euclidian(boxA.x, boxA.y, boxA.z, boxB.x, boxB.y, boxB.z) 
            
            allDistances["" + distance] = [ indexA, indexB ]
            
            sortedDistances.push(distance)
        }
    }
}

function euclidian(x1, y1, z1, x2, y2, z2) {

    const deltaX = x2 - x1
    const deltaY = y2 - y1
    const deltaZ = z2 - z1

    const xx = deltaX * deltaX
    const yy = deltaY * deltaY
    const zz = deltaZ * deltaZ
    
    return Math.sqrt(xx + yy + zz)
}

function createCircuitOrMerge() {

    const distance = sortedDistances.shift()
    
    const newCircuit = allDistances["" + distance]
    
    const boxAIndex = newCircuit[0]
    const boxBIndex = newCircuit[1]
    
    const indexes = [ ]
    
    for (let index = 0; index < allCircuits.length; index++) {
    
        const circuit = allCircuits[index]
        
        const hasA = circuit.includes(boxAIndex)
        const hasB = circuit.includes(boxBIndex)
        
        if (hasA || hasB) { indexes.push(index) }
    }
    
    if (indexes.length == 0) { allCircuits.push(newCircuit); return }
    
    const masterCircuit = allCircuits[indexes.shift()]
    
    if (! masterCircuit.includes(boxAIndex)) { masterCircuit.push(boxAIndex) }
    if (! masterCircuit.includes(boxBIndex)) { masterCircuit.push(boxBIndex) }
    
    while (indexes.length != 0) { // runs backwards
    
        const index = indexes.pop()
        
        const deadCircuit = allCircuits[index]
        
        for (const boxIndex of deadCircuit) {
    
            if (! masterCircuit.includes(boxIndex)) { masterCircuit.push(boxIndex) } 
        }
    
        allCircuits.splice(index, 1)    
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 890ms

