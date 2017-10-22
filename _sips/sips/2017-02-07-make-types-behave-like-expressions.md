---
layout: sip
discourse: true
title: SIP-33 - Match infix & prefix types to meet expression rules

vote-status: pending
permalink: /sips/:title.html
---

**By: Oron Port**

## History

| Date          | Version                                                                |
|---------------|------------------------------------------------------------------------|
| Feb 7th 2017  | Initial Draft                                                          |
| Feb 9th 2017  | Updates from feedback                                                  |
| Feb 10th 2017 | Updates from feedback                                                  |
| Aug 8th 2017  | Numbered SIP, improve view, fixed example, and added related issues    |
| Oct 20th 2017 | Added implementation link                                              |


Your feedback is welcome! If you're interested in discussing this proposal, head over to [this](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471) Scala Contributors thread and let me know what you think.

---

## Introduction
Currently scala allows symbol operators (`-`, `*`, `~~>`, etc.) for both type names and definition names.
Unfortunately, there is a 'surprise' element since the two differ in behaviour:

### Infix operator precedence and associativity
Infix types are 'mostly' left-associative,
while the expression operation precedence is determined by the operator's first character (e.g., `/` is precedent to `+`).
Please see [Infix Types](http://scala-lang.org/files/archive/spec/2.12/03-types.html#infix-types) and [Infix Operations](http://scala-lang.org/files/archive/spec/2.12/06-expressions.html#infix-operations) sections of the Scala specifications for more details.

**Infix expression precedence vs. infix type precedence example**:

```scala
object InfixExpressionPrecedence {
  case class Nummy(expand : String) {
    def + (that : Nummy) : Nummy = Nummy(s"Plus[$this,$that]")
    def / (that : Nummy) : Nummy = Nummy(s"Div[$this,$that]")
  }
  object N1 extends Nummy("N1")
  object N2 extends Nummy("N2")
  object N3 extends Nummy("N3")
  object N4 extends Nummy("N4")
  //Both expand to Plus[Plus[N1,Div[N2,N3]],N4]
  assert((N1 + N2 / N3 + N4).expand == (N1 + (N2 / N3) + N4).expand)
}
object InfixTypePrecedence {
  trait Plus[N1, N2]
  trait Div[N1, N2]
  type +[N1, N2] = Plus[N1, N2]
  type /[N1, N2] = Div[N1, N2]
  trait N1
  trait N2
  trait N3
  trait N4
  //Error!
  //Left  expands to Plus[Div[Plus[N1,N2],N3],N4] (Surprising)
  //Right expands to Plus[Plus[N1,Div[N2,N3]],N4]
  implicitly[(N1 + N2 / N3 + N4) =:= (N1 + (N2 / N3) + N4)]
}
```

### Prefix operators bracketless unary use
While expressions have prefix unary operators, there are none for types. See the [Prefix Operations](http://scala-lang.org/files/archive/spec/2.12/06-expressions.html#prefix-operations) section of the Scala specification.
This is a lacking feature of the type language Scala offers. See also interactions of this feature with other Scala features, further down this text.


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
The proposal is split into two; type infix precedence, and prefix unary types. Note to the SIP committee: It might be better to vote on the two parts separately.   

### Proposal, Part 1: Infix type precedence & associativity
Make infix types conform to the same precedence and associativity traits as expression operations.

### Proposal, Part 2: Prefix unary types
Add prefix types, exactly as specified for prefix expression.


---

## Motivation
The general motivation is developers expect terms and types to behave equally regarding operation precedence and availability of unary types.

### Motivating examples

#### Dotty infix type similarity
Dotty infix type associativity and precedence seem to act the same as expressions.
No documentation available to prove this, but the infix example above works perfectly in dotty.

Dotty has no prefix types, same as Scalac.

#### Singleton-ops library example
The [singleton-ops library](https://github.com/fthomas/singleton-ops) with [Typelevel Scala](https://github.com/typelevel/scala) (which implemented [SIP-23](http://docs.scala-lang.org/sips/pending/42.type.html)) enables developers to express literal type operations more intuitively.
For example:

```scala
import singleton.ops._

val four1 : 4 = implicitly[2 + 2]
val four2 : 2 + 2 = 4
val four3 : 1 + 3 = implicitly[2 + 2]

class MyVec[L] {
  def doubleSize = new MyVec[2 * L]
  def nSize[N] = new MyVec[N * L]
}
object MyVec {
  implicit def apply[L](implicit check : Require[L > 0]) : MyVec[L] = new MyVec[L]()
}
val myVec : MyVec[10] = MyVec[4 + 1].doubleSize
val myBadVec = MyVec[-1] //fails compilation, as required
```

We currently loose some of the intuitive appeal due to the precedence issue:

```scala
val works : 1 + (2 * 3) + 4 = 11
val fails : 1 + 2 * 3 + 4 = 11 //left associative:(((1+2)*3)+4))) = 13
```

#### Developer issues example
[This](http://stackoverflow.com/questions/23333882/scala-infix-type-aliasing-for-2-type-parameters) stackoverflow question demonstrate developers are 'surprised' by the difference in infix precedence, expecting infix type precedence to act the same as expression operations.

---

## Interactions with other language features

#### Variance Annotation
Variance annotation uses the `-` and `+` symbols to annotate contravariant and covariant subtyping, respectively. Introducing unary prefix types may lead to some developer confusion.
E.g.

```scala
trait Negate[A]
trait Positive[A]
type unary_-[A] = Negate[A]
type unary_+[A] = Positive[A]
trait Contravariant[B, -A <: -B] //contravariant A subtype upper-bounded by Negate[B]
trait Covariant[B, +A <: +B] //covariant A subtype upper-bounded by Positive[B]
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
  
#### Star `*` infix type interaction with repeated parameters  
The [repeated argument symbol `*`](https://www.scala-lang.org/files/archive/spec/2.12/04-basic-declarations-and-definitions.html#repeated-parameters) may create confusion with the infix type `*`. 
Please note that this feature interaction already exists within the current specification.  

```scala
trait *[N1, N2]
trait N1
trait N2
def foo(a : N1*N2*) : Unit = {} //repeated parameter of type *[N1, N2]
```

**Related Issues**
* [Dotty Issue #1961](https://github.com/lampepfl/dotty/issues/1961)


## Backward Compatibility
Changing infix type associativity and precedence affects code that uses type operations and conforms to the current specification.

## Implementation
Pull request is available at https://github.com/scala/scala/pull/6142

---

### Bibliography
[Scala Contributors](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471)

[scala-sips](https://groups.google.com/forum/#!topic/scala-sips/ARVf1RLDw9U)
