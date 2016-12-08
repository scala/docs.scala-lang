---
layout: tutorial
title: Operators

disqus: true

tutorial: scala-tour
num: 29
next-page: automatic-closures
previous-page: local-type-inference
---

Any method which takes a single parameter can be used as an *infix operator* in Scala. Here is the definition of class `MyBool` which includes methods `and` and `or`:

```tut
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

It is now possible to use `and` and `or` as infix operators:

```tut
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

This helps to make the definition of `xor` more readable.

Here is the corresponding code in a more traditional object-oriented programming language syntax:

```tut
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)
```
