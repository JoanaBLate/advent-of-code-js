// solution for https://adventofcode.com/2025/day/11 part 2

"use strict"

const input = Deno.readTextFileSync("day11-input.txt").trim()

const DEVICES = { "out": [ ] } // { parentName: childrenNames }

const REVERSED = { } // { childName: parentNames }

const isDAC = { }

const isFFT = { }

const CACHE = { }


function main() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 

        const segments = rawLine.split(":")
        
        const parentName = segments.shift().trim()
        
        const childrenNames = segments.shift().trim().split(" ")
        
        DEVICES[parentName] = childrenNames
        
        for (const childName of childrenNames) {
        
            if (REVERSED[childName] == undefined) { REVERSED[childName] = [ ] }
            
            REVERSED[childName].push(parentName)       
        }
    }
    
    if (REVERSED["svr"] == undefined) { REVERSED["svr"] = [ ] }

    walkDAC("dac")
    isDAC["dac"] = false // or else will not reverse walk
    reverseWalkDAC("dac")

    walkFFT("fft")    
    isFFT["fft"] = false // or else will not reverse walk
    reverseWalkFFT("fft")
    
    console.log("the answer is ", walkSVR("svr"))
}  

function walkDAC(parentName) {

    if (isDAC[parentName]) { return } // avoiding infinite loop

    isDAC[parentName] = true
        
    for (const childName of DEVICES[parentName]) { walkDAC(childName) }
}  

function reverseWalkDAC(childName) {

    if (isDAC[childName]) { return } // avoiding infinite loop

    isDAC[childName] = true
    
    for (const parentName of REVERSED[childName]) { reverseWalkDAC(parentName) }
} 

function walkFFT(parentName) {

    if (isFFT[parentName]) { return } // avoiding infinite loop

    isFFT[parentName] = true
        
    for (const childName of DEVICES[parentName]) { walkFFT(childName) }
} 

function reverseWalkFFT(childName) {

    if (isFFT[childName]) { return } // avoiding infinite loop

    isFFT[childName] = true
    
    for (const parentName of REVERSED[childName]) { reverseWalkFFT(parentName) }
}

function walkSVR(parentName) {

    if (parentName == "out") { return 1 }
    
    if (CACHE[parentName] != undefined) { return CACHE[parentName] }
    
    let result = 0
    
    for (const childName of DEVICES[parentName]) { 
    
        if (! isDAC[childName]) { continue }
        if (! isFFT[childName]) { continue }
    
        result += walkSVR(childName) 
    }
    
    CACHE[parentName] = result
    
    return result
}  

console.time("execution time")
main()
console.timeEnd("execution time") // 4.2ms

