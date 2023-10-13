"use strict"

// solving the puzzle takes (my computer) 0.320s


// THIS SOLUTION ONLY WORKS WITH THE CURRENT INPUT!!!
//
// this puzzle was made to stress your computer 
// during many hours, maybe days using brute-force 
// computing; we MUST change the assembly code, 
// cleaning up the trash parts or running its 
// essential code in other way


var A = 1
var B = 0
var C = 0
var D = 0
var E = 0
var F = 0
var G = 0
var H = 0

/*

; F controls if H will be increased or not
; G controls most of jumps

01 set b 93      ; B = 93
02 set c b       ; C = 93
03 jnz a 2       ; GOTO 05; granted to jump 05 
04 jnz 1 5       ; USELESS (unreachable line)
05 mul b 100     ; B = 9300
06 sub b -100000 ; B = 109300
07 set c b       ; C = 109300
08 sub c -17000  ; C = 126300

09 set f 1       
10 set d 2       ; second loop counter

11 set e 2       ; first loop counter
12 set g d      
13 mul g e
14 sub g b       ; G = D * E - B; when B == D * E -> F becomes 0 (line 16)
15 jnz g 2       ; SKIP next line (G decides) 
16 set f 0
17 sub e -1      ; increase first loop counter
18 set g e       ; prepare for jump check
19 sub g b       ; prepare for jump check
20 jnz g -8      ; GOTO 12 WHILE E != B

21 sub d -1      ; increase second loop counter
22 set g d       ; prepare for jump check
23 sub g b       ; prepare for jump check
24 jnz g -13     ; GOTO 11 WHILE D != B

25 jnz f 2       ; SKIP next line (F decides)
26 sub h -1      ; increase H
27 set g b       ; prepare for jump check
28 sub g c       ; prepare for jump check
29 jnz g 2       ; SKIP next line WHILE B != C 
30 jnz 1 3       ; END program
31 sub b -17     ; add to B
32 jnz 1 -23     ; GOTO 09; granted to jump


*/


function main() {

    B = 109300
    C = 126300

    while (true) { // line 09
    
        F = 1
        D = 2
        
        while (true) { // line 11
            
            E = 2
        
            runFirstLoop()

            D += 1
            G = D - B
            
            if (G == 0) { break }
        }
        
        if (F == 0) { H += 1 }
        
        G = B - C
        
        if (G == 0) { break }
        
        B += 17
    }
    console.log("the value left in register h is", H)
}

function runFirstLoop() {

    tryZeroF()
    
    G = 0 // this loop ends when G is zero at line 20
    E = B // E must equal B in order to make G zero
    
}

function tryZeroF(){
    
    if (F == 0) { return }

    // if G is zero at line 15
    // F is set to zero at line 16
    // G being zero at that point implies that B = D * E 
    // B and D doesn't change inside this loop, and E, ranges
    // from 2 to B: searching  E == B / D
    
    if (B % D != 0) { return } // E is an integer, not a float

    const quotient = B / D
    
    if (quotient < 2  ||  quotient > B) { return } // out of E's range
    
    F = 0    
}

main()

