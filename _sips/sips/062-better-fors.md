---
layout: sip
number: 62
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: For comprehension improvements
---

**By: Kacper Korban (VirtusLab)**

## History

| Date          | Version                |
|---------------|------------------------|
| June 6th 2023 | Initial Draft          |
| Feb 15th 2024 | Reviewed Version       |
| Nov 21th 2024 | Addendum for change 3. |

## Summary

`for`-comprehensions in Scala 3 improved their usability in comparison to Scala 2, but there are still some pain points relating both usability of `for`-comprehensions and simplicity of their desugaring.

This SIP tries to address some of those problems, by changing the specification of `for`-comprehensions. From user perspective, the biggest change is allowing aliases at the start of the `for`-comprehensions. e.g.

```
for {
  x = 1
  y <- Some(2)
} yield x + y
```

## Motivation

There are some clear pain points related to Scala'3 `for`-comprehensions and those can be divided into two categories:

1. User-facing and code simplicity problems

    Specifically, for the following example written in a Haskell-style do-comprehension

    ```haskell
    do
      a = largeExpr(arg)
      b <- doSth(a)
      combineM(a, b)
    ```
    in Scala we would have to write

    ```scala
    val a = largeExpr(b)
    for
      b <- doSth(a)
      x <- combineM(a, b)
      yield x
    ```

    This complicates the code, even in this simple example.
2. The simplicity of desugared code

    The second pain point is that the desugared code of `for`-comprehensions can often be surprisingly complicated.

    e.g.
    ```scala
    for
      a <- doSth(arg)
      b = a
    yield a + b
    ```

    Intuition would suggest for the desugared code will be of the form

    ```scala
    doSth(arg).map { a =>
      val b = a
      a + b
    }
    ```

    But because of the possibility of an `if` guard being immediately after the pure alias, the desugared code is of the form

    ```scala
    doSth(arg).map { a =>
      val b = a
      (a, b)
    }.map { case (a, b) =>
      a + b
    }
    ```

    These unnecessary assignments and additional function calls not only add unnecessary runtime overhead but can also block other optimizations from being performed.

## Proposed solution

This SIP suggests the following changes to `for` comprehensions:

1. Allow `for` comprehensions to start with pure aliases

    e.g.
    ```scala
    for
      a = 1
      b <- Some(2)
      c <- doSth(a)
    yield b + c
    ```
2. Simpler conditional desugaring of pure aliases. i.e. whenever a series of pure aliases is not immediately followed by an `if`, use a simpler way of desugaring.

    e.g.
    ```scala
    for
      a <- doSth(arg)
      b = a
    yield a + b
    ```

    will be desugared to

    ```scala
    doSth(arg).map { a =>
      val b = a
      a + b
    }
    ```

    but

    ```scala
    for
      a <- doSth(arg)
      b = a
      if b > 1
    yield a + b
    ```

    will be desugared to

    ```scala
    doSth(arg).map { a =>
      val b = a
      (a, b)
    }.withFilter { case (a, b) =>
      b > 1
    }.map { case (a, b) =>
      a + b
    }
    ```

3. Avoiding redundant `map` calls if the yielded value is the same as the last bound value.

    e.g.
    ```scala
    for
      a <- List(1, 2, 3)
    yield a
    ```

    will just be desugared to

    ```scala
    List(1, 2, 3)
    ```

### Detailed description

#### Ad 1. Allow `for` comprehensions to start with pure aliases

Allowing `for` comprehensions to start with pure aliases is a straightforward change.

The Enumerators syntax will be changed from:

```
Enumerators ::= Generator {semi Enumerator | Guard}
```

to

```
Enumerators ::= {Pattern1 `=' Expr semi} Generator {semi Enumerator | Guard}
```

Which will allow adding 0 or more aliases before the first generator.

When desugaring is concerned, a for comprehension starting with pure aliases will generate a block with those aliases as `val` declarations and the rest of the desugared `for` as an expression. Unless the aliases are followed by a guard, then the desugaring should result in an error.

New desugaring rule will be added:

```scala
For any N:
  for (P_1 = E_1; ... P_N = E_N; ...)
    ==>
  {
    val x_2 @ P_2 = E_2
    ...
    val x_N @ P_N = E_N
    for (...)
  }
