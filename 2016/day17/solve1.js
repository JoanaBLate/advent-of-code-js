"use strict"

// solving the puzzle takes (my computer) 0.030s

/*
#########
#S| | | #
#-#-#-#-#
# | | | #
#-#-#-#-#
# | | | #
#-#-#-#-#
# | | |  
####### V`
*/

// don't let the diagram above *fool* you,
// it is NOT a 9 x 9 grid
// it is a 4 x 4 grid of rooms

import md5 from "npm:md5"

const targetX = 4
const targetY = 4

let secretKey = ""

var bestPath = "@".repeat(99)

function main() {

    secretKey = Deno.readTextFileSync("input.txt").trim()
                
    walk(1, 1, "")
    
    console.log("the shortest path is", bestPath)
}

function walk(x, y, path) { // recursive function

    if (path.length > bestPath.length) { return }

    if (x == targetX  &&  y == targetY) { 
    
        if (path.length < bestPath.length) { bestPath = path }
        
        return
    }
    
    const hash = md5(secretKey + path)
    
    tryWalk(x,   y-1, path + "U", hash[0]) // up
    tryWalk(x,   y+1, path + "D", hash[1]) // down
    tryWalk(x-1, y,   path + "L", hash[2]) // left
    tryWalk(x+1, y,   path + "R", hash[3]) // right
}    
    
function tryWalk(x, y, path, hashChar) {

    if (x < 1) { return }
    if (y < 1) { return }

    if (x > 4) { return }
    if (y > 4) { return }
     
    if (! "bcdef".includes(hashChar)) { return }
    
    walk(x, y, path)
}

main()

