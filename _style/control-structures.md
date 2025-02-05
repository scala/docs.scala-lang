---
layout: style-guide
title: Control Structures
partof: style
overview-name: Style Guide
num: 7
previous-page: declarations
next-page: method-invocation
---

All control structures should be written with a space following the
defining keyword. In Scala 3 parentheses around the condition should be omitted:

{% tabs control_structures_1 class=tabs-scala-version%}
{% tab 'Scala 2' for=control_structures_1 %}
```scala
// right!
if (foo) bar else baz
for (i <- 0 to 10) { ... }
while (true) { println("Hello, World!") }

// wrong!
if(foo) bar else baz
for(i <- 0 to 10) { ... }
while(true) { println("Hello, World!") }
```
{% endtab %}
{% tab 'Scala 3' for=control_structures_1 %}
```scala
// right!
if foo then bar else baz
for i <- 0 to 10 do ...
while true do println("Hello, World!") 

// wrong!
if(foo) bar else baz
for(i <- 0 to 10) do ...
while(true) do println("Hello, World!") 
```
{% endtab %}
{% endtabs %}

## Curly-Braces

In Scala 3 using curly-braces is discouraged and the quiet syntax with significant indentation is favoured. 
In Scala 2, curly-braces should be omitted in cases where the control structure
represents a pure-functional operation and all branches of the control
structure (relevant to `if`/`else`) are single-line expressions.
Remember the following guidelines:

-   `if` - Omit braces if you have an `else` clause. Otherwise, surround
    the contents with curly braces even if the contents are only a
    single line.
-   `while` - Never omit braces (`while` cannot be used in a
    pure-functional manner).
-   `for` - Omit braces if you have a `yield` clause. Otherwise,
    surround the contents with curly-braces, even if the contents are
    only a single line.
-   `case` - Always omit braces in case clauses.

<!-- necessary to separate the following example from the above bullet list -->

{% tabs control_structures_2 class=tabs-scala-version%}
{% tab 'Scala 2' for=control_structures_2 %}
```scala
val news = if (foo)
  goodNews()
else
  badNews()

if (foo) {
  println("foo was true")
}

news match {
  case "good" => println("Good news!")
  case "bad" => println("Bad news!")
}
```
{% endtab %}
{% tab 'Scala 3' for=control_structures_2 %}
```scala
val news = if foo then
  goodNews()
else
  badNews()

if foo then
  println("foo was true")

news match 
  case "good" => println("Good news!")
  case "bad" => println("Bad news!")
```
{% endtab %}
{% endtabs %}

## Comprehensions

Scala has the ability to represent `for`-comprehensions with more than
one generator (usually, more than one `<-` symbol). In such cases, there
are two alternative syntaxes which may be used:

{% tabs control_structures_3 class=tabs-scala-version%}
{% tab 'Scala 2' for=control_structures_3 %}
```scala
// wrong!
for (x <- board.rows; y <- board.files)
  yield (x, y)

// right!
for {
  x <- board.rows
  y <- board.files
} yield (x, y)
```
{% endtab %}
{% tab 'Scala 3' for=control_structures_3 %}
```scala
// wrong!
for x <- board.rows; y <- board.files
  yield (x, y)

// right!
for
  x <- board.rows
  y <- board.files
yield (x, y)
```
{% endtab %}
{% endtabs %}

While the latter style is more verbose, it is generally considered
easier to read and more "scalable" (meaning that it does not become
obfuscated as the complexity of the comprehension increases). You should
prefer this form for all `for`-comprehensions of more than one
generator. Comprehensions with only a single generator (e.g.
`for i <- 0 to 10 yield i`) should use the first form (parentheses
rather than curly braces).

Finally, `for` comprehensions are preferred to chained calls to `map`,
`flatMap`, and `filter`, as this can get difficult to read (this is one
of the purposes of the enhanced `for` comprehension).

## Trivial Conditionals

There are certain situations where it is useful to create a short
`if`/`else` expression for nested use within a larger expression. In
Java, this sort of case would traditionally be handled by the ternary
operator (`?`/`:`), a syntactic device which Scala lacks. In these
situations (and really any time you have an extremely brief `if`/`else`
expression) it is permissible to place the "then" and "else" branches on
the same line as the `if` and `else` keywords:

{% tabs control_structures_4 class=tabs-scala-version%}
{% tab 'Scala 2' for=control_structures_4 %}
```scala
val res = if (foo) bar else baz
```
{% endtab %}
{% tab 'Scala 3' for=control_structures_4 %}
```scala
val res = if foo then bar else baz
```
{% endtab %}
{% endtabs %}

The key here is that readability is not hindered by moving both branches
inline with the `if`/`else`. Note that this style should never be used
with imperative `if` expressions nor should curly braces be employed.
