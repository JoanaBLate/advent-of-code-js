## --- Part Two ---

The logic you've constructed forms a single **round** of the **Knot Hash** algorithm; running the full thing requires many of these rounds. Some input and output processing is also required.

First, from now on, your input should be taken not as a list of numbers, but as a string of bytes instead. Unless otherwise specified, convert characters to bytes using their [ASCII codes](https://en.wikipedia.org/wiki/ASCII#Printable_characters). This will allow you to handle arbitrary ASCII strings, and it also ensures that your input lengths are never larger than `255`. For example, if you are given `1,2,3`, you should convert it to the ASCII codes for each character: `49,44,50,44,51`.

Once you have determined the sequence of lengths to use, add the following lengths to the end of the sequence: `17, 31, 73, 47, 23`. For example, if you are given `1,2,3`, your final sequence of lengths should be `49,44,50,44,51,17,31,73,47,23` (the ASCII codes from the input string combined with the standard length suffix values).

Second, instead of merely running one **round** like you did above, run a total of `64` rounds, using the same **length** sequence in each round. The **current position** and **skip size** should be preserved between rounds. For example, if the previous example was your first round, you would start your second round with the same **length** sequence (`3, 4, 1, 5, 17, 31, 73, 47, 23`, now assuming they came from ASCII codes and include the suffix), but start with the previous round's **current position** (`4`) and **skip size** (`4`).

Once the rounds are complete, you will be left with the numbers from `0` to `255` in some order, called the **sparse hash**. Your next task is to reduce these to a list of only `16` numbers called the **dense hash**. To do this, use numeric bitwise [XOR](https://en.wikipedia.org/wiki/Bitwise_operation#XOR) to combine each consecutive block of `16` numbers in the sparse hash (there are `16` such blocks in a list of `256` numbers). So, the first element in the dense hash is the first sixteen elements of the sparse hash XOR'd together, the second element in the dense hash is the second sixteen elements of the sparse hash XOR'd together, etc.

For example, if the first sixteen elements of your sparse hash are as shown below, and the XOR operator is `^`, you would calculate the first output number like this:

```
65 ^ 27 ^ 9 ^ 1 ^ 4 ^ 3 ^ 40 ^ 50 ^ 91 ^ 7 ^ 6 ^ 0 ^ 2 ^ 5 ^ 68 ^ 22 = 64
```

Perform this operation on each of the sixteen blocks of sixteen numbers in your sparse hash to determine the sixteen numbers in your dense hash.

Finally, the standard way to represent a Knot Hash is as a single [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) string; the final output is the dense hash in hexadecimal notation. Because each number in your dense hash will be between `0` and `255` (inclusive), always represent each number as two hexadecimal digits (including a leading zero as necessary). So, if your first three numbers are `64, 7, 255`, they correspond to the hexadecimal numbers `40, 07, ff`, and so the first six characters of the hash would be `4007ff`. Because every Knot Hash is sixteen such numbers, the hexadecimal representation is always `32` hexadecimal digits (`0`\-`f`) long.

Here are some example hashes:

-   The empty string becomes `a2582a3a0e66e6e86e3812dcb672a272`.
-   `AoC 2017` becomes `33efeb34ea91902bb2f59c9920caa6cd`.
-   `1,2,3` becomes `3efbe78a8d82f29979031a4aa0b16a9d`.
-   `1,2,4` becomes `63960835bcdc130f0b66d7ff4f6a5a8e`.

Treating your puzzle input as a string of ASCII characters, **what is the Knot Hash of your puzzle input?** Ignore any leading or trailing whitespace you might encounter.

Although it hasn't changed, you can still [get your puzzle input](input.txt).

