## --- Part Two ---

There are many areas the springdroid can't reach. You flip through the manual and discover a way to **increase its sensor range**.

Instead of ending your springcode program with `WALK`, use `RUN`. Doing this will enable **extended sensor mode**, capable of sensing ground up to **nine tiles away**. This data is available in **five new read-only registers**:

*   Register `E` indicates whether there is ground **five** tiles away.
*   Register `F` indicates whether there is ground **six** tiles away.
*   Register `G` indicates whether there is ground **seven** tiles away.
*   Register `H` indicates whether there is ground **eight** tiles away.
*   Register `I` indicates whether there is ground **nine** tiles away.

All other functions remain the same.

Successfully survey the rest of the hull by ending your program with `RUN`. **What amount of hull damage does the springdroid now report?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

