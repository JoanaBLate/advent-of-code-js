// solution for https://adventofcode.com/2025/day/7 part 1

"use strict"

const input = Deno.readTextFileSync("day07-input.txt").trim()

const map = [ ] 

var beamCols = [ ] // just the column

var count = 0

function main() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { map.push(rawLine.trim()) }
        
    beamCols.push(map.shift().indexOf("S"))
    
    for (const line of map) { processMapLine(line) }
      
    console.log("the answer is", count)
}

function processMapLine(line) {

    const newBeamCols = [ ]
    
    for (const col of beamCols) {
    
         if (line[col] == ".") { 
         
            if (! newBeamCols.includes(col)) { newBeamCols.push(col) }
            continue 
        }
         
        count += 1
         
        const colLeft = col - 1
         
        // cheking redundancy may not be necessary
        if (colLeft > -1  && ! newBeamCols.includes(colLeft)) { newBeamCols.push(colLeft) } 
         
        const colRight = col + 1
        
        // cheking redundancy may not be necessary
        if (colRight < line.length  && ! newBeamCols.includes(colRight)) { newBeamCols.push(colRight) }
    
    }
    
    beamCols = newBeamCols
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

