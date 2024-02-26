
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
      z: holds the result (value that a subroutine pass to the next subroutine)
    
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

    
function versionA(digit, result, zDivisor, xDelta, yDelta) {
       
    let z = result                 // (implicit)
     
    const w = digit                // inp w
   
    let x = 0                      // mul x 0
    
    x += z                         // add x z
        
    x = x % 26                     // mod x
    
    z = Math.floor(z / zDivisor)   // (#) div z 26   -- zDivisor
    
    x += deltaX                    // (#) add x -15  -- xDelta
    
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


    simplifying the version A:

    
function versionB(digit, result, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(result / zDivisor) 
     
    let x = (result % 26) + deltaX
    
    x = (x == digit) ? 0 : 1 // compacts two eql instructions
    
    let y = 25 * x + 1
    
    z *= y
       
    y = (digit + yDelta) * x
        
    return z + y
}


    simplifying the version B:

    
function versionC(digit, result, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(result / zDivisor) 
     
    let x = (result % 26) + deltaX
    
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


    simplifying the version C:

    
function versionD(digit, result, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(result / zDivisor) 
     
    let x = (result % 26) + deltaX
    
    if (x == digit) { return z }
    
    z *= 26
        
    let y = digit + yDelta
        
    return z + y
}

    simplifying the version D:
    
    
function versionE(digit, result, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(result / zDivisor) 
     
    let x = (result % 26) + deltaX
    
    if (x == digit) { return z }
    
    return z * 26 + digit + yDelta
}


    simplifying the version E:
    
    
function versionF(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    if (digit == balance % 26 + xDelta) { return z }
    
    return z * 26 + digit + yDelta
}


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


    2. SMART ASSUMPTIONS BASED ON **MY** INPUT
    ==========================================
    
    
    (under construction)
    
    
    
