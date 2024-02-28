/*
 
*WARNING*

THIS SOLUTION MAY NOT WORK FOR YOUR INPUT

This file explains the principles used for solving the puzzle.
    
///////////////////////////////////////////////////////////


1. SIMPLIFYING THE ALU PROGRAM
==============================

The ALU program is a sequence of **14 VERY SIMILAR** subroutines,
one for each digit of the number to be validated.

Only (the same) 3 instructions change among the subroutines;
and only the value of those instructions change.

The instructions that change are marked with '(#)' in the example
subroutine below.

The variables inside each subroutine:

  w: a constant that holds the current input digit
  x: is reset before being used 
  y: is reset before being used
  z: holds the balance (value that a subroutine receives and passes ahead)

For each subsroutine, doesn't matter the previous values of w, x and y.

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


Instead of reading/executing instruction by instruction, we can create an 
equivalent JavaScript function, which is a much more clear and efficient way.
*/
    

// Creating a basic/direct translation:

    
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


// Simplifying the version A:

    
function versionB(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    x = (x == digit) ? 0 : 1 // compacts two eql instructions
    
    let y = 25 * x + 1
    
    z *= y
       
    y = (digit + yDelta) * x
        
    return z + y
}


// Simplifying the version B:

    
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


// Simplifying the version C:

    
function versionD(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    if (x == digit) { return z }
    
    z *= 26
        
    let y = digit + yDelta
        
    return z + y
}


// Simplifying the version D:
    
    
function versionE(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    let x = (balance % 26) + xDelta
    
    if (x == digit) { return z }
    
    return z * 26 + digit + yDelta
}


