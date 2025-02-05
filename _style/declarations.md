---
layout: style-guide
title: Declarations
partof: style
overview-name: Style Guide
num: 6
previous-page: nested-blocks
next-page: control-structures
---

## Classes

Class, object, and trait constructors should be declared all on one line,
unless the line becomes "too long" (about 100 characters). In that case,
put each constructor argument on its own line with
[trailing commas](https://docs.scala-lang.org/sips/trailing-commas.html#motivation):

{% tabs declarations_1 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_1 %}
```scala
class Person(name: String, age: Int) {
  …
}

class Person(
  name: String,
  age: Int,
  birthdate: Date,
  astrologicalSign: String,
  shoeSize: Int,
  favoriteColor: java.awt.Color,
) {
  def firstMethod: Foo = …
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_1 %}
```scala
class Person(name: String, age: Int):
  …

class Person(
  name: String,
  age: Int,
  birthdate: Date,
  astrologicalSign: String,
  shoeSize: Int,
  favoriteColor: java.awt.Color,
):
  def firstMethod: Foo = …
```
{% endtab %}
{% endtabs %}

If a class/object/trait extends anything, the same general rule applies,
put it on one line unless it goes over about 100 characters, and then
put each item on its own line with
[trailing commas](https://docs.scala-lang.org/sips/trailing-commas.html#motivation);
closing parenthesis and indentation provide visual separation between constructor arguments and extensions;
empty line should be added to further separate extensions from class implementation:

{% tabs declarations_2 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_2 %}
```scala
class Person(
  name: String,
  age: Int,
  birthdate: Date,
  astrologicalSign: String,
  shoeSize: Int,
  favoriteColor: java.awt.Color,
) extends Entity
    with Logging
    with Identifiable
    with Serializable {

  def firstMethod: Foo = …
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_2 %}
```scala
class Person(
  name: String,
  age: Int,
  birthdate: Date,
  astrologicalSign: String,
  shoeSize: Int,
  favoriteColor: java.awt.Color,
) extends Entity
    with Logging
    with Identifiable
    with Serializable:

  def firstMethod: Foo = …
```
{% endtab %}
{% endtabs %}

### Ordering Of Class Elements

All class/object/trait members should be declared interleaved with
newlines. The only exceptions to this rule are `var` and `val`. These
may be declared without the intervening newline, but only if none of the
fields have Scaladoc and if all of the fields have simple (max of 20-ish
chars, one line) definitions:

{% tabs declarations_3 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_3 %}
```scala
class Foo {
  val bar = 42
  val baz = "Daniel"

  def doSomething(): Unit = { ... }

  def add(x: Int, y: Int): Int = x + y
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_3 %}
```scala
class Foo:
  val bar = 42
  val baz = "Daniel"

  def doSomething(): Unit = ...

  def add(x: Int, y: Int): Int = x + y
```
{% endtab %}
{% endtabs %}

Fields should *precede* methods in a scope. The only exception is if the
`val` has a block definition (more than one expression) and performs
operations which may be deemed "method-like" (e.g. computing the length
of a `List`). In such cases, the non-trivial `val` may be declared at a
later point in the file as logical member ordering would dictate. This
rule *only* applies to `val` and `lazy val`! It becomes very difficult
to track changing aliases if `var` declarations are strewn throughout
class file.

### Methods

Methods should be declared according to the following pattern:

{% tabs declarations_4 %}
{% tab 'Scala 2 and 3' for=declarations_4 %}
```scala
def foo(bar: Baz): Bin = expr
```
{% endtab %}
{% endtabs %}

Methods with default parameter values should be declared in an analogous
fashion, with a space on either side of the equals sign:

{% tabs declarations_5 %}
{% tab 'Scala 2 and 3' for=declarations_5 %}
```scala
def foo(x: Int = 6, y: Int = 7): Int = x + y
```
{% endtab %}
{% endtabs %}

You should specify a return type for all public members.
Consider it documentation checked by the compiler.
It also helps in preserving binary compatibility in the face of changing type inference (changes to the method implementation may propagate to the return type if it is inferred).

Local methods or private methods may omit their return type:

{% tabs declarations_6 %}
{% tab 'Scala 2 and 3' for=declarations_6 %}
```scala
private def foo(x: Int = 6, y: Int = 7) = x + y
```
{% endtab %}
{% endtabs %}

#### Modifiers

Method modifiers should be given in the following order (when each is
applicable):

1.  Annotations, *each on their own line*
2.  Override modifier (`override`)
3.  Access modifier (`protected`, `private`)
4.  Implicit modifier (`implicit`)
5.  Final modifier (`final`)
6.  `def`

<!-- necessary to separate the following example from the above bullet list -->

{% tabs declarations_8 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_8 %}
```scala
@Transaction
@throws(classOf[IOException])
override protected final def foo(): Unit = {
  ...
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_8 %}
```scala
@Transaction
@throws(classOf[IOException])
override protected final def foo(): Unit =
  ...
```
{% endtab %}
{% endtabs %}

#### Body

When a method body comprises a single expression which is less than 30
(or so) characters, it should be given on a single line with the method:

{% tabs declarations_9 %}
{% tab 'Scala 2 and 3' for=declarations_9 %}
```scala
def add(a: Int, b: Int): Int = a + b
```
{% endtab %}
{% endtabs %}

When the method body is a single expression *longer* than 30 (or so)
characters but still shorter than 70 (or so) characters, it should be
given on the following line, indented two spaces:

{% tabs declarations_10 %}
{% tab 'Scala 2 and 3' for=declarations_10 %}
```scala
def sum(ls: List[String]): Int =
  ls.map(_.toInt).foldLeft(0)(_ + _)
```
{% endtab %}
{% endtabs %}

The distinction between these two cases is somewhat artificial.
Generally speaking, you should choose whichever style is more readable
on a case-by-case basis. For example, your method declaration may be
very long, while the expression body may be quite short. In such a case,
it may be more readable to put the expression on the next line rather
than making the declaration line too long.

When the body of a method cannot be concisely expressed in a single line
or is of a non-functional nature (some mutable state, local or
otherwise), the body must be enclosed in braces:

{% tabs declarations_11 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_11 %}
```scala
    def sum(ls: List[String]): Int = {
      val ints = ls.map(_.toInt)
      ints.foldLeft(0)(_ + _)
    }
```
{% endtab %}
{% tab 'Scala 3' for=declarations_11 %}
```scala
def sum(ls: List[String]): Int =
  val ints = ls.map(_.toInt)
  ints.foldLeft(0)(_ + _)
```
{% endtab %}
{% endtabs %}

Methods which contain a single `match` expression should be declared in
the following way:

{% tabs declarations_12 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_12 %}
```scala
// right!
def sum(ls: List[Int]): Int = ls match {
  case hd :: tail => hd + sum(tail)
  case Nil => 0
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_12 %}
```scala
// right!
def sum(ls: List[Int]): Int = ls match
  case hd :: tail => hd + sum(tail)
  case Nil => 0
```
{% endtab %}
{% endtabs %}

*Not* like this:

{% tabs declarations_13 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_13 %}
```scala
// wrong!
def sum(ls: List[Int]): Int = {
  ls match {
    case hd :: tail => hd + sum(tail)
    case Nil => 0
  }
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_13 %}
```scala
// wrong!
def sum(ls: List[Int]): Int =
  ls match
    case hd :: tail => hd + sum(tail)
    case Nil => 0
```
{% endtab %}
{% endtabs %}

#### Multiple Parameter Lists

In general, you should only use multiple parameter lists if there is a
good reason to do so. These methods (or similarly declared functions)
have a more verbose declaration and invocation syntax and are harder for
less-experienced Scala developers to understand.

There are three main reasons you should do this:

1.  For a fluent API

    Multiple parameter lists allow you to create your own "control
    structures":

{% tabs declarations_14 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_14 %}
```scala
def unless(exp: Boolean)(code: => Unit): Unit = {
  if (!exp) code
}

unless(x < 5) {
  println("x was not less than five")
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_14 %}
```scala
def unless(exp: Boolean)(code: => Unit): Unit =
  if (!exp) code

unless(x < 5):
  println("x was not less than five")
```
{% endtab %}
{% endtabs %}

{:start="2"}
2.  Implicit Parameters

    When using implicit parameters, and you use the `implicit` keyword,
    it applies to the entire parameter list. Thus, if you want only some
    parameters to be implicit, you must use multiple parameter lists.

3.  For type inference

    When invoking a method using only some of the parameter lists, the
    type inferencer can allow a simpler syntax when invoking the
    remaining parameter lists. Consider fold:

{% tabs declarations_15 %}
{% tab 'Scala 2 and 3' for=declarations_15 %}
```scala
def foldLeft[B](z: B)(op: (B, A) => B): B
List("").foldLeft(0)(_ + _.length)

// If, instead:
def foldLeft[B](z: B, op: (B, A) => B): B
// above won't work, you must specify types
List("").foldLeft(0, (b: Int, a: String) => b + a.length)
List("").foldLeft[Int](0, _ + _.length)
```
{% endtab %}
{% endtabs %}

For complex DSLs, or with type names that are long, it can be difficult
to fit the entire signature on one line. For those cases there are several
different styles in use:

1. Split the parameter lists, one parameter per line with
[trailing commas](https://docs.scala-lang.org/sips/trailing-commas.html#motivation)
and parentheses being on separate lines adding to visual separation between
the lists:

{% tabs declarations_16 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_16 %}
```scala
protected def forResource(
  resourceInfo: Any,
)(
  f: (JsonNode) => Any,
)(implicit
  urlCreator: URLCreator,
  configurer: OAuthConfiguration,
): Any = {
  ...
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_16 %}
```scala
protected def forResource(
  resourceInfo: Any,
)(
  f: (JsonNode) => Any,
)(using
  urlCreator: URLCreator,
  configurer: OAuthConfiguration,
): Any =
  ...
```
{% endtab %}
{% endtabs %}

{:start="2"}
2. Or align the open-paren of the parameter lists, one list per line:

{% tabs declarations_17 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_17 %}
```scala
protected def forResource(resourceInfo: Any)
                         (f: (JsonNode) => Any)
                         (implicit urlCreator: URLCreator, configurer: OAuthConfiguration): Any = {
  ...
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_17 %}
```scala
protected def forResource(resourceInfo: Any)
                         (f: (JsonNode) => Any)
                         (using urlCreator: URLCreator, configurer: OAuthConfiguration): Any =
  ...
```
{% endtab %}
{% endtabs %}

#### Higher-Order Functions

It's worth keeping in mind when declaring higher-order functions the
fact that Scala allows a somewhat nicer syntax for such functions at
call-site when the function parameter is curried as the last argument.
For example, this is the `foldl` function in SML:

{% tabs declarations_18 %}
{% tab 'SML' for=declarations_18 %}
```
fun foldl (f: ('b * 'a) -> 'b) (init: 'b) (ls: 'a list) = ...
```
{% endtab %}
{% endtabs %}

In Scala, the preferred style is the exact inverse:

{% tabs declarations_19 %}
{% tab 'Scala 2 and 3' for=declarations_19 %}
```scala
def foldLeft[A, B](ls: List[A])(init: B)(f: (B, A) => B): B = ...
```
{% endtab %}
{% endtabs %}

By placing the function parameter *last*, we have enabled invocation
syntax like the following:

{% tabs declarations_20 %}
{% tab 'Scala 2 and 3' for=declarations_20 %}
```scala
foldLeft(List(1, 2, 3, 4))(0)(_ + _)
```
{% endtab %}
{% endtabs %}

The function value in this invocation is not wrapped in parentheses; it
is syntactically quite disconnected from the function itself
(`foldLeft`). This style is preferred for its brevity and cleanliness.

### Fields

Fields should follow the declaration rules for methods, taking special
note of access modifier ordering and annotation conventions.

Lazy vals should use the `lazy` keyword directly before the `val`:

{% tabs declarations_21 %}
{% tab 'Scala 2 and 3' for=declarations_21 %}
```scala
private lazy val foo = bar()
```
{% endtab %}
{% endtabs %}

## Function Values

Scala provides a number of different syntactic options for declaring
function values. For example, the following declarations are exactly
equivalent:

1.  `val f1 = ((a: Int, b: Int) => a + b)`
2.  `val f2 = (a: Int, b: Int) => a + b`
3.  `val f3 = (_: Int) + (_: Int)`
4.  `val f4: (Int, Int) => Int = (_ + _)`

Of these styles, (1) and (4) are to be preferred at all times. (2)
appears shorter in this example, but whenever the function value spans
multiple lines (as is normally the case), this syntax becomes extremely
unwieldy. Similarly, (3) is concise, but obtuse. It is difficult for the
untrained eye to decipher the fact that this is even producing a
function value.

When styles (1) and (4) are used exclusively, it becomes very easy to
distinguish places in the source code where function values are used.
Both styles make use of parentheses, since they look clean on a single line.

### Spacing

There should be no space between parentheses and the code they contain.
Curly braces should be separated from the code within them by a one-space gap,
to give the visually busy braces "breathing room".

### Multi-Expression Functions

Most function values are less trivial than the examples given above.
Many contain more than one expression. In such cases, it is often more
readable to split the function value across multiple lines. When this
happens, only style (1) should be used, substituting braces for parentheses.
Style (4) becomes extremely difficult to follow when enclosed in large amounts
of code. The declaration itself should loosely follow the declaration style for
methods, with the opening brace on the same line as the assignment or
invocation, while the closing brace is on its own line immediately
following the last line of the function. Parameters should be on the
same line as the opening brace, as should the "arrow" (`=>`):

{% tabs declarations_22 class=tabs-scala-version%}
{% tab 'Scala 2' for=declarations_22 %}
```scala
val f1 = { (a: Int, b: Int) =>
  val sum = a + b
  sum
}
```
{% endtab %}
{% tab 'Scala 3' for=declarations_22 %}
```scala
val f1 = (a: Int, b: Int) =>
  val sum = a + b
  sum
```
{% endtab %}
{% endtabs %}

As noted earlier, function values should leverage type inference
whenever possible.
