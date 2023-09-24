
"use strict"

const alphabet = "abcdefghijklmnopqrstuvwxyz"

const source = String.raw`Al => ThF
Al => ThRnFAr
B => BCa
B => TiB
B => TiRnFAr
Ca => CaCa
Ca => PB
Ca => PRnFAr
Ca => SiRnFYFAr
Ca => SiRnMgAr
Ca => SiTh
F => CaF
F => PMg
F => SiAl
H => CRnAlAr
H => CRnFYFYFAr
H => CRnFYMgAr
H => CRnMgYFAr
H => HCa
H => NRnFYFAr
H => NRnMgAr
H => NTh
H => OB
H => ORnFAr
Mg => BF
Mg => TiMg
N => CRnFAr
N => HSi
O => CRnFYFAr
O => CRnMgAr
O => HP
O => NRnFAr
O => OTi
P => CaP
P => PTi
P => SiRnFAr
Si => CaSi
Th => ThCa
Ti => BP
Ti => TiTi
e => HF
e => NAl
e => OMg`

let medicine = "CRnSiRnCaPTiMgYCaPTiRnFArSiThFArCaSiThSiThPBCaCaSiRnSiRnTiTiMgArPBCaPMgYPTiRnFArFArCaSiRnBPMgArPRnCaPTiRnFArCaSiThCaCaFArPBCaCaPTiTiRnFArCaSiRnSiAlYSiThRnFArArCaSiRnBFArCaCaSiRnSiThCaCaCaFYCaPTiBCaSiThCaSiThPMgArSiRnCaPBFYCaCaFArCaCaCaCaSiThCaSiRnPRnFArPBSiThPRnFArSiRnMgArCaFYFArCaSiRnSiAlArTiTiTiTiTiTiTiRnPMgArPTiTiTiBSiRnSiAlArTiTiRnPMgArCaFYBPBPTiRnSiRnMgArSiThCaFArCaSiThFArPRnFArCaSiRnTiBSiThSiRnSiAlYCaFArPRnFArSiThCaFArCaCaSiThCaCaCaSiRnPRnCaFArFYPMgArCaPBCaPBSiRnFYPBCaFArCaSiAl"


const rawlines = source.split("\n")

const formulas = [ ] // [ a, b ]

const newMedicines = [ ]

for (const rawline of rawlines) {
    
    const tokens = rawline.split("=>")
    
    const agent = tokens.shift().trim()
    
    const value = tokens.shift().trim()
    
    formulas.push([agent, value])
}

// console.log(formulas)

let steps = 0

while (medicine != "e") { processOnce(); steps += 1 }

console.log(steps)

function processOnce() {

    for (const formula of formulas) { 
        
        const diff = processFormulaOnce(formula) 
        if (diff) { return }   
    }
}

function processFormulaOnce(formula) {

    const agent = formula[0]
    const value = formula[1]
    
    const index = medicine.indexOf(value)
        
    if (index == -1) { return false }
        
    medicine = medicine.substr(0, index) + agent + medicine.substr(index + value.length) 
    
    console.log(medicine)
    return true       
}





