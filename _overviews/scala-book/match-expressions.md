---
type: section
layout: multipage-overview
title: match Expressions
description: This page shows examples of the Scala 'match' expression, including how to write match/case expressions.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 17
outof: 54
previous-page: for-expressions
next-page: try-catch-finally
---


Scala has a concept of a `match` expression. In the most simple case you can use a `match` expression like a Java `switch` statement:

```scala
// i is an integer
i match {
    case 1  => println("January")
    case 2  => println("February")
    case 3  => println("March")
    case 4  => println("April")
    case 5  => println("May")
    case 6  => println("June")
    case 7  => println("July")
    case 8  => println("August")
    case 9  => println("September")
    case 10 => println("October")
    case 11 => println("November")
    case 12 => println("December")
    // catch the default with a variable so you can print it
    case _  => println("Invalid month")
}
```

As shown, with a `match` expression you write a number of `case` statements that you use to match possible values. In this example we match the integer values `1` through `12`. Any other value falls down to the `_` case, which is the catch-all, default case.

`match` expressions are nice because they also return values, so rather than directly printing a string as in that example, you can assign the string result to a new value:

```scala
val monthName = i match {
    case 1  => "January"
    case 2  => "February"
    case 3  => "March"
    case 4  => "April"
    case 5  => "May"
    case 6  => "June"
    case 7  => "July"
    case 8  => "August"
    case 9  => "September"
    case 10 => "October"
    case 11 => "November"
    case 12 => "December"
    case _  => "Invalid month"
}
```

Using a `match` expression to yield a result like this is a common use.



## Aside: A quick look at Scala methods

Scala also makes it easy to use a `match` expression as the body of a method. We haven’t shown how to write Scala methods yet, so as a brief introduction, here’s a method named `convertBooleanToStringMessage` that takes a `Boolean` value and returns a `String`:

```scala
def convertBooleanToStringMessage(bool: Boolean): String = {
    if (bool) "true" else "false"        
}
```

Hopefully you can see how that method works, even though we won’t go into its details. These examples show how it works when you give it the `Boolean` values `true` and `false`:

```scala
scala> val answer = convertBooleanToStringMessage(true)
answer: String = true

scala> val answer = convertBooleanToStringMessage(false)
answer: String = false
```



## Using a `match` expression as the body of a method

Now that you’ve seen an example of a Scala method, here’s a second example that works just like the previous one, taking a `Boolean` value as an input parameter and returning a `String` message. The big difference is that this method uses a `match` expression for the body of the method:

```scala
def convertBooleanToStringMessage(bool: Boolean): String = bool match {
    case true => "you said true"
    case false => "you said false"
}
```

The body of that method is just two `case` statements, one that matches `true` and another that matches `false`. Because those are the only possible `Boolean` values, there’s no need for a default `case` statement.

This is how you call that method and then print its result:

```scala
val result = convertBooleanToStringMessage(true)
println(result)
```

Using a `match` expression as the body of a method is also a common use.



## Handling alternate cases

`match` expressions are extremely powerful, and we’ll demonstrate a few other things you can do with them.

`match` expressions let you handle multiple cases in a single `case` statement. To demonstrate this, imagine that you want to evaluate “boolean equality” like the Perl programming language handles it: a `0` or a blank string evaluates to false, and anything else evaluates to true. This is how you write a method using a `match` expression that evaluates to true and false in the manner described:

```scala
def isTrue(a: Any) = a match {
    case 0 | "" => false
    case _ => true
}
```

Because the input parameter `a` is defined to be the `Any` type — which is the root of all Scala classes, like `Object` in Java — this method works with any data type that’s passed in:

```scala
scala> isTrue(0)
res0: Boolean = false

scala> isTrue("")
res1: Boolean = false

scala> isTrue(1.1F)
res2: Boolean = true

scala> isTrue(new java.io.File("/etc/passwd"))
res3: Boolean = true
```

The key part of this solution is that this one `case` statement lets both `0` and the empty string evaluate to `false`:

```scala
case 0 | "" => false
```

Before we move on, here’s another example that shows many matches in each `case` statement:

```scala
val evenOrOdd = i match {
    case 1 | 3 | 5 | 7 | 9 => println("odd")
    case 2 | 4 | 6 | 8 | 10 => println("even")
    case _ => println("some other number")
}
```

Here’s another example that shows how to handle multiple strings in multiple `case` statements:

```scala
cmd match {
    case "start" | "go" => println("starting")
    case "stop" | "quit" | "exit" => println("stopping")
    case _ => println("doing nothing")
}
```



## Using `if` expressions in `case` statements

Another great thing about `match` expressions is that you can use `if` expressions in `case` statements for powerful pattern matching. In this example the second and third `case` statements both use `if` expressions to match ranges of numbers:

```scala
count match {
    case 1 => println("one, a lonely number")
    case x if x == 2 || x == 3 => println("two's company, three's a crowd")
    case x if x > 3 => println("4+, that's a party")
    case _ => println("i'm guessing your number is zero or less")
}
```

Scala doesn’t require you to use parentheses in the `if` expressions, but you can use them if you think that makes them more readable:

```scala
count match {
    case 1 => println("one, a lonely number")
    case x if (x == 2 || x == 3) => println("two's company, three's a crowd")
    case x if (x > 3) => println("4+, that's a party")
    case _ => println("i'm guessing your number is zero or less")
}
```

You can also write the code on the right side of the `=>` on multiple lines if you think is easier to read. Here’s one example:

```scala
count match {
    case 1 => 
        println("one, a lonely number")
    case x if x == 2 || x == 3 => 
        println("two's company, three's a crowd")
    case x if x > 3 => 
        println("4+, that's a party")
    case _ => 
        println("i'm guessing your number is zero or less")
}
```

Here’s a variation of that example that uses curly braces:

```scala
count match {
    case 1 => {
        println("one, a lonely number")
    }
    case x if x == 2 || x == 3 => {
        println("two's company, three's a crowd")
    }
    case x if x > 3 => {
        println("4+, that's a party")
    }
    case _ => {
        println("i'm guessing your number is zero or less")
    }
}
```

Here are a few other examples of how you can use `if` expressions in `case` statements. First, another example of how to match ranges of numbers:

```scala
i match {
  case a if 0 to 9 contains a => println("0-9 range: " + a)
  case b if 10 to 19 contains b => println("10-19 range: " + b)
  case c if 20 to 29 contains c => println("20-29 range: " + c)
  case _ => println("Hmmm...")
}
```

Lastly, this example shows how to reference class fields in `if` expressions:

```scala
stock match {
  case x if (x.symbol == "XYZ" && x.price < 20) => buy(x)
  case x if (x.symbol == "XYZ" && x.price > 50) => sell(x)
  case x => doNothing(x)
}
```


## Even more

`match` expressions are very powerful, and there are even more things you can do with them, but hopefully these examples provide a good start towards using them.








