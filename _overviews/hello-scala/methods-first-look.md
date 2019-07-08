---
layout: multipage-overview
title: A First Look at Scala Methods
description: This page provides a first look at how to write Scala methods, including how to test them in the REPL.
partof: hello_scala
overview-name: Hello, Scala
num: 22
---


In Scala, *methods* are defined inside classes (just like Java), but for testing purposes you can also create them in the REPL. This lesson will show a few examples of methods so you can see what the syntax looks like.



## Defining a method that takes one input parameter

This is how you define a method named `double` that takes one integer input parameter named `a` and returns the doubled value of that integer:

```scala
def double(a: Int) = a * 2
```

In that example the method name and signature are shown on the left side of the `=` sign:

    def double(a: Int) = a * 2
        --------------

`def` is the keyword you use to define a method, the method name is `double`, and the input parameter `a` has the type `Int`, which is Scala’s integer data type.

The body of the function is shown on the right side, and in this example it simply doubles the value of the input parameter `a`:

    def double(a: Int) = a * 2
                         -----

After you paste that method into the REPL, you can call it (invoke it) by giving it an `Int` value:

```scala
scala> double(2)
res0: Int = 4

scala> double(10)
res1: Int = 20
```



## Showing the method’s return type

In the previous example I don’t show the method’s return type, but you can show it, and indeed, I normally do:

```scala
def double(a: Int): Int = a * 2
                  -----
```

Writing a method like this *explicitly* declares the method’s return type. When I first started working with Scala I tended to leave the return type off of my method declarations, but after a while I found that it was easier to maintain my code when I declared the return type. That way I could just scan the function signature to easily so its input and output types.

>That being said, that’s just my personal preference; use whatever you like.

If you paste that method into the REPL, you’ll see that it works just like the previous method.



## Methods with multiple input parameters

To show something a little more complex, here’s a method that takes two input parameters:

    def add(a: Int, b: Int) = a + b

Here’s the same method, with the method’s return type explicitly shown:

    def add(a: Int, b: Int): Int = a + b

Here’s a method that takes three input parameters:

    def add(a: Int, b: Int, c: Int): Int = a + b + c



## Multiline methods

When a method is only one line long I use the format I just showed, but when the method body gets longer, you put the multiple lines inside curly braces:

```scala
def addThenDouble(a: Int, b: Int): Int = {
    val sum = a + b
    val doubled = sum * 2
    doubled
}
```

If you paste that code into the REPL, you’ll see that it works just like the previous examples:

```scala
scala> addThenDouble(1, 1)
res0: Int = 4
```



## `return` is optional

You can use the `return` keyword to return a value from your method:

```scala
def addThenDouble(a: Int, b: Int): Int = {
    val sum = a + b
    val doubled = sum * 2
    return doubled   //<-- return this result
}
```

However, it isn’t required, and in fact, Scala programmers rarely ever use it:

```scala
def addThenDouble(a: Int, b: Int): Int = {
    val sum = a + b
    val doubled = sum * 2
    doubled  //<-- `return` isn't needed
}
```

In fact, that method can be reduced to this:

```scala
def addThenDouble(a: Int, b: Int): Int = {
    val sum = a + b
    sum * 2
}
```

or this:

```scala
def addThenDouble(a: Int, b: Int): Int = {
    (a + b) * 2
}
```

or this:

```scala
def addThenDouble(a: Int, b: Int): Int = (a + b) * 2
```


### Why we don’t use `return`

We don’t use `return` for a couple of reasons. First, any code inside of parentheses is really just a block of code that evaluates to a result. When you think about your code this way, you’re not really “returning” anything; the block of code just evaluates to a result. For instance, if you paste this code into the REPL, you’ll begin to see that it doesn’t feel right to “return” a value from a block of code:

```scala
val c = {
    val a = 1
    val b = 2
    a + b
}
```

The second reason we don’t use `return` is that when you write pure functions, the general feeling is that you’re writing algebraic equations. If you remember your algebra, you know that you don’t use `return` with mathematical expressions:

    x = a + b
    y = x * 2

Similarly, as your code becomes more functional and you write it more like math expressions, you’ll find that you won’t use `return` any more.



## See also

If you’re interested in functional programming, I write *much* more about this topic in my book, *Functional Programming, Simplified*.














