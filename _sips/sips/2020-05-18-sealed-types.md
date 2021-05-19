---
layout: sip
title: Sealed Types
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/sealed-types.html
---

**By: Dale Wijnand and Fengyun Liu**

## History

| Date          | Version   |
|---------------|-----------|
| May 18th 2021 | Submitted |

## Introduction

Exhaustivity checking is one of the safety belts for using pattern matching in functional
programming.  However, if one wants to partition values of an existing type to reason about them in
separate cases of a match or as separate types this requires wrapping the values in new classes,
which incurs a boxing cost.

As an alternative, one may define custom extractors and use them as the case patterns. However, there is no
way in Scala to declare that these extractors are complementary, i.e. the match is exhaustive when
the complete set of extractors are used together.

Similarly, one can define `TypeTest`s for matching abstract types, but there is no way to determine
if a match on an abstract type exhausts all its subtypes.

This SIP solves these three problems by introducing *sealed types*.

## Motivating Examples

We've identified several real world use cases that calls for enhancing exhaustivity checking, and
used them to stress the design proposed here.  You can find them [here][problems], but we'll present
an example below.

Using the opaque types and custom extractors we can work safely with positive integers and negative
integers:

```scala
opaque type Pos <: Int = Int
opaque type Neg <: Int = Int

object Pos { def unapply(x: Int): Option[Pos] = if (x > 0) Some(x) else None }
object Neg { def unapply(x: Int): Option[Neg] = if (x < 0) Some(x) else None }

(n: Int) match
  case 0      =>
  case Pos(x) =>
  case Neg(x) =>
```

With the above, when we get a `Pos` value, it's guaranteed to be a positive number. The same goes
for `Neg`. Sadly the match is reported as not exhaustive because the two extractors and the value
`0` aren't known to be complementary.

## Design

We identify two root causes:

1. You can't define a type, that isn't a class, as `sealed`
2. You can't define a mapping from values to types

The *sealed type*, proposed by this SIP, allow partitioning of value of a given type into a sealed
type hierarchy.  [Here][solutions] you can find how sealed types address the issues faced by all the
motivating examples, but we'll present here how it fixes the number example above.

In order to partition int into positive, zero, and negative numbers we'll define a new `sealed` type
`Num` and how to distinguish its subtypes with match syntax:

```scala
sealed type Num = Int {
  case 0          => val Zero
  case n if n > 0 => type Pos
  case _          => type Neg
}
```

This sealed type definition desugars into the following type and value definitions:

```scala
type Num = Int
val Zero: Num = 0
opaque type Pos <: Num = Num
opaque type Neg <: Num = Num
```

The match desugars into an ordinal method, that reuses the logic to associate an ordinal for each
case:

```scala
extension (n: Num):
  def ordinal: Int = (n: Int) match {
    case 0          => 0
    case n if n > 0 => 1
    case _          => 2
  }
```

Finally a series of `TypeTest`s are defined, allowing for values of both the underlying type `Int`
and the sealed type `Num` to be tested against the subtypes and singleton subtypes `Pos`,
`Zero.type`, and `Neg`, using the `ordinal` method:

```scala
given TypeTest[Int, Zero.type] = (n: Int) => if ((n: Num).ordinal == 0) Some(n) else None
given TypeTest[Int, Pos]       = (n: Int) => if ((n: Num).ordinal == 1) Some(n) else None
given TypeTest[Int, Neg]       = (n: Int) => if ((n: Num).ordinal == 2) Some(n) else None
given TypeTest[Int, Num]       = (n: Int) => Some(n)
given [T <: Num](using t: TypeTest[Int, T]): TypeTest[Num, T] = (n: Num) => t.unapply(n)
```

Given the above, one can either change the usage from extractors to types:

```scala
(n: Int) match
  case 0      =>
  case x: Pos =>
  case x: Neg =>
```

Or we can keep the usage the same by redefining the extractors (using a value class name-based
extractors `PosExtractor` and `NegExtractor` to avoid allocating):

```scala
object Pos { def unapply(x: Pos): PosExtractor = new PosExtractor(x) }
object Neg { def unapply(x: Neg): NegExtractor = new NegExtractor(x) }

class PosExtractor(private val x: Pos) extends AnyVal { def isEmpty: false = false ; def get = x }
class NegExtractor(private val x: Neg) extends AnyVal { def isEmpty: false = false ; def get = x }

(n: Int) match
  case 0      =>
  case Pos(x) =>
  case Neg(x) =>
```

## Syntax

The existing syntax is enhanced as follows:

```
TypeDcl ::= `sealed` [`opaque`] `type` id [TypeParamClause]
TypeDef ::= `sealed` [`opaque`] `type` id [TypeParamClause] [`>:` Type] [`<:` Type] `=` Type `{`
    `case` Pattern [Guard] `=>` (`type` id [TypeParamClause] | `val` id [`:` Type])
  `}`
```

Specifically:

* the `sealed` modifier becomes available for type definitions and declarations
* on the right-hand side of definitions is the underlying type of the sealed type
* following the underlying type is a match that operates on a value of the
  underlying type and defines the type or singleton type associated to that case.
* the type is defined using the `type` keyword and singleton types are defined using `val`

## Desugaring

Using the example

```
sealed [opaque] type T[X..] [bounds] = U {
  case p1 => type C[X..]
  case p2 => val S
}
```

