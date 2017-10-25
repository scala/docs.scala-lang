---
layout: sip
discourse: true
title: SIP-NN - Adding prefix types

vote-status: pending
permalink: /sips/:title.html
---

**By: Oron Port**

## History

| Date          | Version                                  |
| ------------- | ---------------------------------------- |
| Oct 25th 2017 | Split prefix types from [SIP33](http://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html), and emphasize motivation |


Your feedback is welcome! If you're interested in discussing this proposal, head over to [this](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471) Scala Contributors thread and let me know what you think.

---

## Introduction
Currently scala supports unary prefix operators (`-`, `+`, `~`, `!`) for expressions (e.g., `def unary_-`) and does not support prefix types.  See the Scala specification [Prefix Operations](http://scala-lang.org/files/archive/spec/2.12/06-expressions.html#prefix-operations) section.

**Prefix expression vs. prefix type example**:

```scala
object PrefixExpression {
  case class Nummy(expand : String) {
    def unary_- : Nummy = Nummy(s"-$this")
    def unary_~ : Nummy = Nummy(s"~$this")
    def unary_! : Nummy = Nummy(s"!$this")
    def unary_+ : Nummy = Nummy(s"+$this")
  }
  object N extends Nummy("N")
  val n1 = -N
  val n2 = ~N
  val n3 = !N
  val n4 = +N
}
object NonExistingPrefixTypes {
  trait unary_-[A]
  trait unary_~[A]
  trait unary_![A]
  trait unary_+[A]
  trait N
  type N1 = -N //Not working
  type N2 = ~N //Not working
  type N3 = !N //Not working
  type N4 = +N //Not working
}
```

---

## Proposal
Add support for prefix types, which is equivalent to the prefix operations for expressions.

```
PrefixType ::= [`-' | `+' | `~' | `!'] SimpleType
CompoundType ::= PrefixType
              |  AnnotType {with AnnotType} [Refinement]
              |  Refinement
```

---

## Motivation
Developers expect terms and types to be expressed the same for mathematical and logical operations.

### Motivating examples

The [singleton-ops library](https://github.com/fthomas/singleton-ops) with [Typelevel Scala](https://github.com/typelevel/scala) (which implemented [SIP-23](http://docs.scala-lang.org/sips/pending/42.type.html)) enable developers to express literal type operations more intuitively. For example:

```scala
import singleton.ops._

object PrefixExample {
  /*
  We would much rather write the following to acheive more clarity and shorter code:
  type Foo[Cond1, Cond2, Num] = ITE[Cond1 && !Cond2, -Num, Num]	
  */
  type Foo[Cond1, Cond2, Num] = ITE[Cond1 && ![Cond2], Negate[Num], Num]  
  def foo[Cond1, Cond2, Num](implicit f : Foo[Cond1, Cond2, Num]) : f.Out = f.value
  def foo(cond1 : Boolean, cond2 : Boolean, num : Int) : Int = 
    if (cond1 && !cond2) -num else num
}

import PrefixExample._

foo[true, false, 3] //returns -3
foo(true, false, 3) //returns -3
```

Note: `type ![A]` is possible to define, but `type -[A]` is not due to collision with infix type parsing.

---

## Implementation

A PR for this SIP is available at: [https://github.com/scala/scala/pull/6148](https://github.com/scala/scala/pull/6148)

------

### Interactions with other language features

#### Variance Annotation
Variance annotation uses the `-` and `+` symbols to annotate contravariant and covariant subtyping, respectively. Introducing unary prefix types may lead to some developer confusion. However, such interaction is very unlikely to occur. E.g.:

```scala
trait Negate[A]
trait Positive[A]
type unary_-[A] = Negate[A]
type unary_+[A] = Positive[A]
trait Contravariant[B, -A <: +B] //contravariant A subtype upper-bounded by Positive[B]
trait Covariant[B, +A <: -B] //covariant A subtype upper-bounded by Negative[B]
```

#### Negative Literal Types
Negative literal types are annotated using the `-` symbol. This can lead to the following confusion:

```scala
trait Negate[A]
type unary_-[A] = Negate[A]
trait MyTrait[B]

type MinusFortyTwo = MyTrait[-42]
type NegateFortyTwo = MyTrait[Negate[42]]
```

The above example demonstrates a case of two types `MinusFortyTwo` and `NegateFortyTwo` which are different. They may be equivalent in view (implicit conversion between the two type instances), but they are not equal.

Note: It is not possible to annotate a positive literal type in Scala (checked both in TLS and Dotty):

```scala
val a : 42 = +42 //works
val b : -42 = -42 //works
val c : +42 = 42 //error: ';' expected but integer literal found
```

This means that if unary prefix types are added, then `+42` will be a type expansion of `unary_+[42]`.

**Related Issues**
* [Dotty Issue #2783](https://github.com/lampepfl/dotty/issues/2783)
* [Typelevel Scala Issue #157](https://github.com/typelevel/scala/issues/157)

Both SIP23 implementation and Dotty's implementation of literal types currently fail compilation when infix types interact with a negative literal type.
```scala
type ~~[A, B]
type good = 2 ~~ 2
type bad = 2 ~~ -2 //Error:(9, 20) ';' expected but integer literal found.
type work_around = 2 ~~ (-2) //works for Typelevel scala, but fails in Dotty
```
It is not yet clear if this is an implementation issue, or if the spec should be changed to allow this as well.
If this is a spec change, then the committee should approve it also. 

----

### Bibliography
[Scala Contributors](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471)

[scala-sips](https://groups.google.com/forum/#!topic/scala-sips/ARVf1RLDw9U)
