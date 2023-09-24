"use strict"

// solving the puzzle takes (my computer) 0:026s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) {
        
        const info = createBlankInfo()

        const index = rawLine.indexOf(":")
        
        info.aunt = rawLine.substr(0, index)
        
        const tokens = rawLine.substr(index + 1).trim().split(",")
        
        while (tokens.length != 0) {
        
            const token = tokens.shift()
            const subtokens = token.split(":")
            const key = subtokens.shift().trim()
            const value = parseInt(subtokens.shift().trim())
            info[key] = value
        }
        
        if (! checkCandidate(info)) { continue }
        
        console.log("real aunt Sue is", info.aunt)
        
        return
    }
}
        
function createBlankInfo() {

    return  {
        aunt: "",
        children: -1,
        cats: -1,
        samoyeds: -1,
        pomeranians: -1,
        akitas: -1,
        vizslas: -1,
        goldfish: -1,
        trees: -1,
        cars: -1,
        perfumes: -1
    }
}

function checkCandidate(info) {

    if (info.children != -1  &&  info.children != 3) { return false }
    
    if (info.cats != -1  &&  info.cats == 0) { return false }
    
    if (info.samoyeds != -1  &&  info.samoyeds != 2) { return false }
    
    if (info.pomeranians != -1  &&  info.pomeranians >= 3) { return false }
    
    if (info.akitas != -1  &&  info.akitas != 0) { return false }
    
    if (info.vizslas != -1  &&  info.vizslas != 0) { return false }
    
    if (info.goldfish != -1  &&  info.goldfish >= 5) { return false }
    
    if (info.trees != -1  &&  info.trees <= 3) { return false }
    
    if (info.cars != -1  &&  info.cars != 2) { return false }
    
    if (info.perfumes != -1  &&  info.perfumes != 1) { return false }

    return true
}

main()

