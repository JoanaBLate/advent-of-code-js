"use strict"

// solving the puzzle takes (my computer) 0.030s

const input = Deno.readTextFileSync("input.txt").trim()

const NUMBERS = [ ]

const BOARDS = [ ]

const DIM = 5 //  *WARNING*: MAYBE YOU HAVE TO CHANGE THIS VALE FOR YOUR INPUT!!!


function main() {

    processInput()
    
    let winnerBoard = null
    let winnerNumber = -1
    
    for (const number of NUMBERS) {
        
        const boardObjs = markBoards(number)
        
        for (const boardObj of boardObjs) {
        
            const index = BOARDS.indexOf(boardObj)
        
            BOARDS.splice(index, 1)
            
            if (BOARDS.length == 0) {
                
                winnerBoard = boardObj.board
                winnerNumber = number
                
                break
            }
        }
    }
    
    console.log("the answer is", calcResult(winnerBoard, winnerNumber))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const blocks = input.split("\n\n")
    
    const strNumbers = blocks.shift().trim().split(",")
    
    for (const s of strNumbers) { NUMBERS.push(parseInt(s)) }
    
    for (const block of blocks) { BOARDS.push(createBoardObj(block)) }
}
    
function createBoardObj(block) {

    const board = [ ]

    const lines = block.trim().split("\n")
    
    for (const line of lines) { 
    
        const boardLine = [ ]
        
        board.push(boardLine)
    
        const tokens = line.trim().split(" ")

        for (const token of tokens) {
        
            if (token.trim() == "") { continue }
            
            boardLine.push(parseInt(token))
        }
    }
    return { "board": board, "rowPoints": new Uint8Array(DIM), "colPoints": new Uint8Array(DIM) }
}

///////////////////////////////////////////////////////////

function markBoards(number) {

    const winners = [ ]

    for (const boardObj of BOARDS) { 
    
        markBoard(boardObj, number)
        
        for (let n = 0; n < DIM; n++) {
        
            if (boardObj.rowPoints[n] == DIM) { winners.push(boardObj); break }
            
            if (boardObj.colPoints[n] == DIM) { winners.push(boardObj); break }        
        }
    }
    return winners
}

function markBoard(boardObj, number) {

    for (let row = 0; row < DIM; row++) {
    
        for (let col = 0; col < DIM; col++) {

            if (boardObj.board[row][col] != number) { continue }

            boardObj.rowPoints[row] += 1
            boardObj.colPoints[col] += 1
        }
    }
}

///////////////////////////////////////////////////////////

function calcResult(winnerBoard, winnerNumber) {
    
    const index = NUMBERS.indexOf(winnerNumber)
    
    const numbers = NUMBERS.slice(0, index + 1)
    
    let sum = 0

    for (const line of winnerBoard) { 
    
        for (const number of line) { 
        
            if (numbers.includes(number)) { continue }
            
            sum += number
        }
    }
    
    return sum * winnerNumber
}

main()

