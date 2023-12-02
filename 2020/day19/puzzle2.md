## --- Part Two ---

As you look over the list of messages, you realize your matching rules aren't quite right. To fix them, completely replace rules `8: 42` and `11: 42 31` with the following:

```
8: 42 | 42 8
11: 42 31 | 42 11 31
```

This small change has a big impact: now, the rules **do** contain loops, and the list of messages they could hypothetically match is infinite. You'll need to determine how these changes affect which messages are valid.

Fortunately, many of the rules are unaffected by this change; it might help to start by looking at which rules always match the same set of values and how **those** rules (especially rules `42` and `31`) are used by the new versions of rules `8` and `11`.

(Remember, **you only need to handle the rules you have**; building a solution that could handle any hypothetical combination of rules would be [significantly more difficult](https://en.wikipedia.org/wiki/Formal_grammar).)

For example:

```
42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
```

Without updating rules `8` and `11`, these rules only match three messages: `bbabbbbaabaabba`, `ababaaaaaabaaab`, and `ababaaaaabbbaba`.

However, after updating rules `8` and `11`, a total of **`12`** messages match:

*   `bbabbbbaabaabba`
*   `babbbbaabbbbbabbbbbbaabaaabaaa`
*   `aaabbbbbbaaaabaababaabababbabaaabbababababaaa`
*   `bbbbbbbaaaabbbbaaabbabaaa`
*   `bbbababbbbaaaaaaaabbababaaababaabab`
*   `ababaaaaaabaaab`
*   `ababaaaaabbbaba`
*   `baabbaaaabbaaaababbaababb`
*   `abbbbabbbbaaaababbbbbbaaaababb`
*   `aaaaabbaabaaaaababaa`
*   `aaaabbaabbaaaaaaabbbabbbaaabbaabaaa`
*   `aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`

**After updating rules `8` and `11`, how many messages completely match rule `0`?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

