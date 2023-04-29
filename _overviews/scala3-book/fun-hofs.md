---
title: Higher-Order Functions
type: section
description: This page demonstrates how to create and use higher-order functions in Scala.
languages: [ru, zh-cn]
num: 31
previous-page: fun-eta-expansion
next-page: fun-write-map-function
---


A higher-order function (HOF) is often defined as a function that (a) takes other functions as input parameters or (b) returns a function as a result.
In Scala, HOFs are possible because functions are first-class values.

As an important note, while we use the common industry term “higher-order function” in this document, in Scala this phrase applies to both *methods* and *functions*.
Thanks to Scala’s [Eta Expansion technology][eta_expansion], they can generally be used in the same places.

## From consumer to creator

In the examples so far in this book you’ve seen how to be a *consumer* of methods that take other functions as input parameters, such as using HOFs like `map` and `filter`.
In the next few sections you’ll see how to be a *creator* of HOFs, including:

- How to write methods that take functions as input parameters
- How to return a function from a method

In the process you’ll see:

- The syntax you use to define function input parameters
- How to call a function once you have a reference to it

As a beneficial side effect of this discussion, once you’re comfortable with this syntax, you’ll use it to define function parameters, anonymous functions, and function variables, and it also becomes easier to read the Scaladoc for higher-order functions.

## Understanding filter’s Scaladoc

To understand how higher-order functions work, it helps to dig into an example.
For instance, you can understand the type of functions `filter` accepts by looking at its Scaladoc.
Here’s the `filter` definition in the `List[A]` class:

