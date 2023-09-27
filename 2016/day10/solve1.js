"use strict"

// solving the puzzle takes (my computer) 0.030s

// a box may be a bot or a bin

const boxes = { } // id: [ 0,1 or 2 microchips ] 

var targetBotId = ""

const instructions = [ ]

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
        
    for (const rawLine of rawLines) { instructions.push(rawLine.trim()) }        
        
    while (targetBotId == "") { executeBatch() }
        
    console.log("number of the bot is", targetBotId.replace("bot", ""))
}

function executeBatch() {

    const executeds = [ ]
    
    let index = -1
    
    for (const line of instructions) {
    
        index += 1
        
        const done = executeInstruction(line)
        
        if (done) { executeds.push(index) }
    }
    
    while (executeds.length != 0) {
    
        const index = executeds.pop() // must be reversed order
    
        instructions.splice(index, 1) // emptying
    }
}

function executeInstruction(line) {

    if (line.startsWith("value")) { return executeValueInstruction(line) }
        
    return executeBotInstruction(line)
}

function executeValueInstruction(line) {

    const tokens = line.split(" ")
    
    tokens.shift() // 'value'
    
    const value = parseInt(tokens.shift())
    
    const id = tokens.pop()
    
    const prefix = tokens.pop()
    
    fillBoxOnce(prefix+id, value)

    return true 
}

function executeBotInstruction(line) {

    const tokens = line.split(" ")
    
    tokens.shift() // 'bot'
    
    const giver = "bot" + tokens.shift()
    
    const values = boxes[giver]
    
    if (values == undefined) { return false }
    
    if (values.length != 2)  { return false }
    
    tokens.shift() // 'gives'
    tokens.shift() // 'low'
    tokens.shift() // 'to'
    
    const lowPrefix = tokens.shift() // 'bot' or 'output'
    
    const lowReceiver = tokens.shift()
    
    tokens.shift() // 'and'
    tokens.shift() // 'high'
    tokens.shift() // 'to'
    
    const highPrefix = tokens.shift() // 'bot' or 'output'
    
    const highReceiver = tokens.shift()
    
    if (values[0] == 17  &&  values[1] == 61) { targetBotId = giver }
    
    fillBoxOnce(lowPrefix + lowReceiver, values[0])
    
    fillBoxOnce(highPrefix + highReceiver, values[1])
    
    boxes[giver] = [ ]
    
    return true
}

function fillBoxOnce(id, value) {

    if (boxes[id] == undefined) { boxes[id] = [ value ]; return }
    
    const values = boxes[id]

    if (values.length == 0) { values.push(value); return }

    if (value > values[0]) { values.push(value) } else { values.unshift(value) }
}
    
main()

