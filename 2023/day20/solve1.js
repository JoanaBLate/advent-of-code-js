"use strict"

// solving the puzzle takes (my computer) 0.042s

const input = Deno.readTextFileSync("input.txt").trim()

const DEVICES = { }

var futurePulses = [ ]

const BROADCASTER = 0

const FLIPFLOP = 1

const CONJUNCTION = 2

const OFF = 0

const ON = 1

const LOW = 0

const HIGH = 1

var OUTPUT_NAME = ""

var OUTPUT_PULSE = LOW

var numberOfLowPulses = 0
var numberOfHighPulses = 0


function main() {

    processInput()

    fillMemoryOfConjunctionDevices()
    
    for (let n = 0; n < 1000; n++) { runOnce() }
    
    console.log("the answer is", numberOfLowPulses * numberOfHighPulses)

}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" -> ")
        
        const targets = parts.pop().split(", ")
        
        const token = parts.shift()
        
        let name = "broadcaster"
        
        let kind = BROADCASTER
        
        if (token[0] == "%") { kind = FLIPFLOP; name = token.substr(1) }
        
        if (token[0] == "&") { kind = CONJUNCTION; name = token.substr(1) }
        
        DEVICES[name] = { "name": name, "kind": kind, "targets": targets, "state": OFF, "memory": { } }
    }
}
    
function fillMemoryOfConjunctionDevices() {

    const devices = Object.values(DEVICES)
    
    for (const device of devices) {
        
        for (const target of device.targets) { fillMemoryOfConjunctionDevice(device.name, target) }
    }
}

function fillMemoryOfConjunctionDevice(sender, target) {

    const device = DEVICES[target]
    
    if (device == undefined) { OUTPUT_NAME = target; return }
    
    if (device.kind != CONJUNCTION) { return }
    
    device.memory[sender] = LOW
}

///////////////////////////////////////////////////////////

function runOnce() {

    numberOfLowPulses += 1 // button sends low pulse to broadcaster

    broadcast(LOW)

    while (futurePulses.length != 0) {

        const pulses = futurePulses
        
        futurePulses = [ ]
        
        dispatchPulses(pulses) 
    }
}

///////////////////////////////////////////////////////////

function schedulePulse(sender, target, pulse) {

    futurePulses.push({ "sender": sender, "target": target, "pulse": pulse })
}

function dispatchPulses(pulses) {

    for (const obj of pulses) { receivePulse(obj.sender, obj.pulse, obj.target) }
}
    
function broadcast(pulse) {

    const device = DEVICES["broadcaster"]

    for (const target of device.targets) { schedulePulse("broadcaster", target, pulse) }
}

///////////////////////////////////////////////////////////

function receivePulse(sender, pulse, target) {

    if (pulse == LOW) { numberOfLowPulses += 1 } else { numberOfHighPulses += 1 }

    // console.log("receiving pulse:", sender, pulse, target) 
    
    if (target == OUTPUT_NAME) { OUTPUT_PULSE = pulse; return }

    const device = DEVICES[target]

    if (device.kind == BROADCASTER) { broadcast(pulse); return } 
    
    if (device.kind == FLIPFLOP) { flipflopReceivePulse(device, pulse); return }
    
    conjunctionReceivePulse(sender, device, pulse)
}

function flipflopReceivePulse(device, pulse) {

    if (pulse == HIGH) { return }
    
    const newPulse = (device.state == OFF) ? HIGH : LOW
    
    device.state = (device.state == OFF) ? ON : OFF
    
    for (const target of device.targets) { schedulePulse(device.name, target, newPulse) }
}

function conjunctionReceivePulse(sender, device, pulse) {

    device.memory[sender] = pulse
    
    let lows = 0
    
    let highs = 0
    
    for (const value of Object.values(device.memory)) {
    
        if (value == LOW) { lows += 1 }
        if (value == HIGH) { highs += 1 }
    }
    
    const newPulse = (lows == 0) ? LOW : HIGH
    
    for (const target of device.targets) { schedulePulse(device.name, target, newPulse) } 
}

main()

