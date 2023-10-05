"use strict"

// solving the puzzle takes (my computer) 0.024s

const data = "abcdefgh".split("")

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        const instr = tokens.shift()
        
        if (instr == "move")   { move(tokens); continue }
        
        if (instr == "reverse") { reverse(tokens); continue }
        
        if (instr == "rotate")  { rotate(tokens); continue }
        
        if (instr == "swap")    { swap(tokens); continue }        
    }        

    console.log("the result of scrambling is", data.join(""))
}

function move(tokens) {

    tokens.shift() // position
    
    const indexA = parseInt(tokens.shift())

    tokens.shift() // to
    tokens.shift() // position
    
    const indexB = parseInt(tokens.shift())
    
    const char = data[indexA]
    
    data.splice(indexA, 1)
    
    data.splice(indexB, 0, char)    
}

function reverse(tokens) {

    tokens.shift() // positions
    
    const indexA = parseInt(tokens.shift())

    tokens.shift() // through
    
    const indexB = parseInt(tokens.shift())
    
    const clone = data.slice(indexA, indexB + 1)
    
    clone.reverse()
    
    let index = -1
    
    for (const c of clone) { index += 1; data[indexA + index] = c }
}

function rotate(tokens) {

    const kind = tokens.shift() 
    
    if (kind == "left")  { rotateLeft(parseInt(tokens.shift())); return }
    if (kind == "right") { rotateRight(parseInt(tokens.shift())); return }
    
    // rotate based
    const char = tokens.pop()
    
    const index = data.indexOf(char)
    
    let times = 1 + index
    
    if (index >= 4) { times += 1 }
    
    rotateRight(times)
}

function rotateLeft(times) {

    for (let n = 0; n < times; n++) { data.push(data.shift()) }
}

function rotateRight(times) {

    for (let n = 0; n < times; n++) { data.unshift(data.pop()) }
}

function swap(tokens) {

    const kind = tokens.shift() 
    
    if (kind == "letter")  { 

        const letter1 = tokens.shift()
        const letter2 = tokens.pop()
        const indexA = data.indexOf(letter1)
        const indexB = data.indexOf(letter2)
        
        swapPosition(indexA, indexB)
        return 
    }
    
    if (kind == "position") { 

        const indexA = parseInt(tokens.shift())
        const indexB = parseInt(tokens.pop())
        
        swapPosition(indexA, indexB)
        return 
    }
}

function swapPosition(indexA, indexB) {

    const temp = data[indexA]

    data[indexA] = data[indexB]
    
    data[indexB] = temp

}

main()

