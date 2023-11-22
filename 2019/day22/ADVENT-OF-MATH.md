## Advent of Code or Advent of Math?

I tried very hard, during five days, to solve the part 2 of this puzzle in **efficient and intuitive programming** style, using JavaScript - which is exactly the purpose my series of solutions.

I failed.

My best attempt is in this file: trying-backwards.js

Below you see a short and fast MATH solution in Python that was published on Reddit by someone else.


```

m = 119315717514047
n = 101741582076661
pos = 2020
shuffles = { 'deal with increment ': lambda x,m,a,b: (a*x %m, b*x %m),
         'deal into new stack': lambda _,m,a,b: (-a %m, (m-1-b)%m),
         'cut ': lambda x,m,a,b: (a, (b-x)%m) }
a,b = 1,0
with open('input.txt') as f:
  for s in f.read().strip().split('\n'):
    for name,fn in shuffles.items():
      if s.startswith(name):
        arg = int(s[len(name):]) if name[-1] == ' ' else 0
        a,b = fn(arg, m, a, b)
        break

r = (b * pow(1-a, m-2, m)) % m
print(f"Card at #{pos}: {((pos - r) * pow(a, n*(m-2), m) + r) % m}")

```
