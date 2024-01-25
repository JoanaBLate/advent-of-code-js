"use strict"

// solving the puzzle takes (my computer) 0.090s

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

    const home = createPathObj([ "start" ], [ ], false)

    const objs = [ home ]
    
    while (objs.length != 0) {

        const obj = objs.pop()
        
        const last = obj.path.at(-1)
        
        for (const cave of CAVES[last]) {
        
            if (cave == "start") { continue }
            
            if (cave == "end") { numberOfPaths += 1; continue }
        
            if (cave[0] <= "Z") { includeNewPathBig(objs, obj, cave); continue } // big cave
    
            if (obj.hasDoubleSmall  &&  obj.smalls.includes(cave)) { continue }
        
            includeNewPathSmall(objs, obj, cave)       
        }
    }
}

function createPathObj(path, smalls, hasDoubleSmall) {

    return { "path": path, "smalls": smalls, "hasDoubleSmall": hasDoubleSmall }
}

function includeNewPathBig(objs, obj, cave) {
    
    const newObj = createPathObj(obj.path.slice(), obj.smalls.slice(), obj.hasDoubleSmall)

    newObj.path.push(cave)

    objs.push(newObj)
}

function includeNewPathSmall(objs, obj, cave) {
    
    const newObj = createPathObj(obj.path.slice(), obj.smalls.slice(), obj.hasDoubleSmall)

    newObj.path.push(cave)
    
    if (newObj.smalls.includes(cave)) { newObj.hasDoubleSmall = true } else { newObj.smalls.push(cave) }

    objs.push(newObj)
}

main()

