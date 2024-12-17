"use strict"

// solving the puzzle takes (my computer) 0.025s


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()

    const rows = [ input ]
    
    while (rows.length < 40) {
    
        const ref = rows[rows.length - 1]
        
        rows.push(createRow(ref)) 
    }
     
    let count = 0
        
    for (const row of rows) {
    
        for (const c of row) { if (c == ".") { count += 1 } }    
    }    

    console.log("number of safe tiles is", count)
}

function createRow(ref) {

    const arr = new Array(ref.length)
    
    arr.fill(".")

    for (let i = 0; i < arr.length; i++) {
    
        const left  = ref[i-1] || "." 
        const right = ref[i+1] || "."
        
        if (left == "."  &&  right == ".") { continue }
        if (left == "^"  &&  right == "^") { continue } 
    
        arr[i] = "^"
    }

    return arr.join("")
}

main()


