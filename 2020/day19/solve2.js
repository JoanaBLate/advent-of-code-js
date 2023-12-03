"use strict"

// solving the puzzle takes (my computer) 0.033s

// excepting the TOP rules, this program replaces

// all links in all rules for literals (text)

// since the beginning, using "01" instead of "ab", for performance

// near the end, the format 011000111011... is translated to the format BAABA...
// where each letter represents a *group match* for each segment of 8 binary digits

const DATA = [ ]

const RULES = { }

var allKeys = [ ]

const LENGTH = 8 // all strings to be checked have length multiple of 8,
                 // also the words of groupA and groupB have length 8
                 
const MAX_SEGMENTS = 12 // the largest string to be checked has 96 characteres,
                        // (12 segments with length == LENGTH);
                        // so rule #8 and rule #11 must match at least 1, at most 11
                        // segments
                 
const referenceA = new Uint8Array(Math.pow(2, LENGTH))
const referenceB = new Uint8Array(Math.pow(2, LENGTH)) 

const allFinalCombinations = [ ] // in the form BAA, BABAAB, etc. 


function main() {

    processInput() 
    
    delete RULES["#0"]   // 0: 8 11
    delete RULES["#8"]   // 8: 42 | 42 8
    delete RULES["#11"]  // 11: 42 31 | 42 11 31
    
    allKeys = Object.keys(RULES)

    while (replaceBasicLinks()) { }

    while (replaceAdvancedLinks()) { }
    
    //

    const groupA = RULES["#31"].words
    const groupB = RULES["#42"].words
        
    for (const word of groupA) { const index = parseInt(word, 2); referenceA[index] = 1 }

    for (const word of groupB) { const index = parseInt(word, 2); referenceB[index] = 1 }

    //
    
    fillAllFinalCombinations()
    
    //
    
    let goods = 0   
    
    for (const data of DATA) { if (isApproved(data)) { goods += 1 } }
    
    console.log("the answer is", goods)
}

///////////////////////////////////////////////////////////

function fillAllFinalCombinations() {

    // length of largest token of each rule is (MAX_SEGMENTS - 1)

    const rule8 = [ "B", "BB", "BBB", "BBBB", "BBBBB", "BBBBBB", "BBBBBBB", "BBBBBBBB", 
                    "BBBBBBBBB", "BBBBBBBBBB", "BBBBBBBBBBB" ]
                    
    const rule11 = [ "BA", "BBAA", "BBBAAA", "BBBBAAAA", "BBBBBAAAAA" ]
            
    for (const token8 of rule8) {

        for (const token11 of rule11) {

            const newToken = token8 + token11
            
            if (newToken.length > MAX_SEGMENTS) { continue }
            
            allFinalCombinations.push(newToken)
        }
    }
}

function isApproved(data) {

    // 'A' matches groupA
    // 'B' matches groupB
    // for the current specific puzzle input, no segment matches both groups!!!

    let segments = ""
    
    while (data.length != "") {
    
        const binary8 = data.substr(0, 8)
        
        data = data.substr(8)
        
        const index = parseInt(binary8, 2)
        
        if (referenceA[index] == 1) {
        
            segments += "A"
        }
        else if (referenceB[index] == 1) {
        
            segments += "B"
        }
        else {
        
            return false
        }
    }
    return allFinalCombinations.includes(segments)
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
                
        const node = { "formulas": [ ], "words": [ ] }
        
        RULES[key] = node
        
        let value = parts.shift().trim()
                
        if (value == '"a"') { value = "0" }
        if (value == '"b"') { value = "1" }
        
        if (value == "0"  ||  value == "1") { node.formulas = null; node.words.push(value); continue }
        
        const stringFormulas = ("#" + value).split(" ").join(" #").split(" #| ")
        
        for (const sf of stringFormulas) { node.formulas.push(sf.split(" ")) }
    }
}

function convertToBinary(source) {

    let s = ""
    
    for (const c of source) { s += (c == "a") ? "0" : "1" }
    
    return s
}

function removeFormula(rule, formula) {

    const index = rule.formulas.indexOf(formula)
    
    rule.formulas.splice(index, 1)
    
    if (rule.formulas.length == 0) { rule.formulas = null }
}

///////////////////////////////////////////////////////////

function replaceBasicLinks() {

    const links = [ ]
    
    for (const key of allKeys) {
    
        const rule = RULES[key]
        
        if (rule.formulas != null) { continue }
        if (rule.words.length > 1) { continue } // not necessary
        
        links.push(key)    
    }

    let changed = false
    
    for (const key of allKeys) {
    
        if (replaceBasicLink(key, links)) { changed = true }
    }
    
    return changed
}

function replaceBasicLink(key, links) {
        
    const rule = RULES[key]
    
    if (rule.formulas == null) { return false }
    
    let changed = false
    
    for (const formula of rule.formulas) {

        for (const link of links) {
    
            const index = formula.indexOf(link)
            
            if (index == -1) { continue }            

            changed = true
 
            formula[index] = RULES[link].words[0]            
        }
    }
    
    if (! changed) { return false }

    mergeLiterals(rule)

    return true
}

function mergeLiterals(rule) {

    const formulas = [ ]

    for (const formula of rule.formulas) {
                
        if (formula.length == 1) { 
        
            if (formula[0][0] == "#") { formulas.push(formula) } else { rule.words.push(formula[0]) }
            
            continue
        }
         
        if (formula[0][0] == "#") { formulas.push(formula); continue }
        if (formula[1][0] == "#") { formulas.push(formula); continue }
        
        rule.words.push(formula[0] + formula[1])
    }
    
    if (formulas.length == 0) { rule.formulas = null } else { rule.formulas = formulas }
}

///////////////////////////////////////////////////////////

function replaceAdvancedLinks() {

    const links = [ ]
    
    for (const key of allKeys) {
    
        const rule = RULES[key]
        
        if (rule.formulas == null) { links.push(key) }
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
 
    if (rule.formulas == null) { return false }
    
    for (const formula of rule.formulas) {
    
        if (replaceAdvancedLinkThis(rule, formula, links)) { changed = true }
    }
    
    return changed
}

function replaceAdvancedLinkThis(rule, formula, links) {

    const targets = [ ]
    
    for (const token of formula) {
    
        if (token[0] != "#") { continue } // not a link
        
        if (! links.includes(token)) { return false } // not ready yet
        
        targets.push(token)
    }
    
    if (targets.length == 1)  { 
    
        replaceAdvancedLinkSingle(rule, formula, targets[0])
    }
    else {
    
        replaceAdvancedLinkDouble(rule, formula, targets[0], targets[1]) 
    }
    
    return true
}

///////////////////////////////////////////////////////////

function replaceAdvancedLinkSingle(rule, formula, link) { 

    removeFormula(rule, formula)
    
    const indexOfLink = formula.indexOf(link)
    
    const isHead = indexOfLink == 0
    
    formula.splice(indexOfLink, 1)
    
    const joker = formula.shift() ||  "" // maybe formula had only one token

    const sourceWords = RULES[link].words
    
    for (const sourceWord of sourceWords) {
    
        const newWord = isHead ? sourceWord + joker : joker + sourceWord
        
        rule.words.push(newWord)        
    }
}
    
///////////////////////////////////////////////////////////

function replaceAdvancedLinkDouble(rule, formula, linkA, linkB) {

    removeFormula(rule, formula)
    
    const ruleAWords = RULES[linkA].words
    const ruleBWords = RULES[linkB].words
    
    for (const wordA of ruleAWords) {
    
        for (const wordB of ruleBWords) {
            
            rule.words.push(wordA + wordB)
        }
    }
}

main()

