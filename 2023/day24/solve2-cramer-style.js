"use strict"

// solving the puzzle takes (my computer) 0.040s

/*/
    >>> this program is a very slightly changed version of the original one 
    
    by shahata5 at https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/khlrstp/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    
    
We can create first three equations from the fact that the hailstone 0 and our rock will meet at t0
1) px0 + vx0*t0 = pxr + vxr*t0
2) py0 + vy0*t0 = pyr + vyr*t0
3) py0 + vz0*t0 = pzr + vzr*t0

We edit the three equations to isolate t0 because we don't really care about it
1) t0 = (pxr - px0) / (vx0 - vxr)
2) t0 = (pyr - py0) / (vy0 - vyr)
3) t0 = (pzr - pz0) / (vz0 - vzr)

Now we can create two equations eliminating t0 from the system
1) (pxr - px0) / (vx0 - vxr) = (pyr - py0) / (vy0 - vyr)
2) (pxr - px0) / (vx0 - vxr) = (pzr - pz0) / (vz0 - vzr)

We edit the two new equaltions to so that we get ready to expand them
1) (pxr - px0) * (vy0 - vyr) = (pyr - py0) * (vx0 - vxr)
2) (pxr - px0) * (vz0 - vzr) = (pzr - pz0) * (vx0 - vxr)

And now we expnad the equations
1) pxr*vy0 - pxr*vyr - px0*vy0 + px0*vyr = pyr*vx0 - pyr*vxr - py0*vx0 + py0*vxr
2) pxr*vz0 - pxr*vzr - px0*vz0 + px0*vzr = pzr*vx0 - pzr*vxr - pz0*vx0 + pz0*vxr

We know that those equations are true actually for any hailstone, not just hailstone 0
So now we add two new equations for hailstone N which are identical to the two above
3) pxr*vyN - pxr*vyr - pxN*vyN + pxN*vyr = pyr*vxN - pyr*vxr - pyN*vxN + pyN*vxr
4) pxr*vzN - pxr*vzr - pxN*vzN + pxN*vzr = pzr*vxN - pzr*vxr - pzN*vxN + pzN*vxr

Now we can substract equations 1 & 3 and substract 2 & 4
It will help us to get rid of those pxr*vyr, pyr*vxr and so on
We really don't want them because for cramer rule we need a linear equation a1*x+a2*y+...=c
1-3) pxr*(vy0 - vyN) + pyr*(vxN - vx0) + vxr*(pyN - py0) + vyr*(px0 - pxN) = px0*vy0 - py0*vx0 - pxN*vyN + pyN*vxN
2-4) pxr*(vz0 - vzN) + pzr*(vxN - vx0) + vxr*(pzN - pz0) + vzr*(px0 - pxN) = px0*vz0 - pz0*vx0 - pxN*vzN + pzN*vxN

Now let's just add any missing variables to the two new equations
1) pxr*(vy0 - vyN) + pyr*(vxN - vx0) + pzr*(0)         + vxr*(pyN - py0) + vyr*(px0 - pxN) + vzr*(0)         = px0*vy0 - py0*vx0 - pxN*vyN + pyN*vxN
2) pxr*(vz0 - vzN) + pyr*(0)         + pzr*(vxN - vx0) + vxr*(pzN - pz0) + vyr*(0)         + vzr*(px0 - pxN) = px0*vz0 - pz0*vx0 - pxN*vzN + pzN*vxN

That's it now we have two equations with constant coefficients for our six variables (pxr, pyr, pzr, vxr, vyr, vzr)
It means that we can choose any three hailstones (1 to N) and have six equations linear system.

vy0 - vy1    vx1 - vx0    0            py1 - py0    px0 - px1    0         = px0*vy0 - py0*vx0 - px1*vy1 + py1*vx1
vz0 - vz1    0            vx1 - vx0    pz1 - pz0    0            px0 - px1 = px0*vz0 - pz0*vx0 - px1*vz1 + pz1*vx1
vy0 - vy2    vx2 - vx0    0            py2 - py0    px0 - px2    0         = px0*vy0 - py0*vx0 - px2*vy2 + py2*vx2
vz0 - vz2    0            vx2 - vx0    pz2 - pz0    0            px0 - px2 = px0*vz0 - pz0*vx0 - px2*vz2 + pz2*vx2
vy0 - vy3    vx3 - vx0    0            py3 - py0    px0 - px3    0         = px0*vy0 - py0*vx0 - px3*vy3 + py3*vx3
vz0 - vz3    0            vx3 - vx0    pz3 - pz0    0            px0 - px3 = px0*vz0 - pz0*vx0 - px3*vz3 + pz3*vx3

Feed this matrix into Cramer's rule and we have our result: https://www.youtube.com/watch?v=RdLo-9jh2EM

/*/

const input = Deno.readTextFileSync("input.txt").trim()

function main() {

    console.log(solve())
}

function add(A, B, hails, n) {

    const [px0, py0, pz0, vx0, vy0, vz0] = hails[0]
    const [pxN, pyN, pzN, vxN, vyN, vzN] = hails[n]
    A.push([vy0 - vyN, vxN - vx0, 0n, pyN - py0, px0 - pxN, 0n])
    B.push(px0 * vy0 - py0 * vx0 - pxN * vyN + pyN * vxN)
    A.push([vz0 - vzN, 0n, vxN - vx0, pzN - pz0, 0n, px0 - pxN])
    B.push(px0 * vz0 - pz0 * vx0 - pxN * vzN + pzN * vxN)
}

function det(m) {

    if (m.length == 0) return 1n
    let [l, ...r] = m
    r = l.map((n, i) => n * det(r.map(row => row.toSpliced(i, 1))))

    return r.reduce((a, b, i) => (i % 2 ? a - b : a + b), 0n)
}

function cramer(A, B) {

    const detA = det(A)
    return A.map((_, i) => det(A.map((r, j) => r.toSpliced(i, 1, B[j]))) / detA)
}

function solve() {

    const hails = input.split('\n').map(line => line.match(/-?\d+/g).map(BigInt))
    const A = []
    const B = []
    for (let i = 1; i <= 3; i++) add(A, B, hails, i)
    const [pxr, pyr, pzr] = cramer(A, B)
    return pxr + pyr + pzr
}

main()

// (I am confused... is this a puzzle for Advent Of Code or for Advent Of Math?)


