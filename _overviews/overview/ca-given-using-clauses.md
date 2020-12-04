---
title: Given Instances and Using Clauses
description: This page demonstrates how to use 'given' instances and 'using' clauses in Scala 3.
num: 27
previous-page: ca-contextual-abstractions-intro
next-page: ca-context-bounds
---


*Given Instances* let you define terms that can be synthesized by the compiler. They replace “implicit definitions,” which were used in Scala 2. Called “givens,” they’re a single way to define terms that can be synthesized for types.

*Using Clauses* are a new syntax for using “given” parameters and their arguments. They unambiguously align parameters and arguments, and let you have several `using` clauses in a definition.

Givens have many different applications, and this section demonstrates two use cases:

- Eliminating the need to manually specify a repeated parameter
- Eliminating the need to name one of several possible alternative resources


## Eliminate the need to manually specify a repeated parameter

<!-- https://www.scala-lang.org/2020/11/06/explicit-term-inference-in-scala-3.html -->

If givens didn’t exist, you’d have to write code like this:

```scala
import scala.concurrent._

def factorial(n: Int): Int = ???
def fibonacci(n: Int): Int = ???

@main def main =
  val executor: ExecutionContext = ExecutionContext.global
  val fact100 = Future(factorial(100))(executor)
  val fibo100 = Future(fibonacci(100))(executor)
```

Notice how passing in the `executor` parameter makes the code in the `main` method verbose and repetitive.

With givens in Scala 3, the same code can be written like this:

```scala
@main def main =
  given executor as ExecutionContext = ExecutionContext.global
  val fact100 = Future(factorial(100))
  val fibo100 = Future(fibonacci(100))
```

In this use, `given` contextual parameters simplify the code. The `executor` parameter is still passed into the future’s second parameter group, but it’s passed in *implicitly* by the compiler, rather than *explicitly* (or manually) in your code. Once you know that the second parameter group of `Future` is designed to enable this, there’s no need to see this parameter repeated in the code.

>The second parameter group of `Future` is designed to take an `implicit` parameter in Scala 2, and a `using` parameter in Scala 3.
<!-- TODO: verify that statement -->



## Eliminate the need to specify different possible resources

In another uses of givens, imagine that you want to write some code like this, where the `max` function uses `intOrd`, `doubleOrd`, and `listOrd` to determine the maximum of the values it’s given:

```scala
println(max(2, 3)(using intOrd))
println(max(2.0, 3.0)(using doubleOrd))
println(max(Nil, List(1, 2, 3))(using listOrd))
```

Once again this code appears repetitive. It can be cleaner if the second parameter group isn’t used:

```scala
println(max(2, 3))
println(max(2.0, 3.0))
println(max(Nil, List(1, 2, 3)))
```

That requires the compiler to know where to use `intOrd`, `doubleOrd`, and `listOrd`, and thanks to strong typing, Scala 3 can do this work for you, reducing the verbosity of your code.


### Defining givens

*Givens* let you write code like this last example. For this use case, the formula is to first define the givens as follows, first defining a base trait, and then specific `given` instances of that trait for each type you want to support:

```scala
object Orderings:

  // a base trait for the generic type A
  trait Ord[A]:
    def compare(x: A, y: A): Int
    extension (x: A) def < (y: A) = compare(x, y) < 0
    extension (x: A) def > (y: A) = compare(x, y) > 0

  // three specific implementations for the Int, Double, and
  // List[A] types:

  given intOrd as Ord[Int]:
    def compare(x: Int, y: Int) =
      if (x < y) -1 else if (x > y) +1 else 0

  given doubleOrd as Ord[Double]:
    def compare(x: Double, y: Double) =
      if (x < y) -1 else if (x > y) +1 else 0

  given listOrd[A](using ord: Ord[A]) as Ord[List[A]]:
    def compare(xs: List[A], ys: List[A]): Int =
      // more code here ...

end Orderings
```

Then you import the givens into your code:

```scala
import Orderings._
import Orderings.{given Ord[?]}
```


### Defining “using” clauses

Then you define your `max` method, *using* a parameter of the `Ord` type in the second parameter group:

```scala
def max[A](x: A, y: A)(using ord: Ord[A]): A =
  if ord.compare(x, y) < 0 then y else x
```

The `using` keyword in the second parameter group is like a magnet that pulls in the correct `given` value when `max` is used: If, for example, (a) `A` is an `Int` and (b) `intOrd` is in scope, then (c) the compiler automatically pulls `intOrd` in at this point.

With that code in place, the final end-user code is written like this:

```scala
@main def ordMain =
  println(max(2, 3))
  println(max(2.0, 3.0))
  println(max(Nil, List(1, 2, 3)))
```

<!-- TODO: mention "type class" here? -->

Givens have other uses that are explained in this Overview, and in the Reference documentation.




