"use strict"

// solving the puzzle takes (my computer) 0.024s

const input = Deno.readTextFileSync("input.txt").trim()

const valueOfSnafuDigit = {

    "0": 0,
    "1": 1,
    "2": 2,
    "-": "-1",
    "=": "-2"
}

const DATA = [ ]


function main() {

    processInput()
    
    let total = 0
    
    for (const snafu of DATA) { total += snafuToDecimal(snafu) }
    
    console.log("the answer is", decimalToSnafu(total))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function snafuToDecimal(snafu) {

    const digits = snafu.split("").reverse()
    
    let decimal = 0
    
    let exponent = -1
    
    for (const digit of digits) {
    
        exponent += 1
        
        decimal += Math.pow(5, exponent) * valueOfSnafuDigit[digit]    
    }

    return decimal
}

///////////////////////////////////////////////////////////

function decimalToSnafu(decimal) {

    const base5 = "000000000000000" + decimal.toString(5) //  decimal number -> to base5 number as string
    
    const list = [ ]
    
    for (const c of base5) { list.unshift(parseInt(c, 5)) } // REVERSED!
    
    const max = list.length - 2
    
    let n = -1
    
    while (n <= max) {
    
        n += 1
    
        while (list[n] > 2) { list[n] -= 5; list[n + 1] += 1 }
    }
    
    list.reverse()
    
    while (list[0] == 0) { list.shift() }
    
    let result = ""
    
    for (const digit of list) {
    
        if (digit == -1) { result += "-"; continue }

        if (digit == -2) { result += "="; continue }

        result += digit
    }
    
    return result
}

///////////////////////////////////////////////////////////

main()

