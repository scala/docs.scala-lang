---
layout: tour
title: Multiple Parameter Lists (Currying)
partof: scala-tour

num: 10
next-page: case-classes
previous-page: nested-functions

redirect_from: "/tutorials/tour/multiple-parameter-lists.html"
---

Methods may have multiple parameter lists.

### Example

Here is an example, as defined on the `TraversableOnce` trait in Scala's collections API:

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft` applies a two-parameter function `op` to an initial value `z` and all elements of this collection, going left to right. Shown below is an example of its usage.

Starting with an initial value of 0, `foldLeft` here applies the function `(m, n) => m + n` to each element in the List and the previous accumulated value.

{% scalafiddle %}
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```
{% endscalafiddle %}

### Use cases

Suggested use cases for multiple parameter lists include:

#### Single functional parameter

In case of a single functional parameter, like `op` in the case of `foldLeft` above, multiple parameter lists allow a concise syntax to pass an anonymous function to the method. Without multiple parameter lists, the code would look like this:

```
numbers.foldLeft(0, (m: Int, n: Int) => m + n)
```

Note that the use of multiple parameter lists here also allows us to take advantage of Scala type inference to make the code more concise, like this:

```
numbers.foldLeft(0)(_ + _)
```

this would not be possible with only a single parameter list, as the Scala compiler would not be able to infer the parameter types of the function.

#### Implicit parameters

To specify only certain parameters as `implicit`, they must be placed in their own `implicit` parameter list.

An example of this is:

```
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

#### Partial application

When a method is called with a fewer number of parameter lists, then this will yield a function taking the missing parameter lists as its arguments. This is formally known as [partial application](https://en.wikipedia.org/wiki/Partial_application).

For example,

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _

val squares = numberFunc((xs, x) => xs :+ x*x)
print(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
print(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```
