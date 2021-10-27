---
title: Des bretons malchanceux
date: 22/06/2021
keywords:
    - crypto
thumbnail: /articles/des_bretons_malchanceux/thumbnail.png
description: In this challenge, we had to recover the flag from a strange sequence of numbers encoded with a weird custom base 13 and a few permutations.
author: Elf
---

# Des bretons malchanceux

This challenge was one of the most complicated to understand and flag, not because it's very difficult but it's very obscure and far-fetched.

We start the challenge with the coded message `012 67 28 05 80 05 28 67 1012 105 28 83 106 107 100 68 108 64`.

Without any more informations, no one was able to find anything, so we had to wait for the hints.

The first hint explains that the 0 in base 10 here corresponds to the 3 in base 13, 1 to 9, 2 to 2, 3 to 11, 4 to 1 and finally 5 to 0. We don't just have a base conversion to deal with: we also need to permutate some digits when converting from a basis to another. I have no idea how we were supposed to find that out.

When we read the text again, we can see that a statement try to tell us that it has something to do with the base 13, indeed.

> the 13 cyberhacktivists...

The second hint explains us the whole conversion system. Basically, this base 13 is very unusual, because instead of using A, B and C to represent the decimal numbers 10, 11 and 12, this base will use 10, 11 and 12, but as "digits". Think of them in this case as a single digit and not two digits side by side. This is very counter intuitive, especially when we're used to use letters to represent them.

In addition to the fact that it's weird, it also creates ambiguities. For example, the decimal numbers 10 and 13 now have the exact same base 13 representation (10). Fortunately for us, this challenge is designed to not contain any ambiguous case.

From here, we can create a dictionary of base 10 / base 13 associations for the numbers we know the association. We miss the associations for the decimal numbers from 6 to 12, that is 7 associations. There are 7! possible combinations of associations, that is 5040. As it's a small number of possibilites, we can just compute all the cases with a little script to find the right one.

| Base 10 | Base 13 |
|---------|---------|
| 0       | 3       |
| 1       | 9       |
| 2       | 2       |
| 3       | 11      |
| 4       | 1       |
| 5       | 0       |
| 6       | ?       |
| 7       | ?       |
| 8       | ?       |
| 9       | ?       |
| 10      | ?       |
| 11      | ?       |
| 12      | ?       |

With this table of associations, all that is left to do is to cut each of the given base 13 numbers into two digits of this strange base 13, interchange them with their with their dictionary association to base 10, multiply each of these numbers by the appropriate power of 13 according to the position of the digit in the number, just like any other any base conversion.

Here is my script:

```python
from itertools import permutations

ciphertext = "012 67 28 05 80 05 28 67 1012 105 28 83 106 107 100 68 108 64"

dico = {0: 3, 1: 9, 2: 2, 3: 11, 4: 1, 5: 0}

unknown_keys = [6, 7, 8, 9, 10, 11, 12]
unknown_values = permutations([4, 5, 6, 7, 8, 10, 12])

for permutation in unknown_values:
    run = dico.copy()
    for k, v in zip(unknown_keys, permutation):
        run[k] = v

    inverted = {v: k for k, v in run.items()}

    txt = ""

    for charcode in ciphertext.split():
        if len(charcode) == 2:
            part1 = charcode[0]
            part2 = charcode[1]
        elif (len(charcode) == 3):
            if charcode[0] == "0":
                part1 = charcode[0]
                part2 = charcode[1:]
            else:
                part1 = charcode[:2]
                part2 = charcode[2:]
        else:
            part1 = charcode[:2]
            part2 = charcode[2:]

        ascii = inverted[int(part1)] * 13 + inverted[int(part2)] # 13^0 = 1, no need to add it
        txt += chr(ascii)

    print(txt)
```

Now all we have to do is to be patient and go through the results until we find something that looks like a flag (it is a french sentence).

![](/articles/des_bretons_malchanceux/flag.png)

The flag is the decoded sentence without the spaces. Flag : `CTFIUT{LeMSMestNormand}`