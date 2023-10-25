"use strict"

// solving the puzzle takes (my computer) 0.030s

/*

1) there is no negative value:
    pointer only decreases when an (inferior) absolute value is set
    this allows to identifiy all loops

2) before the execution of any instruction:
    r4 and the pointer holds its line number

3) ($) means: parameter r4 was replaced by the line number


-- ORIGINAL PROGRAM (with notes) ----------------------------------------------

#ip 4                     # r4 is the register-pointer


// SECTION A //

// the lines below only run once, and sends the program to line 05
// where r1 receives a new value
// this whole section may be ignored

00 seti 123 0 1           # r1 = 123 // runs only once

01 bani 1 456 1           # r1 &= 456  // r1 is 72  // LOOP START from line 04 
02 eqri 1 72 1            # r1 = (r1 == 72) ? 1 : 0
03 addr 1 4 4             # r4 = r1 + 3  ($) // JUMP to 4 + r1 -> jumps to nextline (04) or skips it (05)
04 seti 0 0 4             # r4 = 0 // JUMP to line 01


// SECTION B //

05 seti 0 6 1             # r1 = 0 // runs only once

// the lines below:
// first run {
//       r1 = 0
//       r3 = 65536
//       r1 = 6780005
//       r2 = 0
//       r1 = 6780005
//       r1 = 6780005
//       r1 = 446795549495
//       r1 = 1510199
//       enters SECTION C
// }

06 bori 1 65536 3         # r3 = r1 | 65636 // LOOP START from line 30
07 seti 6780005 8 1       # r1 = 6780005
08 bani 3 255 2           # r2 = r3 & 255  // LOOP START from line 27
09 addr 1 2 1             # r1 += r2
10 bani 1 16777215 1      # r1 &= 16777215
11 muli 1 65899 1         # r1 = r1 * 65899
12 bani 1 16777215 1      # r1 &= 16777215


// SECTION C //

// the lines below:
// first run {
//       r2 = 0
//       jumps to line 15
//       jumps ot line 17
//       enters SECTION D
// }

13 gtir 256 3 2           # r2 = (256 > r3) ? 1 : 0
14 addr 2 4 4             # r4 = r2 + 14   ($) // JUMP to r2 + 15 -> jumps to nextline (15) or skips it (16)
15 addi 4 1 4             # r4 = 15 + 1    ($) // JUMP to line 17
16 seti 27 5 4            # r4 = 27 // JUMP to line 28
17 seti 0 5 2             # r2 = 0


// SECTION D //

// the lines below:
// first run {
//       r2 = 0
//       r5 = 1
//       r5 = 256
//       r5 = 0
//       jumps to line 22
//       jumps to line 24
//       r2 = 2
//       jumps to line 18
//         LOOP:
//            r5 = 3
//            r5 = 768
//            r2 = 3
//            continue till r5 > r3 then enters SECTION E (jumps to lines 23 and then to 26)

18 addi 2 1 5             # r5 = r2 + 1 // LOOP START from line 25
19 muli 5 256 5           # r5 *= 256
20 gtrr 5 3 5             # r5 = (r5 > r3) ? 1 : 0
21 addr 5 4 4             # r4 = r5 + 21    ($) // JUMP to 22 + r5 -> goes to next line (22) or skips it (23)
22 addi 4 1 4             # r4 = 22 + 1     ($) // JUMP to line 24
23 seti 25 4 4            # r4 = 25 // JUMP to line 26
24 addi 2 1 2             # r2 += 1
25 seti 17 7 4            # r4 = 17 // JUMP to line 18


// SECTION E //

// the lines below:
// first run {
//       r1 = 0, r1 = 1510199, r2 = 256, r3 = 256, r4 = 26, r5 = 1 ] # after executing line 26
//       returns to line 08
// }

26 setr 2 1 3             # r3 = r2
27 seti 7 3 4             # r4 = 7 // JUMP to line 08


// SECTION F //

// the lines below end the program when r1 == r0
// otherwise r2 = 0 and the program jumps to line 6

28 eqrr 1 0 2             # r2 = (r1 == r0) ? 1 : 0 // receives jump from line 16
29 addr 2 4 4             # r4 = r2 + 29    ($) // JUMP to 30 + r2 -> jumps to nextline (30) or ends the program (31)
30 seti 5 4 4             # r4 = 5 // JUMP to line 6


CONCLUSION: we must set r0 to the same value that r1 has at line 28
-------------------------------------------------------------------

*/

const REGISTERS = [ 0, 0, 0, 0, 0, 0 ]

const instructions = [ ]

var registerPointer = 0


function main() {

    processInput()
    
    let pointer = 0
        
    while (true) { 
    
        REGISTERS[registerPointer] = pointer
        
        const instr = instructions[pointer]
                
        executeInstruction(instr) 
        
        if (pointer == 28) {  console.log("the answer is", REGISTERS[1]); return }
            
        pointer = REGISTERS[registerPointer] + 1
    }
}
        
///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")    
    
    registerPointer = parseInt(lines.shift().replace("#ip ",""))
        
    for (const line of lines) {
    
        const tokens = line.split(" ")
        
        const instruction = [ ]
        
        instruction.push(tokens.shift())
        
        instruction.push(parseInt(tokens.shift()))
        instruction.push(parseInt(tokens.shift()))
        instruction.push(parseInt(tokens.shift()))
        
        instructions.push(instruction)
    }
}

///////////////////////////////////////////////////////////

function executeInstruction(instr) {

    const opcode = instr[0]
    
    const valA = instr[1]
    const regA = REGISTERS[valA]
    
    const valB = instr[2]
    const regB = REGISTERS[valB]
    
    const index = instr[3]
    
    if (opcode == "addr") { REGISTERS[index] = regA + regB; return }
    if (opcode == "addi") { REGISTERS[index] = regA + valB; return }

    if (opcode == "mulr") { REGISTERS[index] = regA * regB; return }
    if (opcode == "muli") { REGISTERS[index] = regA * valB; return }
    
    if (opcode == "banr") { REGISTERS[index] = regA & regB; return }
    if (opcode == "bani") { REGISTERS[index] = regA & valB; return }
    
    if (opcode == "borr") { REGISTERS[index] = regA | regB; return }
    if (opcode == "bori") { REGISTERS[index] = regA | valB; return }

    if (opcode == "setr") { REGISTERS[index] = regA; return }
    if (opcode == "seti") { REGISTERS[index] = valA; return }

    if (opcode == "gtri") { REGISTERS[index] = (regA > valB ? 1 : 0); return }
    if (opcode == "gtir") { REGISTERS[index] = (valA > regB ? 1 : 0); return }
    if (opcode == "gtrr") { REGISTERS[index] = (regA > regB ? 1 : 0); return }    

    if (opcode == "eqri") { REGISTERS[index] = (regA == valB ? 1 : 0); return }
    if (opcode == "eqir") { REGISTERS[index] = (valA == regB ? 1 : 0); return }
    if (opcode == "eqrr") { REGISTERS[index] = (regA == regB ? 1 : 0); return }
}

main()

