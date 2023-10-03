"use strict"

// solving the puzzle takes (my computer) 0.235s

// manipulating strings like before (part 1) stresses too much the computer

const LENGTH = 35651584
    
function main() {

    const data = new Uint8Array(LENGTH)

    const source = Deno.readTextFileSync("input.txt").trim()
    
    // FILLING
    
    for (let i = 0; i < source.length; i++) { data[i] = parseInt(source[i]) }
    
    let length = source.length
    
    while (true) {
    
        fillDataOnce(data, length)
        
        length = 2 * length + 1

        if (length > LENGTH) { break }
    }
    
    // CHECKSUM
    
    length = LENGTH
    
    while (true) {
    
        checksumOnce(data, length)
        
        length = length / 2

        if (length % 2 == 1) { break }
    }
    
    const checksum = data.slice(0, length).join("")
        
    console.log("the correct checksum is", checksum)
}

function fillDataOnce(data, length) {

    data[length] = false // data comes with at least one position available
    
    const maxIndex = LENGTH - 1
    
    let sourceIndex = length // reversed order
    let destinyIndex = length
    
    while (true) {
    
        sourceIndex -= 1
        destinyIndex += 1
        
        if (sourceIndex < 0) { return }
        if (destinyIndex > maxIndex) { return }
        
        data[destinyIndex] = 1 - data[sourceIndex]
    }
}

function checksumOnce(data, length) {
    
    let sourceIndex = 0
    let destinyIndex = 0
    
    while (true) {
        
        const a = data[sourceIndex]
        const b = data[sourceIndex + 1]
        
        data[destinyIndex] = (a == b) ? 1 : 0
    
        sourceIndex += 2
        destinyIndex += 1
        
        if (sourceIndex >= length) { return }
    }
}

main()

