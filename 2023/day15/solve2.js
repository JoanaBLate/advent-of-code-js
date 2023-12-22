"use strict"

// solving the puzzle takes (my computer) 0.033s

const DATA = [ ]

const boxes = [ ]


function main() {

    processInput()
    
    for (let n = 0; n < 256; n++) { boxes.push([ ]) }

    for (const data of DATA) { processCommand(data) }
    
    let sum = 0
    
    for (let n = 0; n < 256; n++) { sum += boxValue(n) }
    
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const tokens = input.split(",")
    
    for (const token of tokens) {
    
        if (token.endsWith("-")) {
        
            const label = token.replace("-", "")
            
            const box = decode(label)
        
            DATA.push({ "label": label, "box": box, "operation": "remove", "lens": -1 })
            
            continue 
        }
        
        // symbol is '='
        
        const label = token.substr(0, token.length - 2)
        
        const box = decode(label)
    
        const lens = parseInt(token.at(-1))
    
        DATA.push({ "label": label, "box": box, "operation": "replace", "lens": lens })
    }
}

function decode(label) {
    
    let value = 0
    
    for (const c of label) {
        
        value += c.charCodeAt(0)
        value *= 17
        value %= 256    
    }

    return value
}

//////////////////////////////////////////////////////////

function processCommand(data) {

    if (data.operation == "remove") { remove(data); return }

    replace(data)
}

function remove(data) {

    const box = boxes[data.box]

    for (let n = box.length - 1; n > -1; n--) {
    
        if(box[n].label == data.label) { box.splice(n, 1) }
    }
}

function replace(data) {

    const box = boxes[data.box]
    
    for (const obj of box) {
    
        if (obj.label == data.label) { obj.lens = data.lens; return }
    }
    
    box.push({ "label": data.label, "lens": data.lens })
}

///////////////////////////////////////////////////////////

function boxValue(n) {

    const box = boxes[n]
    
    if (box.length == 0) { return 0 }
    
    let value = 0
    
    const factor = n + 1
    
    let slot = 0 
    
    for (const obj of box) {
    
        slot += 1
        
        value += (factor * slot * obj.lens)
    }
    
    return value
}

main()

