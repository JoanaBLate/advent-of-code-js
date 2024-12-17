"use strict"

// solving the puzzle takes (my computer) 0.030s

const groups = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const group of groups) { sum += countAnyoneYes(group) }
     
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const segments = input.split("\n\n")
    
    for (const segment of segments) { 
    
        const lines = segment.trim().split("\n")
        
        const group = [ ]
        
        for (const line of lines) { group.push(line.trim()) }
        
        groups.push(group)
    }
}

function countAnyoneYes(group) {

    const offset = "a".charCodeAt(0)

    const questions = new Uint8Array(26)
    
    for (const form of group) {
    
        for (const letter of form) { 
        
            const index = letter.charCodeAt(0) - offset
            
            questions[index] = 1
        }        
    }
    
    let count = 0
    
    for (let n = 0; n < 26; n++) { count += questions[n] }

    return count
}

main()

