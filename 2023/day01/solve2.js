"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]

const words = [ "PLACEHOLDER", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const data of DATA) { 
    
        const first = getFirstDigit(data)
        
        const last = getLastDigit(data)
        
        sum += parseInt(first + last)
    }
    
    console.log("the answer is", sum)    
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}
    
function getFirstDigit(data) {

    while (data != "") {

        for (const word of words) {
        
            if (data.startsWith(word)) { return words.indexOf(word).toString() }
        }
    
        const c = data[0]
        
        data = data.substr(1)

        if (c >= "0"  &&  c <= "9") { return c }
    }           
}

function getLastDigit(data) {

    while (data != "") {

        for (const word of words) {
        
            if (data.endsWith(word)) { return words.indexOf(word).toString() }
        }
    
        const c = data.at(-1)
        
        data = data.substr(0, data.length - 1)

        if (c >= "0"  &&  c <= "9") { return c }
    }           
}

main()

