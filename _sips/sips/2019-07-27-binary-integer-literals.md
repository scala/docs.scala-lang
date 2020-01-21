---
layout: sip
title: SIP-NN - Support Binary Integer Literals
vote-status: pending
permalink: /sips/:title.html
---

**By: NthPortal**

## History

| Date          | Version                  |
|---------------|--------------------------|
| Jul 27th 2019 | Initial Draft            |

Your feedback is welcome! If you're interested in discussing this proposal, head over to [this](https://contributors.scala-lang.org/t/pre-sip-binary-literals/3559) Scala Contributors thread and let me know what you think.

## Proposal

Support binary integer literals. For example, the binary literal `0b00101010` would have the integer value `42`.

## Motivation

Several other major languages support binary integer literals, including [Java](https://docs.oracle.com/javase/specs/jls/se12/html/jls-3.html#jls-3.10.1) (as of [Java 7](https://docs.oracle.com/javase/specs/jls/se7/html/jls-3.html#jls-3.10.1)), [Kotlin](https://kotlinlang.org/docs/reference/basic-types.html#literal-constants), [Python](https://docs.python.org/3/reference/lexical_analysis.html#integer-literals) and [Rust](https://doc.rust-lang.org/stable/reference/tokens.html#number-literals).

## Interactions with Other Language Features

Like other integer literals, binary integer literals support separators (`_`), which can greatly enhance the readability of larger values (e.g. `0b_1110_1101_1011_0111`).

## Implementation

The implementation of binary integer literals is quite simple, and can be found at <https://github.com/scala/scala/pull/8275>.
