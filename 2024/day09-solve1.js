// solution for https://adventofcode.com/2024/day/9 part 1

"use strict"

const input = Deno.readTextFileSync("day09-input.txt").trim()

const disk = [ ]


function main() {

    processInput()

    moveFiles()
        
    console.log("the answer is", checksum())
}

function processInput() {
        
    let index = -1
    let fileId = -1

    while (true) {
    
        index += 1
        
        const fileLength = input[index]
        
        if (fileLength == undefined) { return }
        
        fileId += 1
        
        for (let n = 0; n < fileLength; n++) { disk.push(fileId) }
        
        index += 1
        
        const blankLength = input[index]
        
        if (blankLength == undefined) { return }
        
        for (let n = 0; n < blankLength; n++) { disk.push(-1) } // -1 means blank space
    }
}

function moveFiles() {

    let leftIndex = -1
    let rightIndex = disk.length

    while (true) {
    
        while (true) {
            leftIndex += 1
            if (leftIndex == disk.length) { return }
            if (leftIndex >= rightIndex) { return }
            if (disk[leftIndex] == -1) { break }
        }
    
        while (true) {
            rightIndex -= 1
            if (rightIndex == -1) { return }
            if (rightIndex <= leftIndex) { return }
            if (disk[rightIndex] != -1) { break }
        }
        
        disk[leftIndex] = disk[rightIndex]
        
        disk[rightIndex] = -1
    }
}

function checksum() {

    let result = 0

    for (let index = 0; index < disk.length; index++) {
    
        const file = disk[index]
        
        if (file != -1) { result += index * file }
    }
    return result
}
    
console.time("execution time")
main()
console.timeEnd("execution time") // 8ms

