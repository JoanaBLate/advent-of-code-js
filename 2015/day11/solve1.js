"use strict"

// solving the puzzle takes (my computer) 0.090s

function main() {

    let password = Deno.readTextFileSync("input.txt").trim()

    while (true) {

        password = increasePassword(password)
        
        if (! trioOk(password)) { continue }
        
        if (! pairsOk(password)) { continue }

        if (! forbiddenOk(password)) { continue }
        
        break
    }
            
    console.log("new password is", password)
}

function increasePassword(password) {

    const len = password.length
    
    const list = password.split("")
    
    for (let i = len - 1; i > -1; i--) {
    
        const newLetter = increaseLetter(list[i])

        list[i] = newLetter
                
        if (newLetter != "a") { break }
    }
    
    return list.join("")
}

function increaseLetter(l) {

    if (l == "z") { return "a" }
    
    const n = l.charCodeAt(0)
    
    return String.fromCharCode(n + 1)
}

function trioOk(password) {

    let maxIndex = password.length - 3 // last 2 characters cannot start a trio
    
    for (let i = 0; i <= maxIndex; i++) {
    
        const a = password[i]
        const b = password[i + 1]
        const c = password[i + 2]
        
        if (a.charCodeAt(0) + 1 != b.charCodeAt(0)) { continue }
        if (b.charCodeAt(0) + 1 != c.charCodeAt(0)) { continue }
        
        return true
    }
    return false
}

function pairsOk(password) {

    let firstPairRef = ""

    let maxIndex = password.length - 2 // last character cannot start a pair
    
    for (let i = 0; i <= maxIndex; i++) {
    
        const a = password[i]
        const b = password[i + 1]
        
        if (a == b) { 
        
            if (a == firstPairRef) { continue }
            
            if (firstPairRef == "") { firstPairRef = a; continue } 
        
            return true
        }
    }
    return false
}

function forbiddenOk(password) {

    for (const c of password) {
    
        if ("iol".includes(c)) { return false }
    }
    return true
}

main()

