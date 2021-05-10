---
title: main Methods
type: section
description: This page describes how 'main' methods and the '@main' annotation work in Scala 3.
num: 25
previous-page: methods-most
next-page: methods-summary
---


Scala 3 offers a new way to define programs that can be invoked from the command line: Adding a `@main` annotation to a method turns it into entry point of an executable program:

```scala
@main def hello = println("Hello, world")
```

Just save that line of code in a file named something like *Hello.scala*---the filename doesn’t have to match the method name---and compile it with `scalac`:

```bash
$ scalac Hello.scala
```

Then run it with `scala`:

```bash
$ scala hello
Hello, world
```

A `@main` annotated method can be written either at the top-level (as shown), or inside a statically accessible object.
In either case, the name of the program is in each case the name of the method, without any object prefixes.



### Command line arguments

With this approach your `@main` method can handle command line arguments, and those arguments can have different types.
For example, given this `@main` method that takes an `Int`, a `String`, and a varargs `String*` parameter:

```scala
@main def happyBirthday(age: Int, name: String, others: String*) =
  val suffix = (age % 100) match
    case 11 | 12 | 13 => "th"
    case _ => (age % 10) match
      case 1 => "st"
      case 2 => "nd"
      case 3 => "rd"
      case _ => "th"

  val sb = StringBuilder(s"Happy $age$suffix birthday, $name")
  for other <- others do sb.append(" and ").append(other)
  sb.toString
```

When you compile that code, it creates a main program named `happyBirthday` that’s called like this:

```
$ scala happyBirthday 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```

As shown, the `@main` method can have an arbitrary number of parameters.
For each parameter type there must be an instance of the *scala.util.FromString* type class that converts an argument `String` to the required parameter type.
Also as shown, a main method’s parameter list can end in a repeated parameter like `String*` that takes all remaining arguments given on the command line.

The program implemented from an `@main` method checks that there are enough arguments on the command line to fill in all parameters, and that the argument strings can be converted to the required types.
If a check fails, the program is terminated with an error message:

```
$ scala happyBirthday 22
Illegal command line after first argument: more arguments expected

$ scala happyBirthday sixty Fred
Illegal command line: java.lang.NumberFormatException: For input string: "sixty"
```



## The details

The Scala compiler generates a program from an `@main` method `f` as follows:

- It creates a class named `f` in the package where the `@main` method was found.
- The class has a static method `main` with the usual signature: It takes an `Array[String]` as argument and returns `Unit`.
- The generated `main` method calls method `f` with arguments converted using methods in the `scala.util.CommandLineParser` object.

For instance, the `happyBirthday` method above generates additional code equivalent to the following class:

```scala
final class happyBirthday {
  import scala.util.{CommandLineParser as CLP}
  <static> def main(args: Array[String]): Unit =
    try
      happyBirthday(
          CLP.parseArgument[Int](args, 0),
          CLP.parseArgument[String](args, 1),
          CLP.parseRemainingArguments[String](args, 2))
    catch {
      case error: CLP.ParseError => CLP.showError(error)
    }
}
```

> **Note**: In this generated code, the `<static>` modifier expresses that the `main` method is generated as a static method of class `happyBirthday`.
> This feature is not available for user programs in Scala.
> Regular “static” members are generated in Scala using objects instead.



## Scala 3 compared to Scala 2

`@main` methods are the recommended way to generate programs that can be invoked from the command line in Scala 3.
They replace the previous approach in Scala 2, which was to create an `object` that extends the `App` class:

```scala
// scala 2
object happyBirthday extends App: {
  // needs by-hand parsing of the command line arguments ...
}
```

The previous functionality of `App`, which relied on the “magic” `DelayedInit` trait, is no longer available.
`App` still exists in limited form for now, but it doesn’t support command line arguments and will be deprecated in the future.

If programs need to cross-build between Scala 2 and Scala 3, it’s recommended to use an explicit `main` method with an `Array[String]` argument instead:

```scala
object happyBirthday:
  def main(args: Array[String]) = println("Hello, world")
```

If you place that code in a file named *happyBirthday.scala*, you can then compile it with `scalac` and run it with `scala`, as shown previously:

```bash
$ scalac happyBirthday.scala

$ scala happyBirthday
Hello, world
```