```

e.g.

```scala
for
  a = 1
  b <- Some(2)
  c <- doSth(a)
yield b + c
```

will desugar to

```scala
{
  val a = 1
  for
    b <- Some(2)
    c <- doSth(a)
  yield b + c
}
```

#### Ad 2. Simpler conditional desugaring of pure aliases. i.e. whenever a series of pure aliases is not immediately followed by an `if`, use a simpler way of desugaring.

Currently, for consistency, all pure aliases are desugared as if they are followed by an `if` condition. Which makes the desugaring more complicated than expected.

e.g.

The following code:

```scala
for
  a <- doSth(arg)
  b = a
yield a + b
```

will be desugared to:

```scala
doSth(arg).map { a =>
  val b = a
  (a, b)
}.map { case (a, b) =>
  a + b
}
```

The proposed change is to introduce a simpler desugaring for common cases, when aliases aren't followed by a guard, and keep the old desugaring method for the other cases.

A new desugaring rules will be introduced for simple desugaring.

```scala
For any N:
  for (P <- G; P_1 = E_1; ... P_N = E_N; ...)
    ==>
  G.flatMap (P => for (P_1 = E_1; ... P_N = E_N; ...))

And:

  for () yield E  ==>  E

(Where empty for-comprehensions are excluded by the parser)
```

It delegares desugaring aliases to the newly introduced rule from the previous impreovement. i.e.

```scala
For any N:
  for (P_1 = E_1; ... P_N = E_N; ...)
    ==>
  {
    val x_2 @ P_2 = E_2
    ...
    val x_N @ P_N = E_N
    for (...)
  }
```

One other rule also has to be changed, so that the current desugaring method, of passing all the aliases in a tuple with the result, will only be used when desugaring a generator, followed by some aliases, followed by a guard.

```scala
For any N:
  for (P <- G; P_1 = E_1; ... P_N = E_N; if E; ...)
    ==>
  for (TupleN(P, P_1, ... P_N) <-
    for (x @ P <- G) yield {
      val x_1 @ P_1 = E_2
      ...
      val x_N @ P_N = E_N
      TupleN(x, x_1, ..., x_N)
    }; if E; ...)
```

This changes will make the desugaring work in the following way:

```scala
for
  a <- doSth(arg)
  b = a
yield a + b
```

will be desugared to

```scala
doSth(arg).map { a =>
  val b = a
  a + b
}
```

but

```scala
for
  a <- doSth(arg)
  b = a
  if b > 1
yield a + b
```

will be desugared to

```scala
doSth(arg).map { a =>
  val b = a
  (a, b)
}.withFilter { case (a, b) =>
  b > 1
}.map { case (a, b) =>
  a + b
}
```

#### Ad 3. Avoiding redundant `map` calls if the yielded value is the same as the last bound value.

This change is strictly an optimization. This allows for the compiler to get rid of the final `map` call, if the yielded value is the same as the last bound pattern. The pattern can be either a single variable binding or a tuple.

This optimization should be done after type checking (e.g. around first transform). See the reasons to why it cannot be done in desugaring in [here](#previous-design-in-desugaring).

We propose an approach where an attachment (`TrailingForMap`) is attached to the last `map` `Apply` node. After that, a later phase will look for `Apply` nodes with this attachment and possibly remove the `map` call.

The condition for allowing to remove the last map call (for a binding `pat <- gen yield pat1`) are as follows:
- `pat` is (syntactically) equivalent to `pat1` ($pat =_{s} pat1$)
  
  where
  
  $x =_{s} x, \text{if x is a variable reference}$

  $x =_{s} (), \text{if x is a variable reference of type Unit}$
  
  $(x_1, ..., x_n) =_{s} (y_1, ..., y_n) \iff \forall i \in n.\; x_i =_{s} y_i$

  This means that the two patterns are equivalent if they are the same variable, if they are tuples of the same variables, or if one is a variable reference of type `Unit` and the other is a `Unit` literal.
- `pat` and `pat1` have the same types (`pat.tpe` =:= `pat1.tpe`)

##### Changes discussion

This adresses the problem of changing the resulting type after removing trailing `map` calls.

There are two main changes compared to the previous design:
1. Moving the implementation to the later phase, to be able to use the type information and explicitly checking that the types are the same.
2. Allowing to remove the last `map` call if the yielded value is a `Unit` literal (and obviously the type doesn't change).

The motivation for the second change is to avoid potential memory leaks in effecting loops. e.g.

```scala
//> using scala 3.3.3
//> using lib "dev.zio::zio:2.1.5"

