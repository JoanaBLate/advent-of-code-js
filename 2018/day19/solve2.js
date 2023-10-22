"use strict"

// solving the puzzle takes (my computer) 0.040s

// simply computing takes too long',

// THIS PROGRAM SOLVES THE CURRENT **SPECIFIC** INPUT //

/*

1) there is no negative value:
    pointer only decreases when an (inferior) absolute value is set
    this allows to identifiy all loops

2) before the execution of any instruction:
    r5 and the pointer holds that line number
    
3) role of each register:
    
r0 > used at start to define if r3 will be a very big number or not
     and holds the answer
r1 > counter
r2 > counter
r3 > limit to be achieved
r4 > jump controller helper
r5 > jump controller

-- ORIGINAL CODE (with notes) -------------------------------------------------
    
#ip 5;                                 # defines r5 as register-pointer

00 addi 5 16 5;  r5 += 16              # JUMPS to line 17; runs only once

01 seti 1  3 1;  r1 = 1                # LOOP START (till line 26 or 35); only set at start
02 seti 1  1 2;  r2 = 1                # LOOP START (till line 15)
03 mulr 1  2 4;  r4 = r1 * r2          # LOOP START (till line 11) 

04 eqrr 4  3 4;  r4 = (r4 == r3 ? 1:0) # r4 is 1 or 0 
05 addr 4  5 5;  r5 += r4              # r5 is 5 or 6 (pointer is 6 or 7)
06 addi 5  1 5;  r5 += 1               # r5 is 7 (pointer is 8)
07 addr 1  0 0;  r0 += r1              # r0 only increases when (r4 == r3) -> (r1 * r2 == r3)

08 addi 2  1 2;  r2 += 1
09 gtrr 2  3 4;  r4 = (r2 > r3) ? 1:0  # r4 is 1 or 0
10 addr 5  4 5;  r5 += r4              # r5 is 10 or 11 (pointer is 11 or 12)
11 seti 2  4 5;  r5 = 2                # LOOP END (goto line 03) # if (r2 <= r3) continue else break

12 addi 1  1 1;  r1 += 1
13 gtrr 1  3 4;  r4 = (r1 > r3) ? 1:0  # r4 is 1 or 0
14 addr 4  5 5;  r5 += r4              # r5 is 14 or 15 (pointer is 15 or 16)
15 seti 1  5 5;  r5 = 1                # LOOP END (to line 02) # if (r1 <= r3) continue else break

16 mulr 5  5 5;  r5 *= r5              # END OF PROGRAM - r5 = 16 * 16 (pointer is 257)

17 addi 3  2 3;  r3 += 2               # START OF PROGRAM (line 00 only jumps here)
18 mulr 3  3 3;  r3 *= r3
19 mulr 5  3 3;  r3 *= r5              # r3 *= 19           
20 muli 3 11 3;  r3 *= 11
21 addi 4  8 4;  r4 += 8
22 mulr 4  5 4;  r4 *= r5              # r4 *= 22
23 addi 4 13 4;  r4 += 13
24 addr 3  4 3;  r3 += r4
25 addr 5  0 5;  r5 += r0              # starting with (r0 == 1) program skips end of loop in the line below
26 seti 0  8 5;  r5 = 0                # LOOP END (to line 01)

                                       # the instructions below do not run when (r0 == 0) at the start
                                       # this whole segment only gives r3 a big value
                                       # (r4 holds a big value too, but will be overriden at line 03)

27 setr 5  3 4;  r4 = r5               # r4 = 27
28 mulr 4  5 4;  r4 *= r5              # r4 = 27 * 28
29 addr 5  4 4;  r4 += r5              # r4 = 756 + 29
30 mulr 5  4 4;  r4 *= r5              # r4 = 785 * 30
31 muli 4 14 4;  r4 *= 14              # r4 = 23550 * 14
32 mulr 4  5 4;  r4 *= r5              # r4 = 329700 * 32
33 addr 3  4 3;  r3 += r4              # r3 += 10550400
34 seti 0  8 0;  r0 = 0                # resets r0    
35 seti 0  4 5;  r5 = 0                # LOOP END (goto line 01)


-- JAVASCRIPT (raw version) ---------------------------------------------------

function program(r0StartingValue) { // not simplified, not optimized

    let r0 = r0StartingValue
    let r1 = 0
    let r2 = 0
    let r3 = 0
    let r4 = 0
    let r5 = 0  // holds the pointer data
    
    // r5 (as operand in the formulas) is replaced by the respective line number
    
    setR3WithLowValue()  // line 00
    
    if (r0 == 1) { addHighValueToR3() }  // lines 25 and 26
        
    r1 = 1  // line 01
    
    while (true) {

        r2 = 1  // line 02    # LOOP START (till line 15)

        while (true) {
        
            r4 = r1 * r2  // line 03 
                        
            r4 = (r4 == r3) ? 1 : 0  // line 04

            if (r4 == 1) {  // lines 05 and 06
            
                r0 += 1 // line 07
            }

            r2 += 1  // line 08
            
            r4 = (r2 > r3) ? 1 : 0  // line 09 
            
            if (r4 == 1) {  break }  // line 10
            
        }  //  line 11
        
        r1 += 1  // line 12
        
        r4 = (r1 > r3) ? 1 : 0  // line 13
        
        if (r4 == 1) { break }  // line 14

    } // line 15 

    return r0  // line 16 END OF PROGRAM 

    function setR3WithLowValue() {
        
        r3 += 2   // line 17
        r3 *= r3  // line 18
        r3 *= 19  // line 19         
        r3 *= 11  // line 20
        r4 += 8   // line 21
        r4 *= 22  // line 22
        r4 += 13  // line 23
        r3 += r4  // line 24
    }
    
    function setR3WithHighValue() {
        
        r4 = 27   // line 27
        r4 *= 28  // line 28
        r4 += 29  // line 29
        r4 *= 30  // line 30
        r4 *= 14  // line 31
        r4 *= 32  // line 32
        r3 += r4  // line 33
    }
}


-- JAVASCRIPT (simplified version) --------------------------------------------

function program(startingValue) { // version not optimized

    let r0 = 0
    let r1 = 0
    let r2 = 0
    let r3 = 0
    
    r3 = 1025
    
    if (startingValue == 1) { r3 += 10550400 } // r3 = 10_551_425
    
    r1 = 1
    
    while (true) {

        r2 = 1  
        
        while (true) {
        
            if (r1 * r2 == r3) { r0 += r1 }

            r2 += 1 
            
            if (r2 > r3) {  break }
            
        }
        
        r1 += 1 
        
        if (r1 > r3) { break } 
    } 

    return r0 
}

*/

///////////////////////////////////////////////////////////

function program() { // optimized version

    const dividend = 10551425
    
    const limit = Math.ceil(dividend / 2) + 1

    let answer = dividend // dividend is beyond limit but it is an acceptable divisor
    
    for (let divisor = 1; divisor <= limit; divisor++) {
    
        if (dividend % divisor == 0) { answer += divisor }
    }

    return answer
}
    
///////////////////////////////////////////////////////////

function main() {

    console.log("the answer is", program())
}

main()

