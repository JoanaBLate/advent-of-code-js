"use strict"

// solving the puzzle takes (my computer) 0.030s

const start = "abcdefghijklmnop"

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const instructions = rawText.split(",")
    
    const programs = start.split("") 
     
    while (instructions.length > 0) {
        
        let instr = instructions.shift()
        
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
        
            instr = instr.substr(1) // x

            const indexA = parseInt(instr)
            
            instr = instr.replace(indexA.toString(), "")
            
            instr = instr.substr(1) // /
            
            const indexB = parseInt(instr)
            
            const programA = programs[indexA]
            const programB = programs[indexB]
        
            programs[indexA] = programB
            programs[indexB] = programA
            
            continue        
        }
    }    
        
    console.log("the order is", programs.join(""))
}

main()

