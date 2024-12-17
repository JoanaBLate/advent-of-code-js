// solution for https://adventofcode.com/2024/day/X part 1

"use strict"

const input = Deno.readTextFileSync("day05-input.txt").trim()

const forbiddenFollowersFor = { }

const allGroups = [ ]

var result = 0

function main() {

    processInput()
    
    for (const group of allGroups) { processGroup(group) }
    
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
            
            if (! obeyRules(a, b)) { return }
        }    
    }  
    
    const index = Math.floor(group.length / 2)
    
    result += parseInt(group[index])  
}

function obeyRules(a, b) {
            
    const list = forbiddenFollowersFor["" + a]
    
    if (list == undefined) { return true }
            
    return ! list.includes(b)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms
 
