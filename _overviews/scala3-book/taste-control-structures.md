---
title: Control Structures
type: section
description: This section demonstrates Scala 3 control structures.
languages: [ru, zh-cn]
num: 8
previous-page: taste-vars-data-types
next-page: taste-modeling
---


Scala has the control structures you find in other programming languages, and also has powerful `for` expressions and `match` expressions:

- `if`/`else`
- `for` loops and expressions
- `match` expressions
- `while` loops
- `try`/`catch`

These structures are demonstrated in the following examples.

## `if`/`else`

Scala’s `if`/`else` control structure looks similar to other languages.

{% tabs if-else class=tabs-scala-version %}
{% tab 'Scala 2' for=if-else %}

```scala
if (x < 0) {
  println("negative")
} else if (x == 0) {
  println("zero")
} else {
  println("positive")
}
```

{% endtab %}

{% tab 'Scala 3' for=if-else %}

```scala
if x < 0 then
  println("negative")
else if x == 0 then
  println("zero")
else
  println("positive")
```

{% endtab %}
{% endtabs %}

Note that this really is an _expression_---not a _statement_.
This means that it returns a value, so you can assign the result to a variable:

{% tabs if-else-expression class=tabs-scala-version %}
{% tab 'Scala 2' for=if-else-expression %}

```scala
val x = if (a < b) { a } else { b }
```

{% endtab %}

{% tab 'Scala 3' for=if-else-expression %}

```scala
val x = if a < b then a else b
```

{% endtab %}
{% endtabs %}

As you’ll see throughout this book, _all_ Scala control structures can be used as expressions.

> An expression returns a result, while a statement does not.
> Statements are typically used for their side-effects, such as using `println` to print to the console.

## `for` loops and expressions

The `for` keyword is used to create a `for` loop.
This example shows how to print every element in a `List`:

{% tabs for-loop class=tabs-scala-version %}
{% tab 'Scala 2' for=for-loop %}

```scala
val ints = List(1, 2, 3, 4, 5)

for (i <- ints) println(i)
```

> The code `i <- ints` is referred to as a _generator_, and the code that follows the closing parentheses of the generator is the _body_ of the loop.

{% endtab %}

{% tab 'Scala 3' for=for-loop %}

```scala
val ints = List(1, 2, 3, 4, 5)

for i <- ints do println(i)
```

> The code `i <- ints` is referred to as a _generator_, and the code that follows the `do` keyword is the _body_ of the loop.

{% endtab %}
{% endtabs %}

### Guards

You can also use one or more `if` expressions inside a `for` loop.
These are referred to as _guards_.
This example prints all of the numbers in `ints` that are greater than `2`:

{% tabs for-guards class=tabs-scala-version %}
{% tab 'Scala 2' for=for-guards %}

```scala
for (i <- ints if i > 2)
  println(i)
```

{% endtab %}

{% tab 'Scala 3' for=for-guards %}

```scala
for
  i <- ints
  if i > 2
do
  println(i)
```

{% endtab %}
{% endtabs %}

You can use multiple generators and guards.
This loop iterates over the numbers `1` to `3`, and for each number it also iterates over the characters `a` to `c`.
However, it also has two guards, so the only time the print statement is called is when `i` has the value `2` and `j` is the character `b`:

{% tabs for-guards-multi class=tabs-scala-version %}
{% tab 'Scala 2' for=for-guards-multi %}

```scala
for {
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
} {
  println(s"i = $i, j = $j")   // prints: "i = 2, j = b"
}
```

{% endtab %}

{% tab 'Scala 3' for=for-guards-multi %}

```scala
for
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
do
  println(s"i = $i, j = $j")   // prints: "i = 2, j = b"
```

{% endtab %}
{% endtabs %}

### `for` expressions

The `for` keyword has even more power: When you use the `yield` keyword instead of `do`, you create `for` _expressions_ which are used to calculate and yield results.

A few examples demonstrate this.
Using the same `ints` list as the previous example, this code creates a new list, where the value of each element in the new list is twice the value of the elements in the original list:

{% tabs for-expression_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expression_1 %}

````
scala> val doubles = for (i <- ints) yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

{% endtab %}

{% tab 'Scala 3' for=for-expression_1 %}

````
scala> val doubles = for i <- ints yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

{% endtab %}
{% endtabs %}

Scala’s control structure syntax is flexible, and that `for` expression can be written in several other ways, depending on your preference:

{% tabs for-expressioni_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_2 %}

```scala
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
val doubles = for { i <- ints } yield (i * 2)
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_2 %}

```scala
val doubles = for i <- ints yield i * 2     // style shown above
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
val doubles = for { i <- ints } yield (i * 2)
```

{% endtab %}
{% endtabs %}

This example shows how to capitalize the first character in each string in the list:

{% tabs for-expressioni_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_3 %}

```scala
val names = List("chris", "ed", "maurice")
val capNames = for (name <- names) yield name.capitalize
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_3 %}

```scala
val names = List("chris", "ed", "maurice")
val capNames = for name <- names yield name.capitalize
```

{% endtab %}
{% endtabs %}

Finally, this `for` expression iterates over a list of strings, and returns the length of each string, but only if that length is greater than `4`:

{% tabs for-expressioni_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_4 %}

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths =
  for (f <- fruits if f.length > 4) yield f.length

