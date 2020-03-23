---
type: section
layout: multipage-overview
title: No Null Values
description: This lesson demonstrates the Scala Option, Some, and None classes, including how to use them instead of null values.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 47
outof: 54
previous-page: passing-functions-around
next-page: companion-objects
---



Functional programming is like writing a series of algebraic equations, and because you don’t use null values in algebra, you don’t use null values in FP. That brings up an interesting question: In the situations where you might normally use a null value in Java/OOP code, what do you do?

Scala’s solution is to use constructs like the Option/Some/None classes. We’ll provide an introduction to the techniques in this lesson.



## A first example

While this first Option/Some/None example doesn’t deal with null values, it’s a good way to demonstrate the Option/Some/None classes, so we’ll start with it.

Imagine that you want to write a method to make it easy to convert strings to integer values, and you want an elegant way to handle the exceptions that can be thrown when your method gets a string like `"foo"` instead of something that converts to a number, like `"1"`. A first guess at such a function might look like this:

```scala
def toInt(s: String): Int = {
    try {
        Integer.parseInt(s.trim)
    } catch {
        case e: Exception => 0
    }
}
```

The idea of this function is that if a string converts to an integer, you return the converted `Int`, but if the conversion fails you return 0. This might be okay for some purposes, but it’s not really accurate. For instance, the method might have received `"0"`, but it may have also received `"foo"` or `"bar"` or an infinite number of other strings. This creates a real problem: How do you know when the method really received a `"0"`, or when it received something else? The answer is that with this approach, there’s no way to know.



## Using Option/Some/None

Scala’s solution to this problem is to use a trio of classes known as `Option`, `Some`, and `None`. The `Some` and `None` classes are subclasses of `Option`, so the solution works like this:

- You declare that `toInt` returns an `Option` type
- If `toInt` receives a string it *can* convert to an `Int`, you wrap the `Int` inside of a `Some`
- If `toInt` receives a string it *can’t* convert, it returns a `None`

The implementation of the solution looks like this:

```scala
def toInt(s: String): Option[Int] = {
    try {
        Some(Integer.parseInt(s.trim))
    } catch {
        case e: Exception => None
    }
}
```

This code can be read as, “When the given string converts to an integer, return the integer wrapped in a `Some` wrapper, such as `Some(1)`. When the string can’t be converted to an integer, return a `None` value.”

Here are two REPL examples that demonstrate `toInt` in action:

```scala
scala> val a = toInt("1")
a: Option[Int] = Some(1)

scala> val a = toInt("foo")
a: Option[Int] = None
```

As shown, the string `"1"` converts to `Some(1)`, and the string `"foo"` converts to `None`. This is the essence of the Option/Some/None approach. It’s used to handle exceptions (as in this example), and the same technique works for handling null values.

>You’ll find this approach used throughout Scala library classes, and in third-party Scala libraries.



## Being a consumer of toInt

Now imagine that you’re a consumer of the `toInt` method. You know that the method returns a subclass of `Option[Int]`, so the question becomes, how do you work with these return types?

There are two main answers, depending on your needs:

- Use a `match` expression
- Use a for-expression

>There are other approaches, but these are the two main approaches, especially from an FP standpoint.



### Using a match expression

One possibility is to use a `match` expression, which looks like this:

```scala
toInt(x) match {
    case Some(i) => println(i)
    case None => println("That didn't work.")
}
```

In this example, if `x` can be converted to an `Int`, the first `case` statement is executed; if `x` can’t be converted to an `Int`, the second `case` statement is executed.


### Using for/yield

Another common solution is to use a for-expression — i.e., the for/yield combination that was shown earlier in this book. To demonstrate this, imagine that you want to convert three strings to integer values, and then add them together. The for/yield solution looks like this:

```scala
val y = for {
    a <- toInt(stringA)
    b <- toInt(stringB)
    c <- toInt(stringC)
} yield a + b + c
```

When that expression finishes running, `y` will be one of two things:

- If all three strings convert to integers, `y` will be a `Some[Int]`, i.e., an integer wrapped inside a `Some`
- If any of the three strings can’t be converted to an inside, `y` will be a `None`

You can test this for yourself in the Scala REPL. First, paste these three string variables into the REPL:

```scala
val stringA = "1"
val stringB = "2"
val stringC = "3"
```

Next, paste the for-expression into the REPL. When you do that, you’ll see this result:

```scala
scala> val y = for {
     |     a <- toInt(stringA)
     |     b <- toInt(stringB)
     |     c <- toInt(stringC)
     | } yield a + b + c
y: Option[Int] = Some(6)
```

