"use strict"

// solving the puzzle takes (my computer) 0.030s


const DATA = { } // name: info

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        const name = tokens.shift()
        
        const rawWeight = tokens.shift()
        
        const weight = parseInt(rawWeight.replace("(", ""))
        
        tokens.shift() // nothing or ->
        
        const children = [ ]
        
        while (tokens.length > 0) { 
        
            const child = tokens.shift().replace(",", "")
            
            children.push(child)
        }
        
        DATA[name] = { "weight": weight, "children": children, "parent": "" }        
    }
    
    const names = Object.keys(DATA)
    
    for (const name of names) {
    
        const data = DATA[name]
        
        for (const child of data.children) {

            DATA[child].parent = name        
        }    
    } 
    
    for (const name of names) { 
    
        if (DATA[name].parent == "") { console.log("name of the bottom program is", name); return }
    }
}

main()

