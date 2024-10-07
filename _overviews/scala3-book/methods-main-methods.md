---
title: Main Methods in Scala 3
type: section
description: This page describes how 'main' methods and the '@main' annotation work in Scala 3.
languages: [ru, zh-cn]
num: 26
previous-page: methods-most
next-page: methods-summary
---

<h5>Writing one line programs <span class="tag tag-inline">Scala 3 Only</span></h5>

Scala 3 offers a new way to define programs that can be invoked from the command line: Adding a `@main` annotation to a method turns it into entry point of an executable program:

{% tabs method_1 %}
{% tab 'Scala 3 Only' for=method_1 %}

```scala
@main def hello() = println("Hello, World")
```

{% endtab %}
{% endtabs %}

To run this program, save the line of code in a file named as e.g. *Hello.scala*---the filename doesn’t have to match the method name---and run it with `scala`:

```bash
$ scala run Hello.scala
Hello, World
```

A `@main` annotated method can be written either at the top-level (as shown), or inside a statically accessible object.
In either case, the name of the program is in each case the name of the method, without any object prefixes.

Learn more about the `@main` annotation by reading the following sections, or by watching this video:

<div style="text-align: center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/uVMGPrH5_Uc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Command line arguments

With this approach your `@main` method can handle command line arguments, and those arguments can have different types.
For example, given this `@main` method that takes an `Int`, a `String`, and a varargs `String*` parameter:

{% tabs method_2 %}
{% tab 'Scala 3 Only' for=method_2 %}

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
  println(sb.toString)
```

{% endtab %}
{% endtabs %}

Pass the arguments after `--`:

```
$ scala run happyBirthday.scala -- 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```

As shown, the `@main` method can have an arbitrary number of parameters.
For each parameter type there must be a [given instance]({% link _overviews/scala3-book/ca-context-parameters.md %}) of the `scala.util.CommandLineParser.FromString` type class that converts an argument `String` to the required parameter type.
Also as shown, a main method’s parameter list can end in a repeated parameter like `String*` that takes all remaining arguments given on the command line.

The program implemented from an `@main` method checks that there are enough arguments on the command line to fill in all parameters, and that the argument strings can be converted to the required types.
If a check fails, the program is terminated with an error message:

```
$ scala run happyBirthday.scala -- 22
Illegal command line after first argument: more arguments expected

$ scala run happyBirthday.scala -- sixty Fred
Illegal command line: java.lang.NumberFormatException: For input string: "sixty"
```

## User-defined types as parameters

As mentioned up above, the compiler looks for a given instance of the
`scala.util.CommandLineParser.FromString` typeclass for the type of the
argument. For example, let's say you have a custom `Color` type that you want to
use as a parameter. You would do this like you see below:

{% tabs method_3 %}
{% tab 'Scala 3 Only' for=method_3 %}

```scala
enum Color:
  case Red, Green, Blue

given CommandLineParser.FromString[Color] with
  def fromString(value: String): Color = Color.valueOf(value)

@main def run(color: Color): Unit =
  println(s"The color is ${color.toString}")
```

{% endtab %}
{% endtabs %}

This works the same for your own user types in your program as well as types you
might be using from another library.

## The details

The Scala compiler generates a program from an `@main` method `f` as follows:

- It creates a class named `f` in the package where the `@main` method was found.
- The class has a static method `main` with the usual signature of a Java `main` method: it takes an `Array[String]` as argument and returns `Unit`.
- The generated `main` method calls method `f` with arguments converted using methods in the `scala.util.CommandLineParser.FromString` object.

For instance, the `happyBirthday` method above generates additional code equivalent to the following class:

{% tabs method_4 %}
{% tab 'Scala 3 Only' for=method_4 %}

```scala
final class happyBirthday {
  import scala.util.{CommandLineParser as CLP}
  <static> def main(args: Array[String]): Unit =
    try
      happyBirthday(
          CLP.parseArgument[Int](args, 0),
          CLP.parseArgument[String](args, 1),
          CLP.parseRemainingArguments[String](args, 2)*)
    catch {
      case error: CLP.ParseError => CLP.showError(error)
    }
}
```

> **Note**: In this generated code, the `<static>` modifier expresses that the `main` method is generated as a static method of class `happyBirthday`.
> This feature is not available for user programs in Scala.
> Regular “static” members are generated in Scala using objects instead.

{% endtab %}
{% endtabs %}

## Backwards Compatibility with Scala 2

`@main` methods are the recommended way to generate programs that can be invoked from the command line in Scala 3.
They replace the previous approach in Scala 2, which was to create an `object` that extends the `App` class:

The previous functionality of `App`, which relied on the “magic” `DelayedInit` trait, is no longer available.
`App` still exists in limited form for now, but it doesn’t support command line arguments and will be deprecated in the future.

If programs need to cross-build between Scala 2 and Scala 3, it’s recommended to use an `object` with an explicit `main` method and a single `Array[String]` argument instead:

{% tabs method_5 %}
{% tab 'Scala 2 and 3' %}

```scala
object happyBirthday {
  private def happyBirthday(age: Int, name: String, others: String*) = {
    ... // same as before
  }
  def main(args: Array[String]): Unit =
    happyBirthday(args(0).toInt, args(1), args.drop(2).toIndexedSeq:_*)
}
```

> note that here we use `:_*` to pass a vararg argument, which remains in Scala 3 for backwards compatibility.

{% endtab %}
{% endtabs %}

If you place that code in a file named *happyBirthday.scala*, you can then compile and run it with `scala`, as shown previously:

```bash
$ scala run happyBirthday.scala -- 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```
