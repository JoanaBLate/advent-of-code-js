"use strict"

// solving the puzzle takes (my computer) 0.033s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()

    const rawLines = rawText.split("\n")
    
    const discs = [ ]
    
    for (const rawLine of rawLines) { discs.push(parse(rawLine)) }
    
    console.log(discs)

    let buttonTime = -1
    
    while (true) {
    
        buttonTime += 1 
        
        let plus = 0 // for distance from capsule
        
        for (const disc of discs) { 
        
            plus += 1
            
            const position = disc.start + buttonTime + plus
                        
            if (position % disc.size != 0) { break }
            
            if (plus != discs.length) { continue }
        
            console.log("time to press the button is", buttonTime)
            return
        }
    }
}

function parse(rawLine) {

    const tokens = rawLine.trim().split(" ")
    
    tokens.shift() // Disc
    tokens.shift() // #n
    tokens.shift() // has
    
    const size = parseInt(tokens.shift())
    const start = parseInt(tokens.pop().replace(".", ""))
    
    return { size, start }
}

main()

