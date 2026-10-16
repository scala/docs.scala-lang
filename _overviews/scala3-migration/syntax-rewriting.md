---
title: Scala 3 Syntax Rewriting
type: chapter
description: Rewriting code to the new, optional Scala 3 syntax
num: 18
previous-page: scala2-xsource3
next-page: compiler-options
redirect_from:
  - /scala3/guides/migration/tooling-syntax-rewriting.html
---

Scala 3 adds new syntax for control structures, and makes braces optional through significant indentation.
Both are optional: the Scala 2 style is still valid in Scala 3, and converting is not part of the migration.
The [Optional Braces]({{ site.scala3ref }}/other-new-features/indentation.html) and [New Control Syntax]({{ site.scala3ref }}/other-new-features/control-syntax.html) pages of the reference describe them.

The compiler can rewrite code to either style, using one of these options together with `-rewrite`:

| Option | Syntax |
|-|-|
| `-new-syntax` | Control structures without parentheses: `if x then`, `while x do`, `for ... do` |
| `-old-syntax` | Control structures with parentheses: `if (x)`, `while (x)`, `for (...)` |
| `-indent` | Significant indentation instead of braces |
| `-no-indent` | Braces |

Only one of them can be used per compilation.

## Example

Given this code in Scala 2 style:

{% tabs scala-2-location %}
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
    } println(i + j)
  }
}
```
{% endtab %}
{% endtabs %}

Compiling with `-new-syntax -rewrite`, then with `-indent -rewrite`, gives:

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

Run `-new-syntax` first: `-indent` keeps the braces around the generators of a `for` that uses the old syntax.

Compiling with `-no-indent -rewrite`, then with `-old-syntax -rewrite`, goes back to the classic style.

## Enforcing a Specific Syntax

Without `-rewrite`, `-new-syntax`, `-old-syntax` and `-no-indent` make the compiler report an error on code that uses the other syntax.
For example, under `-new-syntax`:

{% highlight text %}
-- Error: State.scala:4:7 ------------------------------------------------------
4 |    if (n == maxValue)
  |       ^^^^^^^^^^^^^^^
  |This construct is not allowed under -new-syntax or -language:future.
  |This construct can be rewritten automatically under -rewrite -source 3.0-migration -new-syntax or -language:future.
{% endhighlight %}

Significant indentation cannot be enforced.
