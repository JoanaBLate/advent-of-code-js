"use strict"

// solving the puzzle takes (my computer) 0.060s

/*
    corner tiles have 2 neighbors (there are only 4 corner tiles)
    
    border (not corner) tiles have 3 neighbors
    
    middle tiles have 4 neighbors
    
    we start guessing one corner, after we find it, the rest is easy

    --
        
    for this *SPECIFIC* puzzle input, for all tiles: any border
    compatible tile is a true neighbor (not just an eventual match):
          
    for example, any tile with 4 possible neighbors IS a middle tile,
    NOT a corner tile with 2 excedent possible neighbors
*/

const TILES = { } 

const GROUPS = { } // aditional info referent tiles of the same group group (original tile)

var TILE_DIM = 10 // first_tile.image.length

var PICTURE_DIM = 12 // Math.pow(tiles.length, 0.5)
        
var cornerTiles = [ ]

var borderTiles = [ ]  // excepts corner tiles

var middleTiles = [ ]


function main() {

    processInput()
    
    for (const tile of Object.values(TILES)) { createDerivedTiles(tile) }
    
    for (const tile of Object.values(TILES)) { noteBorders(tile) }
    
    for (const groupId of Object.keys(GROUPS)) { noteCompatibles(groupId) }
    
    for (const tile of Object.values(TILES))   { classifyTile(tile) }
    
    const picture = createPicture()
    
    let photo = createPhoto(picture)
    
    photo = rotateClockwise(photo)
    
 // console.log(photo.join("\n"))

    const seaMonsters = findSeaMonsters(photo)

    const monsterMap = getMonsterPositions(seaMonsters)
    
    console.log("the answer is", countFreeSharps(photo, monsterMap))
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const parts = input.split("\n\n")
    
    for (const part of parts) {
    
        const lines = part.trim().split("\n")
        
        const id = lines.shift().split(" ").pop() // string format
        
        const image = [ ]
        
        for (const line of lines) { image.push(line.trim()) }
        
        TILES[id +  "o"] = createTile(id +  "o", image) // 'o' means original
        
        GROUPS[id] = { "borders": [ ], "compatibles": [ ] }
    }
}

function createTile(id, image) {

    return { 
    
        "id": id, "image": image, 
    
        "border-north": 0, "border-south": 0, "border-west": 0, "border-east": 0
    }
}

///////////////////////////////////////////////////////////

function flipHorizontal(image) {

    const newImage = [ ]
    
    for (const line of image) { newImage.push(line.split("").reverse().join("")) }

    return newImage
}

function flipVertical(image) {

    const newImage = [ ]
    
    for (const line of image) { newImage.unshift(line) }

    return newImage
}

function rotateClockwise(image) {

    const newImage = [ ]    
    
    for (let col = 0; col < image.length; col++) {
    
        let line = ""

        for (let row = image.length - 1; row > -1; row--) {
    
            line += image[row][col]
        }
        newImage.push(line)
    }
    return newImage
}

function createDerivedTiles(master) {

    const original = master.image

    const hFlipped = flipHorizontal(original) 
    
    const vFlipped = flipVertical(original) 

    const rotated = rotateClockwise(original) 
    
    const hFlipRota = flipHorizontal(rotated)
    
    const vFlipRota = flipVertical(rotated)
    
    const doubleFlipped = flipVertical(hFlipped) 
    
    //
    
    const prefix = master.id.replace( "o", "")
    
    pushTile("h", hFlipped)
    
    pushTile("v", vFlipped)
    
    pushTile("hv", doubleFlipped)
    
    pushTile("r", rotated)

    pushTile("hr", hFlipRota)
    
    pushTile("vr", vFlipRota)
    
    function pushTile(suffix, image) {
    
        const id = prefix + suffix
        
        TILES[id] = createTile(id, image)    
    }
}

///////////////////////////////////////////////////////////

function noteBorders(tile) {

    noteBordersThis(tile) 
    
    const borders = GROUPS[tile.id.substr(0, 5)].borders
    
    if (! borders.includes(tile["border-north"])) { borders.push(tile["border-north"]) }
    
    if (! borders.includes(tile["border-south"])) { borders.push(tile["border-south"]) }
    
    if (! borders.includes(tile["border-west"]))  { borders.push(tile["border-west"]) }
    
    if (! borders.includes(tile["border-east"]))  { borders.push(tile["border-east"]) }
}

function noteBordersThis(tile) {

    tile["border-north"] = encode(tile.image[0])
    
    tile["border-south"] = encode(tile.image[TILE_DIM - 1])

    let westBorder = ""

    let eastBorder = ""
        
    for (let n = 0; n < TILE_DIM; n++) {

        westBorder += tile.image[n][0]
        
        eastBorder += tile.image[n][TILE_DIM - 1]
    }

    tile["border-west"] = encode(westBorder)
    
    tile["border-east"] = encode(eastBorder)
}

