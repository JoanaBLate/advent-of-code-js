## --- Day 4: Secure Container ---

You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

*   It is a six-digit number.
*   The value is within the range given in your puzzle input.
*   Two adjacent digits are the same (like `22` in `1_22_345`).
*   Going from left to right, the digits _never decrease_; they only ever increase or stay the same (like `111123` or `135679`).

Other than the range rule, the following are true:

*   `111111` meets these criteria (double `11`, never decreases).
*   `2234`**`50`** does not meet these criteria (decreasing pair of digits `50`).
*   `123789` does not meet these criteria (no double).

**How many different passwords** within the range given in your puzzle input meet these criteria?

Your puzzle input is `246515-739105`.

To begin, [get your puzzle input](input.txt).

