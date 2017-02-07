---
layout: sip
disqus: true
title: SIP-NN - Make types behave like expressions 
---

**By: Oron Port**

## History

| Date          | Version          |
|---------------|------------------|
| Feb 7th 2017  | Initial Draft    |

---
## Introduction
Currently scala allows symbol operators (`-`, `*`, `~~>`, etc.) for both type names and definition names.
Unfortunately, there is a 'surprise' element since the two differ in behaviour:

* **Infix operator precedence and associativity**: 
Infix types are 'mostly' left-associative, 
while the expression operations are more intuitive with different precedence weights.
Please see [Infix Types](http://scala-lang.org/files/archive/spec/2.12/03-types.html#infix-types) and [Infix Operations](http://scala-lang.org/files/archive/spec/2.12/06-expressions.html#infix-operations) sections of the Scala specifications for more details. 

**Example**:
```scala
object InfixExpressionPrecedence {
    case class Nummy(expand : String) {
      def + (that : Nummy) : Nummy = Nummy(s"Plus[$this,$that]")
      def * (that : Nummy) : Nummy = Nummy(s"Prod[$this,$that]")
      override def toString : String = expand
    }
    object N1 extends Nummy("N1")
    object N2 extends Nummy("N2")
    object N3 extends Nummy("N3")
    object N4 extends Nummy("N4")
    val result_expected = N1 + N2 * N3 + N4
    //result_expected.expand is Plus[Plus[N1,Prod[N2,N3]],N4]
}
object InfixTypePrecedence {
    trait Plus[N1, N2]
    trait Prod[N1, N2]
    type +[N1, N2] = Plus[N1, N2]
    type *[N1, N2] = Prod[N1, N2]
    trait N1 
    trait N2
    trait N3 
    trait N4 
    type Result_Surprise = N1 + N2 * N3 + N4
    //Result_Surprise expands to Plus[Prod[Plus[N1,N2],N3],N4]
    type Result_Expected = N1 + (N2 * N3) + N4
    //Result_Expected expands to Plus[Plus[N1,Prod[N2,N3]],N4]
}
```

* **Prefix operators bracketless unary use**: While expressions have prefix unary operators, there are none for types. See the [Prefix Operations](http://scala-lang.org/files/archive/spec/2.12/06-expressions.html#prefix-operations) section of the Scala specification. 
This is a lacking feature of the type language Scala offers. See also interactions of this feature with other Scala features, further down this text. 
(Author's note: Not crucial as infix precedence, but good for completeness) 

**Example**:
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
(Author's note: I can copy-paste the specification and modify it, if it so required)
### Proposal, Part 2: Prefix unary types
Add prefix types, exactly as specified for prefix expression. 
(Author's note: I can copy-paste the specification and modify it, if it so required)

---

## Motivating examples

#### Singleton-ops library
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

#### Developer issues
The following stackoverflow question demonstrate developers are 'surprised' by the difference in infix precedence.
http://stackoverflow.com/questions/23333882/scala-infix-type-aliasing-for-2-type-parameters



---

## Interactions with other language features

#### Variance Annotation
Variance annotation uses the `-` and `+` symbols to annotate contravariant and covariant subtyping, respectively. Introducing unary prefix types might lead to some confusion, more precisely with the `-` symbol.
E.g.
```scala
trait Negate[A]
type unary_-[A] = Negate[A] 
trait MyTrait[B, -A <: -B] //contravariant A subtype upper-bounded by Negate[B]
```
(Author's note: it seem very unlikely that such feature interaction will occur)  

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

#### Scala meta
Open question how this SIP affects `scala-meta`.

---

## Backward Compatibility
Changing infix type associativity and precedence affects code that uses type operations and conforms to the current specification.
(Author's note: I don't know if providing a flag to select the precedence is good or not. IMHO, it is better to create a tool that adds brackets to convert code to the old associativity.)    

---

### Extended proposal alternative
It is possible to extend this proposal and allow the developer to annotate the expected associativity and precedence per operation. 
(Author's note: I personally don't like this, but if such a solution is better for the community, then I will gladly modify this SIP to reflect that.)
See the following [Typelevel Scala issue](https://github.com/typelevel/scala/issues/69) for the suggestion.

### Other languages
Would love some help to complete what happens in different programming languages.

### Discussions
[Scala Contributors](https://contributors.scala-lang.org/t/sip-nn-make-infix-type-alias-precedence-like-expression-operator-precedence/471)

[scala-sips](https://groups.google.com/forum/#!topic/scala-sips/ARVf1RLDw9U)
