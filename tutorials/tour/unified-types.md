---
layout: tutorial
title: Unified Types

disqus: true

tutorial: scala-tour
num: 2
next-page: classes
previous-page: tour-of-scala
---

In contrast to Java, all values in Scala are objects (including numerical values and functions). Since Scala is class-based, all values are instances of a class. The diagram below illustrates the class hierarchy.

![Scala Type Hierarchy]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## Scala Class Hierarchy ##

The superclass of all classes `scala.Any` has two direct subclasses: `scala.AnyVal` and `scala.AnyRef`.

`scala.AnyVal` represents value classes. All value classes are predefined; they correspond to the primitive types of Java-like languages. Note that the diagram above also shows implicit conversions between the value classes.

`scala.AnyRef` represents reference classes. All non-value classes are defined as reference class. Every user-defined class in Scala implicitly extends `scala.AnyRef`. If Scala is used in the context of a Java runtime environment, then `scala.AnyRef` corresponds to `java.lang.Object`.

Here is an example that demonstrates that numbers, characters, boolean values, and functions are all objects just like every other object:

```tut
object UnifiedTypes extends App {
  var list: List[Any] = List()

  list = list :+ "This is a string"
  list = list :+ 732
  list = list :+ 'c'
  list = list :+ true
  list = list :+ (() => "This is an anonymous function returning a string")

  list.foreach(element => println(element))
}
```

The program defines a variable `list` which refers to an instance of class `List[Any]`. The program adds elements of various types to this list. In the end, the program outputs something like below:

```tut
This is a string
732
c
true
$line15.$read$$iw$$iw$$$Lambda$1095/599060649@108a7fff
```
