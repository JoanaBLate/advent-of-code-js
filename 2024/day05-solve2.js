// solution for https://adventofcode.com/2024/day/X part 2

"use strict"

const input = Deno.readTextFileSync("day05-input.txt").trim()

const forbiddenFollowersFor = { }

const allGroups = [ ]
const badGroups = [ ]

var result = 0

function main() {

    processInput()
    
    for (const group of allGroups) { processGroup(group) }
    
    for (const group of badGroups) { processBadGroup(group) }
    
    console.log("the answer is", result)
}

function processInput() {
        
    const parts = input.split("\n\n")
    
    const rules = parts.shift().split("\n")
    
    for (const rule of rules) { 
    
        const numbers = rule.trim().split("|")
        
        const a = parseInt(numbers.shift())
        const b = parseInt(numbers.shift())
        
        if (forbiddenFollowersFor["" + b] == undefined) { forbiddenFollowersFor["" + b] = [ ] }
    
        const list = forbiddenFollowersFor["" + b]
        
        if (! list.includes(a)) { list.push(a) }        
    }
    
    const rawGroups = parts.shift().split("\n")
    
    for (const rawGroup of rawGroups) { 
    
        const stringGroup = rawGroup.trim().split(",")
        
        const group = [ ]
        
        for (const str of stringGroup) { group.push(parseInt(str)) }
        
        allGroups.push(group)
    }
} 

function processGroup(group) {

    const lastPos = group.length - 1

    for (let n = 0; n < lastPos; n++) {
    
        for (let p = n + 1; p <= lastPos; p++) {
        
            const a = group[n]
            const b = group[p]
            
            if (! obeyRules(a, b)) { badGroups.push(group); return }
        }    
    }    
}

function processBadGroup(group) {

    while (true) {
    
        const ok = tryFixBadGroup(group)
        
        if (ok) { break }
    }

    const index = Math.floor(group.length / 2)
    
    result += group[index]
}

function tryFixBadGroup(group) {

    let ok = true

    const lastPos = group.length - 1

    for (let n = 0; n < lastPos; n++) {
    
        for (let p = n + 1; p <= lastPos; p++) {
        
            const a = group[n]
            const b = group[p]
            
            if (! obeyRules(a, b)) { group[n] = b; group[p] = a; ok = false }
        }    
    }
    return ok
}

function obeyRules(a, b) {
            
    const list = forbiddenFollowersFor["" + a]
    
    if (list == undefined) { return true }
            
    return ! list.includes(b)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 6ms
 
