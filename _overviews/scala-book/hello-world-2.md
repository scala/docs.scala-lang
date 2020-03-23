---
type: section
layout: multipage-overview
title: Hello, World - Version 2
description: This is a second Scala 'Hello, World' example.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 6
outof: 54
previous-page: hello-world-1
next-page: scala-repl
---

While that first “Hello, World” example works just fine, Scala provides a way to write applications more conveniently. Rather than including a `main` method, your `object` can just extend the `App` trait, like this:

```scala
object Hello2 extends App {
    println("Hello, world")
}
```

If you save that code to *Hello.scala*, compile it with `scalac` and run it with `scala`, you’ll see the same result as the previous lesson.

What happens here is that the `App` trait has its own `main` method, so you don’t need to write one. We’ll show later on how you can access command-line arguments with this approach, but the short story is that it’s easy: they’re made available to you in a string array named `args`.

>We haven’t mentioned it yet, but a Scala `trait` is similar to an abstract class in Java. (More accurately, it’s a combination of an abstract class and an interface — more on this later!)



## Extra credit

If you want to see how command-line arguments work when your object extends the `App` trait, save this source code in a file named *HelloYou.scala*:

```scala
object HelloYou extends App {
    if (args.size == 0)
        println("Hello, you")
    else
        println("Hello, " + args(0))
}
```

Then compile it with `scalac`:

```sh
scalac HelloYou.scala
```

Then run it with and without command-line arguments. Here’s an example:

```sh
$ scala HelloYou
Hello, you

$ scala HelloYou Al
Hello, Al
```

This shows:

- Command-line arguments are automatically made available to you in a variable named `args`.
- You determine the number of elements in `args` with `args.size` (or `args.length`, if you prefer).
- `args` is an `Array`, and you access `Array` elements as `args(0)`, `args(1)`, etc. Because `args` is an object, you access the array elements with parentheses (not `[]` or any other special syntax).