function encode(string) { // matching numbers is faster than matching strings

    let bin = ""
    
    for (const char of string) { bin += (char == ".") ? "0" : "1" }
    
    return parseInt(bin, 2)
}

///////////////////////////////////////////////////////////

function noteCompatibles(masterId) {

    const master = GROUPS[masterId]
    
    for (const id of Object.keys(GROUPS)) { 
    
        if (id == masterId) { continue }
        
        const group = GROUPS[id]
        
        for (const border of group.borders) { 
        
            if (master.borders.includes(border)) { master.compatibles.push(id); break }
        }
    }
}

function getCompatibles(tileId) {

    const group = GROUPS[tileId.substr(0, 5)]
    
    return group.compatibles
}

///////////////////////////////////////////////////////////

function classifyTile(tile) {
    
    const count = getCompatibles(tile.id).length
    
    if (count == 2) { cornerTiles.push(tile); return }
    if (count == 3) { borderTiles.push(tile); return }
    if (count == 4) { middleTiles.push(tile); return }
    
    console.log("ERROR: not expecting tile with exactly", count, "possible neighbors")
    Deno.exit()
}

///////////////////////////////////////////////////////////

function lastItemOfPicture(picture) {

    const index = picture.lastIndexOf(" ") + 1
        
    return picture.substr(index)
}

function lengthOfPicture(picture) {

    let count = 0
    
    for (const c of picture) { if (c == " ") { count += 1 } }
    
    return count + 1
}

function getPictureMatches(picture, previousId, field, value) {

    const matches = [ ]
    
    for (const groupId of getCompatibles(previousId)) { 

        if (picture.includes(groupId)) { continue }       
    
        for (const suffix of [ "o", "h", "v", "hv", "r", "hr", "vr" ]) {
        
            const id = groupId + suffix
                        
            if (TILES[id][field] == value) { matches.push(id) }
        }
    }
    return matches
}

///////////////////////////////////////////////////////////
    
function createPicture() { // sets the top left corner

    for (const tile of cornerTiles) {

        const picture = createPicture2(tile.id)
        
        if (picture != null) { return picture }
    }
    
    return null
}

function createPicture2(picture) { // fills top row between corners

    const westId = lastItemOfPicture(picture)
        
    const westTile = TILES[westId]
    
    const east = westTile["border-east"]
    
    const matches = getPictureMatches(picture, westId, "border-west", east)
    
    for (const id of matches) {
            
        if (lengthOfPicture(picture) == PICTURE_DIM - 2) {
        
            const newPicture = createPicture3(picture + " " + id)
            
            if (newPicture != null) { return newPicture }                        
        }
        else {

            const newPicture = createPicture2(picture + " " + id)
            
            if (newPicture != null) { return newPicture }
        }
    }
    return null
}
    
function createPicture3(picture) { // sets the top right corner

    const westId = lastItemOfPicture(picture)
        
    const westTile = TILES[westId]
    
    const east = westTile["border-east"]
    
    for (const tile of cornerTiles) {
    
        const groupId = tile.id.substr(0, 5)
        
        if (picture.includes(groupId)) { continue }       
    
        for (const suffix of [ "o", "h", "v", "hv", "r", "hr", "vr" ]) {
        
            const id = groupId + suffix
                        
            if (TILES[id]["border-west"] != east) { continue }
            
            const newPicture = createPicture4(picture + " " + tile.id)
            
            if (newPicture != null) { return newPicture }
        }
    }
    return null
}

function createPicture4(picture) { // sets first tile of a middle row

    const tokens = picture.split(" ")

    const northId = tokens.at(-PICTURE_DIM)
        
    const northTile = TILES[northId]
    
    const south = northTile["border-south"]
    
    const matches = getPictureMatches(picture, northId, "border-north", south)
    
    for (const id of matches) {
        
        const newPicture = createPicture5(picture + " " + id)
        
        if (newPicture != null) { return newPicture }
    }
    return null
}

function createPicture5(picture) { // fills any middle row after its start
    
    const tokens = picture.split(" ")
    
    if (tokens.length == PICTURE_DIM * PICTURE_DIM) { return picture } // all done! 

    if (tokens.length % PICTURE_DIM == 0) { // full row
    
        if (tokens.length / PICTURE_DIM == PICTURE_DIM - 1) { return createPicture6(picture) } // last row
        
        return createPicture4(picture)    
    }

    const northId = tokens.at(-PICTURE_DIM)
        
    const northTile = TILES[northId]
    
    const south = northTile["border-south"]
    
    const northMatches = getPictureMatches(picture, northId, "border-north", south)


    const westId = lastItemOfPicture(picture)
        
    const westTile = TILES[westId]
    
    const east = westTile["border-east"]
    
    const westMatches = getPictureMatches(picture, westId, "border-west", east)
    

    for (const id of northMatches) {
    
        if (! westMatches.includes(id)) { continue }
    
        const newPicture = createPicture5(picture + " " + id)
        
        if (newPicture != null) { return newPicture }
    }
    return null
}

