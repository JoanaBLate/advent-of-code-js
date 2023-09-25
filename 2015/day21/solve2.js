"use strict"

// solving the puzzle takes (my computer) 0.025s

let BOSS_HP = 0

let BOSS_ARMOR = 0

let BOSS_DAMAGE = 0

//    Category    Cost  Damage  Armor

const Weapons = {

    Dagger:     [   8,     4,       0 ],
    Shortsword: [  10,     5,       0 ],
    Warhammer:  [  25,     6,       0 ],
    Longsword:  [  40,     7,       0 ],
    Greataxe:   [  74,     8,       0 ]
}

const Armors = {

    Leather:    [  13,     0,       1 ],
    Chainmail:  [  31,     0,       2 ],
    Splintmail: [  53,     0,       3 ], 
    Bandedmail: [  75,     0,       4 ], 
    Platemail:  [ 102,     0,       5 ]
}

const Rings = {

    "Damage +1":  [  25,     1,       0 ],
    "Damage +2":  [  50,     2,       0 ],
    "Damage +3":  [ 100,     3,       0 ],
    "Defense +1": [  20,     0,       1 ],
    "Defense +2": [  40,     0,       2 ],
    "Defense +3": [  80,     0,       3 ]
}

const weapons = Object.keys(Weapons) // 5 items

const armors = Object.keys(Armors) // 5 items

const rings = Object.keys(Rings) // 6 items

var highestCost = 0 // highest cost with loss


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    BOSS_HP     = parseInt(rawLines.shift().trim().split(" ").pop())
    BOSS_DAMAGE = parseInt(rawLines.shift().trim().split(" ").pop())
    BOSS_ARMOR  = parseInt(rawLines.shift().trim().split(" ").pop())
    

    // -1 means to not buy item:

    for (let w = 0; w < 5; w++) { // weapon
    
        for (let a = -1; a < 5; a++) { // armor
        
           for (let r = -1; r < 6; r++) { // ring1
           
                for (let s = -1; s < 6; s++) { // ring2
                
                    const obj = shop(w, a, r, s)
                    
                    if (obj == null) { continue }
            
                    const win = fight(obj)
                    
                    if (! win  &&  obj.cost > highestCost) { highestCost = obj.cost } 
                }
            }
        }
    }
    
    console.log("highest cost is", highestCost)
}

function shop(w, a, r, s) {
    
    const obj = { atk: 0, def: 0, cost: 0 }

    if (r == s) { return null }  // cannot repeat rings
    
    buy(obj, Weapons, weapons[w])
    buy(obj, Armors, armors[a])
    buy(obj, Rings, rings[r])
    buy(obj, Rings, rings[s])
    
    return obj
}

function buy(obj, dict, key) {

    if (key == undefined) { return }
    
    const data = dict[key]
    
    obj.cost += data[0]
    obj.atk  += data[1]
    obj.def  += data[2]
}

function fight(obj) {

    let myLife = 100
    let bossLife = BOSS_HP
    
    const myAttack = obj.atk
    const myDefense = obj.def
    
    while (true) {
    
        bossLife -= Math.max(1, myAttack - BOSS_ARMOR)
        
        if (bossLife <= 0) { return true }
    
        myLife -= Math.max(1, BOSS_DAMAGE - myDefense)
        
        if (myLife <= 0) { return false }
    }
}

main()

