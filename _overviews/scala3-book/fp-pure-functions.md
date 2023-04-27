---
title: Pure Functions
type: section
description: This section looks at the use of pure functions in functional programming.
languages: [ru, zh-cn]
num: 43
previous-page: fp-immutable-values
next-page: fp-functions-are-values
---


Another feature that Scala offers to help you write functional code is the ability to write pure functions.
A _pure function_ can be defined like this:

- A function `f` is pure if, given the same input `x`, it always returns the same output `f(x)`
- The function’s output depends _only_ on its input variables and its implementation
- It only computes the output and does not modify the world around it

This implies:
- It doesn’t modify its input parameters
- It doesn’t mutate any hidden state
- It doesn’t have any “back doors”: It doesn’t read data from the outside world (including the console, web services, databases, files, etc.), or write data to the outside world

As a result of this definition, any time you call a pure function with the same input value(s), you’ll always get the same result.
For example, you can call a `double` function an infinite number of times with the input value `2`, and you’ll always get the result `4`.



## Examples of pure functions

Given that definition, as you can imagine, methods like these in the *scala.math._* package are pure functions:

- `abs`
- `ceil`
- `max`

These `String` methods are also pure functions:

- `isEmpty`
- `length`
- `substring`

Most methods on the Scala collections classes also work as pure functions, including `drop`, `filter`, `map`, and many more.

> In Scala, _functions_ and _methods_ are almost completely interchangeable, so even though we use the common industry term “pure function,” this term can be used to describe both functions and methods.
> If you’re interested in how methods can be used like functions, see the [Eta Expansion][eta] discussion.



## Examples of impure functions

Conversely, the following functions are _impure_ because they violate the definition.

- `println` -- methods that interact with the console, files, databases, web services, sensors, etc., are all impure.
- `currentTimeMillis ` -- date and time related methods are all impure because their output depends on something other than their input parameters 
- `sys.error` -- exception throwing methods are impure because they do not simply return a result

Impure functions often do one or more of these things:

- Read from hidden state, i.e., they access variables and data not explicitly passed into the function as input parameters
- Write to hidden state
- Mutate the parameters they’re given, or mutate hidden variables, such as fields in their containing class
- Perform some sort of I/O with the outside world

> In general, you should watch out for functions with a return type of `Unit`.
> Because those functions do not return anything, logically the only reason you ever call it is to achieve some side effect.
> In consequence, often the usage of those functions is impure.


## But impure functions are needed ...

Of course an application isn’t very useful if it can’t read or write to the outside world, so people make this recommendation:

> Write the core of your application using pure functions, and then write an impure “wrapper” around that core to interact with the outside world.
> As someone once said, this is like putting a layer of impure icing on top of a pure cake.

It’s important to note that there are ways to make impure interactions with the outside world feel more pure.
For instance, you’ll hear about using an `IO` Monad to deal with input and output.
These topics are beyond the scope of this document, so to keep things simple it can help to think that FP applications have a core of pure functions that are wrapped with other functions to interact with the outside world.



## Writing pure functions

**Note**: In this section the common industry term “pure function” is often used to refer to Scala methods.

To write pure functions in Scala, just write them using Scala’s method syntax (though you can also use Scala’s function syntax, as well).
For instance, here’s a pure function that doubles the input value it’s given:


{% tabs fp-pure-function %}

{% tab 'Scala 2 and 3' %}
```scala
def double(i: Int): Int = i * 2
```
{% endtab %}

{% endtabs %}

If you’re comfortable with recursion, here’s a pure function that calculates the sum of a list of integers:

{% tabs fp-pure-recursive-function class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def sum(xs: List[Int]): Int = xs match {
  case Nil => 0
  case head :: tail => head + sum(tail)
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def sum(xs: List[Int]): Int = xs match
  case Nil => 0
  case head :: tail => head + sum(tail)
```
{% endtab %}

{% endtabs %}

If you understand that code, you’ll see that it meets the pure function definition.



## Key points

The first key point of this section is the definition of a pure function:

> A _pure function_ is a function that depends only on its declared inputs and its implementation to produce its output.
> It only computes its output and does not depend on or modify the outside world.

A second key point is that every real-world application interacts with the outside world.
Therefore, a simplified way to think about functional programs is that they consist of a core of pure functions that are wrapped with other functions that interact with the outside world.



[eta]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
