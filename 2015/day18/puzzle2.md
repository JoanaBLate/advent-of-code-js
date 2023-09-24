## --- Part Two ---

You flip the instructions over; Santa goes on to point out that this is all
just an implementation of [Conway's Game of Life][game-of-life]. At least, it
was, until you notice that something's wrong with the grid of lights you
bought: four lights, one in each corner, are **stuck on** and can't be turned
off.  The example above will actually run like this:

```
Initial state:
##.#.#
...##.
#....#
..#...
#.#..#
####.#

After 1 step:
#.##.#
####.#
...##.
......
#...#.
#.####

After 2 steps:
#..#.#
#....#
.#.##.
...##.
.#..##
##.###

After 3 steps:
#...##
####.#
..##.#
......
##....
####.#

After 4 steps:
#.####
#....#
...#..
.##...
#.....
#.#..#

After 5 steps:
##.###
.##..#
.##...
.##...
#.#...
##...#
```

After `5` steps, this example now has `17` lights on.

In your grid of 100x100 lights, given your initial configuration, but with the
four corners always in the **on** state,
**how many lights are on after 100 steps**?

Although it hasn't changed, you can still
[get your puzzle input](input.txt).

[game-of-life]: https://en.wikipedia.org/wiki/Conway's_Game_of_Life
