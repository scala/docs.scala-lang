---
title: Extension Methods
type: section
description: This page demonstrates how Extension Methods work in Scala 3.
languages: [ru, zh-cn]
num: 60
previous-page: ca-contextual-abstractions-intro
next-page: ca-context-parameters
scala3: true
versionSpecific: true
---

In Scala 2, a similar result could be achieved with [implicit classes]({% link _overviews/core/implicit-classes.md %}).

---

Extension methods let you add methods to a type after the type is defined, i.e., they let you add new methods to closed classes.
For example, imagine that someone else has created a `Circle` class:

{% tabs ext1 %}
{% tab 'Scala 2 and 3' %}
```scala
case class Circle(x: Double, y: Double, radius: Double)
```
{% endtab %}
{% endtabs %}

Now imagine that you need a `circumference` method, but you can’t modify their source code.
Before the concept of term inference was introduced into programming languages, the only thing you could do was write a method in a separate class or object like this:

{% tabs ext2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object CircleHelpers {
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object CircleHelpers:
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
```
{% endtab %}
{% endtabs %}

Then you’d use that method like this:

{% tabs ext3 %}
{% tab 'Scala 2 and 3' %}
```scala
val aCircle = Circle(2, 3, 5)

// without extension methods
CircleHelpers.circumference(aCircle)
```
{% endtab %}
{% endtabs %}

But with extension methods you can create a `circumference` method to work on `Circle` instances:

{% tabs ext4 %}
{% tab 'Scala 3 Only' %}
```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
```
{% endtab %}
{% endtabs %}

In this code:

- `Circle` is the type that the extension method `circumference` will be added to
- The `c: Circle` syntax lets you reference the variable `c` in your extension method(s)

Then in your code you use `circumference` just as though it was originally defined in the `Circle` class:

{% tabs ext5 %}
{% tab 'Scala 3 Only' %}
```scala
aCircle.circumference
```
{% endtab %}
{% endtabs %}

### Import extension method

Imagine, that `circumference` is defined in package `lib`, you can import it by

{% tabs ext6 %}
{% tab 'Scala 3 Only' %}
```scala
import lib.circumference

aCircle.circumference
```
{% endtab %}
{% endtabs %}

The compiler also supports you if the import is missing by showing a detailed compilation error message such as the following:

```text
value circumference is not a member of Circle, but could be made available as an extension method.

The following import might fix the problem:

   import lib.circumference
```

## Discussion

The `extension` keyword declares that you’re about to define one or more extension methods on the type that’s put in parentheses.
To define multiple extension methods on a type, use this syntax:

{% tabs ext7 %}
{% tab 'Scala 3 Only' %}
```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```
{% endtab %}
{% endtabs %}


