---
title: Functional Error Handling
type: section
description: This section provides an introduction to functional error handling in Scala 3.
num: 45
previous-page: fp-functions-are-values
next-page: fp-summary
---



Functional programming is like writing a series of algebraic equations, and because algebra doesn’t have null values or throw exceptions, you don’t use these features in FP.
This brings up an interesting question: In the situations where you might normally use a null value or exception in OOP code, what do you do?

Scala’s solution is to use constructs like the `Option`/`Some`/`None` classes.
This lesson provides an introduction to using these techniques.

Two notes before we jump in:

- The `Some` and `None` classes are subclasses of `Option`.
- Instead of repeatedly saying “`Option`/`Some`/`None`,” the following text generally just refers to “`Option`” or “the `Option` classes.”



## A first example

While this first example doesn’t deal with null values, it’s a good way to introduce the `Option` classes, so we’ll start with it.

Imagine that you want to write a method that makes it easy to convert strings to integer values, and you want an elegant way to handle the exception that’s thrown when your method gets a string like `"Hello"` instead of `"1"`.
A first guess at such a method might look like this:

```scala
def makeInt(s: String): Int =
  try
    Integer.parseInt(s.trim)
  catch
    case e: Exception => 0
```

If the conversion works, this method returns the correct `Int` value, but if it fails, the method returns `0`.
This might be okay for some purposes, but it’s not really accurate.
For instance, the method might have received `"0"`, but it may have also received `"foo"`, `"bar"`, or an infinite number of other strings that will throw an exception.
This is a real problem: How do you know when the method really received a `"0"`, or when it received something else?
The answer is that with this approach, there’s no way to know.



## Using Option/Some/None

A common solution to this problem in Scala is to use a trio of classes known as `Option`, `Some`, and `None`.
The `Some` and `None` classes are subclasses of `Option`, so the solution works like this:

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

This code can be read as, “When the given string converts to an integer, return the `Int` wrapped inside a `Some`, such as `Some(1)`.
When the string can’t be converted to an integer, an exception is thrown and caught, and the method returns a `None` value.”

These examples show how `makeInt` works:

```scala
val a = makeInt("1")     // Some(1)
val b = makeInt("one")   // None
```

As shown, the string `"1"` results in a `Some(1)`, and the string `"one"` results in a `None`.
This is the essence of the `Option` approach to error handling.
As shown, this technique is used so methods can return *values* instead of *exceptions*.
In other situations, `Option` values are also used to replace `null` values.

Two notes:

- You’ll find this approach used throughout Scala library classes, and in third-party Scala libraries.
- A key point of this example is that functional methods don’t throw exceptions; instead they return values like `Option`.



## Being a consumer of makeInt

Now imagine that you’re a consumer of the `makeInt` method.
You know that it returns a subclass of `Option[Int]`, so the question becomes, how do you work with these return types?

There are two common answers, depending on your needs:

- Use a `match` expression
- Use a `for` expression

## Using a `match` expression

One possible solution is to use a `match` expression:

```scala
makeInt(x) match
  case Some(i) => println(i)
  case None => println("That didn’t work.")
```

In this example, if `x` can be converted to an `Int`, the first `case` statement is executed; if `x` can’t be converted to an `Int`, the second `case` statement is executed.



## Using a `for` expression

Another common solution is to use a `for` expression---i.e., the `for`/`yield` combination that was shown earlier in this book.
For instance, imagine that you want to convert three strings to integer values, and then add them together.
This is how you do that with a `for` expression and `makeInt`:

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

To see the failure case, change any of those strings to something that won’t convert to an integer.
When you do that, you’ll see that `y` is a `None`:

```scala
y: Option[Int] = None
```


## Thinking of Option as a container

Mental models can often help us understand new situations, so if you’re not familiar with the `Option` classes, one way to think about them is as a *container*:

- `Some` is a container with one item in it
- `None` is a container, but it has nothing in it

If you prefer to think of the `Option` classes as being like a box, `None` is like an empty box.
It could have had something in it, but it doesn’t.


{% comment %}
NOTE: I commented-out this subsection because it continues to explain Some and None, and I thought it was probably too much for this book.



## Using `foreach` with `Option`

Because `Some` and `None` can be thought of containers, they’re also like collections classes.
They have many of the methods you’d expect from a collection class, including `map`, `filter`, `foreach`, etc.

This raises an interesting question: What will these two values print, if anything?

```scala
makeInt("1").foreach(println)
makeInt("x").foreach(println)
```

Answer: The first example prints the number `1`, and the second example doesn’t print anything.
The first example prints `1` because:

- `makeInt("1")` evaluates to `Some(1)`
- The expression becomes `Some(1).foreach(println)`
- The `foreach` method on the `Some` class knows how to reach inside the `Some` container and extract the value (`1`) that’s inside it, so it passes that value to `println`

Similarly, the second example prints nothing because:

- `makeInt("x")` evaluates to `None`
- The `foreach` method on the `None` class knows that `None` doesn’t contain anything, so it does nothing

In this regard, `None` is similar to an empty `List`.


### The happy and unhappy paths

Somewhere in Scala’s history, someone noted that the first example (the `Some`) represents the “Happy Path” of the `Option` approach, and the second example (the `None`) represents the “Unhappy Path.”
*But* despite having two different possible outcomes, the great thing with `Option` is that there’s really just one path: The code you write to handle the `Some` and `None` possibilities is the same in both cases.
The `foreach` examples look like this:

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

> There are several other ways to handle `Option` values.
> See the reference documentation for more details.
{% endcomment %}



## Using `Option` to replace `null`

Getting back to `null` values, a place where a `null` value can silently creep into your code is with a class like this:

```scala
class Address:
  var street1: String,
  var street2: String,
  var city: String, 
  var state: String, 
  var zip: String
```

While every address on Earth has a `street1` value, the `street2` value is optional.
As a result, the `street2` field can be assigned a `null` value:

```scala
val santa = new Address(
  "1 Main Street",
  null,               // <-- D’oh! A null value!
  "North Pole",
  "Alaska",
  "99705"
)
```

Historically, developers have used blank strings and null values in this situation, both of which are hacks to work around the root problem: `street2` is an *optional* field.
In Scala---and other modern languages---the correct solution is to declare up front that `street2` is optional:

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



## `Option` isn’t the only solution

While this section focuses on the `Option` classes, Scala has a few other alternatives.

For example, a trio of classes known as `Try`/`Success`/`Failure` work in the same manner, but (a) you primarily use these classes when your code can throw exceptions, and (b) you want to use the `Failure` class because it gives you access to the exception message.
For example, these `Try` classes are commonly used when writing methods that interact with files, databases, and internet services, as those functions can easily throw exceptions.



## A quick review

This section was long, so let’s give it a quick review:

- Functional programmers don’t use `null` values
- A main replacement for `null` values is to use the `Option` classes
- Functional methods don’t throw exceptions; instead they return values like `Option`, `Try`, or `Either`
- Common ways to work with `Option` values are `match` and `for` expressions
- Options can be thought of as containers of one item (`Some`) and no items (`None`)
- Options can also be used for optional constructor or method parameters


