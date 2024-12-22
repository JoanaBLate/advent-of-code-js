// solution for https://adventofcode.com/2024/day/19 part 1

"use strict"

const input = Deno.readTextFileSync("day19-input.txt").trim()

const allTargets = [ ]

const patternsBySize = { } // { size: list }

const patternsByLetter = { } // { letter: list }

const cache = { } // token: true/false


function main() {

    processInput()

    simplifyPatterns()
    
    fillPatternsByLetter()

    let count = 0
    
    for (const target of allTargets) { 

        if (isComposable(target)) { count += 1 }
    }
    
    console.log("the answer is", count)
}

function processInput() {
    
    const sections = input.split("\n\n")
    
    const rawTargets = sections.pop().trim().split("\n")
    
    for (const rawTarget of rawTargets) { allTargets.push(rawTarget.trim()) }
    
    const patterns = sections.pop().trim().split(", ")
    
    for (const pattern of patterns) {

        const size = pattern.length
        
        if (patternsBySize[size] == undefined) { patternsBySize[size] = [ ] }
        
        patternsBySize[size].push(pattern)
    }
}

///////////////////////////////////////////////////////////////////////////////

function simplifyPatterns() {

    const maxSize = Object.keys(patternsBySize).length
    
    for (let size = 2; size <= maxSize; size++) { simplifyPatternsThisSize(size) }
}

function simplifyPatternsThisSize(size) {
    
    const newList = [ ]
    
    for (const pattern of patternsBySize[size]) {
    
        if (! isRedundant(pattern, 1)) { newList.push(pattern) }
    }

    patternsBySize[size] = newList
}

function isRedundant(sourcePattern, reductor) {

    const maxSize = sourcePattern.length - reductor
    
    for (let size = maxSize; size > 0; size--) { // decreasing
    
        for (const pattern of patternsBySize[size]) {
        
            if (! sourcePattern.startsWith(pattern)) { continue }
            
            const remain = sourcePattern.replace(pattern, "")
            
            if (remain == "") { return true }

            if (isRedundant(remain, 0)) { return true }        
        }        
    }
    
    return false
}

///////////////////////////////////////////////////////////////////////////////

function fillPatternsByLetter() {

    const maxSize = Object.keys(patternsBySize).length

    for (let size = maxSize; size > 0; size--) { // decreasing

        for (const pattern of patternsBySize[size]) {
        
            const letter = pattern[0]
            
            if (patternsByLetter[letter] == undefined) { patternsByLetter[letter] = [ ] }
            
            patternsByLetter[letter].push(pattern)
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

function isComposable(target) {

    if (cache[target] !== undefined) { return cache[target] }

    for (const pattern of patternsByLetter[target[0]]) {
    
        if (! target.startsWith(pattern)) { continue }
        
        const remain = target.replace(pattern, "")
        
        if (remain == "") { cache[target] = true; return true }
        
        if (isComposable(remain)) { cache[target] = true; return true }
    }
    
    cache[target] = false
    return false
}

console.time("execution time")
main()
console.timeEnd("execution time") // 18ms

