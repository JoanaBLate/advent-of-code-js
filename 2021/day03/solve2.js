"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    const generator = findRating(createGeneratorSelection)
    
    const scrubber = findRating(createScrubberSelection)
    
    console.log("the answer is", generator * scrubber)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function findRating(callback) {

    let list = DATA
    
    let position = -1
    
    while (true) { 
    
        position += 1

        list = callback(list, position)

        if (list.length == 1) { break }
    }
    
    return parseInt(list[0], 2)
}

///////////////////////////////////////////////////////////

function createGeneratorSelection(sourceList, position) {
    
    const list0 = [ ]
    
    const list1 = [ ]
    
    for (const data of sourceList) {
    
        if (data[position] == "0") { list0.push(data) } else { list1.push(data) }
    }  
    
    if (list1.length >= list0.length) { return list1 } 
    
    return list0
}

function createScrubberSelection(sourceList, position) {
    
    const list0 = [ ]
    
    const list1 = [ ]
    
    for (const data of sourceList) {
    
        if (data[position] == "0") { list0.push(data) } else { list1.push(data) }
    }  
    
    if (list0.length <= list1.length) { return list0 } 
    
    return list1
} 

main()

