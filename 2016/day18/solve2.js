"use strict"

// solving the puzzle takes (my computer)  2.1s


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()

    let row = input
    
    let count = countTraps(row)
    
    const off = 400000 - 1
    
    for (let n = 0; n < off; n++) {
    
        row = createRow(row)
        
        count += countTraps(row)
    } 

    console.log("number of safe tiles is", count)
}

function countTraps(row) {

    let count = 0
        
    for (const c of row) { if (c == ".") { count += 1 } }    
    
    return count
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