function createPicture6(picture) {// sets the bottom left corner

    const tokens = picture.split(" ")

    const northId = tokens.at(-PICTURE_DIM)
        
    const northTile = TILES[northId]
    
    const south = northTile["border-south"]
    
    for (const tile of cornerTiles) {
    
        const groupId = tile.id.substr(0, 5)
        
        if (picture.includes(groupId)) { continue }       
    
        for (const suffix of [ "o", "h", "v", "hv", "r", "hr", "vr" ]) {
        
            const id = groupId + suffix
                        
            if (TILES[id]["border-north"] != south) { continue }
            
            const newPicture = createPicture5(picture + " " + tile.id)
            
            if (newPicture != null) { return newPicture }
        }
    }
    return null
}

///////////////////////////////////////////////////////////

function createPhoto(picture) {

    const fragments = [ ]
    
    const ids = picture.split(" ")
    
    while (ids.length != 0) { fragments.push(createFragment(ids.shift())) }
    
    const photo = [ ]

    for (let row = 0; row < PICTURE_DIM; row++) { 
    
        const segment = [ ]
        
        for (let col = 0; col < PICTURE_DIM; col++) { segment.push(fragments.shift()) }
    
        const block = consolidateFragments(segment)
        
        for (const line of block) { photo.push(line) }
    }    
    
    return photo
}

function consolidateFragments(fragments) {

    const block = [ ]
    
    while (true) {
    
        let blockline = ""
        
        for (const fragment of fragments) { blockline += fragment.shift() }
        
        block.push(blockline)
        
        blockline = ""

        if (fragments[0].length == 0) { break }
    }
    
    return block
}

function createFragment(id) {

    const sourceImage = TILES[id].image

    const fragment = [ ]
    
    for (let row = 1; row < TILE_DIM - 1; row++) { 
    
        const line = sourceImage[row]
        
        const segment = line.substr(1, TILE_DIM - 2)
        
        fragment.push(segment)
    }
    return fragment
}

///////////////////////////////////////////////////////////

/* 
    sea monster ;)
    
    01234567890123456789
                      # 
    #    ##    ##    ###
     #  #  #  #  #  #   
    01234567890123456789
    
    width is 20
*/

function findSeaMonsters(photo) {

    const seaMonsters = [ ] // the home slots

    for (let row = 1; row < photo.length - 1; row++) {
    
        const previousLine = photo[row - 1]
        const currentLine  = photo[row]
        const nextLine     = photo[row + 1]
    
        for (let col = 0; col < photo.length - 19; col++) {
                        
            if (previousLine[col+18] != "#") { continue }
            
            if (currentLine[col]    != "#") { continue }
            if (currentLine[col+5]  != "#") { continue }
            if (currentLine[col+6]  != "#") { continue }
            if (currentLine[col+11] != "#") { continue }
            if (currentLine[col+12] != "#") { continue }
            if (currentLine[col+17] != "#") { continue }
            if (currentLine[col+18] != "#") { continue }
            if (currentLine[col+19] != "#") { continue }
            
            if (nextLine[col+1]  != "#") { continue }
            if (nextLine[col+4]  != "#") { continue }
            if (nextLine[col+7]  != "#") { continue }
            if (nextLine[col+10] != "#") { continue }
            if (nextLine[col+13] != "#") { continue }
            if (nextLine[col+16] != "#") { continue } 
            
            seaMonsters.push({ "row": row, "col": col })
        }            
    }
    return seaMonsters
}

function getMonsterPositions(seaMonsters) {

    const map = { }

    for (const seaMonster of seaMonsters) { fillMonsterMap(map, seaMonster) }
    
    return map
}

function fillMonsterMap(map, point) {

    const row = point.row
    const col = point.col
        
    fill(row-1, col+18)
    
    fill(row, col)
    fill(row, col+5)
    fill(row, col+6)
    fill(row, col+11)
    fill(row, col+12)
    fill(row, col+17)
    fill(row, col+18)
    fill(row, col+19)
    
    fill(row+1, col+1)
    fill(row+1, col+4)
    fill(row+1, col+7)
    fill(row+1, col+10)
    fill(row+1, col+13)
    fill(row+1, col+16)
    
    function fill(row, col) { map[row + "~" + col] = true }
}     

function countFreeSharps(photo, map) {   

    let count = 0

    for (let row = 0; row < photo.length; row++) {

        for (let col = 0; col < photo.length; col++) {
                        
            if (photo[row][col] != "#") { continue }
            
            if (map[row + "~" + col] == true) { continue }
            
            count += 1
        }
    }
    return count
}

main()