{% tabs filter-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def filter(p: A => Boolean): List[A]
```
{% endtab %}
{% endtabs %}

This states that `filter` is a method that takes a function parameter named `p`.
By convention, `p` stands for a *predicate*, which is just a function that returns a `Boolean` value.
So `filter` takes a predicate `p` as an input parameter, and returns a `List[A]`, where `A` is the type held in the list; if you call `filter` on a `List[Int]`, `A` is the type `Int`.

At this point, if you don’t know the purpose of the `filter` method, all you’d know is that its algorithm somehow uses the predicate `p` to create and return the `List[A]`.

Looking specifically at the function parameter `p`, this part of `filter`’s description:

{% tabs filter-definition_1 %}
{% tab 'Scala 2 and 3' %}
```scala
p: A => Boolean
```
{% endtab %}
{% endtabs %}

means that whatever function you pass in must take the type `A` as an input parameter and return a `Boolean`.
So if your list is a `List[Int]`, you can replace the generic type `A` with `Int`, and read that signature like this:

{% tabs filter-definition_2 %}
{% tab 'Scala 2 and 3' %}
```scala
p: Int => Boolean
```
{% endtab %}
{% endtabs %}

Because `isEven` has this type---it transforms an input `Int` into a resulting `Boolean`---it can be used with `filter`.

{% comment %}
NOTE: (A low-priority issue): The next several sections can be condensed.
{% endcomment %}

## Writing methods that take function parameters

Given that background, let’s start writing methods that take functions as input parameters.

**Note:** To make the following discussion clear, we’ll refer to the code you’re writing as a *method*, and the code you’re accepting as an input parameter as a *function*.


### A first example

To create a method that takes a function parameter, all you have to do is:

1. In your method’s parameter list, define the signature of the function you want to accept
2. Use that function inside your method

To demonstrate this, here’s a method that that takes an input parameter named `f`, where `f` is a function:

{% tabs sayHello-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def sayHello(f: () => Unit): Unit = f()
```
{% endtab %}
{% endtabs %}

This portion of the code---the *type signature*---states that `f` is a function, and defines the types of functions the `sayHello` method will accept:

{% tabs sayHello-definition_1 %}
{% tab 'Scala 2 and 3' %}
```scala
f: () => Unit
```
{% endtab %}
{% endtabs %}

Here’s how this works:

- `f` is the name of the function input parameter.
  It’s just like naming a `String` parameter `s` or an `Int` parameter `i`.
- The type signature of `f` specifies the *type* of the functions this method will accept.
- The `()` portion of `f`’s signature (on the left side of the `=>` symbol) states that `f` takes no input parameters.
- The `Unit` portion of the signature (on the right side of the `=>` symbol) indicates that `f` should not return a meaningful result.
- Looking back at the body of the `sayHello` method (on the right side of the `=` symbol), the `f()` statement there invokes the function that’s passed in.

Now that we’ve defined `sayHello`, let’s create a function to match `f`’s signature so we can test it.
The following function takes no input parameters and returns nothing, so it matches `f`’s type signature:

{% tabs helloJoe-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def helloJoe(): Unit = println("Hello, Joe")
```
{% endtab %}
{% endtabs %}

Because the type signatures match, you can pass `helloJoe` into `sayHello`:

{% tabs sayHello-usage %}
{% tab 'Scala 2 and 3' %}
```scala
sayHello(helloJoe)   // prints "Hello, Joe"
```
{% endtab %}
{% endtabs %}

If you’ve never done this before, congratulations:
You just defined a method named `sayHello` that takes a function as an input parameter, and then invokes that function in its method body.

### sayHello can take many functions

It’s important to know that the beauty of this approach is not that `sayHello` can take *one* function as an input parameter; the beauty is that it can take *any* function that matches `f`’s signature.
For instance, because this next function takes no input parameters and returns nothing, it also works with `sayHello`:

{% tabs bonjourJulien-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def bonjourJulien(): Unit = println("Bonjour, Julien")
```
{% endtab %}
{% endtabs %}

Here it is in the REPL:

{% tabs bonjourJulien-usage %}
{% tab 'Scala 2 and 3' %}
````
scala> sayHello(bonjourJulien)
Bonjour, Julien
````
{% endtab %}
{% endtabs %}

This is a good start.
The only thing to do now is see a few more examples of how to define different type signatures for function parameters.

## The general syntax for defining function input parameters

In this method:

{% tabs sayHello-definition-2 %}
{% tab 'Scala 2 and 3' %}
```scala
def sayHello(f: () => Unit): Unit
```
{% endtab %}
{% endtabs %}

We noted that the type signature for `f` is:

{% tabs sayHello-definition-2_1 %}
{% tab 'Scala 2 and 3' %}
```scala
() => Unit
```
{% endtab %}
{% endtabs %}

We know that this means, “a function that takes no input parameters and returns nothing meaningful (given by `Unit`).”

To demonstrate more type signature examples, here’s a function that takes a `String` parameter and returns an `Int`:

{% tabs sayHello-definition-2_2 %}
{% tab 'Scala 2 and 3' %}
```scala
f: String => Int
```
{% endtab %}
{% endtabs %}

What kinds of functions take a string and return an integer?
Functions like “string length” and checksum are two examples.

Similarly, this function takes two `Int` parameters and returns an `Int`:

{% tabs sayHello-definition-2_3 %}
{% tab 'Scala 2 and 3' %}
```scala
f: (Int, Int) => Int
```
{% endtab %}
{% endtabs %}

Can you imagine what sort of functions match that signature?

The answer is that any function that takes two `Int` input parameters and returns an `Int` matches that signature, so all of these “functions” (methods, really) are a match:

{% tabs add-sub-mul-definitions %}
{% tab 'Scala 2 and 3' %}
```scala
def add(a: Int, b: Int): Int = a + b
def subtract(a: Int, b: Int): Int = a - b
def multiply(a: Int, b: Int): Int = a * b
```
{% endtab %}
{% endtabs %}

As you can infer from these examples, the general syntax for defining function parameter type signatures is:

{% tabs add-sub-mul-definitions_1 %}
{% tab 'Scala 2 and 3' %}
```scala
variableName: (parameterTypes ...) => returnType
```
{% endtab %}
{% endtabs %}

> Because functional programming is like creating and combining a series of algebraic equations, it’s common to think about types a *lot* when designing functions and applications.
> You might say that you “think in types.”

## Taking a function parameter along with other parameters

For HOFs to be really useful, they also need some data to work on.
For a class like `List`, its `map` method already has data to work on: the data in the `List`.
But for a standalone HOF that doesn’t have its own data, it should also accept data as other input parameters.

For instance, here’s a method named `executeNTimes` that has two input parameters: a function, and an `Int`:

{% tabs executeNTimes-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def executeNTimes(f: () => Unit, n: Int): Unit =
  for (i <- 1 to n) f()
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def executeNTimes(f: () => Unit, n: Int): Unit =
  for i <- 1 to n do f()
```
{% endtab %}
{% endtabs %}

As the code shows, `executeNTimes` executes the `f` function `n` times.
Because a simple `for` loop like this has no return value, `executeNTimes` returns `Unit`.

To test `executeNTimes`, define a method that matches `f`’s signature:

{% tabs helloWorld-definition %}
{% tab 'Scala 2 and 3' %}
```scala
// a method of type `() => Unit`
def helloWorld(): Unit = println("Hello, world")
```
{% endtab %}
{% endtabs %}

Then pass that method into `executeNTimes` along with an `Int`:

{% tabs helloWorld-usage %}
{% tab 'Scala 2 and 3' %}
```
scala> executeNTimes(helloWorld, 3)
Hello, world
Hello, world
Hello, world
```
{% endtab %}
{% endtabs %}

Excellent.
The `executeNTimes` method executes the `helloWorld` function three times.
### As many parameters as needed

Your methods can continue to get as complicated as necessary.
For example, this method takes a function of type `(Int, Int) => Int`, along with two input parameters:

{% tabs executeAndPrint-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def executeAndPrint(f: (Int, Int) => Int, i: Int, j: Int): Unit =
  println(f(i, j))
```
{% endtab %}
{% endtabs %}

Because these `sum` and `multiply` methods match that type signature, they can be passed into `executeAndPrint` along with two `Int` values:

{% tabs executeAndPrint-usage %}
{% tab 'Scala 2 and 3' %}
```scala
def sum(x: Int, y: Int) = x + y
def multiply(x: Int, y: Int) = x * y

executeAndPrint(sum, 3, 11)       // prints 14
executeAndPrint(multiply, 3, 9)   // prints 27
```
{% endtab %}
{% endtabs %}

## Function type signature consistency

A great thing about learning about Scala’s function type signatures is that the syntax you use to define function input parameters is the same syntax you use to write function literals.

For instance, if you were to write a function that calculates the sum of two integers, you’d write it like this:

{% tabs f-val-definition %}
{% tab 'Scala 2 and 3' %}
```scala
val f: (Int, Int) => Int = (a, b) => a + b
```
{% endtab %}
{% endtabs %}

That code consists of the type signature:

````
val f: (Int, Int) => Int = (a, b) => a + b
       -----------------
````

The input parameters:

````
val f: (Int, Int) => Int = (a, b) => a + b
                           ------
````

and the body of the function:

````
val f: (Int, Int) => Int = (a, b) => a + b
                                     -----
````

Scala’s consistency is shown here, where this function type:

````
val f: (Int, Int) => Int = (a, b) => a + b
       -----------------
````

is the same as the type signature you use to define a function input parameter:

````
def executeAndPrint(f: (Int, Int) => Int, ...
                       -----------------
````

Once you’re comfortable with this syntax, you’ll use it to define function parameters, anonymous functions, and function variables, and it becomes easier to read the Scaladoc for higher-order functions.



[eta_expansion]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
