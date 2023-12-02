"use strict"

// solving the puzzle takes (my computer) 0.960s

// this solution involves replacing, step by step, all links in all rules for literal (text)

// since the beginning, using "01" instead of "ab", for performance


const DATA = [ ]

const RULES = { }

const REFERENCE = new Uint8Array(Math.pow(2, 25)) // more than 32 million items

var allKeys = [ ]


function main() {

    processInput() 
    
    allKeys = Object.keys(RULES)

    while (replaceBasicLinks()) { }

    while (replaceAdvancedLinks()) { }
    
   // l(RULES)
 
    //
        
    const models = RULES["#0"]

    for (const model of models) { 
    
        if (model == "|") { continue }
    
        const index = parseInt(model, 2)
        
        REFERENCE[index] = 1 
    }
    
    const length = models[0].length
    
    //
    
    let goods = 0   
        
    for (const data of DATA) {
    
        if (data.length != length) { continue }
        
        const index = parseInt(data, 2)
        
        if (REFERENCE[index] == 1) { goods += 1 }        
    }
    
    console.log("the answer is", goods)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const segments = input.split("\n\n")
        
    const rules = segments.shift().trim()
    const datas = segments.shift().trim()
    
    for (const line of datas.split("\n")) { 
    
        const data = convertToBinary(line.trim())
        
        DATA.push(data)
    }
    
    const lines = rules.split("\n")
    
    for (let n = 0; n < lines.length; n++) { RULES["#" + n] = null } // granting crescent order
    
    for (const line of lines) { 

        const parts = line.split(":")
        
        const key = "#" + parts.shift().trim()
                
        let value = parts.shift().trim()
        
        if (value == '"a"') { RULES[key] = [ "0" ]; continue }
        if (value == '"b"') { RULES[key] = [ "1" ]; continue }
        
        const tokens = value.split(" ")
        
        for (let n = 0; n < tokens.length; n++) {
        
            if (tokens[n] != "|") { tokens[n] = "#" + tokens[n] }
        }        
        
        RULES[key] = tokens
    }
}

function convertToBinary(source) {

    let s = ""
    
    for (const c of source) { s += (c == "a") ? "0" : "1" }
    
    return s
}

function isLink(token) {
    
    if (token == undefined) { return false }
    
    return token[0] == "#"
}

function isText(token) {

    if (token == undefined) { return false }
    
    return token[0] == "0"  ||  token[0] == "1"
}

function isLiteralRule(rule) {

    for (const token of rule) {
    
        if (isLink(token)) { return false }    
    }
    return true
}

///////////////////////////////////////////////////////////

function groupsFromRule(rule) {

    const groups = [ ]

    let group = [ ]
    
    for (const token of rule) {
    
        if (token != "|") { group.push(token); continue }

        groups.push(group); group = [ ]        
    }

    groups.push(group)

    return groups
}

///////////////////////////////////////////////////////////

function replaceBasicLinks() {

    const links = [ ]
    
    for (const key of allKeys) {
    
        const rule = RULES[key]
        
        if (rule.length > 1) { continue }
        
        if (isLink(rule[0])) { continue }
        
        links.push(key)    
    }

    let changed = false
    
    for (const key of allKeys) {
        
        if (replaceBasicLink(key, links)) { changed = true }
    }
    
    return changed
}

function replaceBasicLink(key, links) {
        
    let changed = false
    
    const rule = RULES[key]
    
    for (let n = 0; n < rule.length; n++) {

        const token = rule[n]
    
        if (! links.includes(token)) { continue }

        changed = true

        rule[n] = RULES[token][0]
    }
    
    if (! changed) { return false }
    
    mergeLiterals(rule)
        
    return true
}

function mergeLiterals(rule) {

    let n = -1
    
    while (true) {
    
        n += 1
    
        const current = rule[n]
        
        const next = rule[n+1]
        
        if (next == undefined) { return }
        
        if (! isText(current)) { continue }

        if (! isText(next)) { continue }
        
        rule[n] += next
        
        rule.splice(n + 1, 1)
        
        n -= 1
    }
}

///////////////////////////////////////////////////////////

function replaceAdvancedLinks() {

    const links = [ ]
    
    for (const key of allKeys) {
    
        const rule = RULES[key]
        
        if (isLiteralRule(rule)) { links.push(key) }
    }
    
    let changed = false
    
   for (const key of allKeys) {
   
        if (replaceAdvancedLink(key, links)) { changed = true }    
    }
    
    return changed
}
    
function replaceAdvancedLink(key, links) {

    let changed = false

    const rule = RULES[key]
 
    if (isLiteralRule(rule)) { return false }
    
    const groups = groupsFromRule(rule)

    rule.length = 0 // emptying the rule    
    
    for (const group of groups) {

        const newWords = replaceAdvancedLink2(group, links)
        
        if (newWords != null) {

            changed = true
            
            for (const word of newWords) { 
            
                if (rule.length != 0) { rule.push("|") }

                rule.push(word) 
            }
        }
        else {
        
            if (rule.length != 0) { rule.push("|") }

            for (const token of group) { rule.push(token) }
        }
    }
    
    return changed
} 

function replaceAdvancedLink2(tokens, links) {

    const targets = [ ]
    
    for (const token of tokens) {
    
        if (! isLink(token)) { continue }
        
        if (! links.includes(token)) { return null } // not ready yet
        
        targets.push(token)
    }
    
    if (targets.length == 0) { return null } // literal node
    
    if (targets.length == 1)  { return replaceAdvancedLinkSingle(tokens, targets[0]) } 
    
    return replaceAdvancedLinkDouble(tokens, targets[0], targets[1]) 
    
    console.log ("ERROR (replaceAdvancedLink2): execessive number of targets")
    Deno.exit()
}

///////////////////////////////////////////////////////////

function replaceAdvancedLinkSingle(tokens, link) {
    
    const indexOfLink = tokens.indexOf(link)
    
    const isHead = indexOfLink == 0
    
    tokens.splice(indexOfLink, 1)
    
    const joker = tokens.shift() ||  "" // joker may have come undefined!!!
    
    if (tokens.length != 0) { 
    
        console.log("ERROR (replaceAdvancedLink2): got node with more than two tokens")
        Deno.exit()
    }
    
    const newWords = [ ]
    
    const sourceTokens = RULES[link]
    
    for (const sourceToken of sourceTokens) {
    
        if (sourceToken == "|") { continue }

        const newWord = isHead ? sourceToken + joker : joker + sourceToken
        
        newWords.push(newWord)        
    }

    return newWords
}
    
///////////////////////////////////////////////////////////

function replaceAdvancedLinkDouble(tokens, linkA, linkB) {
    
    if (tokens.length != 2) { 
    
        console.log("ERROR (replaceLinkListDouble): got group with more than two tokens")
        Deno.exit()
    }
    
    const ruleA = RULES[linkA]
    const ruleB = RULES[linkB]
    
    const newWords = [ ]
    
    for (const wordA of ruleA) {
    
        if (wordA == "|") { continue }
            
        for (const wordB of ruleB) {
            
            if (wordB == "|") { continue }
            
            const newWord = wordA + wordB
            
            newWords.push(newWord)
        }
    }
   
    return newWords
}

main()

