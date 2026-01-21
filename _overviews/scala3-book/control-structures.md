---
title: Control Structures
type: chapter
description: This page provides an introduction to Scala's control structures, including if/then/else, 'for' loops, 'for' expressions, 'match' expressions, try/catch/finally, and 'while' loops.
languages: [ru, zh-cn]
num: 19
previous-page: string-interpolation
next-page: domain-modeling-intro
---


Scala has the control structures you expect to find in a programming language, including:

- `if`/`then`/`else`
- `for` loops
- `while` loops
- `try`/`catch`/`finally`

It also has two other powerful constructs that you may not have seen before, depending on your programming background:

- `for` expressions (also known as _`for` comprehensions_)
- `match` expressions

These are all demonstrated in the following sections.

## The if/then/else construct

A one-line Scala `if` statement looks like this:

{% tabs control-structures-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-1 %}
```scala
if (x == 1) println(x)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-1 %}
```scala
if x == 1 then println(x)
```
{% endtab %}
{% endtabs %}

When you need to run multiple lines of code after an `if` equality comparison, use this syntax:

{% tabs control-structures-2 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-2 %}
```scala
if (x == 1) {
  println("x is 1, as you can see:")
  println(x)
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-2 %}
```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
```
{% endtab %}
{% endtabs %}

The `if`/`else` syntax looks like this:

{% tabs control-structures-3 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-3 %}
```scala
if (x == 1) {
  println("x is 1, as you can see:")
  println(x)
} else {
  println("x was not 1")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-3 %}
```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
else
  println("x was not 1")
```
{% endtab %}
{% endtabs %}

And this is the `if`/`else if`/`else` syntax:

{% tabs control-structures-4 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-4 %}
```scala
if (x < 0)
  println("negative")
else if (x == 0)
  println("zero")
else
  println("positive")
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-4 %}
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

### `end if` statement

<blockquote class="help-info">
<i class="fa fa-info"></i>&nbsp;&nbsp;This is new in Scala 3, and not supported in Scala 2.
</blockquote>

You can optionally include an `end if` statement at the end of each expression, if you prefer:

{% tabs control-structures-5 %}
{% tab 'Scala 3 Only'  %}

```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
end if
```

{% endtab %}
{% endtabs %}

### `if`/`else` expressions always return a result

Note that `if`/`else` comparisons form _expressions_, meaning that they return a value which you can assign to a variable.
Because of this, there’s no need for a special ternary operator:

{% tabs control-structures-6 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-6 %}
```scala
val minValue = if (a < b) a else b
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-6 %}
```scala
val minValue = if a < b then a else b
```
{% endtab %}
{% endtabs %}

Because they return a value, you can use `if`/`else` expressions as the body of a method:

{% tabs control-structures-7 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-7 %}
```scala
def compare(a: Int, b: Int): Int =
  if (a < b)
    -1
  else if (a == b)
    0
  else
    1
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-7 %}
```scala
def compare(a: Int, b: Int): Int =
  if a < b then
    -1
  else if a == b then
    0
  else
    1
```
{% endtab %}
{% endtabs %}

### Aside: Expression-oriented programming

As a brief note about programming in general, when every expression you write returns a value, that style is referred to as _expression-oriented programming_, or EOP.
For example, this is an _expression_:

{% tabs control-structures-8 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-8 %}
```scala
val minValue = if (a < b) a else b
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-8 %}
```scala
val minValue = if a < b then a else b
```
{% endtab %}
{% endtabs %}

Conversely, lines of code that don’t return values are called _statements_, and they’re used for their _side-effects_.
For example, these lines of code don’t return values, so they’re used for their side effects:

{% tabs control-structures-9 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-9 %}
```scala
if (a == b) action()
println("Hello")
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-9 %}
```scala
if a == b then action()
println("Hello")
```
{% endtab %}
{% endtabs %}

The first example runs the `action` method as a side effect when `a` is equal to `b`.
The second example is used for the side effect of printing a string to STDOUT.
As you learn more about Scala you’ll find yourself writing more _expressions_ and fewer _statements_.

## `for` loops

In its most simple use, a Scala `for` loop can be used to iterate over the elements in a collection.
For example, given a sequence of integers, you can loop over its elements and print their values like this:

