"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]

const nodes = [ ]


function main() {

    processInput()
    
    if (! DATA.includes(0)) { DATA.push(0) } // the zero start will easy the search
    
    DATA.sort(function (a, b) { return a - b })    
    
    for (const joltage of DATA) { nodes.push(createNode(joltage, 0)) }

    nodes[0].paths = 1
    
    search()
     
    console.log("the answer is", nodes.at(-1).paths)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
           
    const lines = input.trim().split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

function createNode(jolts, paths) {

    return { "jolts": jolts, "paths": paths }
}    

function search() {

    for (let index = 0; index < nodes.length; index++) { searchThis(index); }
}

function searchThis(baseIndex) {

    const baseNode = nodes[baseIndex];
    
    for (let index = baseIndex + 1; index < nodes.length; index++) {
    
        var currentNode = nodes[index];

        if (currentNode.jolts - baseNode.jolts > 3) { return; }
        
        currentNode.paths += baseNode.paths;
    }
}

main()

