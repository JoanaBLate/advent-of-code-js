"use strict"

// solving the puzzle takes (my computer) 0.705s


const TOKENS = [ ] // original input tokens

var LENGTH = 0

const strengths = { }  // token: value

const matches = { } // end: [ tokens ]

const layers = [ ] // bridges grabbed by length


function main() {

    processInput()
    
    fillStrengths()
    
    fillMatches()
    
    fillLayers()
    
    console.log("the strength of the longest bridge is", findLongest())
}  

///////////////////////////////////////////////////////////

function processInput() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { TOKENS.push(rawLine.trim()) }
         
    LENGTH = TOKENS.length
}

function fillStrengths() {
    
    for (const token of TOKENS) {
        
        const parts = token.split("/")
        
        const endA = parseInt(parts.shift())
        const endB   = parseInt(parts.shift())
        
        strengths[token] = endA + endB
    }
}

function fillMatches() {

    for (const token of TOKENS) {
        
        const parts = token.split("/")
        
        const endA = parts.shift()
        const endB = parts.shift()
        
        if (matches[endA] == undefined) { matches[endA] = [ ] }

        matches[endA].push(token)
        
        if (endA == endB) { continue }
                
        if (matches[endB] == undefined) { matches[endB] = [ ] }

        matches[endB].push(token)
    }
}

///////////////////////////////////////////////////////////
    
function fillLayers() {

    let layer = createFirstLayer()

    layers.push(layer)
    
    while (true) {

        layer = createNewLayer(layer)
        
        if (layer.length == 0) { break }
        
        layers.push(layer)
    }            
}

function createFirstLayer() {
    
    const layer = [ ]
    
    for (const token of TOKENS) {
        
        if (! token.startsWith("0/")) { continue }
        
        const parts = token.split("/")
        
        const bridge = { "tokens": [ token ], "end": parts.pop(), "strength": strengths[token] }
        
        layer.push(bridge)
    }
    
    return layer
}

function createNewLayer(currentLayer) {

    const newLayer = [ ]
    
    for (const bridge of currentLayer) { createAndPushNewBridges(bridge, newLayer) }
    
    return newLayer
}

function createAndPushNewBridges(bridge, layer) {
    
    const candidates = matches[bridge.end]
    
    for (const token of candidates) {
    
        if (bridge.tokens.includes(token)) { continue }
        
        const parts = token.split("/")
        
        const a = parts.shift()
        const b = parts.shift()
        
        let newEnd = ""
        
        if (a == bridge.end) {
        
            newEnd = b
        }
        else if (b == bridge.end) {
        
            newEnd = a
        }
        
        const newTokens = bridge.tokens.slice()
        
        newTokens.push(token)
        
        const newStrength = bridge.strength + strengths[token]
        
        const newBridge = { "tokens": newTokens, "end": newEnd, "strength": newStrength }
        
        layer.push(newBridge)
    }
}

///////////////////////////////////////////////////////////

function findLongest() {

    let best = 0
    
   const layer = layers[layers.length - 1]
    
    for (const bridge of layer) {
    
        if (bridge.strength > best) { best = bridge.strength }
    } 
       
    return best
}

main()

