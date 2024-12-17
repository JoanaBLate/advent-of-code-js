"use strict"

// solving the puzzle takes (my computer) 0.024s

var TIME = 0
var DISTANCE = 0


function main() {

    processInput()
         
    console.log("the answer is", calcWays(TIME, DISTANCE))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
            
    const lines = input.split("\n")
    
    const stringTimes = lines.shift().split(":").pop().trim().split(" ") // includes white spaces

    const stringDistances = lines.shift().split(":").pop().trim().split(" ") // includes white spaces
    
    let stringTime = ""
    
    for (const token of stringTimes) { 
    
        const clean = token.trim()
        
        stringTime += clean
    }
    
    TIME = parseInt(stringTime)
    
    let stringDistance = "" 
    
    for (const token of stringDistances) { 
    
        const clean = token.trim()
        
        stringDistance += clean
    }
    
    DISTANCE = parseInt(stringDistance)
}

function calcWays(duration, record) {

    /*
        if we know the LOWEST pressing time able to break the record; the
        respective navigation time is easy to find: (pressing + navigation = duration)

        we can easily find the HIGHEST pressing time able to break the record and its
        respective navigation time: it is just the exchange of the lowest values:
        
        distance = navigation * pressing  ALSO  distance = pressing * navigation
        
        the HIGHEST_pressing_time == navigation_time of the LOWEST_pressing_time
        
        the number of ways to break the record may be calulated this way:
        
        HIGHEST_pressing_time - LOWEST_pressing_time + 1         
    */

    const guessedSpeed = Math.floor(record / duration) // not precise

    const lowestPressing = findLowestPressing(duration, record, guessedSpeed)
    
    const lowestNavigation = duration - lowestPressing
    
    const highestPressing = lowestNavigation

    return highestPressing - lowestPressing + 1
}

function findLowestPressing(duration, record, guessedSpeed) {

    // low is failure
    // high is success

    let low = -1
    let high = 2 * guessedSpeed
    
    let candidate = guessedSpeed
    
     while (true) {

        if (breaksRecord(duration, record, candidate)) {
        
            high = candidate
        }
        else {
            low = candidate 
        }            

        if (high == low + 1) { return high }
            
        candidate = Math.floor((low + high) / 2)
    }
}

function breaksRecord(duration, record, pressing) {

    const navigationTime = duration - pressing
    
    let distance = navigationTime * pressing
        
    return distance > record
}

main()

