"use strict"

// solving the puzzle takes (my computer) 0.025s


var buttons = { // row~col: button

                          "1~3": 1,
               "2~2": 2,  "2~3": 3,  "2~4": 4,
    "3~1": 5,  "3~2": 6,  "3~3": 7,  "3~4": 8,  "3~5": 9,
               "4~2":'A', "4~3":'B', "4~4":'C',
                          "5~3":'D'
}

var row = 3

var col = 1

var code = ""


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) {
    
        proceedInstruction(rawLine.trim())
        
        code += buttons[row + "~" + col]
    }
    
    console.log("bathroom code is", code)
}

function proceedInstruction(instruction) {

    for (const c of instruction) {
    
        if (c == "U"  &&  exists(-1, 0)) { row -= 1; continue }
        
        if (c == "D"  &&  exists(+1, 0)) { row += 1; continue }
        
        if (c == "R"  &&  exists(0, +1)) { col += 1; continue }
        
        if (c == "L"  &&  exists(0, -1)) { col -= 1; continue }
    }
}

function exists(deltaRow, deltaCol) {

    const position = (row + deltaRow) + "~" + (col + deltaCol)
    
    return buttons[position] != undefined
}

main()

