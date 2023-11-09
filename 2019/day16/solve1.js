"use strict"

// solving the puzzle takes (my computer) 0.280s

var DATA = [ ]

var LENGTH = 0

const basePattern = [ 0, 1, 0, -1 ]

const patterns = [ ]

var digitIndex = 0
var digitCount = 1

var repeatFactor = 1


function main() {

    processInput()
    
    LENGTH = DATA.length

    fillPatterns() // takes 4ms
    
    for (let n = 0; n < 100; n++) {
    
        const data = new Uint8Array(LENGTH)
        
        for (let index = 0; index < LENGTH; index++) { data[index] = calcNewDigit(index) }
        
        DATA = data
    }
    
    console.log("the answer is", DATA.join("").substr(0, 8))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    DATA = input.split("")
}

///////////////////////////////////////////////////////////

function fillPatterns() {

    for (let n = 0; n < LENGTH; n++) { patterns.push(createPattern(n)) }
}

function createPattern(position) {

    resetPatternData(position + 1)

    getDigitFromPattern() // excludes the first

    const array = new Int8Array(LENGTH) // cannot be unsigned!
    
    for (let index = 0; index < LENGTH; index++) { array[index] = getDigitFromPattern() }
    
    return array
}

function resetPatternData(position) {

    repeatFactor = position
    
    refreshPatternData()
}

function refreshPatternData() {

    digitIndex = 0
    digitCount = repeatFactor
}

function getDigitFromPattern() {

    const digit = basePattern[digitIndex]
    
    digitCount -= 1
    
    if (digitCount == 0) {
    
        digitCount = repeatFactor
        
        digitIndex += 1
        
        if (digitIndex == basePattern.length) { refreshPatternData() }     
    }

    return digit
}

///////////////////////////////////////////////////////////

function calcNewDigit(position) {

    const pattern = patterns[position]
    
    let sum = 0
    
    for (let index = 0; index < LENGTH; index++) { sum += DATA[index] * pattern[index] }   
    
    return Math.abs(sum % 10)    
} 

main()

