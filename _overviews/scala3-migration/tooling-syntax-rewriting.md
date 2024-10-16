---
title: Scala 3 Syntax Rewriting
type: chapter
description: This section describes the syntax rewriting capability of the Scala 3 compiler 
num: 15
previous-page: tutorial-macro-mixing
next-page: incompatibility-table
---

Scala 3 extends the syntax of the Scala language with the new control structures and the significant indentation syntax.
Both are optional so that the Scala 2 code style is still perfectly valid in Scala 3. 

The new syntax for control structures makes it possible to write the condition of an `if`-expression, the condition of a `while`-loop or the generators of a `for`-expression without enclosing parentheses.

The significant indentation syntax makes braces `{...}` not needed in many occurences: class and method bodies, `if`-expressions, `match`-expressions and more.
You can find a complete description in the [Optional Braces]({{ site.scala3ref }}/other-new-features/indentation.html) page of the Scala 3 reference website.

Converting existing Scala code to the new syntax by hand is tedious and error-prone.
In this chapter we show how you can use the compiler to rewrite your code automatically from the classic Scala 2 style to the new style, or conversely. 

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
-no-indent</b>          Require classical {...} syntax, indentation is not significant.
...
-old-syntax</b>        Require `(...)` around conditions.
...
-rewrite</b>           When used in conjunction with a `...-migration` source version,
                       rewrites sources to migrate to new version.
...

{% endhighlight %}

Each of the first four options corresponds to a specific syntax:

| Syntax | Option |
| - | - |
| New Control Structures | `-new-syntax` |
| Old Control Structures | `-old-syntax` |

| Syntax | Compiler Option |
|-|-|
| Significant Indentation | `-indent` |
| Classical Braces | `-no-indent` |


As we will see in further detail these options can be used in combination with the `-rewrite` option to automate the conversion to a particular syntax.
Let's have a look at how this works in a small example.

## The New Syntax Rewrites

Given the following source code written in a Scala 2 style.

{% tabs scala-2-location %}
{% tab 'Scala 2 Only' %}
```scala
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
{% endtab %}
{% endtabs %}

We will be able to move it to new syntax automatically in two steps: first by using the new control structure rewrite (`-new-syntax -rewrite`) and then the significant indentation rewrite (`-indent -rewrite`).

> The `-indent` option does not work on the classic control structures.
> So make sure to run the two steps in the correct order.

> Unfortunately, the compiler is not able to apply both steps at the same time: `-indent -new-syntax -rewrite`.

### New Control Structures

We can use the `-new-syntax -rewrite` options by adding them to the list of scalac options in our build tool.

{% tabs sbt-location %}
{% tab 'sbt' %}
```scala
// build.sbt, for Scala 3 project
scalacOptions ++= Seq("-new-syntax", "-rewrite")
```
{% endtab %}
{% endtabs %}

After compiling the code, the result looks as follows:

{% tabs scala-3-location_2 %}
{% tab 'Scala 3 Only' %}
```scala
case class State(n: Int, minValue: Int, maxValue: Int) {
  
  def inc: State =
    if n == maxValue then
      this
    else
      this.copy(n = n + 1)
  
  def printAll: Unit = {
    println("Printing all")
    for
      i <- minValue to maxValue
      j <- 0 to n
    do println(i + j)
  }
}
```
{% endtab %}
{% endtabs %}

Notice that the parentheses around the `n == maxValue` disappeared, as well as the braces around the `i <- minValue to maxValue` and `j <- 0 to n` generators.

### Significant Indentation Syntax

After this first rewrite, we can use the significant indentation syntax to remove the remaining braces.
To do that we use the `-indent` option in combination with the `-rewrite` option.
It leads us to the following version:

{% tabs scala-3-location_3 %}
{% tab 'Scala 3 Only' %}
```scala
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
{% endtab %}
{% endtabs %}

## Moving back to the Classic syntax

Starting from the latest state of our code sample, we can move backwards to its initial state.

Let's rewrite the code using braces while retaining the new control structures.
After compiling with the `-no-indent -rewrite` options, we obtain the following result:

{% tabs scala-3-location_4 %}
{% tab 'Scala 3 Only' %}
```scala
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
{% endtab %}
{% endtabs %}

Applying one more rewrite, with `-old-syntax -rewrite`, takes us back to the original Scala 2-style code.

{% tabs shared-location %}
{% tab 'Scala 2 and 3' %}
```scala
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
{% endtab %}
{% endtabs %}

With this last rewrite, we have come full circle.

> #### Loss of formatting when cycling through syntax versions
>
> When formatting tools such as [scalafmt](https://scalameta.org/scalafmt) are used to apply custom formatting to your code, cycling back and forth between different Scala 3 syntax variants may result in differences when going full circle.

## Enforcing a Specific Syntax

It is possible to mix the old and new syntax in a single code base.
Although we would advise against it, since it would reduce the readability and make the code harder to maintain.
A better approach is to choose one style and to consistently apply it to the entire code base.

`-no-indent`, `-new-syntax` and `-old-syntax` can be used as standalone options to enforce a consistent syntax.

For instance, with the `-new-syntax` option, the compiler issues an error when it encounters enclosing parentheses around an `if`-condition. 

{% highlight text %}
-- Error: /home/piquerez/scalacenter/syntax/example.scala:6:7 ------------------
6 |    if (n == maxValue)
  |       ^^^^^^^^^^^^^^^
  |This construct is not allowed under -new-syntax.
  |This construct can be rewritten automatically under -new-syntax -rewrite -source 3.0-migration.
{% endhighlight %}

> The `-indent` syntax is always optional, it cannot be enforced by the compiler.
