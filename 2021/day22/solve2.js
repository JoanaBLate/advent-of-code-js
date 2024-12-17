"use strict"

// solving the puzzle takes (my computer) 0.165s

/*
    the ranges in my input:

    X: from -95887 to 94619
    Y: from -98273 to 97875
    Z: from -98554 to 96188
    
    each dimension length is almost 100,000:
     too big and too slow for creating/counting cells in standard arrays!
    
    -------------------------------------------------------
    
    this solution:
        
    each step creates a cuboid
    
    the cuboids are "placed" BACKWARDS, NEVER a cuboid may be overridden 
    
    when two cuboids overlap, the new one is divided into non-overlapping cuboids (and junk cuboids)
        
*/


const input = Deno.readTextFileSync("input.txt").trim()

const OFF = 0
const ON = 1

const CUBOIDS = [ ]


function main() {

    const rawCuboids = processInput()
    
    CUBOIDS.push(rawCuboids.pop()) // reversed order
    
    while (rawCuboids.length != 0) { processRawCuboid(rawCuboids.pop()) } // reversed order
        
    console.log("the answer is", countCubesOn())
}

///////////////////////////////////////////////////////////

function processInput() {

    const cuboids = [ ]
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const cuboid = createCuboidFromStep(line.trim())
        
        cuboids.push(cuboid)
    }
    
    return cuboids
}

function createCuboidFromStep(line) {

    const parts = line.split(" ")
    
    const status = parts.shift() // turn on or off
    
    const tokens = parts.shift().split(",")
    
    const rangeX = tokens.shift().replace("x=", "").split("..")
    const rangeY = tokens.shift().replace("y=", "").split("..")
    const rangeZ = tokens.shift().replace("z=", "").split("..")
    
    return {
    
        "status": (status == "on") ? ON : OFF,
        
        "xLow":  parseInt(rangeX.shift()),
        "xHigh": parseInt(rangeX.shift()),
        
        "yLow":  parseInt(rangeY.shift()),
        "yHigh": parseInt(rangeY.shift()),
        
        "zLow":  parseInt(rangeZ.shift()),
        "zHigh": parseInt(rangeZ.shift())
    }
}

function cloneCuboid(source) {

    return {
    
        "status": source.status,
        
        "xLow":  source.xLow,
        "xHigh": source.xHigh,
        
        "yLow":  source.yLow,
        "yHigh": source.yHigh,
        
        "zLow":  source.zLow,
        "zHigh": source.zHigh
    }
}

///////////////////////////////////////////////////////////

function countCubesOn() { 

    let count = 0

    for (const cuboid of CUBOIDS) {

        if (cuboid.status == OFF) { continue }

        const width  = cuboid.xHigh - cuboid.xLow + 1
        const height = cuboid.yHigh - cuboid.yLow + 1
        const depth  = cuboid.zHigh - cuboid.zLow + 1
        
        count += width * height * depth
    }
    return count
}

///////////////////////////////////////////////////////////

function processRawCuboid(rawCuboid) {

    let newCuboids = [ rawCuboid ]
                
    for (const oldCuboid of CUBOIDS) {
    
        newCuboids = processNewCuboidsWith(oldCuboid, newCuboids)
    }
    
    for (const newCuboid of newCuboids) { CUBOIDS.push(newCuboid) }
}

function processNewCuboidsWith(oldCuboid, cuboidsToProcess) {

    const allNewCuboids = [ ]
    
    for (const cuboid of cuboidsToProcess) {
    
        const newCuboids = processCuboid(oldCuboid, cuboid)
        
        for (const newCuboid of newCuboids) { allNewCuboids.push(newCuboid) }
    }
    
    return allNewCuboids
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function processCuboid(oldCuboid, cuboid) {
    
    if (cuboid.xHigh < oldCuboid.xLow) { return [ cuboid ] }
    if (cuboid.yHigh < oldCuboid.yLow) { return [ cuboid ] }
    if (cuboid.zHigh < oldCuboid.zLow) { return [ cuboid ] }
    
    if (cuboid.xLow > oldCuboid.xHigh) { return [ cuboid ] }    
    if (cuboid.yLow > oldCuboid.yHigh) { return [ cuboid ] }    
    if (cuboid.zLow > oldCuboid.zHigh) { return [ cuboid ] }
    
    // now the original cuboid will be *slaughtered* till it disappears

    const newCuboids = [ ]
        
    if (cuboid.xLow < oldCuboid.xLow) { newCuboids.push(createLeft(cuboid, oldCuboid.xLow - 1)) }
    
    if (cuboid.yLow < oldCuboid.yLow) { newCuboids.push(createTop(cuboid, oldCuboid.yLow - 1)) }
    
    if (cuboid.zLow < oldCuboid.zLow) { newCuboids.push(createNear(cuboid, oldCuboid.zLow - 1)) }
    
    if (cuboid.xHigh > oldCuboid.xHigh) { newCuboids.push(createRight(cuboid, oldCuboid.xHigh + 1)) }
    
    if (cuboid.yHigh > oldCuboid.yHigh) { newCuboids.push(createBottom(cuboid, oldCuboid.yHigh + 1)) }
    
    if (cuboid.zHigh > oldCuboid.zHigh) { newCuboids.push(createFar(cuboid, oldCuboid.zHigh + 1)) }
    
    return newCuboids
} 

///////////////////////////////////////////////////////////

function createLeft(source, rightEdge) {

    const cuboid = cloneCuboid(source)

    cuboid.xHigh = rightEdge
    
    source.xLow = rightEdge + 1

    return cuboid
}

function createRight(source, leftEdge) {

    const cuboid = cloneCuboid(source)

    cuboid.xLow = leftEdge
    
    source.xHigh = leftEdge - 1

    return cuboid
}

///////////////////////////////////////////////////////////

function createTop(source, bottomEdge) {

    const cuboid = cloneCuboid(source)

    cuboid.yHigh = bottomEdge
    
    source.yLow = bottomEdge + 1

    return cuboid
}

function createBottom(source, topEdge) {

    const cuboid = cloneCuboid(source)

    cuboid.yLow = topEdge
    
    source.yHigh = topEdge - 1

    return cuboid
}

///////////////////////////////////////////////////////////

function createNear(source, farEdge) {

    const cuboid = cloneCuboid(source)

    cuboid.zHigh = farEdge
    
    source.zLow = farEdge + 1

    return cuboid
}

function createFar(source, nearEdge) {

    const cuboid = cloneCuboid(source)

    cuboid.zLow = nearEdge
    
    source.zHigh = nearEdge - 1

    return cuboid
}

///////////////////////////////////////////////////////////

main()

