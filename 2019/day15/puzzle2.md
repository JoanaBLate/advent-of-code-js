## --- Part Two ---

You quickly repair the oxygen system; oxygen gradually fills the area.

Oxygen starts in the location containing the repaired oxygen system. It takes **one minute** for oxygen to spread to all open locations that are adjacent to a location that already contains oxygen. Diagonal locations are **not** adjacent.

In the example above, suppose you've used the droid to explore the area fully and have the following map (where locations that currently contain oxygen are marked `O`):

```
 ##   
#..## 
#.#..#
#.O.# 
 ###  
```

Initially, the only location which contains oxygen is the location of the repaired oxygen system. However, after one minute, the oxygen spreads to all open (`.`) locations that are adjacent to a location containing oxygen:

```
 ##   
#..## 
#.#..#
#OOO# 
 ###  
```

After a total of two minutes, the map looks like this:

```
 ##   
#..## 
#O#O.#
#OOO# 
 ###  
```

After a total of three minutes:

```
 ##   
#O.## 
#O#OO#
#OOO# 
 ###  
```

And finally, the whole region is full of oxygen after a total of four minutes:

```
 ##   
#OO## 
#O#OO#
#OOO# 
 ###  
```

So, in this example, all locations contain oxygen after `**4**` minutes.

Use the repair droid to get a complete map of the area. **How many minutes will it take to fill with oxygen?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

