## --- Part Two ---

Now, all the defragmenter needs to know is the number of **regions**. A region is a group of **used** squares that are all **adjacent**, not including diagonals. Every used square is in exactly one region: lone used squares form their own isolated regions, while several adjacent squares all count as a single region.

In the example above, the following nine regions are visible, each marked with a distinct digit:

```
11.2.3..-->
.1.2.3.4   
....5.6.   
7.8.55.9   
.88.5...   
88..5..8   
.8...8..   
88.8.88.-->
|      |   
V      V   
```

Of particular interest is the region marked `8`; while it does not appear contiguous in this small view, all of the squares marked `8` are connected when considering the whole 128x128 grid. In total, in this example, `1242` regions are present.

**How many regions** are present given your key string?

Although it hasn't changed, you can still [get your puzzle input](input.txt).