{% tabs control-structures-10 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-10 %}
```scala
val ints = Seq(1, 2, 3)
for (i <- ints) println(i)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-10 %}
```scala
val ints = Seq(1, 2, 3)
for i <- ints do println(i)
```
{% endtab %}
{% endtabs %}


The code `i <- ints` is referred to as a _generator_. In any generator `p <- e`, the expression `e` can generate zero or many bindings to the pattern `p`.

This is what the result looks like in the Scala REPL:

{% tabs control-structures-11 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-11 %}
````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for (i <- ints) println(i)
1
2
3
````
{% endtab %}
{% tab 'Scala 3' for=control-structures-11 %}
````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for i <- ints do println(i)
1
2
3
````
{% endtab %}
{% endtabs %}


When you need a multiline block of code following the `for` generator, use the following syntax:

{% tabs control-structures-12 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-12 %}
```scala
for (i <- ints) {
  val x = i * 2
  println(s"i = $i, x = $x")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-12 %}
```scala
for i <- ints
do
  val x = i * 2
  println(s"i = $i, x = $x")
```
{% endtab %}
{% endtabs %}


### Multiple generators

`for` loops can have multiple generators, as shown in this example:

{% tabs control-structures-13 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-13 %}
```scala
for {
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
} {
  println(s"i = $i, j = $j, k = $k")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-13 %}
```scala
for
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
do
  println(s"i = $i, j = $j, k = $k")
```
{% endtab %}
{% endtabs %}


That expression prints this output:

````
i = 1, j = a, k = 1
i = 1, j = a, k = 6
i = 1, j = b, k = 1
i = 1, j = b, k = 6
i = 2, j = a, k = 1
i = 2, j = a, k = 6
i = 2, j = b, k = 1
i = 2, j = b, k = 6
````

### Guards

`for` loops can also contain `if` statements, which are known as _guards_:

{% tabs control-structures-14 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-14 %}
```scala
for {
  i <- 1 to 5
  if i % 2 == 0
} {
  println(i)
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-14 %}
```scala
for
  i <- 1 to 5
  if i % 2 == 0
do
  println(i)
```
{% endtab %}
{% endtabs %}


The output of that loop is:

````
2
4
````

A `for` loop can have as many guards as needed.
This example shows one way to print the number `4`:

{% tabs control-structures-15 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-15 %}
```scala
for {
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
} {
  println(i)
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-15 %}
```scala
for
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
do
  println(i)
```
{% endtab %}
{% endtabs %}

### Using `for` with Maps

You can also use `for` loops with a `Map`.
For example, given this `Map` of state abbreviations and their full names:

{% tabs map %}
{% tab 'Scala 2 and 3' for=map %}
```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama", 
  "AZ" -> "Arizona"
)
```
{% endtab %}
{% endtabs %}

You can print the keys and values using `for`, like this:

{% tabs control-structures-16 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-16 %}
```scala
for ((abbrev, fullName) <- states) println(s"$abbrev: $fullName")
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-16 %}
```scala
for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
```
{% endtab %}
{% endtabs %}

Here’s what that looks like in the REPL:

{% tabs control-structures-17 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-17 %}
```scala
scala> for ((abbrev, fullName) <- states) println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AZ: Arizona
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-17 %}
```scala
scala> for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AZ: Arizona
```
{% endtab %}
{% endtabs %}

As the `for` loop iterates over the map, each key/value pair is bound to the variables `abbrev` and `fullName`, which are in a tuple:

```scala
(abbrev, fullName) <- states
```

As the loop runs, the variable `abbrev` is assigned to the current _key_ in the map, and the variable `fullName` is assigned to the current map _value_.

## `for` expressions

In the previous `for` loop examples, those loops were all used for _side effects_, specifically to print those values to STDOUT using `println`.

It’s important to know that you can also create `for` _expressions_ that return values.
You create a `for` expression by adding the `yield` keyword and an expression to return, like this:

{% tabs control-structures-18 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-18 %}
```scala
val list =
  for (i <- 10 to 12)
  yield i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-18 %}
```scala
val list =
  for i <- 10 to 12
  yield i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```
{% endtab %}
{% endtabs %}


