"use strict"

// solving the puzzle takes (my computer) 0.030s

var map = [ ]

const cars = [ ]


function main() {

    processInput()
    
    findCars()
    
    while (true) {
    
        sortCars()
    
        for (const car of cars) { moveCar(car) }
    
        deleteCrashedCars()
        
        if (cars.length == 1) { break }
    }     

    const car = cars[0]
     
    console.log("the answer is", car.col + "," + car.row)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt") // .trim()
        
    map = input.split("\n")
}

///////////////////////////////////////////////////////////

function findCars() {

    let row = -1   
     
    for (const line of map) {
    
        row += 1
       
        let col = -1
        
        for (const c of line) {
            
            col += 1
            
            if ("^v<>".includes(c)) { carWasFound(c, row, col) }
        }
    }
}

function carWasFound(direction, row, col) {   
    
    const car = { "direction": direction, "row": row, "col": col, "lastTurn": "right", "crashed": false }
    
    cars.push(car)
}

///////////////////////////////////////////////////////////

function sortCars() {

    while (sortCarsByRow()) { }
    while (sortCarsByCol()) { }
}

function sortCarsByRow() { 

    for (let index = 0; index < cars.length; index++) {
    
        const current = cars[index]
        const next = cars[index + 1]
        
        if (next == undefined) { return false }
    
        if (current.row <= next.row) { continue }
    
        cars[index] = next
        cars[index + 1] = current
        
        return true
    }
 // return false
}

function sortCarsByCol() { 

    for (let index = 0; index < cars.length; index++) {
    
        const current = cars[index]
        const next = cars[index + 1]
        
        if (next == undefined) { return false }
    
        if (current.row < next.row) { continue }
    
        // now current.row == current.col
        
        if (current.col <= next.col) { continue }
        
        cars[index] = next
        cars[index + 1] = current
        
        return true
    }
 // return false
}

///////////////////////////////////////////////////////////

function moveCar(car) {
//console.log(car.row,car.col)

    if (car.crashed) { return }

    const char = map[car.row][car.col]
    
    if (char == "+") { 
    
        carChosesTurn(car) 
    }
    else if (char == "/") { 
    
        makeCarTurn(car, char) 
    }
    else if (char == "\\") { 
    
        makeCarTurn(car, char) 
    }
    
    
    if (car.direction == "^") {
        
        car.row -= 1
    }
    else if (car.direction == "v") {
        
        car.row += 1
    }
    else if (car.direction == "<") {
        
        car.col -= 1
    }
    else if (car.direction == ">") {
        
        car.col += 1
    }
    
    checkCrash(car)
}

function makeCarTurn(car, char) {

    if (char == "\\") {
    
        if (car.direction == "^") { car.direction = "<"; return }
        if (car.direction == "v") { car.direction = ">"; return }
        if (car.direction == "<") { car.direction = "^"; return }
        if (car.direction == ">") { car.direction = "v"; return }
    }
    else {
    
        if (car.direction == "^") { car.direction = ">"; return }
        if (car.direction == "v") { car.direction = "<"; return }
        if (car.direction == "<") { car.direction = "v"; return }
        if (car.direction == ">") { car.direction = "^"; return }
    }
}

function carChosesTurn(car) {

    let turn = ""
    
    if (car.lastTurn == "left") {
    
        turn = "straight"    
    }
    else if (car.lastTurn == "straight") {
    
        turn = "right"    
    }
    else if (car.lastTurn == "right") {
        
        turn = "left"
    }
    car.lastTurn = turn
    
    
    if (car.direction == "^") {
    
        if (turn == "left") {
        
            car.direction = "<"
        }
        else if (turn == "right") {
        
            car.direction = ">"
        }    
    }
    
    else if (car.direction == "v") {
    
        if (turn == "left") {
        
            car.direction = ">"
        }
        else if (turn == "right") {
        
            car.direction = "<"
        }    
    }    
    
    else if (car.direction == "<") {
    
        if (turn == "left") {
        
            car.direction = "v"
        }
        else if (turn == "right") {
        
            car.direction = "^"
        }    
    }
    
    else if (car.direction == ">") {
    
        if (turn == "left") {
        
            car.direction = "^"
        }
        else if (turn == "right") {
        
            car.direction = "v"
        }    
    }
}

function checkCrash(activeCar) {

    for (const car of cars) {
    
        if (car == activeCar) { continue }
        if (car.row != activeCar.row) { continue } 
        if (car.col != activeCar.col) { continue } 
        
        car.crashed = true
        activeCar.crashed = true
        return        
    }
}

function deleteCrashedCars() {

    for (let index = cars.length - 1; index > -1; index--) {
    
        if (cars[index].crashed) { cars.splice(index, 1) }
    }
}

main()