As shown, `y` is bound to the value `Some(6)`.

To see the failure case, change any of those strings to something that won’t convert to an integer. When you do that, you’ll see that `y` is a `None`:

```scala
y: Option[Int] = None
```



## Options can be thought of as a container of 0 or 1 items

One good way to think about the `Option` classes is that they represent a *container*, more specifically a container that has either zero or one item inside:

- `Some` is a container with one item in it
- `None` is a container, but it has nothing in it

>If you prefer to think of the Option classes as being like a box, `None` is a little like getting an empty box for a birthday gift.



## Using foreach

Because `Some` and `None` can be thought of containers, they can be further thought of as being like collections classes. As a result, they have all of the methods you’d expect from a collection class, including `map`, `filter`, `foreach`, etc.

This raises an interesting question: What will these two values print, if anything?

```scala
toInt("1").foreach(println)
toInt("x").foreach(println)
```

The answer is that the first example prints the number `1`, and the second example doesn’t print anything. The first example prints `1` because:

- toInt("1") evaluates to `Some(1)`
- The expression evaluates to `Some(1).foreach(println)`
- The `foreach` method on the `Some` class knows how to reach inside the `Some` container and extract the value (`1`) that’s inside it, so it passes that value to `println`

Similarly, the second example prints nothing because:

- `toInt("x")` evaluates to `None`
- The `foreach` method on the `None` class knows that `None` doesn’t contain anything, so it does nothing

>Again, `None` is just an empty container.

Somewhere in Scala’s history, someone noted that the first example (the `Some`) represents the “Happy Path” of Option/Some/None approach, and the second example (the `None`) represents the “Unhappy Path.” *But*, despite having two different possible outcomes, the cool thing about the approach is that the code you write to handle an `Option` looks exactly the same in both cases. The `foreach` examples look like this:

```scala
toInt("1").foreach(println)
toInt("x").foreach(println)
```

And the for-expression looks like this:

```scala
val y = for {
    a <- toInt(stringA)
    b <- toInt(stringB)
    c <- toInt(stringC)
} yield a + b + c
```

You only have to write one piece of code to handle both the Happy and Unhappy Paths, and that simplifies your code. The only time you have to think about whether you got a `Some` or a `None` is when you finally handle the result value in a `match` expression, like this:

```scala
toInt(x) match {
    case Some(i) => println(i)
    case None => println("That didn't work.")
}
```



## Using Option to replace null values

Another place where a null value can silently creep into your code is with a class like this:

```scala
class Address (
    var street1: String,
    var street2: String,
    var city: String, 
    var state: String, 
    var zip: String
)
```

While every address on Earth has a `street1` value, the `street2` value is optional. As a result, that class is subject to this type of abuse:

```scala
val santa = new Address(
    "1 Main Street",
    null,               // <-- D'oh! A null value!
    "North Pole",
    "Alaska",
    "99705"
)
```

To handle situations like this, developers tend to use null values or empty strings, both of which are hacks to work around the main problem: `street2` is an *optional* field. In Scala — and other modern languages — the correct solution is to declare up front that `street2` is optional:

```scala
class Address (
    var street1: String,
    var street2: Option[String],
    var city: String, 
    var state: String, 
    var zip: String
)
```

With that definition, developers can write more accurate code like this:

```scala
val santa = new Address(
    "1 Main Street",
    None,
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

Once you have an optional field like this, you work with it as shown in the previous examples: With `match` expressions, `for` expressions, and other built-in methods like `foreach`.



## Option isn’t the only solution

This lesson focused on the Option/Some/None solution, but Scala has a few other alternatives. For example, a trio of classes known as Try/Success/Failure work in the same manner, but a) you primarily use these classes when code can throw exceptions, and b) the `Failure` class gives you access to the exception message. For example, Try/Success/Failure is commonly used when writing methods that interact with files, databases, and internet services, as those functions can easily throw exceptions. These classes are demonstrated in the Functional Error Handling lesson that follows.



## Key points

This lesson was a little longer than the others, so here’s a quick review of the key points:

- Functional programmers don’t use null values
- A main replacement for null values is to use the Option/Some/None classes
- Common ways to work with Option values are `match` and `for` expressions
- Options can be thought of as containers of one item (`Some`) and no items (`None`)
- You can also use Options when defining constructor parameters



## See also

- Tony Hoare invented the null reference in 1965, and refers to it as his “[billion dollar mistake](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).”







