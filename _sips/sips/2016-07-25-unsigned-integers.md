---
layout: sip
title: SIP-26 - Unsigned Integers

vote-status: rejected
vote-text: The committee votes to reject the proposal because of a 6% performance hit on the provided implementation by the authors.
permalink: /sips/:title.html
redirect_from: /sips/pending/unsigned-integers.html
---

__Sébastien Doeraene and Denys Shabalin__

**Summary**: We propose the addition of 4 "primitive" types to represent
unsigned integers: `UByte`, `UShort`, `UInt` and `ULong`.

A prototype implementation of this proposal, with unit tests and benchmarks,
can be found [here](https://github.com/scala/scala/compare/2.12.x...sjrd:uints).

## History

| Date         | Version       |
|--------------|---------------|
| Nov 9th 2015 | Initial Draft |

## Introduction - Motivation - Abstract

Scala was initially designed to target the JVM, and, as such, defines exactly
9 primitive types corresponding to the 9 primitive types of the JVM (including
`void`):

* `Boolean`
* `Char`
* `Byte`
* `Short`
* `Int`
* `Long`
* `Float`
* `Double`
* `Unit`

Compared to other languages, especially those in the tradition of
compile-to-machine code, this list is missing types for unsigned integer types.

When compiling Scala to other platforms than the JVM, such as JavaScript with
Scala.js or native code/LLVM with the upcoming ScalaNative, the missing unsigned
integer types are a liability, especially when it comes to *interoperability
with host language libraries*.

For example, if a C library defines a function accepting a `uint32_t`, how would
we type it in a FFI definition? Even in JavaScript, which supposedly has only
`Double`s, there are APIs working with unsigned integers. The most well-known
one is
[the TypedArray API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
Currently, because of the lack of unsigned integers in Scala, the
[facade types for `Uint8Array` in Scala.js](https://github.com/scala-js/scala-js/blob/v0.6.5/library/src/main/scala/scala/scalajs/js/typedarray/Uint8Array.scala)
is forced to use `Short` elements instead of a more appropriate `UByte`. Worse,
[the one for `Uint32Array`](https://github.com/scala-js/scala-js/blob/v0.6.5/library/src/main/scala/scala/scalajs/js/typedarray/Uint32Array.scala)
has to work with *Doubles*, because there is no signed integer type existing on
JavaScript that can represent all values of a 32-bit unsigned int.

On the JVM, interoperability is not an issue. However, it is still sometimes
useful to manipulate unsigned integers. An evidence of this fact is that Java 8
has added methods in the JDK to *manipulate* signed integers *as if* they were
unsigned. One example is
[`java.lang.Integer.divideUnsigned`](https://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html#divideUnsigned-int-int-).
Using signed integer types but interpreting them as unsigned is an obvious lack
of type safety, however. Java cannot decently add new primitive types for
compatibility reasons, but Scala has custom-made `AnyVal`s and other
Object-Oriented abstractions on top of primitive types that can allow for
additional, zero-overhead "primitive" types.

We therefore propose to extend the Scala programming language with 4 new
primitive data types, representing unsigned integer types:

* `scala.UByte`, an unsigned 8-bit integer
* `scala.UShort`, an unsigned 16-bit integer
* `scala.UInt`, an unsigned 32-bit integer
* `scala.ULong`, an unsigned 64-bit integer

These data types will support a set of operations similar to their signed
counterparts, except that they will obviously encode the unsigned behavior.

For example:

```scala
val x = Int.MaxValue.toUInt + 1.toUInt // 2147483648
assert(x.toString == "2147483648")
val y = Int.MaxValue.toUInt + 5.toUInt // 2147483652
val z = x / y // unsigned division of 2147483652 by 2147483648
assert(z == 1.toUInt)
assert(x % y == 4.toUInt)
```

## Motivating Examples

### Examples

#### Interoperability with host language unsigned integers

The most important use case for true unsigned integers specified by the
language is interoperability with host languages with unsigned data types.

If we try to manipulate an `Uint32Array` in Scala.js as currently defined, we
end up manipulating `Double`s, which can become extremely confusing:

```scala
val array = new Uint32Array(js.Array(5, 7, 6, 98))
val x = array(3) / array(0)
println(x) // 19.6 (!)
```

This also causes type safety issues, since nothing prevents the developer from
introducing a non-integer `Double` into such an array:

```scala
array(2) = 6.4    // compiles, silent drop of precision
println(array(2)) // 6
```

If we can define `Uint32Array` as an array of `UInt` instead, our problems are
solved:

```scala
val array = new Uint32Array(js.Array(5, 7, 6, 98).map(_.toUInt))
val x = array(3) / array(0)
println(x) // 19, as expected

array(2) = 6.4 // does not compile, yeah!
```

#### Implementation of algorithms requiring unsigned operations

No matter the platform, even on the JVM, we sometimes have to implement
algorithms that are best defined in terms of unsigned operations. Particularly,
more often than not, we want to treat bytes in a buffer as unsigned.

For example, here is a (buggy) algorithm to decode text encoded in ISO-8859-1
(latin1) into Unicode code points. Can you spot the issue?

```scala
def decodeISO88591(buffer: Array[Byte]): String = {
  val result = new StringBuilder(buffer.length)
  for (i <- 0 until buffer.length)
    result.append(buffer(i).toChar)
  result.toString()
}
```

The problem is that `buffer(i).toChar` will first *sign-extend* the signed
`Byte` to an `Int`, then cut off the 16 most significant bits. If the initial
`Byte` was ">= 0x80", it was actually *negative*, and therefore the resulting
`Char` will have its 8 most significant bits set to 1, which is a bug.

Fixing the algorithm requires knowledge of 2's complement properties and how
the bits are affected by arithmetic operations. The solution is
`(buffer(i) & 0xff).toChar`, which is totally non-obvious.

With unsigned bytes, the problem does not happen by construction, and the
algorithm is straightforward:

```scala
def decodeISO88591(buffer: Array[UByte]): String = {
  val result = new StringBuilder(buffer.length)
  for (i <- 0 until buffer.length)
    result.append(buffer(i).toChar) // correct: UByte.toChar does not sign-extend
  result.toString()
}
```

### Comparison Examples

The blog post
[Unsigned int considered harmful for Java](https://www.nayuki.io/page/unsigned-int-considered-harmful-for-java)
explains in detail how to correctly manipulate signed integer types to make
them behave as unsigned.

There are two main problems with this, considering only the JVM target:

* We have to remember what operations need dedicated methods to deal with the
  unsigned case.
* We cannot express in the type of a value whether it is to be interpreted as
  a signed or unsigned integer. Effectively, we're back to *Assembly*-grade
  weak typing.

In addition, those separate manipulations do not allow back-ends to other
targets to effectively interoperate with host language unsigned data types.

### Counter-Examples

We do not intend to generalize unsigned numbers to Big integers nor to
floating-point numbers.

Also, it is out of the scope of this proposal to provide literal constant
notations for unsigned integers. They should be constructed from their
corresponding signed literals, and reinterpreted using `.toUInt` and similar.

## Drawbacks

### Performance of arrays

Unless the implementation of unsigned integer types is very much special-cased
in the compiler, arrays of unsigned integer types will likely suffer from the
same performance penalty as arrays of user-defined `AnyVal`s, because the
elements will be boxed.

This might cause unexpected performance issues, as developers will think that
`Array[UByte]` is as fast as `Array[Byte]`, when in fact it is not.
Performance-critical code should still use `Array[Byte]`, and reinterpret the
bytes into unsigned bytes and back using `sb.toUByte` and `ub.toByte`,
respectively.

## Alternatives

The only other alternative is the status quo, where no unsigned integer types
exist, and difficult 2's complement-aware manipulations must be done when we
need them.

## Design

Naively, the design of the API is straightforward. We would define 4 new
data types `UByte`, `UShort`, `UInt` and `ULong`, corresponding to the 4
signed integer data types. They feature the same set of arithmetic and logic
operations, as well as comparisons. However, such a naive design causes
several issues, especially when signed integers and unsigned integers interact
in operations.

Here, we discuss the set of operations available, and their semantics.

### No arithmetic/logic operations between signed and unsigned integers

To prevent typical caveats when mixing signed and unsigned integers in most
languages, we simply *forbid* any arithmetic or logic operations with operands
of different signedness.

### Universal equality, and hash codes

The universal equality operators (`==` and `!=`) should behave consistently
across signed and unsigned types. Since `5.toByte == 5` in Scala, we should
also have `5.toUInt == 5`. This requires to modify the `==` implementation
(in `BoxesRunTime`) to implement cooperative equality checks between all
combinations of signed and unsigned values.

Negative values of signed integers are *not* equal to any unsigned integer
value. For example, this means that `(-1).toUInt != -1`. This is very simply
explained by the fact that the mathematical value of `(-1).toUInt` is
4294967295.

Because of transitivity of equality, it must be the case that a large value of
an unsigned integer (whose signed reinterpretation is negative, such as
`0xffffffff.toUInt`) *is* equal to values of a larger signed integer types
(such as `0xffffffffL`).

Hash codes, as computed by `##`, must be made consistent with the generalized
form of universal equality.

Note that this definition of universal equality is *essential* for these new
primitives to be usable for interoperability scenarios in Scala.js. This is
because, at runtime, "boxed" versions of numeric types loose their type
information, as they are all stuffed into primitive JavaScript numbers.
Therefore, `0xffff.toUShort` is indistinguishable from `0xffff`, and they must
be equal for this "non-boxing" to be valid.

### Operations on `UByte` and `UShort`

By analogy to the fact that operations on `Byte`s and `Short` start by
converting their operands to `Int`s (using sign-extend), operations on `UByte`s
and `UShort`s convert their operands to `UInt`s (without sign-extend,
obviously).

### Arithmetic operations on `UInt`s and `ULong`s.

For two operands of the same unsigned integer type with N bits, `a + b`,
`a - b`, `a * b`, `a / b` and `a % b` are computed modulo `2^N`.
For `+`, `-` and `*`, this boils down to a primitive (signed) equivalent
operations, on the JVM. `/` and `%` correspond to
`java.lang.{Integer,Long}.divideUnsigned` and `remainderUnsigned`.

If one of the operand is a `ULong` but the other isn't, the latter is converted
to a `ULong` before performing the operation.

There is no `unary_-`, because unsigned integers have no opposite. It could be
argued that `-x` could be useful for low-level bit-twiddling-based algorithms.
However, in that case, `~x + 1.toUInt` can be used instead. A basic peephole
optimizer can simplify the latter as `-x` on platforms where this is relevant.

### Logic (bitwise) operations on `UInt`s and `ULong`s

`unary_~`, `|`, `&` and `^` behave in the obvious way. If you want a precise
spec, they always behave as if the operand was reinterpreted into its signed
equivalent, then the operation performed, then the result reinterpreted back
into unsigned.

### Bit shifting operations on `UInt`s and `ULong`s

Shift left `<<` and shift logical right `>>>` behave in the obvious way.

The case of shift arithmetic right `>>` is debatable. We argue that it should
*not* be available on unsigned integers for two reasons.

First, a shift arithmetic right does not appear to have any *meaning* on
unsigned integers. The correct *arithmetic* shift if `>>>`. Therefore,
similarly to `unary_-`, it should not be introduced.

Second, existing languages that do have unsigned integer types, such as the C
family, actually give different semantics to `>>` depending on whether it has
a signed or unsigned operand: a `>>` on an unsigned operand does *not*
sign-extend. It would be confusing to a C developer for `x >> 3` to sign-extend
in Scala, but it would be equally confusing to a Scala developer that `x >> 3`
*not* sign-extend. Therefore, we prefer to leave it out completely, and let a
compiler error be raised.

If a bit-twiddling-based algorithm needs the sign-extending shift right, it is
always possible to reinterpret as signed, do the operation, and reinterpret
back as unsigned: `(x.toInt >> 3).toUInt`.

Note: the current implementation does provide `>>`, until we agree on this
point.

### Inequality operators

`<`, `<=`, `>`, `>=` perform unsigned comparisons. On the JVM, they correspond
to `java.lang.{Integer,Long}.compareUnsigned`.

### String representation

The string representation is similar to that of signed integers, except that
all numbers are positive, obviously. On the JVM, they correspond to
`java.lang.{Integer,Long}.toUnsignedString`.

### Implicit widening conversions

Unsigned integers can be implicitly widened to "larger" unsigned integer types.
For example, `UShort` can be implicitly converted to `UInt` and `ULong`.

There are no implicit conversions between signed and unsigned integers. It might
be tempting to allow unsigned integers to be widened to larger signed integer
types, since they can always accommodate their mathematical values. However,
this consequently allows operations between signed and unsigned integers, such
as `5L + 4.toUInt`, because of the conversion from `UInt` to `Long`. Since we
want to disallow those to prevent caveats, we do not allow the implicit
conversions.

### Explicit conversions between signed and unsigned

We have already extensively used explicit conversions between signed and
unsigned integer types *of the same size* in this document, such as
`someInt.toUInt`. These are specified as reinterpreting the bit pattern into
the other type, with the common specification that integer types are represented
in 2's complement.

*Narrowing* conversions are also allowed in both directions, such as
`someInt.toUByte` or `someUInt.toByte`. They are equally well specified as
either `someInt.toUInt.toUByte` or `someInt.toByte.toUByte`, with the same
results, and therefore no ambiguity exists.

*Widening* conversions from unsigned integers to larger signed integers is
allowed, and is specified by conserving the mathematical value, i.e., the
widening does *not* sign-extend.

Finally, widening conversions from signed integers to larger unsigned integers
is *disallowed*, because both interpretations are equally valid, and therefore
half of the developers will have the wrong expectation. For example,
`someInt.toULong` can be equally validly specified as `someInt.toUInt.toULong`
or `someInt.toLong.toULong`, but those do not yield the same result (the former
does not sign-extend while the latter does).

### Consequences on other parts of the library

`scala.math` should receive new overloads of `max` and `min`, taking unsigned
integer types as parameters, and performing the comparisons with unsigned
semantics.

There should be instances of the `Ordering` typeclass for unsigned integer
types.

There should *not* be instances of the `Numeric` and `Integral` typeclasses
for unsigned integer types, since they do not support `unary_-`.

It might be tempting to define `Range`s over unsigned integers, but we do not
want to go there.

### Performance considerations

Since they will inevitably be "branded" as primitive data types, unsigned
integer types should be as efficient as signed integer types.

Fortunately, the JDK 8 added the necessary methods in the standard JDK to
trivially implement all the operations on unsigned integers. It is expected
that these methods be as fast primitive operations, since they can be
intrinsified easily.

There also exist efficient implementations of these methods in Scala.js. LLVM
supports the relevant operations by default for ScalaNative, obviously.

The implementations in `BoxesRunTime` for universal equality and hash codes
receives additional cases, which could slow down `==` on `Any`s and generic
values. However, if a codebase does not use any unsigned integer, the JVM,
using global knowledge, can statically determine that the new type tests are
always `false` and therefore remove them. There should be no performance
penalty on such codebases.

## Implementation

Because of the cooperative equality with primitive signed integers, the
addition of unsigned integers must necessarily integrate the core library.

Besides that, there are two major strategies for the implementation: mostly
user-space or mostly in compiler-space.

### Mostly user-space vs compiler-space

An existing implementation living mostly in user-space can be found at
https://github.com/scala/scala/compare/2.12.x...sjrd:uints

In this approach, unsigned integer types are user-defined `AnyVal`s, and all
the new methods are implemented in the library. The compiler needs very little
adaptations; basically only to dispatch `==` of unsigned integers to
`BoxesRunTime` (otherwise, it is "optimized" as directly calling `equals()`).

This approach has obvious advantages:
* Little room for mistakes
* Very simple implementation
* Minimal impact on the compiler

However, it also suffers from a couple of limitations, because the new
"primitive" data types are not really primitive, and do not receive some of the
semantic treatment of primitives.

First, unboxing from `null`: a primitive data type unboxes `null` to its zero,
but user-defined `AnyVal`s throw in those situations. One way to fix this would
be to "fix" the behavior on `AnyVal`s in general, which we think would be a good
idea on its own anyway.

Second, weak conformance: unsigned integers don't receive the weak conformance
properties. However, we argue that this is no big deal. The main use case for
weak conformance is so that `List(1, 5, 3.5)` can be inferred as a
`List[Double]` instead of a `List[AnyVal]`. The problem initially happens
because of the way we write literal integers and literal doubles. Since unsigned
integers have no literal notation, and are not implicitly compatible with
signed integers nor doubles, this point is moot.

In the short term, these limitations do not appear important, and we could live
with them.

More importantly, however, this implementation prevents specialization to be
applied on unsigned integers, and imposes harsh constraints on how back-ends
can implement unsigned integers.

In Scala.js these constraints are not too hard from the point of view of
interoperability scenarios, although they could limit the performance we can
get out of unsigned integers. Since interoperability is paramount, we can again
live with the constraints for the time being.

For ScalaNative, the consequences of these constraints are, as of yet, unknown,
but they could affect interoperability scenarios, and will most probably affect
performance.

In the longer term, we should therefore consider more tightly integrating
unsigned integer types as true primitives of the compiler.

Such a strategy will however be much riskier, and will take much more time to
get right.

### Performance evaluation

To evaluate performance of our prototype we've implemented a simple jmh
benchmark generator that checks composite performance of evaluation of complex
arithmetic expressions for all number types (both primitive signed ones and
user-defined unsigned ones.)

For each type we've generated 4 benchmarks that use `+, -, *` ops (fastops)
and 4 benchmarks that use `+, -, *, /, %` (allops). Each of the 4 benchmarks uses exactly
the same arithmetic expressions for all types. Benchmarks on bytes and shorts wrap back
to corresponding type after each operation.

The split between fastops and allops is important because unsigned division is
quite a bit slower than signed one on latest release of JDK 8:

    Benchmark   Type           Score        Error  Units

    division    Int    289644141.092 ±   1544.707  ops/s
    division    UInt   129838344.866 ±  95523.094  ops/s
    division    Long   129839962.558 ±  90581.655  ops/s
    division    ULong  116493219.034 ±  67688.631  ops/s

    remainder   Int    289454769.011 ±  94380.057  ops/s
    remainder   UInt   111032938.420 ± 679921.289  ops/s
    remainder   Long   128315753.345 ±  35932.509  ops/s
    remainder   ULong   97470062.788 ± 346773.054  ops/s

And here are the results of composite benchmarks.

    Benchmark  Type            Score          Error  Units

    allop0     Byte     76612958.318 ±    97814.015  ops/s
    allop0     UByte    26160709.822 ±     2098.556  ops/s
    allop0     Short    76800575.238 ±    75373.970  ops/s
    allop0     UShort   27172978.979 ±     3244.075  ops/s
    allop0     Int      82816920.142 ±    50194.565  ops/s
    allop0     UInt     27232792.726 ±     5116.920  ops/s
    allop0     Long     28648964.226 ±     6115.162  ops/s
    allop0     ULong    29657228.040 ±   159758.363  ops/s

    allop1     Byte     73715102.215 ±    17282.291  ops/s
    allop1     UByte    26490808.836 ±    86628.862  ops/s
    allop1     Short    73718029.884 ±    19413.132  ops/s
    allop1     UShort   27041330.181 ±     4533.663  ops/s
    allop1     Int      83239625.538 ±    13575.756  ops/s
    allop1     UInt     28425497.966 ±    10927.728  ops/s
    allop1     Long     29251967.961 ±     8278.100  ops/s
    allop1     ULong    30537156.474 ±    14283.996  ops/s

    allop2     Byte     53138040.117 ±     7692.219  ops/s
    allop2     UByte    19912528.484 ±   104896.763  ops/s
    allop2     Short    52989318.748 ±    10075.293  ops/s
    allop2     UShort   19828139.740 ±      217.796  ops/s
    allop2     Int      60104405.263 ±     1888.322  ops/s
    allop2     UInt     20576204.367 ±      446.445  ops/s
    allop2     Long     20752333.428 ±      789.741  ops/s
    allop2     ULong    22949083.651 ±     5766.597  ops/s

    allop3     Byte     68147811.661 ±     7349.838  ops/s
    allop3     UByte    28016596.929 ±     4795.992  ops/s
    allop3     Short    68147020.665 ±     8444.864  ops/s
    allop3     UShort   29092855.210 ±    12323.477  ops/s
    allop3     Int      93592095.470 ±     2970.030  ops/s
    allop3     UInt     33298135.046 ±    15681.174  ops/s
    allop3     Long     32276341.887 ±     3748.706  ops/s
    allop3     ULong    53345993.564 ±     5486.483  ops/s

    fastop0    Byte    174384841.686 ±    13685.151  ops/s
    fastop0    UByte   172490336.775 ±    42178.142  ops/s
    fastop0    Short   174388762.469 ±    10303.837  ops/s
    fastop0    UShort  172545184.374 ±    37150.012  ops/s
    fastop0    Int     335919041.150 ±   121423.806  ops/s
    fastop0    UInt    335925277.378 ±   120408.170  ops/s
    fastop0    Long    339125057.494 ±    71538.513  ops/s
    fastop0    ULong   339306595.964 ±    70387.619  ops/s

    fastop1    Byte    174736448.461 ±     9934.579  ops/s
    fastop1    UByte   173817403.787 ±    20752.221  ops/s
    fastop1    Short   174734415.599 ±     9850.473  ops/s
    fastop1    UShort  173460828.250 ±    18068.154  ops/s
    fastop1    Int     285178506.838 ±   129027.835  ops/s
    fastop1    UInt    285137070.275 ±   145958.174  ops/s
    fastop1    Long    285590926.722 ±   147048.419  ops/s
    fastop1    ULong   274695574.679 ±  4878290.228  ops/s

    fastop2    Byte    168971931.233 ±    40481.486  ops/s
    fastop2    UByte   169665745.096 ±    27401.842  ops/s
    fastop2    Short   168979347.127 ±    11033.548  ops/s
    fastop2    UShort  169675543.605 ±    19494.266  ops/s
    fastop2    Int     287563728.176 ±   122987.272  ops/s
    fastop2    UInt    287559086.868 ±   126833.074  ops/s
    fastop2    Long    296129286.397 ±   171488.897  ops/s
    fastop2    ULong   296142819.979 ±   167330.949  ops/s

    fastop3    Byte    333536457.973 ±    63928.967  ops/s
    fastop3    UByte   339343014.623 ±   119819.041  ops/s
    fastop3    Short   333535961.005 ±    69587.789  ops/s
    fastop3    UShort  339354474.225 ±   121131.393  ops/s
    fastop3    Int     475167307.642 ±   140060.266  ops/s
    fastop3    UInt    475181473.416 ±   116982.494  ops/s
    fastop3    Long    487109297.325 ±   580807.835  ops/s
    fastop3    ULong   487190439.786 ±   737565.041  ops/s

As you can see, fastops results have statistically insignificant differences
between signed and unsigned numbers. The same is true for allops for `Long` vs
`ULong`.

Allops are 2-3x slower for `Byte`s, `Short`s and `Int`s, due to the fact that
unsigned division isn't as well optimised. We can probably make divisions for
`UByte` and `UShort` faster by using the regular division at the `Int` level,
but the current implementation does not do that yet.

### Time frame

We propose that unsigned integers be integrated in their user-space form as
early as possible, ideally in Scala 2.12, should this proposal be accepted in
time. An implementation is already available for Scalac, and it comes with an
exhaustive unit test suite.

In the longer term, for 2.13 or 2.14, we propose to evaluate whether the
benefits of a compiler-space implementation outweigh the risks. The existing
test suite will make sure that the behavior of operations is unchanged. This
second phase should probably be studied jointly with the developments of
ScalaNative.

## Previous discussions and implementations

When
[Value Classes (SIP-15)](https://docs.scala-lang.org/sips/value-classes.html)
were first introduced, the possibility to have new numeric types such as
unsigned integers was mentioned as a motivation. Subsequently, several people
[came up with implementations](https://groups.google.com/forum/#!topic/scala-sips/xtmUjsY9gTY)
of unsigned Ints and Longs. Those implementations were however more hacky
proofs of concept than a really thought-out proposal.

Our proposal improves on those early attempts in several aspects:

* Comprehensive but curated set of operations that are available on unsigned
  integers, in particular no mixing signed and unsigned integers (avoid common
  pitfalls found in other languages)
* Precise semantics for all operations (a specification)
* A meaningful notion of equality, which works well with other primitive types
* Use JDK 8 methods to implement operations that are specific to unsigned
  integers, such as division
* Complete implementation with a test and benchmark suites

## Out of scope

The following related aspects are out of the scope of this proposal:

### Literal notation for unsigned integers

This proposal does not introduce any literal notation for unsigned integers.
Instead, we always convert from signed literals, e.g., `5.toUInt`.

Providing literal notation should be done in the context of a SIP for
generalized user-defined literals.

### Efficient arrays of unsigned integers

We do not plan to address the issue of efficient arrays of unsigned integers.
Solving this should be part of a broader context for efficient arrays of
user-defined value classes in general, such as the encoding used in Dotty.

## Unresolved questions

* Should `>>` be available on unsigned integers?
* Should `null` unbox to 0 for unsigned integers even in their user-space
  implementation? This would require some more changes to the compiler.

## References

1. [Implementation mostly in user-space for scalac/JVM](https://github.com/scala/scala/compare/2.12.x...sjrd:uints)
