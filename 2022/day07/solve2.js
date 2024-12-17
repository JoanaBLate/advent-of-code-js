"use strict"

// solving the puzzle takes (my computer) 0.028s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const ROOT = createDirectory(null)

var CWD = ROOT

var missingSpace = 0

var smallestUtil = Infinity


function main() {

    processInput()
    
    while(DATA.length != 0) { processCommand(DATA.shift()) }
    
    fillSizes(ROOT)
    
    const availableSpace = 70000000 - ROOT.totalSize
    
    missingSpace = Math.abs(availableSpace - 30000000)
    
    search(ROOT)
    
   console.log("the answer is", smallestUtil)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

function createDirectory(parent) {

    // parent -> object
    // directories -> { name: object }
    // files -> { name: size }

    return { "parent": parent, "directories": { }, "files": { }, "mySize": 0, "totalSize": -1 }
}

///////////////////////////////////////////////////////////

function processCommand(command) {
    
    if (command == "$ ls") { readDirectory(); return }
    
    if (command == "$ cd ..") { retreatOneLevel(); return }

    if (command.startsWith("$ cd ")) { changeDirectory(command); return }
    
    console.log("UNKNOWN COMMAND", command)
}

function changeDirectory(command) {

    const dirname = command.replace("$ cd ", "")
    
    if (dirname == "/") { CWD = ROOT; return } 
    
    CWD = CWD.directories[dirname]
    
    if (CWD == undefined) { console.log("ERROR: unknown directory '" + dirname + "'"); Deno.exit() }
}

function retreatOneLevel() {

    CWD = CWD.parent
}

function readDirectory() {
    
    while (DATA.length > 0) {
    
        if (DATA[0][0] == "$") { return }
        
        const data = DATA.shift()
    
        if (data.startsWith("dir ")) {
        
            const dirname = data.replace("dir ", "")
        
            if (CWD.directories[dirname] == undefined) { CWD.directories[dirname] = createDirectory(CWD) }
        }
        else { // it is a file
    
            const tokens = data.split(" ")
            
            const name = tokens.pop()
            const size = parseInt(tokens.pop())
            
            CWD.files[name] = size // if already file exists, it ill be overwritten (with the same data)   
        }
    }
}

///////////////////////////////////////////////////////////

function fillSizes(directory) {

    for (const size of Object.values(directory.files)) {

        directory.mySize += size
    }
        
    directory.totalSize = directory.mySize
    
    for (const childDir of Object.values(directory.directories)) {
    
        if (childDir.totalSize == -1) { fillSizes(childDir) }
        
        directory.totalSize += childDir.totalSize
    }
}

///////////////////////////////////////////////////////////

function search(directory) {

    if (directory.totalSize >= missingSpace) {
    
        if (directory.totalSize < smallestUtil) { smallestUtil = directory.totalSize }    
    }
        
    for (const childDir of Object.values(directory.directories)) { search(childDir) }
}

main()

