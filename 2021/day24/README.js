"use strict"

/* 
    *WARNING*

    THIS SOLUTION MAY NOT WORK FOR YOUR INPUT

    this file explains the principles used for solving the puzzle
    
///////////////////////////////////////////////////////////


    1. SIMPLIFYING THE ALU PROGRAM
    ==============================

    the ALU program is a sequence of **14 VERY SIMILAR** subroutines
    (one for each digit of the number to be validated)
    
    only (the same) 3 instructions change among the subroutines;
    only the value of those instructions change 
    
    the instructions that change are marked with '(#)' in the example
    below
    
    the variables inside each subroutine:
    
      w: a constant that holds the current input digit
      x: is reset before being used 
      y: is reset before being used
      z: holds the balance (value that a subroutine pass to the next subroutine)
    
    for each subsroutine, doesn't matter the previous values of w, x and y

    inp w
    mul x 0
    add x z
    mod x 26
(#) div z 26   -- zDivisor
(#) add x -15  -- xDelta
    eql x w
    eql x 0
    mul y 0
    add y 25
    mul y x
    add y 1
    mul z y
    mul y 0
    add y w
(#) add y 12   -- yDelta
    mul y x
    add z y


    instead of reading/executing instruction by instruction, we can create an equivalent
    JavaScript function, which is a much more clear and efficient way
    
    creating a basic/direct translation:
*/
    
function versionA(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = balance                // (implicit)
     
    const w = digit                // inp w
   
    let x = 0                      // mul x 0
    
    x += z                         // add x z
        
    x = x % 26                     // mod x
    
    z = Math.floor(z / zDivisor)   // (#) div z 26   -- zDivisor
    
    x += xDelta                    // (#) add x -15  -- xDelta
    
    x = (x == w) ? 1 : 0           // eql x w
        
    x = (x == 0) ? 1 : 0           // eql x 0
    
    let y = 0                      // mul y 0
        
    y += 25                        // add y 25
    
    y *= x                         // mul y x
    
    y += 1                         // add y 1
    
    z *= y                         // mul z y
       
    y = 0                          // mul y 0
    
    y += w                         // add y w
    
    y += yDelta                    // (#) add y 12   -- yDelta
    
    y *= x                         // mul y x
    
    z += y                         // add z y
    
    return z
}


// simplifying the version A:

    
function versionB(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    x = (x == digit) ? 0 : 1 // compacts two eql instructions
    
    let y = 25 * x + 1
    
    z *= y
       
    y = (digit + yDelta) * x
        
    return z + y
}


// simplifying the version B:

    
function versionC(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    if (x == digit) {
    
        let y = 25 * 0 + 1 
    
        z *= y            
       
        y = (digit + yDelta) * 0
    }
    
    else {
    
        let y = 25 * 1 + 1 
    
        z *= y            
       
        y = (digit + yDelta) * 1
    }
        
    return z + y
}


// simplifying the version C:

    
function versionD(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    if (x == digit) { return z }
    
    z *= 26
        
    let y = digit + yDelta
        
    return z + y
}

// simplifying the version D:
    
    
function versionE(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    if (x == digit) { return z }
    
    return z * 26 + digit + yDelta
}


// simplifying the version E:
    
    
function versionF(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    if (digit == balance % 26 + xDelta) { return z }
    
    return z * 26 + digit + yDelta
}

