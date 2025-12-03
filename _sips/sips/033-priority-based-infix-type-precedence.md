---
layout: sip
number: 33
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
  - /sips/pending/priority-based-infix-type-precedence.html
stage: completed
status: shipped
title: Priority-based infix type precedence
---

**By: Oron Port**

## History

| Date          | Version                                  |
| ------------- | ---------------------------------------- |
| Feb 7th 2017  | Initial Draft                            |
| Feb 9th 2017  | Updates from feedback                    |
| Feb 10th 2017 | Updates from feedback                    |
| Aug 8th 2017  | Numbered SIP, improve view, fixed example, and added related issues |
| Oct 20th 2017 | Added implementation link                |
| Oct 25th 2017 | Moved prefix types to [another SIP](https://github.com/scala/improvement-proposals/pull/35), changed title and PR |
| Nov 29th 2017 | Updated SIP according to feedback in the PR |


Your feedback is welcome! If you're interested in discussing this proposal, head over to [this](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471) Scala Contributors thread and let me know what you think.

---

## Introduction
Currently scala allows symbol operators (`-`, `*`, `~~>`, etc.) for both type names and definition names.
Unfortunately, there is a 'surprise' element since the two differ in behavior. While infix types are 'mostly' left-associative, the expression operation precedence is determined by the operator's first character (e.g., `/` is precedent to `+`). Please see [Infix Types](https://scala-lang.org/files/archive/spec/2.12/03-types.html#infix-types) and [Infix Operations](https://scala-lang.org/files/archive/spec/2.12/06-expressions.html#infix-operations) sections of the Scala specifications for more details.

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

---

## Motivation
It is easier to reason about the language when mathematical and logical operations for both terms and types are expressed the same.

### Motivating examples

#### Dotty infix type similarity
Dotty infix type associativity and precedence seem to act the same as expressions.
No documentation available to prove this, but the infix example above works perfectly in dotty.

Dotty has no prefix types, same as Scalac.

#### Singleton-ops library example
The [singleton-ops library](https://github.com/fthomas/singleton-ops) with [Typelevel Scala](https://github.com/typelevel/scala) (which implemented [SIP-23](https://docs.scala-lang.org/sips/pending/42.type.html)) enable developers to express literal type operations more intuitively. For example:

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
[This](https://stackoverflow.com/questions/23333882/scala-infix-type-aliasing-for-2-type-parameters) Stack Overflow question demonstrate developers are 'surprised' by the difference in infix precedence, expecting infix type precedence to act the same as expression operations.

---

## Proposal

Make infix types conform to the same precedence and associativity traits as term operations.

------

## Implementation

A PR for this SIP is available at: [https://github.com/scala/scala/pull/6147](https://github.com/scala/scala/pull/6147)

------

### Interactions with other language features

#### Star `*` infix type interaction with repeated parameters
The [repeated argument symbol `*`](https://www.scala-lang.org/files/archive/spec/2.12/04-basic-declarations-and-definitions.html#repeated-parameters) may create confusion with the infix type `*`.
Please note that this feature interaction already exists within the current specification.

```scala
trait +[N1, N2]
trait *[N1, N2]
trait N1
trait N2
def foo(a : N1*N1+N2*) : Unit = {} //repeated parameter of type +[*[N1, N1], N2]
```

However, it is very unlikely that such interaction would occur.

**Related Issues**

* [Dotty Issue #1961](https://github.com/lampepfl/dotty/issues/1961)


## Backward Compatibility
Changing infix type associativity and precedence affects code that uses type operations and conforms to the current specification.

Note: changing the infix precedence didn't fail any scalac test.

---

### Bibliography
[Scala Contributors](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471)

[scala-sips](https://groups.google.com/forum/#!topic/scala-sips/ARVf1RLDw9U)
