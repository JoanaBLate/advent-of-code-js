"use strict"

// solving the puzzle takes (my computer) 0.024s

/*
    *WARNING*
    
    THIS SOLUTION MAY NOT WORK FOR YOUR INPUT
    
    
    --> PLEASE READ THE FILE "EXPLANATION.js",
    
    that presents a deep explanation on the principles used here    
    
*/

const input = Deno.readTextFileSync("input.txt").trim()

const SUBROUTINES = [ ]

const DATA = [ ]


function main() {

    processInput()
    
    fillData()
    
    setRelationships()
    
    let result = ""
    
    for (const data of DATA) { result += findMinDigit(data) }
    
  //  console.log(DATA)
    
    console.log("the answer is", parseInt(result))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    let group = [ ]
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const kind = tokens.shift()

        const operand1 = tokens.shift()
        
        const operand2 = tokens.shift() || ""
        
        if (kind == "inp") { group = [ ]; SUBROUTINES.push(group) }
        
        group.push({ "kind": kind, "operand1": operand1, "operand2": operand2 })
    }
}

///////////////////////////////////////////////////////////

function fillData() {

    for (const subroutine of SUBROUTINES) { fillDataThis(subroutine) }
}

function fillDataThis(subroutine) {

    const isFeeder = parseInt(subroutine[4].operand2) == 1

    const xDelta = parseInt(subroutine[5].operand2)

    const yDelta = parseInt(subroutine[15].operand2)
    
    const data = { "isFeeder": isFeeder, "xDelta": xDelta, "yDelta": yDelta, "next": -1, "previous": -1, "digit": -1 }

    DATA.push(data)
}

///////////////////////////////////////////////////////////

function setRelationships() {
    
    const stack = [ ]
    
    for (let index = 0; index < 14; index++) {
        
        if (DATA[index].isFeeder) { 
        
            stack.push(index)
        }
        
        else { // is retriever

            const previous = stack.pop()
            
            DATA[index].previous = previous
            
            DATA[previous].next = index
        }
    }     
}

///////////////////////////////////////////////////////////

function findMinDigit(data) {

    if (! data.isFeeder) { return data.digit }

    for (const c of "123456789") {
    
        const digit = parseInt(c)
        
        if (isGoodDigitFeeder(data, digit)) { data.digit = digit; return digit }
    }
}

function isGoodDigitFeeder(data, digit) { // also sets the next data digit! 

    const nextData = DATA[data.next]

    for (const c of "123456789") {
    
        const nextDigit = parseInt(c)
    
        if (nextDigit != (digit + data.yDelta) + nextData.xDelta) { continue }
        
        nextData.digit = nextDigit 
       
        return true
    }
    
    return false    
}

///////////////////////////////////////////////////////////

main()

