---
layout: tutorial
title: Unified Types

disqus: true

tutorial: scala-tour
num: 2
next-page: classes
previous-page: tour-of-scala
---

In Scala, all values are instance of a class, including numerical values and functions. The diagram below illustrates the class hierarchy.

![Scala Type Hierarchy]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## Scala Class Hierarchy ##

The superclass of all classes `scala.Any` has two direct subclasses: `scala.AnyVal` and `scala.AnyRef`.

`scala.AnyVal` represents value classes. All value classes are not nullable and predefined; they correspond to the primitive types of Java-like languages. Note that the diagram above also shows implicit conversions between the value classes.

`scala.AnyRef` represents reference classes. All non-value classes are defined as reference class. Every user-defined class in Scala implicitly extends `scala.AnyRef`. If Scala is used in the context of a Java runtime environment, `scala.AnyRef` corresponds to `java.lang.Object`.

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

The program declares an application `UnifiedTypes` in form of a top-level [singleton object](singleton-objects.html) extending [`App`](http://www.scala-lang.org/api/2.12.x/scala/App.html) so that the body of it acts as a main function.

The application defines a variable `list` of type `List[Any]`. The list is initialized with elements of various types, but they all are instance of `scala.Any`, so you can add them to the list.

In the end, the application outputs something like below:

```tut
a string
732
c
true
<function>
```
