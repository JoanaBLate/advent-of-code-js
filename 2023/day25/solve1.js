"use strict"

// solving the puzzle takes (my computer) 0.770s

const input = Deno.readTextFileSync("input.txt").trim()

const NODES = [ ]

var countGroupA = 1
var countGroupB = 0


function main() {
    
    const rawData = processInput()
    
    fillNodes(rawData)
    
    const master = NODES[0]  
    
    for (const node of NODES) {
    
        if (node != master) { searchThis(node, master) }
    }
           
    console.log("the answer is", countGroupA * countGroupB)
}

///////////////////////////////////////////////////////////

function processInput() {
    
    const rawData = { }
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(": ")
        
        const parent = parts.shift() 
        
        const children = parts.shift().split(" ")
        
        rawData[parent] = children
    }

    processRawData(rawData)
    
    return rawData
}

function processRawData(rawData) {

    const names = Object.keys(rawData)
    
    for (const name of names) { processRawDataThis(rawData, name) }
}

function processRawDataThis(rawData, parent) {

    const children = rawData[parent]
    
    for (const child of children) {
    
        if (rawData[child] == undefined) { rawData[child] = [ parent ]; continue }
        
        if (! rawData[child].includes(parent)) { rawData[child].push(parent) }
    }
}

///////////////////////////////////////////////////////////

function fillNodes(rawData) {
    
    const keys = Object.keys(rawData)
    
    for (let n = 0; n < keys.length; n++) { NODES.push(createNodeObject()) }
    
    let index = -1
    
    for (const key of keys) { 
    
        index += 1
        
        const node = NODES[index]
        
        const rawChildren = rawData[key]
        
        for (const rawChild of rawChildren) {
        
            const rawChildIndex = keys.indexOf(rawChild)
        
            node.children.push(NODES[rawChildIndex])        
        }
    }
}        

function createNodeObject() {

    return { "children": [ ], "used": false, "visited": false }
}

///////////////////////////////////////////////////////////

function resetUse() {

   for (const node of NODES) { node.used = false }
}

function resetVisit() {

   for (const node of NODES) { node.visited = false }
}

///////////////////////////////////////////////////////////

function searchThis(target, master) {

    resetUse()

    master.used = true

    let connections = 0

    for (const child of master.children) {
           
        if (connections > 3) { break } // for economy
        
        if (child == target) { connections += 1; continue }
            
        const path = searchThis2(target, child)
        
        if (path != null) { connections += 1; updateUsed(path) }
    }

    if (connections > 3) { countGroupA += 1 } else { countGroupB += 1 } 
} 

function updateUsed(path) {

    for (const node of path) { node.used = true }
}

///////////////////////////////////////////////////////////   

function searchThis2(target, root) { // LEAVES AS SOON AS FINDS ONE CONNECTION
    
    resetVisit() 
    
    root.visited = true
    
    const paths = [ [ root ] ]
        
    while (true) {           
        
        const path = paths.shift()
        
        if (path == undefined) { break }
        
        const lastInPath = path.at(-1)
        
        for (const child of lastInPath.children) { 
        
            if (target == child) { return path }
                
            if (child.visited) { continue }
                
            if (child.used) { continue }
            
            child.visited = true                   
            
            const newPath = path.slice()
            
            newPath.push(child)
            
            paths.push(newPath)                
        }
    }
    
    return null
}

main()    
    