// fruitLengths: List[Int] = List(5, 6, 6)
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_4 %}

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths = for
  f <- fruits
  if f.length > 4
yield
  // you can use multiple lines
  // of code here
  f.length

// fruitLengths: List[Int] = List(5, 6, 6)
```

{% endtab %}
{% endtabs %}

`for` loops and expressions are covered in more detail in the [Control Structures sections][control] of this book, and in the [Reference documentation]({{ site.scala3ref }}/other-new-features/control-syntax.html).

## `match` expressions

Scala has a `match` expression, which in its most basic use is like a Java `switch` statement:

{% tabs match class=tabs-scala-version %}
{% tab 'Scala 2' for=match %}

```scala
val i = 1

// later in the code ...
i match {
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
}
```

{% endtab %}

{% tab 'Scala 3' for=match %}

```scala
val i = 1

// later in the code ...
i match
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
```

{% endtab %}
{% endtabs %}

However, `match` really is an expression, meaning that it returns a result based on the pattern match, which you can bind to a variable:

{% tabs match-expression_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_1 %}

```scala
val result = i match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
```

{% endtab %}

{% tab 'Scala 3' for=match-expression_1 %}

```scala
val result = i match
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
```

{% endtab %}
{% endtabs %}

`match` isn’t limited to working with just integer values, it can be used with any data type:

{% tabs match-expression_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_2 %}

```scala
val p = Person("Fred")

// later in the code
p match {
  case Person(name) if name == "Fred" =>
    println(s"$name says, Yubba dubba doo")

  case Person(name) if name == "Bam Bam" =>
    println(s"$name says, Bam bam!")

  case _ => println("Watch the Flintstones!")
}
```

{% endtab %}

{% tab 'Scala 3' for=match-expression_2 %}

```scala
val p = Person("Fred")

// later in the code
p match
  case Person(name) if name == "Fred" =>
    println(s"$name says, Yubba dubba doo")

  case Person(name) if name == "Bam Bam" =>
    println(s"$name says, Bam bam!")

  case _ => println("Watch the Flintstones!")
```

{% endtab %}
{% endtabs %}

In fact, a `match` expression can be used to test a variable against many different types of patterns.
This example shows (a) how to use a `match` expression as the body of a method, and (b) how to match all the different types shown:

{% tabs match-expression_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_3 %}

```scala
// getClassAsString is a method that takes a single argument of any type.
def getClassAsString(x: Any): String = x match {
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[_] => "List"
  case _ => "Unknown"
}

// examples
getClassAsString(1)               // Int
getClassAsString("hello")         // 'hello' is a String
getClassAsString(List(1, 2, 3))   // List
```

Because the method `getClassAsString` takes a parameter value of type `Any`, it can be decomposed by any kind of
pattern.

{% endtab %}
{% tab 'Scala 3' for=match-expression_3 %}

```scala
// getClassAsString is a method that takes a single argument of any type.
def getClassAsString(x: Matchable): String = x match
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[?] => "List"
  case _ => "Unknown"

// examples
getClassAsString(1)               // Int
getClassAsString("hello")         // 'hello' is a String
getClassAsString(List(1, 2, 3))   // List
```

The method `getClassAsString` takes as a parameter a value of type [Matchable]({{ site.scala3ref }}/other-new-features/matchable.html), which can be
any type supporting pattern matching (some types don’t support pattern matching because this could
break encapsulation).

{% endtab %}
{% endtabs %}

There’s _much_ more to pattern matching in Scala.
Patterns can be nested, results of patterns can be bound, and pattern matching can even be user-defined.
See the pattern matching examples in the [Control Structures chapter][control] for more details.

## `try`/`catch`/`finally`

Scala’s `try`/`catch`/`finally` control structure lets you catch exceptions.
It’s similar to Java, but its syntax is consistent with `match` expressions:

{% tabs try class=tabs-scala-version %}
{% tab 'Scala 2' for=try %}

```scala
try {
  writeTextToFile(text)
} catch {
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
} finally {
  println("Clean up your resources here.")
}
```

{% endtab %}

{% tab 'Scala 3' for=try %}

```scala
try
  writeTextToFile(text)
catch
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
finally
  println("Clean up your resources here.")
```

{% endtab %}
{% endtabs %}

## `while` loops

Scala also has a `while` loop construct.
It’s one-line syntax looks like this:

{% tabs while_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=while_1 %}

```scala
while (x >= 0) { x = f(x) }
```

{% endtab %}

{% tab 'Scala 3' for=while_1 %}

```scala
while x >= 0 do x = f(x)
```
Scala 3 still supports the Scala 2 syntax for the sake of compatibility.

{% endtab %}
{% endtabs %}

The `while` loop multiline syntax looks like this:

{% tabs while_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=while_2 %}

```scala
var x = 1

while (x < 3) {
  println(x)
  x += 1
}
```

{% endtab %}

{% tab 'Scala 3' for=while_2 %}

```scala
var x = 1

while
  x < 3
do
  println(x)
  x += 1
```

{% endtab %}
{% endtabs %}

## Custom control structures

Thanks to features like by-name parameters, infix notation, fluent interfaces, optional parentheses, extension methods, and higher-order functions, you can also create your own code that works just like a control structure.
You’ll learn more about this in the [Control Structures][control] section.

[control]: {% link _overviews/scala3-book/control-structures.md %}
