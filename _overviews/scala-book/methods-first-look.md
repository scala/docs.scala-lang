---
type: section
layout: multipage-overview
title: A First Look at Scala Methods
description: This page provides a first look at how to write Scala methods, including how to test them in the REPL.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 22
outof: 54
previous-page: constructors-default-values
next-page: enumerations-pizza-class
---


In Scala, *methods* are defined inside classes (just like Java), but for testing purposes you can also create them in the REPL. This lesson will show some examples of methods so you can see what the syntax looks like.



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

The previous example didn’t show the method’s return type, but you can show it:

```scala
def double(a: Int): Int = a * 2
                  -----
```

Writing a method like this *explicitly* declares the method’s return type. Some people prefer to explicitly declare method return types because it makes the code easier to maintain weeks, months, and years in the future.

If you paste that method into the REPL, you’ll see that it works just like the previous method.



## Methods with multiple input parameters

To show something a little more complex, here’s a method that takes two input parameters:

```scala
def add(a: Int, b: Int) = a + b
```

Here’s the same method, with the method’s return type explicitly shown:

```scala
def add(a: Int, b: Int): Int = a + b
```

Here’s a method that takes three input parameters:

```scala
def add(a: Int, b: Int, c: Int): Int = a + b + c
```



## Multiline methods

When a method is only one line long you can use the format shown, but when the method body gets longer, you put the multiple lines inside curly braces:

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






