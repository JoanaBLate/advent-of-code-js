## --- Part Two ---

You arrive at the vault only to discover that there is not one vault, but **four** - each with its own entrance.

On your map, find the area in the middle that looks like this:

```
...
.@.
...
```

Update your map to instead use the correct data:

```
@#@
###
@#@
```

This change will split your map into four separate sections, each with its own entrance:

```
#######       #######
#a.#Cd#       #a.#Cd#
##...##       ##@#@##
##.@.##  -->  #######
##...##       ##@#@##
#cB#Ab#       #cB#Ab#
#######       #######
```

Because some of the keys are for doors in other vaults, it would take much too long to collect all of the keys by yourself. Instead, you deploy four remote-controlled robots. Each starts at one of the entrances (`@`).

Your goal is still to **collect all of the keys in the fewest steps**, but now, each robot has its own position and can move independently. You can only remotely control a single robot at a time. Collecting a key instantly unlocks any corresponding doors, regardless of the vault in which the key or door is found.

For example, in the map above, the top-left robot first collects key `a`, unlocking door `A` in the bottom-right vault:

```
#######
#@.#Cd#
##.#@##
#######
##@#@##
#cB#.b#
#######
```

Then, the bottom-right robot collects key `b`, unlocking door `B` in the bottom-left vault:

```
#######
#@.#Cd#
##.#@##
#######
##@#.##
#c.#.@#
#######
```

Then, the bottom-left robot collects key `c`:

```
#######
#@.#.d#
##.#@##
#######
##.#.##
#@.#.@#
#######
```

Finally, the top-right robot collects key `d`:

```
#######
#@.#.@#
##.#.##
#######
##.#.##
#@.#.@#
#######
```

In this example, it only took **`8`** steps to collect all of the keys.

Sometimes, multiple robots might have keys available, or a robot might have to wait for multiple keys to be collected:

```
###############
#d.ABC.#.....a#
######@#@######
###############
######@#@######
#b.....#.....c#
###############
```

First, the top-right, bottom-left, and bottom-right robots take turns collecting keys `a`, `b`, and `c`, a total of `6 + 6 + 6 = 18` steps. Then, the top-left robot can access key `d`, spending another `6` steps; collecting all of the keys here takes a minimum of **`24`** steps.

Here's a more complex example:

```
#############
#DcBa.#.GhKl#
#.###@#@#I###
#e#d#####j#k#
###C#@#@###J#
#fEbA.#.FgHi#
#############
```

*   Top-left robot collects key `a`.
*   Bottom-left robot collects key `b`.
*   Top-left robot collects key `c`.
*   Bottom-left robot collects key `d`.
*   Top-left robot collects key `e`.
*   Bottom-left robot collects key `f`.
*   Bottom-right robot collects key `g`.
*   Top-right robot collects key `h`.
*   Bottom-right robot collects key `i`.
*   Top-right robot collects key `j`.
*   Bottom-right robot collects key `k`.
*   Top-right robot collects key `l`.

In the above example, the fewest steps to collect all of the keys is **`32`**.

Here's an example with more choices:

```
#############
#g#f.D#..h#l#
#F###e#E###.#
#dCba@#@BcIJ#
#############
#nK.L@#@G...#
#M###N#H###.#
#o#m..#i#jk.#
#############
```

One solution with the fewest steps is:

*   Top-left robot collects key `e`.
*   Top-right robot collects key `h`.
*   Bottom-right robot collects key `i`.
*   Top-left robot collects key `a`.
*   Top-left robot collects key `b`.
*   Top-right robot collects key `c`.
*   Top-left robot collects key `d`.
*   Top-left robot collects key `f`.
*   Top-left robot collects key `g`.
*   Bottom-right robot collects key `k`.
*   Bottom-right robot collects key `j`.
*   Top-right robot collects key `l`.
*   Bottom-left robot collects key `n`.
*   Bottom-left robot collects key `m`.
*   Bottom-left robot collects key `o`.

This example requires at least **`72`** steps to collect all keys.

After updating your map and using the remote-controlled robots, **what is the fewest steps necessary to collect all of the keys?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