That desugars into:
* a type alias `type T[X..] [bounds] = U`, `opaque` if the sealed type is `opaque` (see Restrictions)
* opaque type definitions, `opaque type C[X..] <: T[Y..] = T[Y..]`, for each non-singleton type case
  - any type argument `Y` that isn't defined from `X..` will be:
    + its lower bound, if the type parameter is covariant
    + its upper bound, if the type parameter is contravariant
    + a wildcard type, with the type parameter's bounds, if the type parameter is invariant
* val definitions, `val S: T[Y..] = p`, for singleton type cases, using the same type argument rules
* an ordinal method, `extension (t: T): def ordinal: Int = (t: U) match { case p1 => 0 p2 => 1 .. }`
  - each of the sealed type's cases is associated with a unique ordinal
  - ordinals starts from 0 and increase for each case, in the order of their definition
  - the ordinal method adds a `case _ => -1` default case, if the sealed type's match is inexhaustive
  - such an ordinal method may only be defined by the compiler, to preserve exhaustivity guarantees
* a series a `TypeTest`s, defined in terms of the ordinal method
  - a `TypeTest` between `U` and each case `A`, having ordinal `ordA`:
    + `given TypeTest[U, C]      = (u: U) => if ((u: T).ordinal == $ordA) Some(u) else None`
    + `given TypeTest[U, S.type] = (u: U) => if ((u: T).ordinal == $ordA) Some(u) else None`
  - a type test between the underlying type and the sealed type:
    + `given TypeTest[U, T] = (u: U) => if ((u: T).ordinal == -1) None else Some(u)`
  - a generic type test between `T` and each case `A`, defined in terms of the above type tests:
    + `given [A <: T](using t: TypeTest[U, A]): TypeTest[T, A] = (x: T) => t.unapply(x)`

## Restrictions

1. If the match on the value of the underlying type is not exhaustive, then the sealed type must be
   declared `opaque`, in order to preserve the fact that the sealed type represents only a subset of
   the values of the underlying type (e.g. positive integers)
2. No other type may be declared to subtype the opaque type `T`
3. For singleton types, the pattern `p` must be a stable value, e.g. a `val`, a `case object`, or a literal
4. Each case must define a new type or singleton type

## Alternative Design

An alternative design is to introduce an annotation `@complete` to specify that
a type can be partitioned into a list of subtypes.

For example, given the following definition:

```scala
  opaque type Nat <: Int = Int
  opaque type Neg <: Int = Int

  @complete[(Nat, Neg)] // Num decomposes to `Nat` and `Neg`
  type Num = Int

  given TypeTest[Int, Neg] = (n: Int) => if (x < 0) Some(n) else None
  given TypeTest[Int, Nat] = (n: Int) => if (x >= 0) Some(n) else None
```

The user now can write code as follows:

``` Scala
  def foo(n: Num) =
    n match
    case x: Neg =>
    case x: Nat =>
```

Knowing that the type `Num` can be decomposed to `Neg` and `Nat`, the compiler
can verify that the pattern match above is exhaustive.

This approach, however, is relatively low-level and the compiler does not
provide any guarantee that the annotation is actually correct.

You can find more examples [here][complete-gist]

## Related Work

Haskell has a `COMPLETE` pragma which allows patterns and type constructors to be
defined to be a complete set, relying on the programmer getting it right.

```haskell
data Choice a = Choice Bool a

pattern LeftChoice :: a -> Choice a
pattern LeftChoice a = Choice False a

pattern RightChoice :: a -> Choice a
pattern RightChoice a = Choice True a

{-# COMPLETE LeftChoice, RightChoice #-}

foo :: Choice Int -> Int
foo (LeftChoice n) = n * 2
foo (RightChoice n) = n - 2
```

## References

1. [Opaque types][1]
2. [Forum discussion about Opt[T]][2]
3. [Github discussion about enhancing exhaustivity check][3]
4. [_Lightweight static capabilities_][4], Oleg Kiselyov, Chung-chieh Shan, 2007
5. [TypeTest documentation][5]

[1]: https://docs.scala-lang.org/sips/opaque-types.html
[2]: https://contributors.scala-lang.org/t/trouble-with-2-13-4-exhaustivity-checking-being-too-strict/4817
[3]: https://github.com/lampepfl/dotty/issues/10961
[4]: http://okmij.org/ftp/Computation/lightweight-guarantees/lightweight-static-capabilities.pdf
[5]: http://dotty.epfl.ch/docs/reference/other-new-features/type-test.html
[6]: https://github.com/lampepfl/dotty/pull/11186
[problems]:  https://gist.github.com/dwijnand/d33436cf197daa15216b3cd35d03ba1c#file-sealedtypeproblems-scala
[solutions]: https://gist.github.com/dwijnand/d33436cf197daa15216b3cd35d03ba1c#file-sealedtypesolutions-scala
[complete-gist]: https://gist.github.com/dwijnand/d33436cf197daa15216b3cd35d03ba1c#file-z-complete-scala

* https://github.com/lampepfl/dotty/issues/10961 False “match may not be exhaustive warning”
* https://github.com/lampepfl/dotty/pull/11186 Implement @covers annotation for partial irrefutable specification
* https://downloads.haskell.org/~ghc/9.0.1/docs/html/users_guide/exts/pragmas.html#complete-pragma
* https://downloads.haskell.org/~ghc/9.0.1/docs/html/users_guide/exts/pattern_synonyms.html
* https://dotty.epfl.ch/docs/reference/other-new-features/opaques.html
