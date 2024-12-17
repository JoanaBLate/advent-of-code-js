"use strict"

// solving the puzzle takes (my computer) 0.035s

const stars = [ ]

const galaxies = [ ] // galaxy is a shorter name than constellation;
                     // I would not like to use "c" or "constel"
                     // and cannot use const

function main() {

    processInput()
        
    while (stars.length != 0) { galaxies.push(createGalaxy()) }  
     
    console.log("the answer is", galaxies.length)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(",")
        
        const x = parseInt(tokens.shift())
        const y = parseInt(tokens.shift())
        const z = parseInt(tokens.shift())
        const t = parseInt(tokens.shift())
        
        stars.push({ "x": x, "y": y, "z": z, "t": t })      
    }
}

///////////////////////////////////////////////////////////

function createGalaxy() {

    const galaxy = [ stars.shift() ]
    
    let memberIndex = 0
    
    while (memberIndex < galaxy.length) {
    
        const member = galaxy[memberIndex]
    
        let starIndex = 0
    
        while (starIndex < stars.length) {
        
            const star = stars[starIndex]
            
            if (! areClose(member, star)) { starIndex += 1; continue }
            
            galaxy.push(star) // star becomes member and will query as member
            
            stars.splice(starIndex, 1) // removing star, keeping the same starIndex
        }        
        memberIndex += 1        
    }
    return galaxy
}

function areClose(a, b) {

    const deltaX = Math.abs(a.x - b.x)
    const deltaY = Math.abs(a.y - b.y)
    const deltaZ = Math.abs(a.z - b.z)
    const deltaT = Math.abs(a.t - b.t)
  
    return deltaX + deltaY + deltaZ + deltaT <= 3
}

main()

