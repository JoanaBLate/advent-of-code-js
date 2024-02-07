## --- Part Two ---

Your handheld device indicates that the distress signal is coming from a beacon nearby. The distress beacon is not detected by any sensor, but the distress beacon must have `x` and `y` coordinates each no lower than `0` and no larger than `4000000`.

To isolate the distress beacon's signal, you need to determine its **tuning frequency**, which can be found by multiplying its `x` coordinate by `4000000` and then adding its `y` coordinate.

In the example above, the search space is smaller: instead, the `x` and `y` coordinates can each be at most `20`. With this reduced search area, there is only a single position that could have a beacon: `x=14, y=11`. The tuning frequency for this distress beacon is **`56000011`**.

Find the only possible position for the distress beacon. **What is its tuning frequency?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

