## --- Part Two ---

The packet is curious how many steps it needs to go.

For example, using the same routing diagram from the example above...

```
     |          
     |  +--+    
     A  |  C    
 F---|--|-E---+ 
     |  |  |  D 
     +B-+  +--+ 

```

...the packet would go:

-   `6` steps down (including the first line at the top of the diagram).
-   `3` steps right.
-   `4` steps up.
-   `3` steps right.
-   `4` steps down.
-   `3` steps right.
-   `2` steps up.
-   `13` steps left (including the `F` it stops on).

This would result in a total of `38` steps.

**How many steps** does the packet need to go?

Although it hasn't changed, you can still [get your puzzle input](input.txt).

