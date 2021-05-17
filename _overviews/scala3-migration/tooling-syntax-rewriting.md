---
title: Scala 3 Syntax Rewriting
type: chapter
description: This section describes the syntax rewriting capability of the Scala 3 compiler 
num: 13
previous-page: tutorial-macro-mixing
next-page: incompatibility-table
---

Scala 3 gives Scala developers the option to adopt the new and optional significant indentation syntax.
The Scala 2 syntax which uses curly braces to group expressions remains fully supported, and we will refer to it as the classical braces syntax.

Scala 3 also introduces a new syntax for control structures, which applies to `if`-expressions, `while`-loops, and `for`-expressions.

Converting existing code to use the new syntax by hand would be tedious and error-prone.
The good news is the Scala 3 compiler can do the hard work for us!

## Syntax Rewriting Options

Let's start with showing the compiler options we have available to achieve our goal.
If we simply type `scalac` on the command line it prints all the options we have at our disposal.
For our purposes we will use the following five options:

{% highlight text %}
$ scalac
Usage: scalac <options> <source files>
where possible standard options include:
...
-indent</b>            Allow significant indentation
...
-new-syntax</b>        Require `then` and `do` in control expressions.
-noindent</b>          Require classical {...} syntax, indentation is not significant.
...
-old-syntax</b>        Require `(...)` around conditions.
...
-rewrite</b>           When used in conjunction with a `...-migration` source version,
                       rewrites sources to migrate to new version.
...

{% endhighlight %}

Each of the first four options corresponds to a specific syntax:

| Syntax | Compiler Option |
|-|-|
| Significant Indentation | `-indent` |
| Classical Braces | `-noindent` |

| Syntax | Option |
| - | - |
| New Control Structure | `-new-syntax` |
| Old Control Structure | `-old-syntax` |

As we will see in further detail these options can be used in combination with the `-rewrite` option to automate the conversion to a particular syntax.
Let's have a look at how this works in a small example.

## Significant Indentation Syntax

Given the following source code written in the Scala 2 style:

```scala
object Counter {
  enum Protocol {
    case Reset
    case MoveBy(step: Int)
  }
}

case class Animal(name: String)

trait Incrementer {
  def increment(n: Int): Int
}

case class State(n: Int, minValue: Int, maxValue: Int) {
  def inc: State =
    if (n == maxValue)
      this
    else
      this.copy(n = n + 1)
  def printAll: Unit = {
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    } println(i + j)
  }
}
```

Assume that we want to convert this piece of code to the significant indentation syntax.
We can use the `-indent -rewrite` options by adding them to the `scalacOptions` setting in our sbt build:

```scala
// build.sbt
scalacOptions ++= Seq("-indent", "-rewrite")
```

After compiling the code, the result looks as follows:

```scala
object Counter:
  enum Protocol:
    case Reset
    case MoveBy(step: Int)

case class Animal(name: String)

trait Incrementer:
  def increment(n: Int): Int

case class State(n: Int, minValue: Int, maxValue: Int):
  def inc: State =
    if (n == maxValue)
      this
    else
      this.copy(n = n + 1)
  def printAll: Unit =
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    } println(i + j)
```

A few things to observe after the switch to the significant indentation syntax:
- The number of lines was reduced by 4 because of the elimination of a series of closing curly braces
- The control structures are unchanged

## New Control Structure

After this first rewrite, we can jump to the new control structure syntax by using `-new-syntax -rewrite`.
It leads us to the following version:

```scala
object Counter:
  enum Protocol:
    case Reset
    case MoveBy(step: Int)

case class Animal(name: String)

trait Incrementer:
  def increment(n: Int): Int

case class State(n: Int, minValue: Int, maxValue: Int):
  def inc: State =
    if n == maxValue then
      this
    else
      this.copy(n = n + 1)
  def printAll: Unit =
    println("Printing all")
    for
      i <- minValue to maxValue
      j <- 0 to n
    do println(i + j)
```

We moved to the new syntaxes of Scala 3 in two steps: first we used `-indent -rewrite` then `-new-syntax -rewrite`.
We could also apply the new control structure syntax before the significant indentation syntax.
But the compiler is not able to apply both at the same time: <del>`-indent -new-syntax -rewrite`</del>.

## Moving back to Classic syntax

Starting from the latest state of our code sample, we can move backwards to its initial state.

Let's rewrite to the braces syntax and retain the new control structures syntax.
After compiling with the `-no-indent -rewrite` options, we obtain the following result:

```scala
object Counter {
  enum Protocol {
    case Reset
    case MoveBy(step: Int)
  }
}

case class Animal(name: String)

trait Incrementer {
  def increment(n: Int): Int
}

case class State(n: Int, minValue: Int, maxValue: Int) {
  def inc: State =
    if n == maxValue then
      this
    else
      this.copy(n = n + 1)
  def printAll: Unit = {
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    }
    do println(i + j)
  }
}
```

Applying one more rewrite, with `-old-syntax -rewrite`, takes us back to the original Scala 2-style code.

```scala
object Counter {
  enum Protocol {
    case Reset
    case MoveBy(step: Int)
  }
}

case class Animal(name: String)

trait Incrementer {
  def increment(n: Int): Int
}

case class State(n: Int, minValue: Int, maxValue: Int) {
  def inc: State =
    if (n == maxValue)
      this
    else
      this.copy(n = n + 1)
  def printAll: Unit = {
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    }
    println(i + j)
  }
}
```

With this last rewrite, we have come full circle.

> #### Loss of formatting when cycling through syntax versions
>
> When formatting tools such as [scalafmt](https://scalameta.org/scalafmt) are used to apply custom formatting to your code, cycling back and forth between different Scala 3 syntax variants may result in differences when going full circle.

## Enforcing a Specific Syntax

It is possible to mix the old and new syntax in a single code base.
Although we would advise against it, since it would reduce the readability and make the code harder to maintain.
A better approach is to choose one style and to consistently apply it to the entire code base.

`-noindent`, `-new-syntax` and `-old-syntax` can be used as standalone options to enforce a consistent syntax.

For instance, with the `-new-syntax` option, the compiler issues an error when it encounters enclosing parentheses around an `if`-condition. 

{% highlight text %}
-- Error: /home/piquerez/scalacenter/syntax/example.scala:6:7 ------------------
6 |    if (n == maxValue)
  |       ^^^^^^^^^^^^^^^
  |This construct is not allowed under -new-syntax.
  |This construct can be rewritten automatically under -new-syntax -rewrite -source 3.0-migration.
{% endhighlight %}

> The `-indent` syntax is always optional, it cannot be enforced by the compiler.
