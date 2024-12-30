// solution for https://adventofcode.com/2024/day/23 part 1

"use strict"

const input = Deno.readTextFileSync("day23-input.txt").trim()

const allConnections = { }

const allTargets = { }

const alreadyDone = { }

var targetCount = 0


function main() {

    processInput()     
        
    fillAllTargets()
      
    console.log("the answer is", targetCount)
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const pair = rawLine.trim().split("-")
        
        const a = pair.shift()
        const b = pair.shift()
        
        if (allConnections[a] == undefined) { allConnections[a] = [ ] }
        if (allConnections[b] == undefined) { allConnections[b] = [ ] }
        
        allConnections[a].push(b)
        allConnections[b].push(a)
    }
}

///////////////////////////////////////////////////////////////////////////////

function  fillAllTargets() {

    const allComputers = Object.keys(allConnections)
    
    for (const computer of allComputers) { fillTargetsFor(computer) }
}

function fillTargetsFor(computer) {

    alreadyDone[computer] = true
    
    const friends = allConnections[computer]
    
    const off = friends.length
    
    for (let a = 0; a < off - 1; a++) {

        for (let b = a + 1; b < off; b++) {

            const friendA = friends[a]
            const friendB = friends[b]
            
            if (computer[0] != "t"  &&  friendA[0] != "t"   &&  friendB[0] != "t") { continue }
            
            if (alreadyDone[friendA]) { continue }
            if (alreadyDone[friendB]) { continue }    
            
            if (! allConnections[friendA].includes(friendB)) { continue }
            
            const id = [ computer, friendA, friendB ].sort().join("~")
            
            if (allTargets[id]) { continue }
            
            allTargets[id] = true
            
            targetCount += 1
        }
    }
}     

console.time("execution time")
main()
console.timeEnd("execution time") // 9ms

