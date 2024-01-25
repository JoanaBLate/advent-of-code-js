"use strict"

// solving the puzzle takes (my computer) 0.500s

const input = Deno.readTextFileSync("input.txt").trim()

const CAVES = { }

var numberOfPaths = 0


function main() {

    processInput()
    
    walk()
    
    console.log("the answer is", numberOfPaths)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split("-")
        
        const a = tokens.shift()
        const b = tokens.shift()
        
        if (CAVES[a] == undefined) { CAVES[a] = [ ] }
        if (CAVES[b] == undefined) { CAVES[b] = [ ] }
        
        CAVES[a].push(b)
        CAVES[b].push(a)
    }
}

///////////////////////////////////////////////////////////

function walk() {

    const paths = [ [ "start" ] ]
    
    while (paths.length != 0) {

        const path = paths.pop()
        
        const last = path.at(-1)
        
        for (const cave of CAVES[last]) {
        
            if (cave == "start") { continue }
            
            if (cave == "end") { numberOfPaths += 1; continue }
        
            if (! okToEnterCave(path, cave)) { continue }
        
            const newPath = path.slice()
            
            newPath.push(cave)
            
            paths.push(newPath)        
        }
    }
}

function okToEnterCave(path, cave) {

    if (cave[0] <= "Z") { return true } // big cave
    
    if (! path.includes(cave)) { return true }
   
    const smalls = { }
    
    for (const _cave of path) {
    
        if (_cave[0] <= "Z") { continue }
        
        if (smalls[_cave] == undefined) { smalls[_cave] = 0 }
        
        smalls[_cave] += 1
    }
    
    if (Object.values(smalls).includes(2))  { return false }
    
    return true
}

main()

