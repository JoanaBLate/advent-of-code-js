// solution for https://adventofcode.com/2024/day/9 part 2

"use strict"

const input = Deno.readTextFileSync("day09-input.txt").trim()

const disk = [ ]

const allFiles = [ ]

// just for efficiency
const searchStartBySpaceSize = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0
}
    
function main() {

    processInput()
    moveFiles()
    console.log("the answer is", checksum())
}

function processInput() {
        
    let index = -1
    let fileId = -1

    while (true) {
    
        // file
    
        index += 1
        
        const fileLength = input[index]
        
        if (fileLength == undefined) { return }
                
        fileId += 1
        
        allFiles.push({ "id": fileId, "start": disk.length, "size": parseInt(fileLength) })
        
        for (let n = 0; n < fileLength; n++) { disk.push(fileId) }
        
        // space
        
        index += 1
        
        const blankLength = input[index]
        
        if (blankLength == undefined) { return }
        
        for (let n = 0; n < blankLength; n++) { disk.push(-1) } // -1 means blank space
    }
}

function moveFiles() {
 
    while (true) {
    
        const file = allFiles.pop()
        if (file == undefined) { return }
        moveFile(file)
    }
}

function moveFile(file) {

    const spaceStart = findSpaceFor(file.size)
    
    if (spaceStart == -1) { return }
    
    if (spaceStart > file.start) { return }
    
    searchStartBySpaceSize[file.size] = spaceStart // that was the leftmost space
    
    for (let n = 0; n < file.size; n++) {
        
        disk[file.start + n] = -1 
        
        disk[spaceStart + n] = file.id
    }
}
    
function findSpaceFor(fileSize) { 

    let afterThis = searchStartBySpaceSize[fileSize] - 1
    
    while (true) {
    
        const space = findNextSpace(afterThis)
        
        if (space == null) { return -1 }
        
        const spaceSize = space.end - space.start + 1
        
        if (spaceSize >= fileSize) { return space.start }
        
        afterThis = space.end    
    }
}

function findNextSpace(afterThis) {

    let start = afterThis
    
    while (true) {
    
        start += 1
        
        const slot = disk[start]
    
        if (slot == undefined) { return null }
    
        if (slot == -1) { break }
    }
        
    let end = start
    
    while (true) {
    
        if (disk[end + 1] != -1) { return { "start": start, "end": end } }
        
        end += 1
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
console.timeEnd("execution time") // 100ms

