## --- Part Two ---

Upon further analysis, it doesn't seem like **any** hailstones will naturally collide. It's up to you to fix that!

You find a rock on the ground nearby. While it seems extremely unlikely, if you throw it just right, you should be able to **hit every hailstone in a single throw**!

You can use the probably-magical winds to reach **any integer position** you like and to propel the rock at **any integer velocity**. Now **including the Z axis** in your calculations, if you throw the rock at time `0`, where do you need to be so that the rock **perfectly collides with every hailstone**? Due to probably-magical inertia, the rock won't slow down or change direction when it collides with a hailstone.

In the example above, you can achieve this by moving to position `24, 13, 10` and throwing the rock at velocity `-3, 1, 2`. If you do this, you will hit every hailstone as follows:

```
Hailstone: 19, 13, 30 @ -2, 1, -2
Collision time: 5
Collision position: 9, 18, 20

Hailstone: 18, 19, 22 @ -1, -1, -2
Collision time: 3
Collision position: 15, 16, 16

Hailstone: 20, 25, 34 @ -2, -2, -4
Collision time: 4
Collision position: 12, 17, 18

Hailstone: 12, 31, 28 @ -1, -2, -1
Collision time: 6
Collision position: 6, 19, 22

Hailstone: 20, 19, 15 @ 1, -5, -3
Collision time: 1
Collision position: 21, 14, 12
```

Above, each hailstone is identified by its initial position and its velocity. Then, the time and position of that hailstone's collision with your rock are given.

After 1 nanosecond, the rock has **exactly the same position** as one of the hailstones, obliterating it into ice dust! Another hailstone is smashed to bits two nanoseconds after that. After a total of 6 nanoseconds, all of the hailstones have been destroyed.

So, at time `0`, the rock needs to be at X position `24`, Y position `13`, and Z position `10`. Adding these three coordinates together produces **`47`**. (Don't add any coordinates from the rock's velocity.)

Determine the exact position and velocity the rock needs to have at time `0` so that it perfectly collides with every hailstone. **What do you get if you add up the X, Y, and Z coordinates of that initial position?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

