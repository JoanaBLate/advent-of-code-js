## --- Part Two ---

That's weird... the sleigh still isn't balancing.

"Ho ho ho", Santa muses to himself. "I forgot the trunk".

Balance the sleigh again, but this time, separate the packages into
**four groups** instead of three. The other constraints still apply.

Given the example packages above, this would be some of the new unique first
groups, their quantum entanglements, and one way to divide the remaining
packages:

```
11 4    (QE=44); 10 5;   9 3 2 1; 8 7
10 5    (QE=50); 11 4;   9 3 2 1; 8 7
9 5 1   (QE=45); 11 4;   10 3 2;  8 7
9 4 2   (QE=72); 11 3 1; 10 5;    8 7
9 3 2 1 (QE=54); 11 4;   10 5;    8 7
8 7     (QE=56); 11 4;   10 5;    9 3 2 1
```

Of these, there are three arrangements that put the minimum (two) number of
packages in the first group: `11 4`, `10 5`, and `8 7`. Of these, `11 4` has
the lowest quantum entanglement, and so it is selected.

Now, what is the **quantum entanglement** of the first group of packages in the
ideal configuration?

Although it hasn't changed, you can still
[get your puzzle input](input.txt).
