## --- Part Two ---

As you go to remove the virus from the infected nodes, it **evolves** to resist your attempt.

Now, before it infects a clean node, it will **weaken** it to disable your defenses. If it encounters an infected node, it will instead **flag** the node to be cleaned in the future. So:

-   **Clean** nodes become **weakened**.
-   **Weakened** nodes become **infected**.
-   **Infected** nodes become **flagged**.
-   **Flagged** nodes become **clean**.

Every node is always in exactly one of the above states.

The virus carrier still functions in a similar way, but now uses the following logic during its bursts of action:

-   Decide which way to turn based on the **current node**:
    -   If it is **clean**, it turns **left**.
    -   If it is **weakened**, it does **not** turn, and will continue moving in the same direction.
    -   If it is **infected**, it turns **right**.
    -   If it is **flagged**, it **reverses** direction, and will go back the way it came.
-   Modify the state of the **current node**, as described above.
-   The virus carrier moves **forward** one node in the direction it is facing.

Start with the same map (still using `.` for **clean** and `#` for infected) and still with the virus carrier starting in the middle and facing **up**.

Using the same initial state as the previous example, and drawing **weakened** as `W` and **flagged** as `F`, the middle of the infinite grid looks like this, with the virus carrier's position again marked with `[ ]`:

```
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . # . . .
. . . #[.]. . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
```

This is the same as before, since no initial nodes are **weakened** or **flagged**. The virus carrier is on a clean node, so it still turns left, instead **weakens** the node, and moves left:

```
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . # . . .
. . .[#]W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
```

The virus carrier is on an infected node, so it still turns right, instead **flags** the node, and moves up:

```
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . .[.]. # . . .
. . . F W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
```

This process repeats three more times, ending on the previously-flagged node and facing right:

```
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . W W . # . . .
. . W[F]W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
```

Finding a flagged node, it reverses direction and **cleans** the node:

```
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . W W . # . . .
. .[W]. W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
```

The **weakened** node becomes infected, and it continues in the same direction:

```
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
. . W W . # . . .
.[.]# . W . . . .
. . . . . . . . .
. . . . . . . . .
. . . . . . . . .
```

Of the first `100` bursts, `26` will result in **infection**. Unfortunately, another feature of this evolved virus is **speed**; of the first `10000000` bursts, `2511944` will result in **infection**.

Given your actual map, after `10000000` bursts of activity, **how many bursts cause a node to become infected**? (Do not count nodes that begin infected.)

Although it hasn't changed, you can still [get your puzzle input](input.txt).

