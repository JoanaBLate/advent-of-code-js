## --- Part Two ---

Now that your FFT is working, you can decode the **real signal**.

The real signal is your puzzle input **repeated 10000 times**. Treat this new signal as a single input list. Patterns are still calculated as before, and 100 phases of FFT are still applied.

The **first seven digits** of your initial input signal also represent the **message offset**. The message offset is the location of the eight-digit message in the final output list. Specifically, the message offset indicates **the number of digits to skip** before reading the eight-digit message. For example, if the first seven digits of your initial input signal were `1234567`, the eight-digit message would be the eight digits after skipping 1,234,567 digits of the final output list. Or, if the message offset were `7` and your final output list were `98765432109876543210`, the eight-digit message would be `21098765`. (Of course, your real message offset will be a seven-digit number, not a one-digit number like `7`.)

Here is the eight-digit message in the final output list after 100 phases. The message offset given in each input has been highlighted. (Note that the inputs given below are repeated 10000 times to find the actual starting input lists.)

*   `**0303673**2577212944063491565474664` becomes `84462026`.
*   `**0293510**9699940807407585447034323` becomes `78725270`.
*   `**0308177**0884921959731165446850517` becomes `53553731`.

After repeating your input signal 10000 times and running 100 phases of FFT, **what is the eight-digit message embedded in the final output list?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

