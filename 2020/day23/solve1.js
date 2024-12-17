"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

var LINKS = null

var LOWEST = 1

var HIGHEST = 9

var current = 0


function main() {

    processInput()
    
    for (let n = 0; n < 100; n++) { change() }
    
    console.log("the answer is", findAnswer())
}

function processInput() {

    while (! input.includes(LOWEST))  { LOWEST += 1 }
    while (! input.includes(HIGHEST)) { HIGHEST -= 1 }

    current = parseInt(input[0])
    
    const length = input.length + 1 // for the unused zeroth space

    LINKS = new Array(length) // linked list    
    
    for (let n = 0; n < length; n++) { LINKS[n] = createLinkObject(n) }
    
    //
    
    for (let n = 0; n < input.length; n++) {
    
        const item = parseInt(input[n])
        
        let previousIndex = n - 1
        
        if (previousIndex < 0) { previousIndex = input.length - 1 }
        
        const previous = parseInt(input[previousIndex])
        
        let nextIndex = n + 1
        
        if (nextIndex > input.length - 1) { nextIndex = 0 }
        
        const next = parseInt(input[nextIndex])
                
        const currentObj = LINKS[item]
    
        currentObj.previous = previous
        currentObj.next = next    
    }    
}

function createLinkObject(n) {

    return { "index": n, "previous": 0, "next": 0 }
}

///////////////////////////////////////////////////////////

function change() {

    const currentObj = LINKS[current]
    
    // extracting the segment (a, b and c)

    const a = currentObj.next
    
    const aObj = LINKS[a]
    
    const b = aObj.next
    
    const bObj = LINKS[b]
    
    const c = bObj.next
    
    const cObj = LINKS[c]
    
    const d = cObj.next
    
    const dObj = LINKS[d]
    
    dObj.previous = current
    
    currentObj.next = d
    
    //
    // now the segment is extracted (and the circle is closed)
    //
    
    const destination = findDestinationCup(a, b, c)
    
    const destinationObj = LINKS[destination]  
    
    const end = destinationObj.next  
    
    const endObj = LINKS[end]
    
    // inserting
    
    destinationObj.next = a
    
    aObj.previous = destination
    
    cObj.next = end
    
    endObj.previous = c
    
    //
    
    current = currentObj.next
}

///////////////////////////////////////////////////////////

function findDestinationCup(a, b, c) {

    let destination = current

    while (true) {
        
        destination -= 1
    
        if (destination < LOWEST) { destination = HIGHEST }
        
        if (a == destination) { continue }
        if (b == destination) { continue }
        if (c == destination) { continue }

        break
    }
    return destination
}

///////////////////////////////////////////////////////////

function findAnswer() {

    let s = ""
    
    let index = 1
    
    while (true) {

        const obj = LINKS[index]
        
        index = obj.next
        
        if (index == 1) { return s }
        
        s += index
    }
}

main()

