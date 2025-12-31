---
layout: sip
number: 59
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
presip-thread: https://contributors.scala-lang.org/t/pre-sip-multiple-assignments/6425
stage: implementation
status: under-review
title: Multiple Assignments
---

**By: Dimi Racordon**

## History

| Date          | Version            |
|---------------|--------------------|
| Jan 17th 2024 | Initial Draft      |

## Summary

This proposal discusses the syntax and semantics of a construct to assign multiple variables with a single expression.
This feature would simplify the implementation of operations expressed in terms of relationships between multiple variables, such as [`std::swap`](https://en.cppreference.com/w/cpp/algorithm/swap) in C++.

## Motivation

It happens that one has to assign multiple variables "at once" in an algorithm.
For example, let's consider the Fibonacci sequence:

```scala
class FibonacciIterator() extends Iterator[Int]:

  private var a: Int = 0
  private var b: Int = 1

  def hasNext = true
  def next() =
    val r = a
    val n = a + b
    a = b
    b = n
    r
```

The same iterator could be rewritten more concisely if we could assign multiple variables at once.
For example, we can write the following in Swift:

```swift
struct FibonacciIterator: IteratorProtocol {

  private var a: Int = 0
  private var b: Int = 1
  init() {}

  mutating func next() -> Int? {
    defer { (a, b) = (b, a + b) }
    return a
  }

}
```

Though the differences may seem frivolous at first glance, they are in fact important.
If we look at a formal definition of the Fibonacci sequence (e.g., on [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_sequence)), we might see something like:

> The Fibonacci sequence is given by *F(n) = F(n-1) + F(n+1)* where *F(0) = 0* and *F(1) = 1*.

Although this declarative description says nothing about an evaluation order, it becomes a concern in our Scala implementation as we must encode the relationship into multiple operational steps.
This decomposition offers opportunities to get things wrong:

```scala
def next() =
  val r = a
  a = b
  b = a + b // invalid semantics, the value of `a` changed "too early"
  r
```

In contrast, our Swift implementation can remain closer to the formal definition and is therefore more legible and less error-prone.

Multiple assignments show up in many general-purpose algorithms (e.g., insertion sort, partition, min-max element, ...).
But perhaps the most fundamental one is `swap`, which consists of exchanging two values.

We often swap values that are stored in some collection.
In this particular case, all is well in Scala because we can ask the collection to swap elements at given positions:

```scala
extension [T](self: mutable.ArrayBuffer[T])
  def swapAt(i: Int, j: Int) =
    val t = self(i)
    self(i) = self(j)
    self(j) = t

val a = mutable.ArrayBuffer(1, 2, 3)
a.swapAt(0, 2)
println(a) // ArrayBuffer(3, 2, 1)
```

Sadly, one can't implement a generic swap method that wouldn't rely on the ability to index a container.
The only way to express this operation in Scala is to "inline" the pattern implemented by `swapAt` every time we need to swap two values.

Having to rewrite this boilerplate is unfortunate.
Here is an example in a realistic algorithm:

```scala
extension [T](self: Seq[T])(using Ordering[T])
  def minMaxElements: Option[(T, T)] =
    import math.Ordering.Implicits.infixOrderingOps

    // Return None for collections smaller than 2 elements.
    var i = self.iterator
    if (!i.hasNext) { return None }
    var l = i.next()
    if (!i.hasNext) { return None }
    var h = i.next()

    // Confirm the initial bounds.
    if (h < l) { val t = l; l = h; h = l }

    // Process the remaining elements.
    def loop(): Option[(T, T)] =
      if (i.hasNext) {
        val n = i.next()
        if (n < l) { l = n } else if (n > h) { h = n }
        loop()
      } else {
        Some((l, h))
      }
    loop()
```

*Note: implementation shamelessly copied from [swift-algorithms](https://github.com/apple/swift-algorithms/blob/main/Sources/Algorithms/MinMax.swift).*

The swap occurs in the middle of the method with the sequence of expressions `val t = l; l = h; h = l`.
To borrow from the words of Edgar Dijskstra [1, Chapter 11]:

> [that] is combersome and ugly compared with the [multiple] assignment.

While `swap` is a very common operation, it's only an instance of a more general class of operations that are expressed in terms of relationships between multiple variables.
The definition of the Fibonacci sequence is another example.

## Proposed solution

The proposed solution is to add a language construct to assign multiple variables in a single expression.
Using this construct, swapping two values can be written as follows:

```scala
var a = 2
var b = 4
(a, b) = (b, a)
println(s"$a$b") // 42
```

The above Fibonacci iterator can be rewritten as follows:

```scala
class FibonacciIterator() extends Iterator[Int]:

  private var a: Int = 0
  private var b: Int = 1

  def hasNext = true
  def next() =
    val r = a
    (a, b) = (b, a + b)
    r
```

Multiple assignments also alleviate the need for a swap method on collections, as the same idiomatic pattern can be reused to exchange elements at given indices:

```scala
val a = mutable.ArrayBuffer(1, 2, 3)
(a(0), a(2)) = (a(2), a(0))
println(a) // ArrayBuffer(3, 2, 1)
```

### Specification

A multiple assignment is an expression of the form `AssignTarget ‘=’ Expr` where:

```
AssignTarget ::= ‘(’ AssignTargetNode {‘,’ AssignTargetNode} ‘)’
AssignTargetNode ::= Expr | AssignTarget
```

An assignment target describes a structural pattern that can only be matched by a compatible composition of tuples.
For example, the following program is legal.

```scala
def f: (Boolean, Int) = (true, 42)
val a = mutable.ArrayBuffer(1, 2, 3)
def b = a
var x = false

(x, a(0)) = (false, 1337)
(x, a(1)) = f
((x, a(1)), b(2)) = (f, 9000)
(x) = Tuple1(false)
```

A mismatch between the structure of a multiple assignment's target and the result of its RHS is a type error.
It cannot be detected during parsing because at this stage the compiler would not be able to determine the shape of an arbitrary expression's result.
For example, all multiple assignments in the following program are ill-typed:

```scala
def f: (Boolean, Int) = (true, 42)
val a = mutable.ArrayBuffer(1, 2, 3)
def b = a
var x = false

(a(1), x) = f               // type mismatch
(x, a(1), b(2)) = (f, 9000) // structural mismatch
(x) = false                 // structural mismatch
(x) = (1, 2)                // structural mismatch
```

Likewise, `(x) = Tuple1(false)` is _not_ equivalent to `x = Tuple1(false)`.
The former is a multiple assignment while the latter is a regular assignment, as described by the [current grammar](https://docs.scala-lang.org/scala3/reference/syntax.html) (see `Expr1`).
Though this distinction is subtle, multiple assignments involving unary tuples should be rare.

The operational semantics of multiple assignments (aka concurrent assignments) have been studied extensively in scienific literature (e.g., [1, 2]).
A first intuition is that the most desirable semantics can be achieved by fully evaluating the RHS of the assignment before assigning any expression in the LHS [1].
However, additional considerations must be given w.r.t. the independence of the variables on the LHS to guarantee deterministic results.
For example, consider the following expression:

```scala
(x, x) = (1, 2)
```

While one may conclude that such an expression should be an error [1], it is in general difficult to guarantee value independence in a language with pervasive reference semantics.
Further, it is desirable to write expressions of the form `(a(0), a(2)) = (a(2), a(0))`, as shown in the previous section.
Another complication is that multiple assignments should uphold the general left-to-right evaluation semantics of the Scala language.
For example, `a.b = c` requires `a` to be evaluated _before_ `c`.

Note that regular assignments desugar to function calls (e.g., `a(b) = c` is sugar for `a.update(b, c)`).
One property of these desugarings is always the last expression being evaluated before the method performing the assignment is called.
Given this observation, we address the abovementioned issues by defining the following algorithm:

1. Traverse the LHS structure in inorder and for each leaf:
    - Evaluate each outermost subexpression to its value
    - Form a closure capturing these values and accepting a single argument to perform the desugared assignment
    - Associate that closure to the leaf
2. Compute the value of the RHS, which forms a tree
3. Traverse the LHS and RHS structures pairwise in inorder and for each leaf:
    - Apply the closure formerly associated to the LHS on RHS value

For instance, consider the following definitions.

```scala
def f: (Boolean, Int) = (true, 42)
val a = mutable.ArrayBuffer(1, 2, 3)
def b = a
var x = false
```

The evaluation of the expression `((x, a(a(0))), b(2)) = (f, 9000)` is as follows:

1. form a closure `f0 = (rhs) => x_=(rhs)`
2. evaluate `a(0)`; result is `1`
3. form a closure `f1 = (rhs) => a.update(1, rhs)`
4. evaluate `b`; result is `a`
5. evaluate `2`
6. form a closure `f2 = (rhs) => a.update(2, rhs)`
7. evaluate `(f, 9000)`; result is `((true, 42), 9000)`
8. evaluate `f0(true)`
9. evaluate `f1(42)`
10. evaluate `f2(9000)`

After the assignment, `x == true` and `a == List(1, 42, 9000)`.

The compiler is allowed to ignore this procedure and generate different code for optimization purposes as long as it can guarantee that such a change is not observable.
For example, given two local variables `x` and `y`, their assignments in `(x, y) = (1, 2)` can be reordered or even performed in parallel.

### Compatibility

This proposal is purely additive and have no backward binary or TASTy compatibility consequences.
The semantics of the proposed new construct is fully expressible in terms of desugaring into current syntax, interpreteted with current semantics.

The proposed syntax is not currently legal Scala.
Therefore no currently existing program could be interpreted with different semantics using a newer compiler version supporting multiple assignments.

### Other concerns

One understandable concern of the proposed syntax is that the semantics of multiple assignments resembles that of pattern matching, yet it has different semantics.
For example:

```scala
val (a(x), b) = (true, "!") // 1

(a(x), b) = (true, "!")     // 2
```

If `a` is instance of a type with a companion extractor object, the two lines above have completely different semantics.
The first declares two local bindings `x` and `b`, applying pattern matching to determine their value from the tuple `(true, "!")`.
The second is assigning `a(x)` and `b` to the values `true` and `"!"`, respectively.

Though possibly surprising, the difference in behavior is easy to explain.
The first line applies pattern matching because it starts with `val`.
The second doesn't because it involves no pattern matching introducer.
Further, note that a similar situation can already be reproduced in current Scala:

```scala
val a(x) = true // 1

a(x) = true     // 2
```

## Alternatives

The current proposal supports arbitrary tree structures on the LHS of the assignment.
A simpler alternative would be to only support flat sequences, allowing the syntax to dispense with parentheses.

```scala
a, b = b, a
```

While this approach is more lightweight, the reduced expressiveness inhibits potentially interesting use cases.
Further, consistently using tuple syntax on both sides of the equality operator clearly distinguishes regular and multiple assignments.

## Related work

A Pre-SIP discussion took place prior to this proposal (see [here](https://contributors.scala-lang.org/t/pre-sip-multiple-assignments/6425/1)).

Multiple assignments are present in many contemporary languages.
This proposal already illustrated them in Swift, but they are also commonly used in Python.
Multiple assigments have also been studied extensively in scienific literature (e.g., [1, 2]).

## FAQ

## References

1. Edsger W. Dijkstra: A Discipline of Programming. Prentice-Hall 1976, ISBN 013215871X
2. Ralph-Johan Back, Joakim von Wright: Refinement Calculus - A Systematic Introduction. Graduate Texts in Computer Science, Springer 1998, ISBN 978-0-387-98417-9
