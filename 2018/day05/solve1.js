"use strict"

// solving the puzzle takes (my computer) 0.030s

var source = ""

const data = [ ]

function main() {

    processInput()
     
    for (const c of source) { updateDataWith(c) }     
     
    console.log("the answer is", data.length)
}

function processInput() {

    source =  Deno.readTextFileSync("input.txt").trim()
}

function updateDataWith(c) {

    const last = data[data.length - 1]
    
    if (last == undefined) { data.push(c); return }

    if (last == c) { data.push(c); return } 
    
    if (last.toLowerCase() != c.toLowerCase()) { data.push(c); return }
    
    data.pop()
}

main()

