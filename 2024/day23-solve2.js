// solution for https://adventofcode.com/2024/day/23 part 2

// for each group of computers, we keep removing then *most*
// incompatible till the group has only compatible computers;
// for each removed incompatible computer, other computers
// automatically improve their compatibility

"use strict"

const input = Deno.readTextFileSync("day23-input.txt").trim()

const allConnections = { }

var bestLanParty = [ ]


function main() {

    processInput() 
    
    search()

    console.log("the answer is", bestLanParty.sort().join(","))
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

function search() {

    const allComputers = Object.keys(allConnections)
    
    for (const computer of allComputers) {
    
        const computers = allConnections[computer]
        
        searchThis(computer, computers) 
    }
}

function searchThis(master, computers) { // master is granted to be compatible with each other

    const unfriendship = { }
    
    for (const computer of computers) { unfriendship[computer] = [ ] }
    
    const off = computers.length
    
    for (let a = 0; a < off - 1; a++) {
    
        const computerA = computers[a]
    
        const connectionsA = allConnections[computerA]
        
        for (let b = a + 1; b < off; b++) {
        
            const computerB = computers[b] 
            
            if (connectionsA.includes(computerB)) { continue }
            
            unfriendship[computerA].push(computerB) 
            unfriendship[computerB].push(computerA) 
        }
    }    
    
    removeIncompatibles(unfriendship) // only friends remain
    
    const friendsOnly = Object.keys(unfriendship)
        
    friendsOnly.push(master)
    
    if (friendsOnly.length > bestLanParty.length) { bestLanParty = friendsOnly }   
}

///////////////////////////////////////////////////////////////////////////////

function removeIncompatibles(unfriendship) {

    while (removeTheMostIncompatible(unfriendship)) { }
}

function removeTheMostIncompatible(unfriendship) {

    let worstCount = 0
    let worstComputer = ""

    for (const computer of Object.keys(unfriendship)) { 
    
        const notFriends = unfriendship[computer]

        if (notFriends.length > worstCount) { worstCount = notFriends.length; worstComputer = computer }
    }
    
    if (worstComputer == "") { return false }
    
    delete unfriendship[worstComputer]
    
    for (const list of Object.values(unfriendship)) {
    
        const index = list.indexOf(worstComputer)
        
        if (index != -1) { list.splice(index, 1) }    
    }
    
    return true        
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 19ms

