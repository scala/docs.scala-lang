---
title: Functional Programming
type: chapter
description: This section provides an introduction to functional programming in Scala 3.
num: 27
previous-page: collections-summary
next-page: types-introduction
---


Scala lets you write code in an object-oriented programming (OOP) style, a functional programming (FP) style, and also in a hybrid style — using both approaches in combination. [As Martin Odersky has stated](https://twitter.com/alexelcu/status/996408359514525696), the essence of Scala is a fusion of functional and object-oriented programming in a typed setting:

- Functions for the logic
- Objects for the modularity

This chapter assumes that you’re comfortable with OOP and less comfortable with FP, so it provides a gentle introduction to several main functional programming concepts:

- What is functional programming?
- Immutable values
- Pure functions
- Functions are values
- Functional error handling



## What is functional programming?

[Wikipedia defines *functional programming*](https://en.wikipedia.org/wiki/Functional_programming) like this:

>Functional programming is a programming paradigm where programs are constructed by applying and composing functions. It is a declarative programming paradigm in which function definitions are trees of expressions that each return a value, rather than a sequence of imperative statements which change the state of the program.
>In functional programming, functions are treated as first-class citizens, meaning that they can be bound to names (including local identifiers), passed as arguments, and returned from other functions, just as any other data type can. This allows programs to be written in a declarative and composable style, where small functions are combined in a modular manner. 

It can also be helpful to know that experienced functional programmers have a strong desire to see their code as math, that combining pure functions together is like combining a series of algebraic equations. When you write functional code you feel like a mathematician, and once you understand the paradigm, you want to write pure functions that always return *values* — not exceptions or null values — so you can combine (compose) them together to create solutions. The feeling that you’re writing math-like equations (expressions) is the driving desire that leads you to use *only* pure functions and immutable values, because that’s what you use in algebra and other forms of math.

Functional programming is a large topic, and there’s no simple way to condense the entire topic into one chapter, but hopefully the following section will provide an overview of the main topics, and show some of the tools Scala provides for writing functional code.



## Immutable values

In pure functional programming, only immutable values are used. In Scala this means:

- All variables are created as `val` fields
- Only immutable collections classes are used, such as `List`, `Vector`, and the immutable `Map` and `Set` classes

Using only immutable variables raises an interesting question: If everything is immutable, how does anything ever change?

When it comes to using collections, one answer is that you don’t mutate an existing collection; instead, you apply a function to an existing collection to create a new collection. This is where higher-order functions like `map` and `filter` come in.

<!-- TODO: a better example -->
For example, imagine that you have a list of names — a `List[String]` — that are all in lowercase, and you want to find all the names that begin with the letter `"j"`, and then you want to capitalize those names. In FP you write this code:

```scala
val a = List("jane", "jon", "mary", "joe")
val b = a.filter(_.startsWith("j"))
         .map(_.capitalize)
```

As shown, you don’t mutate the original list `a`. Instead, you apply filtering and transformation functions to `a` to create a new collection, and assign that result to the new immutable variable `b`.

Similarly, in FP you don’t create classes with mutable `var` constructor parameters. That is, you don’t write this:

```scala
// don’t do this in FP
class Person(var firstName: String, var lastName: String)
             ---                    ---
```

Instead, you typically create `case` classes, whose constructor parameters are `val` by default:

```scala
case class Person(firstName: String, lastName: String)
```

Now you create a `Person` instance as a `val` field:

```scala
val reginald = Person("Reginald", "Dwight")
```

Then, when you need to make a change to the data, you use the `copy` method that comes with a `case` class to “update the data as you make a copy,” like this:

```scala
val elton = p.copy(
  firstName = "Elton",   // update the first name
  lastName = "John"      // update the last name
)
```

There are other techniques for working with immutable collections and variables, but hopefully these examples give you a taste of the techniques.

<!-- TODO: link -->
>Depending on your needs, you may create enums, traits, or classes instead of `case` classes. See the Data Modeling chapter for more details.




## Pure functions

<!-- TODO: use someone else’s definition? -->
Another feature that Scala offers to help you write functional code is the ability to write pure functions. In his book, *Functional Programming, Simplified*, Alvin Alexander defines a *pure function* like this:

- A function’s output depends *only* on its input variables and its internal algorithm
- It doesn’t mutate any hidden state
- It doesn’t have any “back doors”: It doesn’t read data from the outside world (including the console, web services, databases, files, etc.), or write data to the outside world

As a result of this definition, any time you call a pure function with the same input value(s), you’ll always get the same result. For example, you can call a `double` function an infinite number of times with the input value `2`, and you’ll always get the result `4`.


### Examples of pure functions

Given that definition, as you can imagine, methods like these in the *scala.math._* package are pure functions:

- `abs`
- `ceil`
- `max`

These `String` methods are also pure functions:

- `isEmpty`
- `length`
- `substring`

Most methods on the Scala collections classes also work as pure functions, including `drop`, `filter`, `map`, and many more.

<!-- TODO: link to the “method vs function” discussion -->
>In Scala, *functions* and *methods* are almost completely interchangeable, so even though we use the common industry term “pure function,” this term can be used to describe both functions and methods.


### Examples of impure functions

Conversely, the following functions are *impure* because they violate the definition.

The `foreach` method on collections classes is impure because it’s only used for its side effects, such as printing to STDOUT.

>A great hint that `foreach` is impure is that it’s method signature declares that it returns the type `Unit`. Because it doesn’t return anything, logically the only reason you ever call it is to achieve some side effect. Similarly, *any* method that returns `Unit` is going to be an impure function.

Date and time related methods like `getDayOfWeek`, `getHour`, and `getMinute` are all impure because their output depends on something other than their input parameters. Their results rely on some form of hidden I/O; *hidden inputs,* in these examples.

Additionally, methods that interact with the console, files, databases, web services, sensors, etc., are all impure.

In general, impure functions do one or more of these things:

- Read hidden inputs, i.e., they access variables and data not explicitly passed into the function as input parameters
- Write hidden outputs
- Mutate the parameters they’re given, or mutate hidden variables, such as fields in their containing class
- Perform some sort of I/O with the outside world


### But impure functions are needed ...

Of course an application isn’t very useful if it can’t read or write to the outside world, so people make this recommendation:

>Write the core of your application using pure functions, and then write an impure “wrapper” around that core to interact with the outside world. As someone once said, this is like putting a layer of impure icing on top of a pure cake.

It’s important to note that there are ways to make impure interactions with the outside world feel more pure. For instance, you’ll hear about using an `IO` Monad to deal with input and output. These topics are beyond the scope of this document, so to keep things simple it can help to think that FP applications have a core of pure functions that are wrapped with other functions to interact with the outside world.


### Writing pure functions

**Note**: In this section the common industry term “pure function” is often used to refer to Scala methods.

To write pure functions in Scala, just write them using Scala’s method syntax (though you can also use Scala’s function syntax, as well). For instance, here’s a pure function that doubles the input value it’s given:

```scala
def double(i: Int): Int = i * 2
```

If you’re comfortable with recursion, here’s a pure function that calculates the sum of a list of integers:

```scala
def sum(xs: List[Int]): Int = xs match
  case Nil => 0
  case head :: tail => head + sum(tail)
```

If you understand that code, you’ll see that it meets the pure function definition.


### Key points

The first key point of this section is the definition of a pure function:

>A *pure function* is a function that depends only on its declared inputs and its internal algorithm to produce its output. It does not read any other values from “the outside world” — the world outside of the function’s scope — and it doesn’t modify any values in the outside world.

A second key point is that every real-world application interacts with the outside world. Therefore, a simplified way to think about functional programs is that they consist of a core of pure functions that are wrapped with other functions that interact with the outside world.




## Functions are values

While every programming language ever created probably lets you write pure functions, a second important Scala FP feature is that *you can create functions as values*, just like you create `String` and `Int` values.

This feature has many benefits, the most common of which are (a) you can define methods to accept function parameters, and (b) you can pass functions as parameters into methods. You’ve seen this in multiple places in this book, whenever methods like `map` and `filter` are demonstrated:

```scala
val nums = (1 to 10).toList

val doubles = nums.map(_ * 2)           // double each value
val lessThanFive = nums.filter(_ < 5)   // List(1,2,3,4)
```

In those examples, anonymous functions are passed into `map` and `filter`.

>Anonymous functions are also known as *lambdas*.

In addition to passing anonymous functions into `filter` and `map`, you can also supply them with *methods*:

```scala
// two methods
def double(i: Int): Int = i * 2
def underFive(i: Int): Boolean = i < 5

// pass those methods into filter and map
val doubles = nums.filter(underFive).map(double)
```

This ability to treat methods and functions as values is a powerful feature that functional programming languages provide.

>Technically, a a function that takes another function as an input parameter is known as a *Higher-Order Function*. (If you like humor, as someone once wrote, that’s like saying that a class that takes an instance of another class as a constructor parameter is a Higher-Order Class.)


### Functions, anonymous functions, and methods

As you saw in those examples, this is an anonymous function:

```scala
_ * 2
```

<!-- TODO: link to HOF discussion -->
As shown in the higher-order functions discussion, that’s a shorthand version of this syntax:

```scala
(i: Int) => i * 2
```

Functions like these are called “anonymous” because they don’t have names. If you want to give one a name, just assign it to a variable:

```scala
val double = (i: Int) => i * 2
```

Now you have a named function, one that’s assigned to a variable. You can use this function just like you use a method:

```scala
double(2)   // 4
```

In most scenarios it doesn’t matter if `double` is a function or a method; Scala lets you treat them the same way. Behind the scenes, the Scala technology that lets you treat methods just like functions is known as [Eta Expansion](TODO:LINK).

This ability to seamlessly pass functions around as variables is a distinguishing feature of functional programming languages like Scala. And as you’ve seen in the `map` and `filter` examples throughout this book, the ability to pass functions into other functions helps you create code that is concise and still readable — *expressive*.

If you’re not comfortable with the process of passing functions as parameters into other functions, here are a few more examples you can experiment with:

```scala
List("foo", "bar").map(_.toUpperCase)
List("foo", "bar").map(_.capitalize)
List("adam", "scott").map(_.length)
List(1,2,3,4,5).map(_ * 10)
List(1,2,3,4,5).filter(_ > 2)
List(5,1,3,11,7).takeWhile(_ < 6)
```




## Functional error handling

Functional programming is like writing a series of algebraic equations, and because algebra doesn’t have null values or throw exceptions, you don’t use these features in FP. This brings up an interesting question: In the situations where you might normally use a null value or exception in OOP code, what do you do?

Scala’s solution is to use constructs like the `Option`/`Some`/`None` classes. This lesson provides an introduction to using these techniques.

Two notes before we jump in:

- The `Some` and `None` classes are subclasses of `Option`.
- Instead of repeatedly saying “`Option`/`Some`/`None`,” the following text generally just refers to “`Option`” or “the `Option` classes.”


### A first example

While this first example doesn’t deal with null values, it’s a good way to introduce the `Option` classes, so we’ll start with it.

Imagine that you want to write a method that makes it easy to convert strings to integer values, and you want an elegant way to handle the exception that’s thrown when your method gets a string like `"Hello"` instead of `"1"`. A first guess at such a method might look like this:

```scala
def makeInt(s: String): Int =
  try
    Integer.parseInt(s.trim)
  catch
    case e: Exception => 0
```

If the conversion works, this method returns the correct `Int` value, but if it fails, the method returns `0`. This might be okay for some purposes, but it’s not really accurate. For instance, the method might have received `"0"`, but it may have also received `"foo"`, `"bar"`, or an infinite number of other strings that will throw an exception. This is a real problem: How do you know when the method really received a `"0"`, or when it received something else? The answer is that with this approach, there’s no way to know.


### Using Option/Some/None

A common solution to this problem in Scala is to use a trio of classes known as `Option`, `Some`, and `None`. The `Some` and `None` classes are subclasses of `Option`, so the solution works like this:

- You declare that `makeInt` returns an `Option` type
- If `makeInt` receives a string it *can* convert to an `Int`, the answer is wrapped inside a `Some`
- If `makeInt` receives a string it *can’t* convert, it returns a `None`

Here’s the revised version of `makeInt`:

```scala
def makeInt(s: String): Option[Int] =
  try
    Some(Integer.parseInt(s.trim))
  catch
    case e: Exception => None
```

This code can be read as, “When the given string converts to an integer, return the `Int` wrapped inside a `Some`, such as `Some(1)`. When the string can’t be converted to an integer, an exception is thrown and caught, and the method returns a `None` value.”

These examples show how `makeInt` works:

```scala
val a = makeInt("1")     // Some(1)
val b = makeInt("one")   // None
```

As shown, the string `"1"` results in a `Some(1)`, and the string `"one"` results in a `None`. This is the essence of the `Option` approach to error handling. As shown, this technique is used so methods can return *values* instead of *exceptions*. In other situations, `Option` values are also used to replace `null` values.

Two notes:

- You’ll find this approach used throughout Scala library classes, and in third-party Scala libraries.
- A key point of this example is that functional methods don’t throw exceptions; instead they return values like `Option`.


### Being a consumer of makeInt

Now imagine that you’re a consumer of the `makeInt` method. You know that it returns a subclass of `Option[Int]`, so the question becomes, how do you work with these return types?

There are two common answers, depending on your needs:

- Use a `match` expression
- Use a `for` expression

<!-- TODO: link -->
>There are other approaches that can be used. See the Reference documentation for details on those approaches.


### Using a `match` expression

One possible solution is to use a `match` expression:

```scala
makeInt(x) match
  case Some(i) => println(i)
  case None => println("That didn’t work.")
```

In this example, if `x` can be converted to an `Int`, the first `case` statement is executed; if `x` can’t be converted to an `Int`, the second `case` statement is executed.


### Using a `for` expression

Another common solution is to use a `for` expression — i.e., the `for`/`yield` combination that was shown earlier in this book. For instance, imagine that you want to convert three strings to integer values, and then add them together. This is how you do that with a `for` expression and `makeInt`:

```scala
val y = for
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```

After that expression runs, `y` will be one of two things:

- If *all* three strings convert to `Int` values, `y` will be a `Some[Int]`, i.e., an integer wrapped inside a `Some`
- If *any* of the three strings can’t be converted to an `Int`, `y` will be a `None`

You can test this for yourself:

```scala
val stringA = "1"
val stringB = "2"
val stringC = "3"

val y = for {
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```

With that sample data, the variable `y` will have the value `Some(6)`.

To see the failure case, change any of those strings to something that won’t convert to an integer. When you do that, you’ll see that `y` is a `None`:

```scala
y: Option[Int] = None
```

### Thinking of Option as a container

Mental models can often help us understand new situations, so if you’re not familiar with the `Option` classes, one way to think about them is as a *container*:

- `Some` is a container with one item in it
- `None` is a container, but it has nothing in it

If you prefer to think of the `Option` classes as being like a box, `None` is like an empty box. It could have had something in it, but it doesn’t.


{% comment %}
NOTE: I commented-out this subsection because it continues to explain Some and None, and I thought it was probably too much for this book.

### Using `foreach` with `Option`

Because `Some` and `None` can be thought of containers, they’re also like collections classes. They have many of the methods you’d expect from a collection class, including `map`, `filter`, `foreach`, etc.

This raises an interesting question: What will these two values print, if anything?

```scala
makeInt("1").foreach(println)
makeInt("x").foreach(println)
```

Answer: The first example prints the number `1`, and the second example doesn’t print anything. The first example prints `1` because:

- `makeInt("1")` evaluates to `Some(1)`
- The expression becomes `Some(1).foreach(println)`
- The `foreach` method on the `Some` class knows how to reach inside the `Some` container and extract the value (`1`) that’s inside it, so it passes that value to `println`

Similarly, the second example prints nothing because:

- `makeInt("x")` evaluates to `None`
- The `foreach` method on the `None` class knows that `None` doesn’t contain anything, so it does nothing

In this regard, `None` is similar to an empty `List`.

#### The happy and unhappy paths

Somewhere in Scala’s history, someone noted that the first example (the `Some`) represents the “Happy Path” of the `Option` approach, and the second example (the `None`) represents the “Unhappy Path.” *But* despite having two different possible outcomes, the great thing with `Option` is that there’s really just one path: The code you write to handle the `Some` and `None` possibilities is the same in both cases. The `foreach` examples look like this:

```scala
makeInt(aString).foreach(println)
```

And the `for` expression looks like this:

```scala
val y = for
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```

With exceptions you have to worry about handling branching logic, but because `makeInt` returns a value, you only have to write one piece of code to handle both the Happy and Unhappy Paths, and that simplifies your code.

Indeed, the only time you have to think about whether the `Option` is a `Some` or a `None` is when you handle the result value, such as in a `match` expression:

```scala
makeInt(x) match
  case Some(i) => println(i)
  case None => println("That didn't work.")
```

>There are several other ways to handle `Option` values. See the Reference documentation for more details.
{% endcomment %}



### Using `Option` to replace `null` values

Getting back to `null` values, a place where a `null` value can silently creep into your code is with a class like this:

```scala
class Address:
  var street1: String,
  var street2: String,
  var city: String, 
  var state: String, 
  var zip: String
```

While every address on Earth has a `street1` value, the `street2` value is optional. As a result, the `street2` field can be assigned a `null` value:

```scala
val santa = new Address(
  "1 Main Street",
  null,               // <-- D’oh! A null value!
  "North Pole",
  "Alaska",
  "99705"
)
```

Historically, developers have used blank strings and null values in this situation, both of which are hacks to work around the root problem: `street2` is an *optional* field. In Scala — and other modern languages — the correct solution is to declare up front that `street2` is optional:

```scala
class Address:
  var street1: String,
  var street2: Option[String],   // an optional value
  var city: String, 
  var state: String, 
  var zip: String
```

Now developers can write more accurate code like this:

```scala
val santa = new Address(
  "1 Main Street",
  None,           // 'street2' has no value
  "North Pole",
  "Alaska",
  "99705"
)
```

or this:

```scala
val santa = new Address(
  "123 Main Street",
  Some("Apt. 2B"),
  "Talkeetna",
  "Alaska",
  "99676"
)
```


### `Option` isn’t the only solution

While this section focuses on the `Option` classes, Scala has a few other alternatives. 

For example, a trio of classes known as `Try`/`Success`/`Failure` work in the same manner, but (a) you primarily use these classes when your code can throw exceptions, and (b) you want to use the `Failure` class because it gives you access to the exception message. For example, these `Try` classes are commonly used when writing methods that interact with files, databases, and internet services, as those functions can easily throw exceptions.

You can learn more about the `Try` classes and the similar `Either`/`Right`/`Left` classes in the Reference documentation.


### A quick review

This section was long, so let’s give it a quick review:

- Functional programmers don’t use `null` values
- A main replacement for `null` values is to use the `Option` classes
- Functional methods don’t throw exceptions; instead they return values like `Option`, `Try`, or `Either`
- Common ways to work with `Option` values are `match` and `for` expressions
- Options can be thought of as containers of one item (`Some`) and no items (`None`)
- Options can also be used for optional constructor or method parameters



## Summary

This chapter provides a high-level introduction to functional programming in Scala. The topics covered are:

- What is functional programming?
- Immutable values
- Pure functions
- Functions are values
- Functional error handling

As mentioned, functional programming is a big topic, so all we can do in this book is to touch on these introductory concepts. See the [Reference documentation][reference] for more details.



[reference]: {{ site.scala3ref }}/overview.html