After that `for` expression runs, the variable `list` is a `Vector` that contains the values shown.
This is how the expression works:

1. The `for` expression starts to iterate over the values in the range `(10, 11, 12)`.
   It first works on the value `10`, multiplies it by `2`, then _yields_ that result, the value `20`.
2. Next, it works on the `11`---the second value in the range.
   It multiplies it by `2`, then yields the value `22`.
   You can think of these yielded values as accumulating in a temporary holding place.
3. Finally, the loop gets the number `12` from the range, multiplies it by `2`, yielding the number `24`.
  The loop completes at this point and yields the final result, the `Vector(20, 22, 24)`.

{% comment %}
NOTE: This is a place where it would be great to have a TIP or NOTE block:
{% endcomment %}

While the intent of this section is to demonstrate `for` expressions, it can help to know that the `for` expression shown is equivalent to this `map` method call:

{% tabs map-call %}
{% tab 'Scala 2 and 3' for=map-call %}
```scala
val list = (10 to 12).map(i => i * 2)
```
{% endtab %}
{% endtabs %}

`for` expressions can be used any time you need to traverse all the elements in a collection and apply an algorithm to those elements to create a new list.

Here’s an example that shows how to use a block of code after the `yield`:

{% tabs control-structures-19 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-19 %}
```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for (name <- names) yield { 
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName
}

// capNames: List[String] = List(Olivia, Walter, Peter)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-19 %}
```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for name <- names yield
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName

// capNames: List[String] = List(Olivia, Walter, Peter)
```
{% endtab %}
{% endtabs %}

### Using a `for` expression as the body of a method

Because a `for` expression yields a result, it can be used as the body of a method that returns a useful value.
This method returns all the values in a given list of integers that are between `3` and `10`:

{% tabs control-structures-20 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-20 %}
```scala
def between3and10(xs: List[Int]): List[Int] =
  for {
    x <- xs
    if x >= 3
    if x <= 10
  } yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-20 %}
```scala
def between3and10(xs: List[Int]): List[Int] =
  for
    x <- xs
    if x >= 3
    if x <= 10
  yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```
{% endtab %}
{% endtabs %}

## `while` loops

Scala `while` loop syntax looks like this:

{% tabs control-structures-21 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-21 %}
```scala
var i = 0

while (i < 3) {
  println(i)
  i += 1
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-21 %}
```scala
var i = 0

while i < 3 do
  println(i)
  i += 1
```
{% endtab %}
{% endtabs %}

## `match` expressions

Pattern matching is a major feature of functional programming languages, and Scala includes a `match` expression that has many capabilities.

In the most simple case you can use a `match` expression like a Java `switch` statement, matching cases based on an integer value.
Notice that this really is an expression, as it evaluates to a result:

{% tabs control-structures-22 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-22 %}
```scala
// `i` is an integer
val day = i match {
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"   // the default, catch-all
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-22 %}
```scala
// `i` is an integer
val day = i match
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"   // the default, catch-all
```
{% endtab %}
{% endtabs %}

In this example, the variable `i` is tested against the cases shown.
If it’s between `0` and `6`, `day` is bound to the string that represents that day of the week.
Otherwise, it matches the catch-all case represented by the character, `_`, and `day` is bound to the string, `"invalid day"`.

Since the cases are considered in the order they are written, and the first matching case is used, the default case, which matches any value, must come last. Any cases after the catch-all will be warned as unreachable cases.

> When writing simple `match` expressions like this, it’s recommended to use the `@switch` annotation on the variable `i`.
> This annotation provides a compile-time warning if the switch can’t be compiled to a `tableswitch` or `lookupswitch`, which are better for performance.

### Using the default value

When you need to access the catch-all, default value in a `match` expression, just provide a variable name on the left side of the `case` statement instead of `_`, and then use that variable name on the right side of the statement as needed:

{% tabs control-structures-23 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-23 %}
```scala
i match {
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-23 %}
```scala
i match
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what")
```
{% endtab %}
{% endtabs %}

The name used in the pattern must begin with a lowercase letter.
A name beginning with an uppercase letter does not introduce a variable, but matches a value in scope:

{% tabs control-structures-24 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-24 %}
```scala
val N = 42
i match {
  case 0 => println("1")
  case 1 => println("2")
  case N => println("42")
  case n => println(s"You gave me: $n" )
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-24 %}
```scala
val N = 42
i match
  case 0 => println("1")
  case 1 => println("2")
  case N => println("42")
  case n => println(s"You gave me: $n" )
```
{% endtab %}
{% endtabs %}

