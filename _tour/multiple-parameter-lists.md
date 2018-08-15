---
layout: tour
title: Multiple Parameter Lists (Currying)

discourse: true

partof: scala-tour

num: 10
next-page: case-classes
previous-page: nested-functions

redirect_from: "/tutorials/tour/multiple-parameter-lists.html"
---

Methods may define multiple parameter lists. When a method is called with a fewer number of parameter lists, then this will yield a function taking the missing parameter lists as its arguments. This is formally known as [currying](https://en.wikipedia.org/wiki/Currying).

Here is an example, defined in [Traversable](/overviews/collections/trait-traversable.html) trait from Scala collections:

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft` applies a binary operator `op` to an initial value `z` and all elements of this traversable, going left to right. Shown below is an example of its usage. 

Starting with an initial value of 0, `foldLeft` here applies the function `(m, n) => m + n` to each element in the List and the previous accumulated value.

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
print(res) // 55
```

Multiple parameter lists have a more verbose invocation syntax; and hence should be used sparingly. Suggested use cases include:

#### Single functional parameter
   In case of a single functional parameter, like `op` in the case of `foldLeft` above, multiple parameter lists allow a concise syntax to pass an anonymous function to the method. Without multiple parameter lists, the code would look like this:

```
numbers.foldLeft(0, {(m: Int, n: Int) => m + n})
```
    
   Note that the use of multiple parameter lists here also allows us to take advantage of Scala type inference to make the code more concise as shown below; which would not be possible in a non-curried definition.
    
```
numbers.foldLeft(0)(_ + _)
```
   Above statement `numbers.foldLeft(0)(_ + _)` allows us to fix the parameter `z` and pass around a partial function and reuse it as shown below:
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())_

val squares = numberFunc((xs, x) => xs:+ x*x)
print(squares.toString()) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs:+ x*x*x)
print(cubes.toString())  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

   Finally, `foldLeft` and `foldRight` can be used in any of the following terms,
```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

numbers.foldLeft(0)((sum, item) => sum + item) // Generic Form
numbers.foldRight(0)((sum, item) => sum + item) // Generic Form

numbers.foldLeft(0)(_+_) // Curried Form
numbers.foldRight(0)(_+_) // Curried Form

(0 /: numbers)(_+_) // Used in place of foldLeft
(numbers :\ 0)(_+_) // Used in place of foldRight
```   

   
#### Implicit parameters
   To specify certain parameters in a parameter list as `implicit`, multiple parameter lists should be used. An example of this is:

```
def execute(arg: Int)(implicit ec: ExecutionContext) = ???
```
    
