## \--- Day 18: Boiling Boulders ---

You and the elephants finally reach fresh air. You've emerged near the base of a large volcano that seems to be actively erupting! Fortunately, the lava seems to be flowing away from you and toward the ocean.

Bits of lava are still being ejected toward you, so you're sheltering in the cavern exit a little longer. Outside the cave, you can see the lava landing in a pond and hear it loudly hissing as it solidifies.

Depending on the specific compounds in the lava and speed at which it cools, it might be forming [obsidian](https://en.wikipedia.org/wiki/Obsidian)! The cooling rate should be based on the surface area of the lava droplets, so you take a quick scan of a droplet as it flies past you (your puzzle input).

Because of how quickly the lava is moving, the scan isn't very good; its resolution is quite low and, as a result, it approximates the shape of the lava droplet with **1x1x1 cubes on a 3D grid**, each given as its `x,y,z` position.

To approximate the surface area, count the number of sides of each cube that are not immediately connected to another cube. So, if your scan were only two adjacent cubes like `1,1,1` and `2,1,1`, each cube would have a single side covered and five sides exposed, a total surface area of **`10`** sides.

Here's a larger example:

```
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
```
In the above example, after counting up all the sides that aren't connected to another cube, the total surface area is **`64`**.

**What is the surface area of your scanned lava droplet?**

To begin, [get your puzzle input](input.txt).