If `i` is equal to `42`, then `case N` will match, and it will print the string `"42"`. It won't reach the default case.

### Handling multiple possible matches on one line

As mentioned, `match` expressions have many capabilities.
This example shows how to use multiple possible pattern matches in each `case` statement:

{% tabs control-structures-25 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-25 %}
```scala
val evenOrOdd = i match {
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-25 %}
```scala
val evenOrOdd = i match
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
```
{% endtab %}
{% endtabs %}

### Using `if` guards in `case` clauses

You can also use guards in the `case`s of a match expression.
In this example the second and third `case` both use guards to match multiple integer values:

{% tabs control-structures-26 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-26 %}
```scala
i match {
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-26 %}
```scala
i match
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
```
{% endtab %}
{% endtabs %}

Here’s another example, which shows how to match a given value against ranges of numbers:

{% tabs control-structures-27 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-27 %}
```scala
i match {
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-27 %}
```scala
i match
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
```
{% endtab %}
{% endtabs %}

#### Case classes and match expressions

You can also extract fields from `case` classes---and classes that have properly written `apply`/`unapply` methods---and use those in your guard conditions.
Here’s an example using a simple `Person` case class:

{% tabs control-structures-28 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-28 %}
```scala
case class Person(name: String)

def speak(p: Person) = p match {
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")
}

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-28 %}
```scala
case class Person(name: String)

def speak(p: Person) = p match
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```
{% endtab %}
{% endtabs %}

#### Binding matched patterns to variables

You can bind the matched pattern to a variable to use type-specific behavior:

{% tabs pattern-binding class=tabs-scala-version %}
{% tab 'Scala 2' for=pattern-binding %}
```scala
trait Animal {
  val name: String
}
case class Cat(name: String) extends Animal {
  def meow: String = "Meow"
}
case class Dog(name: String) extends Animal {
  def bark: String = "Bark"
}

def speak(animal: Animal) = animal match {
  case c @ Cat(name) if name == "Felix" => println(s"$name says, ${c.meow}!")
  case d @ Dog(name) if name == "Rex" => println(s"$name says, ${d.bark}!")
  case _ => println("I don't know you!")
}

speak(Cat("Felix")) // "Felix says, Meow!"
speak(Dog("Rex"))   // "Rex says, Bark!"
```
{% endtab %}
{% tab 'Scala 3' for=pattern-binding %}
```scala
trait Animal:
  val name: String
case class Cat(name: String) extends Animal:
  def meow: String = "Meow"
case class Dog(name: String) extends Animal:
  def bark: String = "Bark"

def speak(animal: Animal) = animal match
  case c @ Cat(name) if name == "Felix" => println(s"$name says, ${c.meow}!")
  case d @ Dog(name) if name == "Rex" => println(s"$name says, ${d.bark}!")
  case _ => println("I don't know you!")

speak(Cat("Felix")) // "Felix says, Meow!"
speak(Dog("Rex"))   // "Rex says, Bark!"
```
{% endtab %}
{% endtabs %}

### Using a `match` expression as the body of a method

Because `match` expressions return a value, they can be used as the body of a method.
This method takes a `Matchable` value as an input parameter, and returns a `Boolean`, based on the result of the `match` expression:

