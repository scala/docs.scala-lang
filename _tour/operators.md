---
layout: tour
title: Operators
partof: scala-tour

num: 32
next-page: by-name-parameters
previous-page: type-inference
prerequisite-knowledge: case-classes

redirect_from: "/tutorials/tour/operators.html"
---
In Scala, operators are methods. Any method with a single parameter can be used as an _infix operator_. For example, `+` can be called with dot-notation:

{% tabs operators_1 %}
{% tab 'Scala 2 and 3' for=operators_1 %}
```
10.+(1)
```
{% endtab %}
{% endtabs %}

However, it's easier to read as an infix operator:

{% tabs operators_2 %}
{% tab 'Scala 2 and 3' for=operators_2 %}
```
10 + 1
```
{% endtab %}
{% endtabs %}

## Defining and using operators
You can use any legal identifier as an operator. This includes a name like `add` or a symbol(s) like `+`.

{% tabs operators_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=operators_3 %}
```scala mdoc
case class Vec(x: Double, y: Double) {
  def +(that: Vec) = Vec(this.x + that.x, this.y + that.y)
}

val vector1 = Vec(1.0, 1.0)
val vector2 = Vec(2.0, 2.0)

val vector3 = vector1 + vector2
vector3.x  // 3.0
vector3.y  // 3.0
```
{% endtab %}
{% tab 'Scala 3' for=operators_3 %}
```scala
case class Vec(x: Double, y: Double):
  def +(that: Vec) = Vec(this.x + that.x, this.y + that.y)

val vector1 = Vec(1.0, 1.0)
val vector2 = Vec(2.0, 2.0)

val vector3 = vector1 + vector2
vector3.x  // 3.0
vector3.y  // 3.0
```
{% endtab %}
{% endtabs %}

The class Vec has a method `+` which we used to add `vector1` and `vector2`. Using parentheses, you can build up complex expressions with readable syntax. Here is the definition of class `MyBool` which includes methods `and` and `or`:

{% tabs operators_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=operators_4 %}
```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```
{% endtab %}
{% tab 'Scala 3' for=operators_4 %}
```scala
case class MyBool(x: Boolean):
  def and(that: MyBool): MyBool = if x then that else this
  def or(that: MyBool): MyBool = if x then this else that
  def negate: MyBool = MyBool(!x)
```
{% endtab %}
{% endtabs %}

It is now possible to use `and` and `or` as infix operators:

{% tabs operators_5 %}
{% tab 'Scala 2 and 3' for=operators_5 %}
```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```
{% endtab %}
{% endtabs %}

This helps to make the definition of `xor` more readable.

## Precedence
When an expression uses multiple operators, the operators are evaluated based on the priority of the first character:

{% tabs operators_6 %}
{% tab 'Scala 2 and 3' for=operators_6 %}
```
(characters not shown below)
* / %
+ -
:
= !
< >
&
^
|
(all letters, $, _)
```
{% endtab %}
{% endtabs %}

This applies to functions you define. For example, the following expression:

{% tabs operators_7 %}
{% tab 'Scala 2 and 3' for=operators_7 %}
```
a + b ^? c ?^ d less a ==> b | c
```
{% endtab %}
{% endtabs %}

Is equivalent to

{% tabs operators_8 %}
{% tab 'Scala 2 and 3' for=operators_8 %}
```
((a + b) ^? (c ?^ d)) less ((a ==> b) | c)
```
{% endtab %}
{% endtabs %}

`?^` has the highest precedence because it starts with the character `?`. `+` has the second highest precedence, followed by `==>`, `^?`, `|`, and `less`.
