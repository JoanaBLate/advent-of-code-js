"use strict"

// solving the puzzle takes (my computer) 0.035s

const DATA = [ ]

var HEIGHT = 0

var WIDTH = 0

var homeRow = 0
var homeCol = 0


function main() {

    processInput()
    
    findHome()

    const homeSymbol = getHomeSymbol()
        
    DATA[homeRow] = DATA[homeRow].replace("S", homeSymbol) 
    
    console.log("the answer is", search())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
    
    HEIGHT = DATA.length
    
    WIDTH = DATA[0].length
}

function findHome() {

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            if (DATA[row][col] == "S") { homeRow = row; homeCol = col; return }
        }
    }
}

function getHomeSymbol() {

    const northOk = checkNeighbor(homeRow - 1, homeCol, "|7F")
    const southOk = checkNeighbor(homeRow + 1, homeCol, "|JL")

    const eastOk = checkNeighbor(homeRow, homeCol + 1, "-7J")
    const westOk = checkNeighbor(homeRow, homeCol - 1, "-FL")

    if (northOk && southOk) { return "|" }
    if (northOk && eastOk)  { return "L" }
    if (northOk && westOk)  { return "J" }
    
    if (southOk && eastOk)  { return "F" }
    if (southOk && westOk)  { return "7" }
    
    if (westOk  &&  eastOk) { return "-" }
    
    console.log("ERROR while getting home symbol")
    Deno.exit()
}

function checkNeighbor(row, col, chars) {
        
    if (row < 0) { return false }
    if (col < 0) { return false }
    
    if (row > HEIGHT - 1) { return false }
    if (col > WIDTH  - 1) { return false }

    return chars.includes(DATA[row][col])
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function search() {
     
    const distanceMap = [ ]
    
    for (let n = 0; n < HEIGHT; n++) { 
    
        const line = new Int32Array(WIDTH)
        
        line.fill(-1)
        
        distanceMap.push(line) 
    }

    let distance = -1
    
    let futureNodes = [ createPoint(homeRow, homeCol) ]
    
    while (true) {
    
        if (futureNodes.length == 0) { return distance }
        
        const currentNodes = futureNodes
        
        distance += 1   
        
        futureNodes = [ ]
    
        for (const node of currentNodes) {
        
            const row = node.row
            const col = node.col
            
            distanceMap[row][col] = distance
            
            const symbol = DATA[row][col]
        
            if (symbol == ".") { continue }
            
            if (symbol == "-") { addNode(row, col, "west");  addNode(row, col, "east"); continue }
            
            if (symbol == "|") { addNode(row, col, "north"); addNode(row, col, "south"); continue }
            
            if (symbol == "L") { addNode(row, col, "north"); addNode(row, col, "east"); continue }
            
            if (symbol == "J") { addNode(row, col, "north"); addNode(row, col, "west"); continue }
            
            if (symbol == "F") { addNode(row, col, "south"); addNode(row, col, "east"); continue }
            
            if (symbol == "7") { addNode(row, col, "south"); addNode(row, col, "west"); continue }
            
            console.log("ERROR: unknown symbol '" + symbol + "' at  row", row, " col", col)
            Deno.exit()
        }
    }
    
    function addNode(row, col, direction) {
    
        if (direction == "north") { row -= 1 }
        if (direction == "south") { row += 1 }
        if (direction == "west")  { col -= 1 }
        if (direction == "east")  { col += 1 }
        
        if (row < 0) { return }
        if (col < 0) { return }
        
        if (row > HEIGHT - 1) { return }
        if (col > WIDTH -1 )  { return }
        
        if (distanceMap[row][col] != -1) { return }
        
        distanceMap[row][col] = -2 // reserved
        
        futureNodes.push(createPoint(row, col))        
    }
}

main()