{% tabs control-structures-29 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-29 %}
```scala
def isTruthy(a: Matchable) = a match {
  case 0 | "" | false => false
  case _              => true
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-29 %}
```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _              => true
```
{% endtab %}
{% endtabs %}

The input parameter `a` is defined to be the [`Matchable` type][matchable]---which is the root of all Scala types that pattern matching can be performed on.
The method is implemented by matching on the input, providing two cases:
The first one checks whether the given value is either the integer `0`,  an empty string or `false` and returns `false` in this case.
In the default case, we return `true` for any other value.
These examples show how this method works:

{% tabs is-truthy-call %}
{% tab 'Scala 2 and 3' for=is-truthy-call %}
```scala
isTruthy(0)      // false
isTruthy(false)  // false
isTruthy("")     // false
isTruthy(1)      // true
isTruthy(" ")    // true
isTruthy(2F)     // true
```
{% endtab %}
{% endtabs %}

Using a `match` expression as the body of a method is a very common use.

#### Match expressions support many different types of patterns

There are many different forms of patterns that can be used to write `match` expressions.
Examples include:

- Constant patterns (such as `case 3 => `)
- Sequence patterns (such as `case List(els : _*) =>`)
- Tuple patterns (such as `case (x, y) =>`)
- Constructor pattern (such as `case Person(first, last) =>`)
- Type test patterns (such as `case p: Person =>`)

All of these kinds of patterns are shown in the following `pattern` method, which takes an input parameter of type `Matchable` and returns a `String`:

{% tabs control-structures-30 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-30 %}
```scala
def pattern(x: Matchable): String = x match {

  // constant patterns
  case 0 => "zero"
  case true => "true"
  case "hello" => "you said 'hello'"
  case Nil => "an empty List"

  // sequence patterns
  case List(0, _, _) => "a 3-element list with 0 as the first element"
  case List(1, _*) => "list, starts with 1, has any number of elements"
  case Vector(1, _*) => "vector, starts w/ 1, has any number of elements"

  // tuple patterns
  case (a, b) => s"got $a and $b"
  case (a, b, c) => s"got $a, $b, and $c"

  // constructor patterns
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "found a dog named Zeus"

  // type test patterns
  case s: String => s"got a string: $s"
  case i: Int => s"got an int: $i"
  case f: Float => s"got a float: $f"
  case a: Array[Int] => s"array of int: ${a.mkString(",")}"
  case as: Array[String] => s"string array: ${as.mkString(",")}"
  case d: Dog => s"dog: ${d.name}"
  case list: List[?] => s"got a List: $list"
  case m: Map[?, ?] => m.toString

  // the default wildcard pattern
  case _ => "Unknown"
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-30 %}
```scala
def pattern(x: Matchable): String = x match

  // constant patterns
  case 0 => "zero"
  case true => "true"
  case "hello" => "you said 'hello'"
  case Nil => "an empty List"

  // sequence patterns
  case List(0, _, _) => "a 3-element list with 0 as the first element"
  case List(1, _*) => "list, starts with 1, has any number of elements"
  case Vector(1, _*) => "vector, starts w/ 1, has any number of elements"

  // tuple patterns
  case (a, b) => s"got $a and $b"
  case (a, b, c) => s"got $a, $b, and $c"

  // constructor patterns
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "found a dog named Zeus"

  // type test patterns
  case s: String => s"got a string: $s"
  case i: Int => s"got an int: $i"
  case f: Float => s"got a float: $f"
  case a: Array[Int] => s"array of int: ${a.mkString(",")}"
  case as: Array[String] => s"string array: ${as.mkString(",")}"
  case d: Dog => s"dog: ${d.name}"
  case list: List[?] => s"got a List: $list"
  case m: Map[?, ?] => m.toString

  // the default wildcard pattern
  case _ => "Unknown"
```
{% endtab %}
{% endtabs %}

You can also write the code on the right side of the `=>` on multiple lines if you think it is easier to read. Here is one example:

{% tabs control-structures-31 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-31 %}
```scala
count match {
  case 1 =>
    println("one, a lonely number")
  case x if x == 2 || x == 3 => 
    println("two's company, three's a crowd")
  case x if x > 3 =>
    println("4+, that's a party")
  case _ => 
    println("i'm guessing your number is zero or less")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-31 %}
```scala
count match
  case 1 => 
    println("one, a lonely number")
  case x if x == 2 || x == 3 => 
    println("two's company, three's a crowd")
  case x if x > 3 => 
    println("4+, that's a party")
  case _ => 
    println("i'm guessing your number is zero or less")
```
{% endtab %}
{% endtabs %}

In Scala 3, `match` expressions can be chained:

{% tabs 'control-structures-32' %}
{% tab 'Scala 3 Only' %}
```scala
i match
  case odd: Int if odd % 2 == 1 => "odd"
  case even: Int if even % 2 == 0 => "even"
  case _ => "not an integer"
