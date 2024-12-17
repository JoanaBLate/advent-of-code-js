"use strict"

// solving the puzzle takes (my computer) 0.040s


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const ids = [ ]
    
    for (const line of input.split("\n")) { 
    
        ids.push(line.trim())         
    }
        
    console.log("the answer is", getMatchingCharacters(ids))
}

function getMatchingCharacters(ids) {

    for (let indexA = 0; indexA < ids.length; indexA++) {

        const a = ids[indexA]

        for (let indexB = indexA + 1; indexB < ids.length; indexB++) {

            const b = ids[indexB]
            
            const result = getMatchFromPair(a, b)
            
            if (result != null) { return result }
        }
    }
}

function getMatchFromPair(a, b) {

    const len = a.length

    let common = ""
    
    for (let index = 0; index < len; index++) {
    
        if (a[index] == b[index]) { common += a[index] }
    }        
    
    return (common.length == len - 1) ? common : null
}

main()

