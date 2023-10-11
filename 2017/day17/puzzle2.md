## --- Part Two ---

The spinlock does not short-circuit. Instead, it gets **more** angry. At least, you assume that's what happened; it's spinning significantly faster than it was a moment ago.

You have good news and bad news.

The good news is that you have improved calculations for how to stop the spinlock. They indicate that you actually need to identify **the value after `0`** in the current state of the circular buffer.

The bad news is that while you were determining this, the spinlock has just finished inserting its fifty millionth value (`50000000`).

**What is the value after `0`** the moment `50000000` is inserted?

Although it hasn't changed, you can still [get your puzzle input](input.txt).