match
  case "even" => true
  case _ => false
```
{% endtab %}
{% endtabs %}

The `match` expression can also follow a period, which simplifies matching on results returned by chained method calls:

{% tabs 'control-structures-33' %}
{% tab 'Scala 3 Only' %}
```scala
List(1, 2, 3)
  .map(_ * 2)
  .headOption
  .match
    case Some(value) => println(s"The head is: $value")
    case None => println("The list is empty")
```
{% endtab %}
{% endtabs %}

## try/catch/finally

Like Java, Scala has a `try`/`catch`/`finally` construct to let you catch and manage exceptions.
For consistency, Scala uses the same syntax that `match` expressions use and supports pattern matching on the different possible exceptions that can occur.

In the following example, `openAndReadAFile` is a method that does what its name implies: it opens a file and reads the text in it, assigning the result to the mutable variable `text`:

{% tabs control-structures-34 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-34 %}
```scala
var text = ""
try {
  text = openAndReadAFile(filename)
} catch {
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
} finally {
  // close your resources here
  println("Came to the 'finally' clause.")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-34 %}
```scala
var text = ""
try
  text = openAndReadAFile(filename)
catch
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
finally
  // close your resources here
  println("Came to the 'finally' clause.")
```
{% endtab %}
{% endtabs %}

Assuming that the `openAndReadAFile` method uses the Java `java.io.*` classes to read a file and doesn't catch its exceptions, attempting to open and read a file can result in both a `FileNotFoundException` and an `IOException`, and those two exceptions are caught in the `catch` block of this example.

## Custom Control Structures

Scala allows you to define your own control structures. You can create methods that can be used in a way similar to built-in control structures such as `if`/`then`/`else` or `while` loops. This is primarily achieved using _by-name parameters_.

### Defining your own control structures

A by-name parameter is specified by prepending `=>` to the type, like `body: => Unit`. Unlike a normal by-value parameter, a by-name parameter is not evaluated when the method is called. Instead, it is evaluated every time it is referenced within the method.

This feature allows you to accept a block of code that is run on demand, which is essential for defining control logic.

Here is an example of a simple `repeat` loop that runs a block of code a specified number of times:

{% tabs custom-control-1 %}
{% tab 'Scala 3' %}
```scala
def repeat(n: Int)(body: => Unit): Unit =
  if n > 0 then
    body
    repeat(n - 1)(body)

// usage
repeat(3) {
  println("Hello")
}
```
{% endtab %}
{% endtabs %}

The `body` parameter is evaluated each time `body` is mentioned in the `repeat` method. Because `repeat` is defined with multiple parameter lists, you can use the block syntax `{ ... }` for the second argument, making it look like a language keyword.

### New in Scala 3.3: boundary and break

<blockquote class="help-info">
<i class="fa fa-info"></i>&nbsp;&nbsp;This feature was introduced in Scala 3.3.
</blockquote>

Scala 3.3 introduces `boundary` and `break` in the `scala.util` package to provide a clearer, more structured way to handle non-local returns or to "break" out of nested loops and control structures. This replaces the older `scala.util.control.Breaks` and creating methods that throw exceptions for control flow.

To use it, you define a `boundary` block. Inside that block, you can call `break` to effectively return a value from that block immediately.

Here is an example of a method that searches for the first index of a target element in a list of integers:

{% tabs custom-control-2 %}
{% tab 'Scala 3' %}
```scala
import scala.util.boundary, boundary.break

def firstIndex(xs: List[Int], target: Int): Int =
  boundary:
    for (x, i) <- xs.zipWithIndex do
      if x == target then break(i)
    -1

val xs = List(1, 2, 3, 4, 5)
val found = firstIndex(xs, 3)   // 2
val notFound = firstIndex(xs, 99) // -1
```
{% endtab %}
{% endtabs %}

In this example:
1. `boundary` establishes a scope.
2. The `for` loop iterates through the list.
3. If `x == target`, `break(i)` is called. This immediately exits the `boundary` block and returns `i`.
4. If the loop finishes without breaking, the code after the loop (`-1`) is returned.

This mechanism provides a structured alternative to using exceptions for control flow.


[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
