"use strict"

// solving the puzzle takes (my computer) 0.130s

const start = "abcdefghijklmnop"

const archive = [ ]

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const instructions = rawText.split(",")
    
    const programs = start.split("") 
    
    let cycleLength = 0
    
    while (true) {
     
        applyInstructions(programs, instructions)
        
        cycleLength += 1
        
        if (programs.join("") == start) { break }
    }
    
    const turnsToGo = (1000 * 1000 * 1000) % cycleLength
    
    for (let n = 0; n < turnsToGo; n++) { applyInstructions(programs, instructions) }
       
    console.log("the order afer one billion is", programs.join(""))
}

///////////////////////////////////////////////////////////

function applyInstructions(programs, instructions) {
     
    for (const instr of instructions) {
                
        if (instr[0] == "s") {
        
            let n = parseInt(instr.substr(1))
            
            while (n > 0) { n -= 1; programs.unshift(programs.pop()) }

            continue
        }    
        
        if (instr[0] == "p") {
        
            const programA = instr[1]
            const programB = instr[3]

            const indexA = programs.indexOf(programA)
            const indexB = programs.indexOf(programB)
        
            programs[indexA] = programB
            programs[indexB] = programA
            
            continue        
        }   
        
        if (instr[0] == "x") {
        
            let s = instr.substr(1) // x

            const indexA = parseInt(s)
            
            s = s.replace(indexA.toString(), "")
            
            s = s.substr(1) // /
            
            const indexB = parseInt(s)
            
            const programA = programs[indexA]
            const programB = programs[indexB]
        
            programs[indexA] = programB
            programs[indexB] = programA
            
            continue        
        }
    }
}

main()

