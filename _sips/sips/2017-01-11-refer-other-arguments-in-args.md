---
layout: sip
title: SIP-32 - Allow referring to other arguments in default parameters
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/refer-other-arguments-in-args.html
---

**By: Pathikrit Bhowmick**

## History

| Date          | Version          |
|---------------|------------------|
| Jan 11th 2017 | Initial Draft    |
| Jan 12th 2017 | Initial Feedback |
| Jan 16th 2017 | Minor Changes    |

## Introduction
Currently there is no way to refer to other arguments in the default parameters list:

Does not compile:
```scala
def substring(s: String, start: Int = 0, end: Int = s.length): String
```

The workaround to achieve this is by using a curried-function:
```scala
def substring(s: String, start: Int = 0)(end: Int = s.length): String
```

However, the above workaround is not always suitable in all situations since you may not want a curried function.

The other more verbose alternative is by overloading:
```scala
def substring(s: String, start: Int): String
  = substring(s, start = 0, end = s.length)
def substring(s: String, start: Int = 0, end: Int): String
```

The above is quite verbose as it required 1 extra function definition per argument that refers other args.

### Proposal
Allow to refer to ***any*** parameters in the same (or left) curried parameter list:
```scala
def substring(s: String, start: Int = 0, end: Int = s.length)   // Legal
def substring(start: Int = 0, end: Int = s.length, s: String)   // Legal !!!
def substring(s: String, start: Int = 0)(end: Int = s.length)   // Legal (works currently)
def substring(start: Int = 0, end: Int = s.length)(s: String)   // Illegal
```

The same applies for class arguments:
```scala
class Substring(s: String, start: Int = 0, end: Int = s.length)   // Legal
class Substring(start: Int = 0, end: Int = s.length, s: String)   // Legal
class Substring(s: String, start: Int = 0)(end: Int = s.length)   // Legal
class Substring(start: Int = 0, end: Int = s.length)(s: String)   // Illegal
```

We should also be able to refer to ***multiple*** parameters:
```scala
def binarySearch(start: Int, end: Int, middle: Int = (start + end)/2)  // Legal
```

# Motivating examples:

TBD

## Interactions with other syntax

#### Partially Applied Functions:
Works as expected:
```scala
def substring(s: String, start: Int = 0, end: Int = s.length)

substring(_, start = 0, end = 5)      // Legal
substring(_, end = 5)                 // Legal (start = 0)
substring(_, start = 5)               // Legal (same as s => substring(s, start = 5, end = s.length)
```

#### Multiple Implicit Parameters
[Multiple implicit parameters](https://github.com/scala/docs.scala-lang/pull/520) should also be allowed to refer to one another (left to right):
```scala
def codec[A](data: A)(implicit encoder: Encoder[A])(implicit decoder: Decoder[A] = encoder.reverse) // Legal
```

#### Referring to type members:
The default parameters should be able to refer to type members of other arguments e.g.:
```scala
trait Codec {
  type Input
  type Output
}

def codec(codec: Codec, in: codec.Input, out: codec.Output) // Legal !!!
```

### Other languages
The following languages allow referring to previously declared arguments in the function signature:
* [CoffeeScript](https://coffeescript.org/)
* [Kotlin](https://kotlinlang.org)
* [TypeScript](https://www.typescriptlang.org/)

AFAIK, there are no major languages where referring to parameters declared to the ***right*** is allowed.

### Discussions
[Scala Lang Forum](https://contributors.scala-lang.org/t/refer-to-previous-argument-in-default-argument-list/215/6)
