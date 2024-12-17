"use strict"

// solving the puzzle takes (my computer) 0.150s

const data = { }

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    const ingredients = [ ]

    for (const rawLine of rawLines) {

        const parts = rawLine.trim().split(":")
        
        const ingredient = parts.shift()
        
        ingredients.push(ingredient)
        
        const tokens = (parts.shift()).trim().split(" ")
        
        const obj = { "capacity": 0, "durability": 0, "flavor": 0, "texture": 0, "calories": 0 }
        
        while (tokens.length > 0) {
        
            const key = tokens.shift()
            const value = parseInt(tokens.shift())
            obj[key] = value       
        
        }
        
        data[ingredient] = obj    
    }
    
    //

    let best = 0
            
    for (var f = 0;  f < 101; f++) {
        for (var c = 0;  c < 101; c++) {
            for (var b = 0;  b < 101; b++) {
                for (var s = 0;  s < 101; s++) {
                
                    if (f + c + b + s != 100) { continue }
                    
                    const score = calcScore(f, c, b, s)
                    
                    if (score > best) { best = score }
                    
                }
            }
        }
    }
    
    console.log("highest score is", best)
}
    
function calcScore(f, c, b, s) {

    const frost = data["Frosting"]
    const candy = data["Candy"]
    const butte = data["Butterscotch"]
    const sugar = data["Sugar"]

    let capacity = (f * frost.capacity) + (c * candy.capacity) + (b * butte.capacity) + (s * sugar.capacity)
    if (capacity < 0) { capacity = 0 }

    let durability = (f * frost.durability) + (c * candy.durability) + (b * butte.durability) + (s * sugar.durability)
    if (durability < 0) { durability = 0 }
    
    let flavor = (f * frost.flavor) + (c * candy.flavor) + (b * butte.flavor) + (s * sugar.flavor)
    if (flavor < 0) { flavor = 0 }

    let texture = (f * frost.texture) + (c * candy.texture) + (b * butte.texture) + (s * sugar.texture)
    if (texture < 0) { texture = 0 }

    return capacity * durability * flavor * texture
}

main()

