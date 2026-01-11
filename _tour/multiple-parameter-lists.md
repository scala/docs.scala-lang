---
layout: tour
title: Multiple Parameter Lists
partof: scala-tour

num: 12
next-page: case-classes
previous-page: nested-functions

redirect_from: "/tutorials/tour/multiple-parameter-lists.html"
---

Methods may have multiple parameter lists.

### Example

Here is an example, as defined on the `Iterable` trait in Scala's collections API:

{% tabs foldLeft_definition class=tabs-scala-version %}

{% tab 'Scala 2' for=foldLeft_definition %}

```scala
trait Iterable[A] {
  ...
  def foldLeft[B](z: B)(op: (B, A) => B): B
  ...
}
```

{% endtab %}

{% tab 'Scala 3' for=foldLeft_definition %}

```scala
trait Iterable[A]:
  ...
  def foldLeft[B](z: B)(op: (B, A) => B): B
  ...
```

{% endtab %}

{% endtabs %}

`foldLeft` applies a two-parameter function `op` to an initial value `z` and all elements of this collection, going left to right. Shown below is an example of its usage.

Starting with an initial value of 0, `foldLeft` here applies the function `(m, n) => m + n` to each element in the List and the previous accumulated value.

{% tabs foldLeft_use %}

{% tab 'Scala 2 and 3' for=foldLeft_use %}

```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```

{% endtab %}

{% endtabs %}

### Use cases

Suggested use cases for multiple parameter lists include:

#### Drive type inference

In Scala 2, type inference proceeds one parameter list at a time.

> Scala 3 note :  
> This explanation does not apply to Scala 3.  
> In Scala 3, type variables are inferred as late as possible and are not
> constrained by parameter list boundaries. As a result, later parameter
> lists may contribute to type inference.

Say you have the following method:

{% tabs foldLeft1_definition %}

{% tab 'Scala 2 and 3' for=foldLeft1_definition %}

```scala mdoc
def foldLeft1[A, B](as: List[A], b0: B, op: (B, A) => B) = ???
```

{% endtab %}

{% endtabs %}

Then you'd like to call it in the following way, but will find that it doesn't compile:

{% tabs foldLeft1_wrong_use %}

{% tab 'Scala 2 and 3' for=foldLeft1_wrong_use %}

```scala mdoc:fail
def notPossible = foldLeft1(numbers, 0, _ + _)
```

{% endtab %}

{% endtabs %}

you will have to call it like one of the below ways:

{% tabs foldLeft1_good_use %}

{% tab 'Scala 2 and 3' for=foldLeft1_good_use %}

```scala mdoc
def firstWay = foldLeft1[Int, Int](numbers, 0, _ + _)
def secondWay = foldLeft1(numbers, 0, (a: Int, b: Int) => a + b)
```

{% endtab %}

{% endtabs %}

That's because Scala won't be able to infer the type of the function `_ + _`, as it's still inferring `A` and `B`. By moving the parameter `op` to its own parameter list, `A` and `B` are inferred in the first parameter list. These inferred types will then be available to the second parameter list and `_ + _` will match the inferred type `(Int, Int) => Int`

{% tabs foldLeft2_definition_and_use %}

{% tab 'Scala 2 and 3' for=foldLeft2_definition_and_use %}

```scala mdoc
def foldLeft2[A, B](as: List[A], b0: B)(op: (B, A) => B) = ???
def possible = foldLeft2(numbers, 0)(_ + _)
```

{% endtab %}

{% endtabs %}

This definition doesn't need any type hints and can infer all of its type parameters.

#### Implicit parameters

To specify only certain parameters as [`implicit`](https://docs.scala-lang.org/tour/implicit-parameters.html), they must be placed in their own `implicit` parameter list.

An example of this is:

{% tabs execute_definition class=tabs-scala-version %}

{% tab 'Scala 2' for=execute_definition %}

```scala mdoc
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

{% endtab %}

{% tab 'Scala 3' for=execute_definition %}

```scala
def execute(arg: Int)(using ec: scala.concurrent.ExecutionContext) = ???
```

{% endtab %}

{% endtabs %}

#### Partial application

When a method is called with a fewer number of parameter lists, then this will yield a function taking the missing parameter lists as its arguments. This is formally known as [partial application](https://en.wikipedia.org/wiki/Partial_application).

For example,

{% tabs foldLeft_partial class=tabs-scala-version %}

{% tab 'Scala 2' for=foldLeft_partial %}

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _

val squares = numberFunc((xs, x) => xs :+ x*x)
println(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
println(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

{% endtab %}

{% tab 'Scala 3' for=foldLeft_partial %}

```scala
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())

val squares = numberFunc((xs, x) => xs :+ x*x)
println(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
println(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

{% endtab %}

{% endtabs %}

### Comparison with "currying"

You may sometimes see a method with multiple parameter lists referred to as "curried".

As the [Wikipedia article on currying](https://en.wikipedia.org/wiki/Currying) states,

> Currying is the technique of converting a function that takes
> multiple arguments into a sequence of functions that each takes a
> single argument

We discourage the use of the word "curry" in reference to Scala's multiple parameter lists, for two reasons:

1. In Scala, multiple parameters and multiple parameter lists are
   specified and implemented directly, as part of the language, rather
   being derived from single-parameter functions.

2. There is danger of confusion with the Scala standard library's
   [`curried`](<https://www.scala-lang.org/api/current/scala/Function2.html#curried:T1=%3E(T2=%3ER)>)
   and [`uncurried`](<https://www.scala-lang.org/api/current/scala/Function$.html#uncurried[T1,T2,R](f:T1=%3E(T2=%3ER)):(T1,T2)=%3ER>) methods, which don't involve multiple parameter lists at all.

Regardless, there are certainly similarities to be found between
multiple parameter lists and currying. Though they are different at
the definition site, the call site might nonetheless look identical,
as in this example:

{% tabs about_currying %}

{% tab 'Scala 2 and 3' for=about_currying %}

```scala mdoc
// version with multiple parameter lists
def addMultiple(n1: Int)(n2: Int) = n1 + n2
// two different ways of arriving at a curried version instead
def add(n1: Int, n2: Int) = n1 + n2
val addCurried1 = (add _).curried
val addCurried2 = (n1: Int) => (n2: Int) => n1 + n2
// regardless, all three call sites are identical
addMultiple(3)(4)  // 7
addCurried1(3)(4)  // 7
addCurried2(3)(4)  // 7
```

{% endtab %}

{% endtabs %}
