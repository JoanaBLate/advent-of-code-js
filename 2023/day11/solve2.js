"use strict"

// solving the puzzle takes (my computer) 0.050s

const DATA = [ ]

var HEIGHT = 0

var WIDTH = 0

var homeRow = 0
var homeCol = 0

var allInsiders = 0

var recentInsiders = [ ]


function main() {

    processInput()
       
    findHome()

    DATA[homeRow][homeCol] = getHomeSymbol()
    
    const track = walkPipesMonoDirection()

    walkBorders()
    
    if (getRelativeOutside(track) == "left") {
    
        markInsidersAtRight(track)
    }
    else {
        markInsidersAtLeft(track)
    }
    
    expandInsiders()

  //  for (const line of DATA) { l(line.join("")) } // UNCOMMENT TO SEE THE MAP!

    console.log("the answer is", allInsiders)    
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
       
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim().split("")) }
    
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
    if (col > WIDTH -1 )  { return false }

    return chars.includes(DATA[row][col])
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function createTrackNode(row, col, oldDirection) {

    return { "row": row, "col": col, "oldDirection": oldDirection, "newDirection": "" }
}

///////////////////////////////////////////////////////////

function walkPipesMonoDirection() {

    // walking in a single direction demands only one node in future nodes

    const track = [ ]

    let futureNodes = [ createTrackNode(homeRow, homeCol, "unknown") ]
    
    while (true) {
    
        if (futureNodes.length == 0) { fixTrackDirections(track); return track }
        
        const currentNodes = futureNodes
                
        futureNodes = [ ]
    
        for (const node of currentNodes) {
            
            track.push(node)
            
            const row = node.row
            const col = node.col
            
            const symbol = DATA[row][col]
            
            DATA[row][col] = "@"
        
            if (symbol == "L") { addNode(row, col, "north"); addNode(row, col, "east"); continue }
            
            if (symbol == "|") { addNode(row, col, "north"); addNode(row, col, "south"); continue }
            
            if (symbol == "J") { addNode(row, col, "north"); addNode(row, col, "west"); continue }
            
            if (symbol == "F") { addNode(row, col, "east");  addNode(row, col, "south"); continue }
            
            if (symbol == "-") { addNode(row, col, "east");  addNode(row, col, "west"); continue }

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
        if (col > WIDTH  - 1) { return }
        
        if (futureNodes.length != 0) { return }
        
        const symbol = DATA[row][col]
    
        if (symbol == ".") { return }
        
        if (symbol == "@") { return }
        
        futureNodes.push(createTrackNode(row, col, direction))        
    }
}

function fixTrackDirections(track) {
    
    const home = track[0]
    const last = track.at(-1)
    
    home.oldDirection = findNextDirection(last, home)
    
    for (let n = 1; n < track.length; n++) {
    
        track[n - 1].newDirection = track[n].oldDirection    
    }
    
    last.newDirection = home.oldDirection
}
    
function findNextDirection(current, next) {
    
    if (next.row < current.row) { return "north" }
    if (next.row > current.row) { return "south" }
    if (next.col < current.col) { return "west" }
    if (next.col > current.col) { return "east" }
}

///////////////////////////////////////////////////////////

function walkBorders() {

    for (let row = 0; row < HEIGHT; row++) { 
    
        walkBorder(row, 0)
        walkBorder(row, WIDTH - 1)
    }
    
    for (let col = 0; col < WIDTH; col++) { 
    
        walkBorder(0, col)
        walkBorder(HEIGHT - 1, col)
    }
}

function walkBorder(row, col) {

    if (DATA[row][col] == "@") { return }
    if (DATA[row][col] == "#") { return }
    
    let futureNodes = [ createPoint(row, col) ]
    
    while (true) {
    
        if (futureNodes.length == 0) { return }
        
        const currentNodes = futureNodes
                
        futureNodes = [ ]
    
        for (const node of currentNodes) {
        
            const row = node.row
            const col = node.col
            
            DATA[row][col] = "#"
        
            addNode(row - 1, col)
            addNode(row + 1, col)
            addNode(row, col - 1)
            addNode(row, col + 1)
        }
    }
    
    function addNode(row, col) {
    
        if (row < 0) { return }
        if (col < 0) { return }
        
        if (row > HEIGHT - 1) { return }
        if (col > WIDTH  - 1) { return }
        
        if (DATA[row][col] == "@") { return }
        if (DATA[row][col] == "#") { return }
        
        DATA[row][col] = "#" // reserving
        
        futureNodes.push(createPoint(row, col))        
    }
}

///////////////////////////////////////////////////////////

function getRelativeOutside(track) {

    for (const node of track) {
    
        if (node.direction == "north") { 
            
            if (DATA[node.row][node.col - 1] == "#") { return "left" }
            if (DATA[node.row][node.col + 1] == "#") { return "right" }
            continue 
        }
        if (node.direction == "south") { 
            
            if (DATA[node.row][node.col + 1] == "#") { return "left" }
            if (DATA[node.row][node.col - 1] == "#") { return "right" }
            continue 
        }
        if (node.direction == "west") { 
            
            if (node.row + 1 < HEIGHT) {
            
                if (DATA[node.row + 1][node.col] == "#") { return "left" }
            }
            
            if (node.row > 0) {
            
                if (DATA[node.row - 1][node.col] == "#") { return "right" }
            }
            continue 
        }
        if (node.direction == "east") { 
        
            if (node.row > 0) {

                if (DATA[node.row - 1][node.col] == "#") { return "left" }
            }
            
            if (node.row + 1 < HEIGHT) {
                
                if (DATA[node.row + 1][node.col] == "#") { return "right" }
            }
            continue
        }
    }
}

///////////////////////////////////////////////////////////

function markInsidersAtLeft(track) {

    for (const node of track) { 
    
        markInsiderAtLeft(node.oldDirection, node.row, node.col)
        markInsiderAtLeft(node.newDirection, node.row, node.col)
    }
}

function markInsiderAtLeft(direction, row, col) {

    if (direction == "north") { markInsider(row, col - 1); return }
    if (direction == "south") { markInsider(row, col + 1); return }
    if (direction == "west")  { markInsider(row + 1, col); return }
    if (direction == "east")  { markInsider(row - 1, col); return }
}

function markInsidersAtRight(track) {

    for (const node of track) { 
    
        markInsiderAtRight(node.oldDirection, node.row, node.col)
        markInsiderAtRight(node.newDirection, node.row, node.col)
    }
}

function markInsiderAtRight(direction, row, col) {

    if (direction == "north") { markInsider(row, col + 1); return }
    if (direction == "south") { markInsider(row, col - 1); return }
    if (direction == "west")  { markInsider(row - 1, col); return }
    if (direction == "east")  { markInsider(row + 1, col); return }
}

///////////////////////////////////////////////////////////

function expandInsiders() {

    while (true) {

        if (recentInsiders.length == 0) { return }
    
        const insidersToDo = recentInsiders
        
        recentInsiders = [ ]
    
        for (const point of insidersToDo) {
        
            markInsider(point.row - 1, point.col)
            markInsider(point.row + 1, point.col)
            markInsider(point.row, point.col - 1)
            markInsider(point.row, point.col + 1)
        }
    }
}

function markInsider(row, col) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }
    
    if (DATA[row][col] == "@") { return }
    if (DATA[row][col] == "#") { return }
    if (DATA[row][col] == "*") { return }
    
    DATA[row][col] = "*"
    
    allInsiders += 1
    
    recentInsiders.push(createPoint(row, col))
}

main()

