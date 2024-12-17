"use strict"

// solving the puzzle takes (my computer) 0.024s

function main() {

    const LENGTH = 272

    let string = Deno.readTextFileSync("input.txt").trim()
    
    while (string.length < LENGTH) {
    
        const reversed = string.split("").reverse()
        
        for (let i = 0; i < reversed.length; i++) {
        
            reversed[i] = (reversed[i] == "0") ? "1" : "0"
        }
        
        string += "0" + reversed.join("")
    }
    
    string = string.substr(0, LENGTH)
    
    let checksum = ""

    while (true) {
    
        for (let i = 0; i < string.length; i += 2) {
        
            const c = (string[i] == string[i+1]) ? "1" : "0"
            
            checksum += c        
        }        
    
        if (checksum % 2 == 1) { break }
        
        string = checksum
        checksum = ""    
    }
        
    console.log("the correct checksum is", checksum)
}

main()

