"use strict"

// solving the puzzle takes (my computer) 0.030s

const particles = [ ]

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        fillParticlesOnce(rawLine.trim())
    }     
        
    let leastAcceleration = 999999
    
    let best = -1
        
    for (let i = 0; i < particles.length; i++) {
    
        const ta = particles[i]["total-acceleration"]
    
        if (ta < leastAcceleration) { best = i; leastAcceleration = ta }
    }    
        
    console.log("particle that will stay closest to center is", best)
}

///////////////////////////////////////////////////////////

function fillParticlesOnce(line) {
    
    line = line.replace("p=<", "")
    
    let index = line.indexOf(">")
    
    const segmentP = line.substr(0, index)
    
    line = line.replace(segmentP, "")
    line = line.replace(">, v=<", "")
    
    index = line.indexOf(">")
    
    const segmentV = line.substr(0, index)
    
    line = line.replace(segmentV, "")
    line = line.replace(">, a=<", "")
    
    const segmentA = line.replace(">", "")


    const tokensP = segmentP.split(",")

    const pX = parseInt(tokensP.shift())
    const pY = parseInt(tokensP.shift())
    const pZ = parseInt(tokensP.shift())
    
    const tokensV = segmentV.split(",")

    const vX = parseInt(tokensV.shift())
    const vY = parseInt(tokensV.shift())
    const vZ = parseInt(tokensV.shift())
    
    const tokensA = segmentA.split(",")

    const aX = parseInt(tokensA.shift())
    const aY = parseInt(tokensA.shift())
    const aZ = parseInt(tokensA.shift())
    
    const particle = { "pX": pX, "pY": pY, "pZ": pZ, 
                       "vX": vX, "vY": vY, "vZ": vZ, 
                       "aX": aX, "aY": aY, "aZ": aZ,
                       
                       "total-acceleration": Math.abs(aX) + Math.abs(aY) + Math.abs(aZ) }
    
    particles.push(particle)
}

main()

