---
type: section
layout: multipage-overview
title: Two Types of Variables
description: Scala has two types of variables, val and var.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 8
outof: 54
previous-page: scala-repl
next-page: type-is-optional
---


In Java you declare new variables like this:

```java
String s = "hello";
int i = 42;
Person p = new Person("Joel Fleischman");
```

Each variable declaration is preceded by its type.

By contrast, Scala has two types of variables:

- `val` creates an *immutable* variable (like `final` in Java)
- `var` creates a *mutable* variable

This is what variable declaration looks like in Scala:

```scala
val s = "hello"   // immutable
var i = 42        // mutable

val p = new Person("Joel Fleischman")
```

Those examples show that the Scala compiler is usually smart enough to infer the variable’s data type from the code on the right side of the `=` sign. We say that the variable’s type is *inferred* by the compiler. You can also *explicitly* declare the variable type if you prefer:

```scala
val s: String = "hello"
var i: Int = 42
```

In most cases the compiler doesn’t need to see those explicit types, but you can add them if you think it makes your code easier to read.

>As a practical matter it can help to explicitly show the type when you’re working with methods in third-party libraries, especially if you don’t use the library often, or if their method names don’t make the type clear.



## The difference between `val` and `var`

The difference between `val` and `var` is that `val` makes a variable *immutable* — like `final` in Java — and `var` makes a variable *mutable*. Because `val` fields can’t vary, some people refer to them as *values* rather than variables.

The REPL shows what happens when you try to reassign a `val` field:

```scala
scala> val a = 'a'
a: Char = a

scala> a = 'b'
<console>:12: error: reassignment to val
       a = 'b'
         ^
```

That fails with a “reassignment to val” error, as expected. Conversely, you can reassign a `var`:

```scala
scala> var a = 'a'
a: Char = a

scala> a = 'b'
a: Char = b
```

In Scala the general rule is that you should always use a `val` field unless there’s a good reason not to. This simple rule (a) makes your code more like algebra and (b) helps get you started down the path to functional programming, where *all* fields are immutable.



## “Hello, world” with a `val` field

Here’s what a “Hello, world” app looks like with a `val` field:

```scala
object Hello3 extends App {
    val hello = "Hello, world"
    println(hello)
}
```

As before:

- Save that code in a file named *Hello3.scala*
- Compile it with `scalac Hello3.scala`
- Run it with `scala Hello3`



## A note about `val` fields in the REPL

The REPL isn’t 100% the same as working with source code in an IDE, so there are a few things you can do in the REPL that you can’t do when working on real-world code in a project. One example of this is that you can redefine a `val` field in the REPL, like this:

```scala
scala> val age = 18
age: Int = 18

scala> val age = 19
age: Int = 19
```

`val` fields can’t be redefined like that in the real world, but they can be redefined in the REPL playground.









