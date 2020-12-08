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
```
10.+(1)
```

However, it's easier to read as an infix operator:
```
10 + 1
```

## Defining and using operators
You can use any legal identifier as an operator. This includes a name like `add` or a symbol(s) like `+`.
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
The class Vec has a method `+` which we used to add `vector1` and `vector2`. Using parentheses, you can build up complex expressions with readable syntax. Here is the definition of class `MyBool` which includes methods `and` and `or`:

```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

It is now possible to use `and` and `or` as infix operators:

```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

This helps to make the definition of `xor` more readable.

## Precedence
When an expression uses multiple operators, the operators are evaluated based on the priority of the first character:
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
(all letters)
```
This applies to functions you define. For example, the following expression:
```
a + b ^? c ?^ d less a ==> b | c
```
Is equivalent to
```
((a + b) ^? (c ?^ d)) less ((a ==> b) | c)
```
`?^` has the highest precedence because it starts with the character `?`. `+` has the second highest precedence, followed by `==>`, `^?`, `|`, and `less`.
