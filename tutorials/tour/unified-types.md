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

Here is an example that demonstrates that strings, integers, characters, boolean values, and functions are all objects just like every other object:

```tut
object UnifiedTypes extends App {
  val list: List[Any] = List(
    "a string",
    732,  // an integer
    'c',  // a character
    true, // a boolean value
    () => "an anonymous function returning a string"
  )

  list.foreach(element => println(element))
}
```

The application defines a variable `list` which refers to an instance of class `List[Any]`. The list is initialized with elements of various types. In the end, the application outputs something like below:

```tut
This is a string
732
c
true
$line15.$read$$iw$$iw$$$Lambda$1095/599060649@108a7fff
```
