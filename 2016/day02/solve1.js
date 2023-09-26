"use strict"

// solving the puzzle takes (my computer) 0.032s


var buttons = { // row~col: button

    "1~1": 1, "1~2": 2, "1~3": 3,
    
    "2~1": 4, "2~2": 5, "2~3": 6,
    
    "3~1": 7, "3~2": 8, "3~3": 9
}

var row = 2

var col = 2

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
    
        if (c == "U"  &&  row > 1) { row -= 1; continue }
        
        if (c == "D"  &&  row < 3) { row += 1; continue }
        
        if (c == "R"  &&  col < 3) { col += 1; continue }
        
        if (c == "L"  &&  col > 1) { col -= 1; continue }
    }
}

main()

