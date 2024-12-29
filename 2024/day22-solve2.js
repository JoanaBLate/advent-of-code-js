// solution for https://adventofcode.com/2024/day/22 part 2

"use strict"

const input = Deno.readTextFileSync("day22-input.txt").trim()

const allNumbers = [ ] // BigInts

const SIZE = 19 * 19 * 19 * 19 // four changes of 19 possibilities each (from -9 to +9)

const market = [ ] 

const control = [ ]


function main() {
     
    processInput() 
    
    for (let n = 0; n < SIZE; n++) {

        market.push(0) // total bananas for that four change sequence
     
        control.push(-1)
    }
    
    processBuyers()
    
    let best = 0
    
    for (const bananas of market) { if (bananas > best) { best = bananas } }
    
    console.log("the answer is", best)   
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const number = BigInt(rawLine.trim())
        
        allNumbers.push(number) 
    }
}

///////////////////////////////////////////////////////////////////////////////

function processBuyers() {

    let buyer = -1
    
    for (const secret of allNumbers) { 
    
        buyer += 1
        
        processBuyer(buyer, secret) 
    }
}

function processBuyer(buyer, secret) {
    
    let lastPrice = parseInt(secret % BigInt(10))
    
    const changes = [ ] // last four changes only

    for (let n = 0; n < 2000; n++) {
    
        secret = processSecretNumberOnce(secret)        

        const price = parseInt(secret % BigInt(10))
        
        const change = price - lastPrice
        
        lastPrice = price
        
        if (changes.length < 4) { changes.push(change); continue }
        
        changes[0] = changes[1]
        changes[1] = changes[2]
        changes[2] = changes[3]
        changes[3] = change
        
        const index = getIndex(changes[0], changes[1], changes[2], changes[3])
        
        if (control[index] == buyer) { continue } // only the first occurrence matters
        
        control[index] = buyer
        
        market[index] += price
    }
}

///////////////////////////////////////////////////////////////////////////////

function getIndex(a, b, c, d) {

    return (19 * 19 * 19 * (a + 9)) + (19 * 19 * (b + 9)) + (19 * (c + 9)) + (d + 9)
}

///////////////////////////////////////////////////////////////////////////////

function processSecretNumberOnce(secret) { // expecting BigInt

    const a = secret * BigInt(64)    
    const b = a ^ secret
    const step1 = b % BigInt(16777216)
        
    const c = step1 / BigInt(32) // BigInt automatically rounds down     
    const d = c ^ step1    
    const step2 = d % BigInt(16777216)

    const e = step2 * BigInt(2048)    
    const f = e ^ step2
    const step3 = f % BigInt(16777216)

    return step3
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 340ms