/*
    notes about the function:
    
        yDelta affects the result by INCREMENTING it (second return)
        
        xDelta affects the result by AVOIDING OR NOT it being incremented
    
    
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


    2. SMART ASSUMPTIONS BASED ON **MY** INPUT
    ==========================================
    
    below we see the different sets of arguments 
    for each of the 14 subroutines
    
    [
        { zDivisor:  1,  xDelta:  14,  yDelta:  0 }, //  0
        { zDivisor:  1,  xDelta:  13,  yDelta: 12 }, //  1
        { zDivisor:  1,  xDelta:  15,  yDelta: 14 }, //  2
        { zDivisor:  1,  xDelta:  13,  yDelta:  0 }, //  3
        { zDivisor: 26,  xDelta:  -2,  yDelta:  3 }, //  4
        { zDivisor:  1,  xDelta:  10,  yDelta: 15 }, //  5
        { zDivisor:  1,  xDelta:  13,  yDelta: 11 }, //  6
        { zDivisor: 26,  xDelta: -15,  yDelta: 12 }, //  7
        { zDivisor:  1,  xDelta:  11,  yDelta:  1 }, //  8
        { zDivisor: 26,  xDelta:  -9,  yDelta: 12 }, //  9
        { zDivisor: 26,  xDelta:  -9,  yDelta:  3 }, // 10
        { zDivisor: 26,  xDelta:  -7,  yDelta: 10 }, // 11
        { zDivisor: 26,  xDelta:  -4,  yDelta: 14 }, // 12
        { zDivisor: 26,  xDelta:  -6,  yDelta: 12 }  // 13
    ]
    
    SOME CONCLUSIONS ABOUT THE SUBROUTINES (function versionF and the arguments above)
    

    there are two groups of subroutines:
    
        GROUP A (subroutines 0, 1, 2, 3, 5, 6, and 8)
        
            zDivisor is allways 1
            xDelta is allways greater than 9 
            yDelta is never negative
            yDelta + digit is smaller than 26
    
        GROUP B (subroutines 4, 7, 9, 10, 11, 12, and 13)
        
            zDivisor is allways 26
            xDelta is allways negative
            yDelta is never negative
            yDelta + digit is smaller than 26
    

    the function starts setting 
    
        z = Math.floor(balance / zDivisor)
    
    and has two possible outputs:
    
        1) z // when (digit == balance % 26 + xDelta)
        
        2) z * 26 + digit + yDelta
    
    as the digit, zDivisor and yDelta are allways non negative,
    
    Z (balance) is allways a NON NEGATIVE INTEGER
    
    then, subroutines of group A, don't return from this line:
*/

        if (digit == balance % 26 + xDelta) { return z }

/*
    (because balance is non negative, xDelta is greater than 9 and digit is smaller than 10)

    subroutines of groupA allways return from this line: 
*/

        return z * 26 + digit + yDelta
        
/*
    and being groupA, zDivisor is allways 1,
        
    so we can create a special function for the group A:
     
*/


function forGroupA(digit, balance, yDelta) {
           
    return balance * 26 + digit + yDelta
}


/*
    easy! let's make a function for subroutines of the groupB;
    
    we know that the zDivisor is allways 26        
*/


function forGroupB_sketch(digit, balance, xDelta, yDelta) {
       
    let z = Math.floor(balance / 26)  // FIRST LINE
     
    if (digit == balance % 26 + xDelta) { return z } // SECOND LINE
    
    return z * 26 + digit + yDelta  // THIRD LINE
}


// setting it more clear:


function forGroupB(digit, balance, xDelta, yDelta) {
     
    if (digit == balance % 26 + xDelta) { Math.floor(balance / 26) } // FIRST LINE
    
    return Math.floor(balance / 26) * 26 + digit + yDelta  // SECOND LINE
}


/*

    let's study the functions running 
    
    remember that ALLWAYS digit + yDelta is smaller than 26
    
    (number_smaller_than_26 = digit + yDelta)
    
    this means that Math.floor(balance / 26) erases the eventually added number_smaller_than_26
    
    
    function forGroupA followed by function forGroupB:
    
        forGroupA:
        
            returns balance * 26 + number_smaller_than_26
        
        forGroupB:
        
            first line (if runs to end) returns floor(balance / 26) 
            balance reverts to its original value before the execution of forGroupA
            
            second line (if runs) returns balance floor(balance / 26) * 26 + OTHER_number_smaller_than_26
            erasing the effect of the number_smaller_than_26 in the previous function
            
           
        

    (under construction)
    
*/    
    
