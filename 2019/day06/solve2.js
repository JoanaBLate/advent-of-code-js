"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = { } // id: obj


function main() {

    processInput()
    
    const myPath = createPath("YOU")
    const santaPath = createPath("SAN")
     
    while (myPath[0] == santaPath[0]  &&  myPath[1] == santaPath[1]) { myPath.shift(); santaPath.shift() } 
    
    const fromYouParentToCommonNode = myPath.length - 2

    const fromCommonNodeToSanParent = santaPath.length - 2
    
    const result = fromYouParentToCommonNode + fromCommonNodeToSanParent
     
    console.log("the answer is", result)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(")")
        
        const astro = tokens.shift()
        const satellite = tokens.shift()
        
        if (DATA[astro] == undefined) { DATA[astro] = createAstro() }
        
        DATA[astro].children.push(satellite)
        
        if (DATA[satellite] == undefined) { DATA[satellite] = createAstro() }
        
        DATA[satellite].parent = astro
    }        
}

function createAstro() {

    return { "parent": "", "children": [ ] }
}

function createPath(id) {

    const path = [ id ]
    
    while (true) {
        
        const obj = DATA[path[0]]
        
        path.unshift(obj.parent)

        if (path[0] == "COM") { return path }
    }
}

main()