//  Simplifying the version E:
    
    
function simplified(digit, balance, zDivisor, xDelta, yDelta) {
       
    let z = Math.floor(balance / zDivisor) 
     
    if (digit == balance % 26 + xDelta) { return z }
    
    return z * 26 + digit + yDelta
} 

        
// USING THE SIMPLIFIED FUNCTION //////////////////////////
 
    
const ARGUMENTS = [ // parsed from the ALU program (my input)

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

function validate(number) {

    let stringNumber = "" + number

    let balance = 0
    
    for (let n = 0; n < stringNumber.length; n++) {
    
        const digit = parseInt(stringNumber[n])

        const data = ARGUMENTS[n]
    
        // the balance returned by one subroutine is an argument to the next subroutine
    
        balance = simplified(digit, balance, data.zDivisor, data.xDelta, data.yDelta)
    }
    
    console.log(number, balance == 0 ? "VALIDATED!" : "failed")
}

function simplified(digit, balance, zDivisor, xDelta, yDelta) { 
       
    let z = Math.floor(balance / zDivisor) 
     
    if (balance % 26  ==  digit - xDelta) { return z }
    
    return z * 26 + digit + yDelta
}  

validate(91297395919993) 

/*   

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


2. ANALYSING THE SIMPLIFIED FUNCTION AND ITS ARGUMENTS
======================================================
    

There are two groups of SEVEN subroutines:
    
    GROUP A (subroutines 0, 1, 2, 3, 5, 6, and 8)
    
        zDivisor is always 1
        xDelta is always greater than 9 
        yDelta is never negative
        yDelta + digit is smaller than 26

    GROUP B (subroutines 4, 7, 9, 10, 11, 12, and 13)
    
        zDivisor is always 26
        xDelta is always negative
        yDelta is never negative
        yDelta + digit is smaller than 26
    
--

As the digit, zDivisor and yDelta are always non negative, 
z (balance) is always a NON NEGATIVE INTEGER.

--

The function starts setting "z = Math.floor(balance / zDivisor)".
    
And has two possible outputs:
    
    1) "z", when (digit == balance % 26 + xDelta)
    
    2) "z * 26 + digit + yDelta"
    
--
    
Because balance is always non negative,
digit is always smaller than 10 and,
for subroutines of GROUP A, xDelta is always greater than 9,    
subroutines of groupA NEVER return from this line: 

    if (digit == balance % 26 + xDelta) { return z }

Subroutines of groupA ALWAYS return from this line:

    return z * 26 + digit + yDelta
    
///////////////////////////////////////////////////////////    
        
So we can create a special function for the group A:
     
*/

function forGroupA(digit, balance, yDelta) {
           
    return balance * 26 + digit + yDelta
}

/*
///////////////////////////////////////////////////////////

And now we create a function for subroutines of the groupB.
    
Because, for the groupB, the zDivisor is always 26:

*/

function forGroupB(digit, balance, xDelta, yDelta) {
     
    if (digit == balance % 26 + xDelta) { // CHECKS THE DIGIT
    
        return Math.floor(balance / 26) // DIGIT IS GOOD(*)
    }
    else {
        return Math.floor(balance / 26) * 26 + digit + yDelta  // DIGIT IS BAD(*)
    }
}

// (*) later we will see why the first return is for the good digit
//     and the second return is for the bad digit

/*

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

             
3. THE MAGICAL NUMBER 26 AND THE STACK (or What is going on?)
=============================================================

One of the main features of the ALU program is storing numbers inside numbers.

How is that possible?

Imagine that you want to store a list of 3 digits, [5, 2, 8], in the possible (memory) cheapest way.

All you have to do is store the number 528.

Our decimal numbers do this all the time, with digits from 0 to 9. But the ALU program stores numbers from 

0 to 25 (digit + yDelta), totalizing 26 numbers. That's why the number 26 is everywhere.


Another main feature of the ALU program is to shuffle the data for validating the digits in different subrorutines.

For example, part of the data necessary for validating the last digit is not on the last subroutine.

Therefore, data from a subroutine must be stored for later use.


It is easier to understand if we think that the subroutines exchange data via a stack (pushing and popping).

Subroutines of groupA only push values to the stack.

Subroutines of groupB pop values from the stack. But, when the digit is bad, they push value to the stack too.

--> There are seven subroutines of each kind. Seven only push. And seven should only pop (when the number is good).

--> Only if the stack is empty, after running all subroutines, the number is validated. 

This is how the ALU program works.
    
///////////////////////////////////////////////////////////
    
Let's see those functions again.
    
--

Function forGroupA returns "balance * 26 + digit + yDelta".

"balance" is a number that play the role of the stack (storing numbers).

"balance * 26" is like setting the position in the stack for the new data.

"digit + yDelta" is the data we want to store in the stack, so we add ("+")
it to the stack.

--

Function forGroupB may return 
"Math.floor(balance / 26)" 
or
"Math.floor(balance / 26) * 26 + digit + yDelta",
depends on 
"digit == balance % 26 + xDelta".

"Math.floor(balance / 26)" means the position in the stack before
the last pushing. Just returning it is like popping the stack.

"Math.floor(balance / 26) * 26" means the new position after the 
last pushing to the stack.

Returning "Math.floor(balance / 26) * 26 + digit + yDelta" means pushing
"digit + yDelta" to the stack.

"balance % 26" means reading the last value on the stack.

///////////////////////////////////////////////////////////

Let's check this stack as number concept with a small example.

--

First, we call "forGroupA(digit=3, balance=100, yDelta=4)".

It returns 26 * 100 + 3 + 4 -> 2607.

7 is the value stored in the position 2600 of the stack/number.

--

Then we call "forGroupB(digit=8, balance=2607, xDelta=-5, yDelta=9)".

It checks "if (digit == balance % 26 + xDelta)".
    
We have provided the value for the digit.

xDelta was parsed from the input (it is in the table of arguments).

The value 2607 for the balance was provided by the previous function.

"balance % 26" is 7: THE VALUE THAT WAS STORED PREVIOUSLY!

--

In the ALU program, 
    
"if (digit == balance % 26 + xDelta)"
        
means
        
"if (currentDigit == (previousDigit + previousYDelta) + currentXDelta)".
    

MULTIPLYING BY 26, DIVIDING BY 26 AND GETTING THE MODULE OF 26 
IS JUST AWAY OF **STORING** AND PASSING AN INTEGER SMALLER THAN 26!!!

--
            
COULDN'T WE ACHIVE THE SAME RESULT, WITHOUT A STACK? JUST PASSING DATA DIRECTLY?

NO! Because of the order of the subroutines. They DON'T alternate regularly like:

groupA, groupB, groupA, groupB, groupA, groupB, groupA, groupB...


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
    
             
4. THE STACK STYLE CODE
=======================


Let's rewrite our code in pure stack style.

This is how the old code is translated to the new stack style code:


EACH TIME WE SEE A MATH OPERATION WITH THE BALANCE, 
WE TRANSLATE IT INTO A STACK OPERATION - THERE IS
NO BALANCE ANYMORE!

** INCREASING THE BALANCE = PUSHING DATA TO THE STACK

** DECREASING THE BALANCE = POPPING DATA FROM THE STACK

** NUMBER VALIDATION  ==  (BALANCE == 0)  ==  (STACK.LENGTH == 0)


*/

const ARGUMENTS = [ // (repeated)

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


function checkNumber(number) {

    const digits = number.toString()

    const stack = [ ]
    
    for (let n = 0; n < digits.length; n++) {
    
        const digit = parseInt(digits[n])
        
        const args = ARGUMENTS[n]
        
        const isGroupA = args.zDivisor == 1

        const xDelta = args.xDelta
        const yDelta = args.yDelta
        
        if (isGroupA) { stack.push(digit + yDelta); continue } // groupA subroutine, just stores data
        
        // groupB subroutine:
        
        const last = stack.pop() // retrieving data
        
        if (digit == last + xDelta) { continue } // here is the criteria for a good digit;
                                                 // last means previous_digit + previous_yDelta  
        
        stack.push(digit + yDelta) // -> bad digit corrupts the stack with excessive data;
                                   // -> any data pushed now works, need not to be "digit + yDelta"
    }
    
    const valid = stack.length == 0
    
    console.log(valid ? "VALID!" : "failed")
}


const good = 91297395919993

checkNumber(good-1) // failed
checkNumber(good)   // VALID!!
checkNumber(good+1) // failed

/*
    
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
    
             
5. USING THE STACK FOR PREDICTING GOOD DIGITS
=============================================

(running the function checkNumber with feedback)


This is what happens with the stack when validating a good number (91297395919993):
  
checking digit 9 at position 0
    pushing 9                     <-- pushing the value 9 here
checking digit 1 at position 1
    pushing 13
checking digit 2 at position 2
    pushing 16
checking digit 9 at position 3
    pushing 9
checking digit 7 at position 4
    popping 9
checking digit 3 at position 5
    pushing 18
checking digit 9 at position 6
    pushing 20
checking digit 5 at position 7
    popping 20
checking digit 9 at position 8
    pushing 10
checking digit 1 at position 9
    popping 10
checking digit 9 at position 10
    popping 18
checking digit 9 at position 11
    popping 16
checking digit 9 at position 12
    popping 13
checking digit 3 at position 13
    popping 9                    <-- retrieving the value 9 here
VALID!

--

This is what happens with the stack when validating a bad number (81297395919993):
  
checking digit 8 at position 0    <-- bad digit
    pushing 8                     <-- pushing the value 8 here
checking digit 1 at position 1
    pushing 13
checking digit 2 at position 2
    pushing 16
checking digit 9 at position 3
    pushing 9
checking digit 7 at position 4
    popping 9
checking digit 3 at position 5
    pushing 18
checking digit 9 at position 6
    pushing 20
checking digit 5 at position 7
    popping 20
checking digit 9 at position 8
    pushing 10
checking digit 1 at position 9
    popping 10
checking digit 9 at position 10
    popping 18
checking digit 9 at position 11
    popping 16
checking digit 9 at position 12
    popping 13
checking digit 3 at position 13
    popping 8                     <-- popping the value 8 here
    pushing 15                    <-- pushing after popping - only happens with bad digits
failed


///////////////////////////////////////////////////////////


The principles used for solving the puzzle:


>>  GROUPA SUBROUTINES NEVER CHECK ANYTHING, JUST STORES DATA
    ONTO THE STACK

>>  GROUPB SUBROUTINES VALIDATE OR NOT THE CURRENT DIGIT BASED ON
    THE DIGIT ITSELF, THE CURRENT XDELTA AND THE PREVIOUS (DIGIT + YDELTA)

    "PREVIOUS" MEANS THE LAST POPPED DATA FROM THE STACK
  
  
Predicting the max valid number, it is just predicting each max valid digit, 
based on the criterion above, of course the shuffled data must be tracked first.

The same works for the minimum valid number.

*/

