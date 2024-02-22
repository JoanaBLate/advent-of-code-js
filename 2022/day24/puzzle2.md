## --- Part Two ---

As you reach the force field, you think you hear some Elves in the distance. Perhaps they've already arrived?

You approach the strange **input device**, but it isn't quite what the monkeys drew in their notes. Instead, you are met with a large **cube**; each of its six faces is a square of 50x50 tiles.

To be fair, the monkeys' map **does** have six 50x50 regions on it. If you were to **carefully fold the map**, you should be able to shape it into a cube!

In the example above, the six (smaller, 4x4) faces of the cube are:

```
        1111
        1111
        1111
        1111
222233334444
222233334444
222233334444
222233334444
        55556666
        55556666
        55556666
        55556666
```

You still start in the same position and with the same facing as before, but the **wrapping** rules are different. Now, if you would walk off the board, you instead **proceed around the cube**. From the perspective of the map, this can look a little strange. In the above example, if you are at A and move to the right, you would arrive at B facing down; if you are at C and move down, you would arrive at D facing up:

```
        ...#
        .#..
        #...
        ....
...#.......#
........#..A
..#....#....
.D........#.
        ...#..B.
        .....#..
        .#......
        ..C...#.
```

Walls still block your path, even if they are on a different face of the cube. If you are at E facing up, your movement is blocked by the wall marked by the arrow:

```
        ...#
        .#..
     -->#...
        ....
...#..E....#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.
```

Using the same method of drawing the **last facing you had** with an arrow on each tile you visit, the full path taken by the above example now looks like this:

```
        >>v#    
        .#v.    
        #.v.    
        ..v.    
...#..^...v#    
.>>>>>^.#.>>    
.^#....#....    
.^........#.    
        ...#..v.
        .....#v.
        .#v<<<<.
        ..v...#.
```

The final password is still calculated from your final position and facing from the perspective of the map. In this example, the final row is `5`, the final column is `7`, and the final facing is `3`, so the final password is 1000 \* 5 + 4 \* 7 + 3 = **`5031`**.

Fold the map into a cube, **then** follow the path given in the monkeys' notes. **What is the final password?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