import zio.*

def loop: Task[Unit] =
  for
    _ <- Console.print("loop")
    _ <- loop
  yield ()

@main
def run =
  val runtime = Runtime.default
  Unsafe.unsafe { implicit unsafe =>
    runtime.unsafe.run(loop).getOrThrowFiberFailure()
  }
```

This kind of effect loop is pretty commonly used in Scala FP programs and often ends in `yield ()`.

The problem with the desugaring of this for-comprehensions is that it leaks memory because the result of `loop` has to be mapped over with `_ => ()`, which often does nothing.

##### Previous design (in desugaring)

One desugaring rule has to be modified for this purpose.

```scala
  for (P <- G) yield P  ==>  G
If P is a variable or a tuple of variables and G is not a withFilter.

  for (P <- G) yield E  ==>  G.map (P => E)
Otherwise
```

e.g.
```scala
for
  a <- List(1, 2, 3)
yield a
```

will just be desugared to

```scala
List(1, 2, 3)
```

**Cause of change**

This design ended up breaking quite a few existing projects in the open community build run.

For example, consider the following code:

```scala
//>  using scala 3.nightly

import scala.language.experimental.betterFors

case class Container[A](val value: A) {
  def map[B](f: A => B): Container[B] = Container(f(value))
}

sealed trait Animal
case class Dog() extends Animal

def opOnDog(dog: Container[Dog]): Container[Animal] =
  for
    v <- dog
  yield v
```

With the new desugaring, the code gave an error about type mismatch.

```scala
-- [E007] Type Mismatch Error: /home/kpi/bugs/better-fors-bug.scala:13:2 -------
13 |  for
   |  ^
   |  Found:    (dog : Container[Dog])
   |  Required: Container[Animal]
14 |    v <- dog
15 |  yield v
   |
   | longer explanation available when compiling with `-explain`
```

This is because the container is invariant. And even though the last `map` was an identity function, it was used to upcast `Dog` to `Animal`.

### Compatibility

This change may change the semantics of some programs. It may remove some `map` calls in the desugared code, which may change the program semantics (if the `map` implementation was side-effecting).

For example the following code will now have only one `map` call, instead of two:
```scala
for
  a <- doSth(arg)
  b = a
yield a + b
```

### Other concerns

As far as I know, there are no widely used Scala 3 libraries that depend on the desugaring specification of `for`-comprehensions.

The only Open community build library that failed because of the change to the desugaring specification is [`avocADO`](https://github.com/VirtusLab/avocado).

## Links

1. Scala contributors discussion thread (pre-SIP): https://contributors.scala-lang.org/t/pre-sip-improve-for-comprehensions-functionality/3509/51
2. Github issue discussion about for desugaring: https://github.com/lampepfl/dotty/issues/2573
3. Scala 2 implementation of some of the improvements: https://github.com/oleg-py/better-monadic-for
4. Implementation of one of the simplifications: https://github.com/lampepfl/dotty/pull/16703
5. Draft implementation branch: https://github.com/dotty-staging/dotty/tree/improved-fors
6. Minimized issue reproducing the problem with the current desugaring: https://github.com/scala/scala3/issues/21804
7. (empty :sad:) Contributors thread about better effect loops with for-comprehensions: https://contributors.scala-lang.org/t/pre-sip-sip-62-addition-proposal-better-effect-loops-with-for-comprehensions/6759
8. Draft implementation of dropping the last map call after type checking (only for `Unit` literals): https://github.com/KacperFKorban/dotty/commit/31cbd4744b9375443a0770a8b8a9d16de694c6bb#diff-ed248bb93940ea4f38e6da698051f882e81df6f33fea91a046d1d4f6af506296R2066
