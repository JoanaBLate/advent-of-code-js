"use strict"

// solving the puzzle takes (my computer) 0.025s

/*
    another puzzle that we cannot solve without using advanced math:

    the Chinese Remainder Theorem 

    so we are playing the Advent of **Math**, right?
    
    this program was translated from a Python code on Reddit:
    
    >> SORRY FOR THE **CRAPPY** NAMES (bi, ni, Ni, bi, xi...)       
*/

const bi = [ ]

const ni = [ ]


function main() {

    processInput()
    
    let N = 1
    
    for (const n of ni) { N *= n }
    
    const Ni = [ ]
    
    for (const n of ni) { Ni.push(Math.floor(N / n)) }

    const xi = []
    
    const product = []
    
    for (let n = 0; n < Ni.length; n++) {
    
        const num = Ni[n] % ni[n]
        
        let found = false
        
        let x = 1
        
        while (! found) {
        
            if ((x * num) % ni[n] == 1) {
                found = true
                break
            }
            x += 1
        }
        xi.push(x)
    }

    for (let n = 0; n < bi.length; n++) {
    
        product.push(BigInt(bi[n]) * BigInt(Ni[n]) * BigInt(xi[n]))
    }   
    
    let sum = BigInt(0)
    
    for (const p of product) { sum += p }
    
    const result = sum % BigInt(N)
    
    console.log("the answer is", Number(result))    
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    lines.shift() // timestamp
    
    const tokens = lines.shift().trim().split(",")
    
    for (let n = 0; n < tokens.length; n++) {
    
        if (tokens[n] == "x") { continue }
        
        const bus = parseInt(tokens[n])
    
        bi.push((bus - n % bus) % bus)
        
        ni.push(bus)
    }
}

main()

