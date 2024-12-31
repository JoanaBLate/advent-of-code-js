// solution for https://adventofcode.com/2024/day/23 part 2

"use strict"

const input = Deno.readTextFileSync("day23-input.txt").trim()

const allConnections = { }

const allNetworks = [ ]

var greatestNetworkLength = 0

var bestNetwork = [ ]


function main() {

    processInput() 
    
    fillAllNetworks()
    
    search()

    console.log("the answer is", bestNetwork.sort().join(","))
}

///////////////////////////////////////////////////////////////////////////////

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

function fillAllNetworks() {

    const allComputers = Object.keys(allConnections)
    
    for (const computer of allComputers) {
    
        const network = allConnections[computer].slice()
        
        network.unshift(computer)
        
        allNetworks.push(network)
        
        if (network.length > greatestNetworkLength) { greatestNetworkLength = network.length } 
    }
}

///////////////////////////////////////////////////////////////////////////////

function search() {
    
    for (const network of allNetworks) { // searches without removing any member
    
        if (! allMembersAreFriends(network)) { continue }
    
        if (network.length > bestNetwork.length) { bestNetwork = network }
        
        if (bestNetwork.length == greatestNetworkLength) { return }
    }

    while (true) {
    
        searchRemovingTheWorstMember()
        
        if (bestNetwork.length != 0) { return }
    }
}

function searchRemovingTheWorstMember() {
    
    greatestNetworkLength -= 1
    
    for (const network of allNetworks) {
    
        removeTheWorstMember(network)
    
        if (! allMembersAreFriends(network)) { continue }
    
        if (network.length > bestNetwork.length) { bestNetwork = network }
        
        if (bestNetwork.length == greatestNetworkLength) { return }
    }
}

///////////////////////////////////////////////////////////////////////////////

function removeTheWorstMember(network) { // expects network having at least one bad member

    const unfriendship = [ ]
    
    for (let n = 0; n < network.length; n++) { unfriendship.push(0) }
    
    
    let worstIndex = 0
    let worstValue = -1

    const off = network.length
    
    for (let a = 0; a < off - 1; a++) {
    
        const computerA = network[a]
    
        const connectionsA = allConnections[computerA]
        
        for (let b = a + 1; b < off; b++) {
        
            const computerB = network[b] 
            
            if (connectionsA.includes(computerB)) { continue }
            
            unfriendship[a] += 1
            unfriendship[b] += 1
            
            if (unfriendship[a] > worstValue) { worstValue = unfriendship[a]; worstIndex = a }
            if (unfriendship[b] > worstValue) { worstValue = unfriendship[b]; worstIndex = b }
        }
    }
    
 //  if (worstIndex == -1) { return } // not needed
    
    network.splice(worstIndex, 1)
}

///////////////////////////////////////////////////////////////////////////////

function allMembersAreFriends(network) {

    const off = network.length
    
    for (let a = 0; a < off - 1; a++) {
    
        const computerA = network[a]
    
        const connectionsA = allConnections[computerA]
        
        for (let b = a + 1; b < off; b++) {
        
            const computerB = network[b] 
            
            if (! connectionsA.includes(computerB)) { return false }
        }
    }    
    
    return true
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 5ms

