"use strict"

// solving the puzzle takes (my computer) 0.720s


// The last turn when a number was spoken is BASE *ONE* indexed,
// because zero means not spoken


const target = 30 * 1000 * 1000

const LAST_TURN = new Uint32Array(target)  // memorizes the turn when each number was last spoken
                                           // zero means not spoken

const startingNumbers = [ ]


function main() {

    processInput()
    
    startingNumbers.push(0)
    
    let turn = startingNumbers.length
    
    let todo = startingNumbers.at(-1)
       
    while (turn < target) {
    
        turn += 1
        
        const lastTime = LAST_TURN[todo]
        
        LAST_TURN[todo] = turn - 1

        if (lastTime == 0) { todo = 0 } else { todo = turn - lastTime - 1 }
    }
     
    console.log("the answer is", todo)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")

    for (let n = 0; n < tokens.length; n++) { 
    
        const number = parseInt(tokens[n]) 
        
        startingNumbers.push(number)
        
        LAST_TURN[number] = n + 1 // '+ 1' because zero means number not spoken
    }
}

main()

