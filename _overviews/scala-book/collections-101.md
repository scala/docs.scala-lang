---
type: chapter
layout: multipage-overview
title: Scala Collections
description: This page provides an introduction to the Scala collections classes, including Vector, List, ArrayBuffer, Map, Set, and more.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 28
outof: 54
previous-page: abstract-classes
next-page: arraybuffer-examples
---


If you’re coming to Scala from Java, the best thing you can do is forget about the Java collections classes and use the Scala collections classes as they’re intended to be used. As one author of this book has said, “Speaking from personal experience, when I first started working with Scala I tried to use Java collections classes in my Scala code, and all that did was slow down my progress.”



## The main Scala collections classes

The main Scala collections classes you’ll use on a regular basis are:

| Class         | Description   |
| ------------- | ------------- |
| `ArrayBuffer` | an indexed, mutable sequence |
| `List`        | a linear (linked list), immutable sequence |
| `Vector`      | an indexed, immutable sequence |
| `Map`         | the base `Map` (key/value pairs) class |
| `Set`         | the base `Set` class |

`Map` and `Set` come in both mutable and immutable versions.

We’ll demonstrate the basics of these classes in the following lessons.

>In the following lessons on Scala collections classes, whenever we use the word *immutable*, it’s safe to assume that the class is intended for use in a *functional programming* (FP) style. With these classes you don’t modify the collection; you apply functional methods to the collection to create a new result. You’ll see what this means in the examples that follow.



