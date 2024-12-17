// solution for https://adventofcode.com/2024/day/2 part 1

"use strict"

const input = Deno.readTextFileSync("day02-input.txt").trim()

const allReports = [ ]

function main() {

    processInput()

    let totalSafe = 0
    
    for (const report of allReports) { if (isSafe(report)) { totalSafe += 1 } }
    
    console.log("the answer is", totalSafe)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const report = line.trim().split(" ")

        for (let n = 0; n < report.length; n++) { report[n] = parseInt(report[n]) }
        
        allReports.push(report)
    }
}

function isSafe(report) {

    const expectedSign = Math.sign(report[1] - report[0])
    
    for (let n = 1; n < report.length; n++) {
    
        const a = report[n - 1]
        const b = report[n]
    
        const delta = b - a
        
        if (Math.sign(delta) != expectedSign) { return false }
        
        if (Math.abs(delta) < 1) { return false }
        if (Math.abs(delta) > 3) { return false }
    }

    return true
}
 
console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

