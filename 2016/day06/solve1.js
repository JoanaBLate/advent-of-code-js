"use strict"

// solving the puzzle takes (my computer) 0.024s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    const messages = [ ]
    
    for (const rawLine of rawLines) { messages.push(rawLine.trim()) }
    
    const length = messages[0].length
    
    let message = ""
    
    for (let i = 0; i < length; i++) { message += understand(messages, i) }
        
    console.log("the message is", message)
}

function understand(messages, i) {    

    const data = { }
    
    for (const message of messages) {
    
        const c = message[i]
        
        if (data[c] == undefined) { data[c] = 0 } else { data[c] += 1 }
    }
    
    let best = ""
    let amount = 0
    
    for (const c of Object.keys(data)) {
    
        if (data[c] > amount) { best = c; amount = data[c] }    
    }
    
    return best
}

main()

