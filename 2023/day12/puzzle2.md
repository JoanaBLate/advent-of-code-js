## --- Part Two ---

As you look out at the field of springs, you feel like there are way more springs than the condition records list. When you examine the records, you discover that they were actually **folded up** this whole time!

To **unfold the records**, on each row, replace the list of spring conditions with five copies of itself (separated by `?`) and replace the list of contiguous groups of damaged springs with five copies of itself (separated by `,`).

So, this row:

```
.# 1
```

Would become:

```
.#?.#?.#?.#?.# 1,1,1,1,1
```

The first line of the above example would become:

```
???.###????.###????.###????.###????.### 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3
```

In the above example, after unfolding, the number of possible arrangements for some rows is now much larger:

*   `???.### 1,1,3` - **`1`** arrangement
*   `.??..??...?##. 1,1,3` - **`16384`** arrangements
*   `?#?#?#?#?#?#?#? 1,3,1,6` - **`1`** arrangement
*   `????.#...#... 4,1,1` - **`16`** arrangements
*   `????.######..#####. 1,6,5` - **`2500`** arrangements
*   `?###???????? 3,2,1` - **`506250`** arrangements

After unfolding, adding all of the possible arrangement counts together produces **`525152`**.

Unfold your condition records; **what is the new sum of possible arrangement counts?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

