"use strict"

// solving the puzzle takes (my computer) 0.025s

// WARNING: THIS PROGRAM MAY NOT WORK WITH ANOTHER INPUT! //

const DATA = [ ]


function main() {

    processInput()
    
    if (! DATA.includes(0)) { DATA.push(0) }
    
    DATA.sort(function (a, b) { return a - b })
    
    const last = DATA.at(-1)
    
    DATA.push(last + 3)
        
    const segments = [ ] // delta between consecutive values of any segment is always 1
    
    while (DATA.length != 0) { segments.push(createSegment(DATA)) }
    
    let n = 1
    
    for (const segment of segments) { n *= possibilitiesOfSegment(segment) }
     
    console.log("the answer is", n)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
           
    const lines = input.trim().split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

function createSegment(DATA) {

    const segment = [ DATA.shift() ]
    
    while (DATA.length != 0) {
        
        const delta = DATA[0] - segment.at(-1)
        
        if (delta != 1) { break }
    
        segment.push(DATA.shift())
    }
    return segment
}    

function possibilitiesOfSegment(segment) {

    // delta between consecutive values of any segment is always 1
    
    // the first and the last element must be present or else the
    // segment will not be able to connect with others

    const len = segment.length
    
    if (len == 1) { return 1 } // 0
    
    if (len == 2) { return 1 } // 0,1
    
    if (len == 3) { return 2 } // 0,1,2; 0,2
    
    if (len == 4) { return 4 } // 0,1,2,3; 0,3; 0,1,3, 0,2,3; 
    
    if (len == 5) { return 7 } // 0,1,2,3,4; 0,1,4; 0,2,4; 0,3,4; 0,1,2,4; 0,1,3,4; 0,2,3,4
    
    console.log("ERROR: not expecting input that generates segment larger than 5")
    
    Deno.exit()
}

main()

