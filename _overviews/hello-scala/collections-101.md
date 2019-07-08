---
layout: multipage-overview
title: Scala Collections
description: This page provides an introduction to the Scala collections classes, including Vector, List, ArrayBuffer, Map, Set, and more.
partof: hello_scala
overview-name: Hello, Scala
num: 28
---


If you’re coming to Scala from Java, the best thing you can do is forget about the Java collections classes and use the Scala collections classes as they’re intended to be used. Speaking from my own experience, when I first started working with Scala I tried to use Java collections classes in my Scala code, and it slowed down my progress.



## The main Scala collections classes

The main Scala collections classes you’ll use on a regular basis are:

<!--
- `ArrayBuffer` - an indexed, mutable sequence
- `List` - a linear, immutable sequence
- `Vector` - an indexed, immutable sequence
- `Map` - the base `Map` class
    - there are many variations for special needs
- `Set` - the base `Set` class
    - other variations for special needs
-->

| Class         | Description   |
| ------------- | ------------- |
| `ArrayBuffer` | an indexed, mutable sequence |
| `List`        | a linear (linked list), immutable sequence |
| `Vector`      | an indexed, immutable sequence |
| `Map`         | the base `Map` (key/value pairs) class |
| `Set`         | the base `Set` class |

`Map` and `Set` come in both mutable and immutable versions.

I’ll demonstrate the basics of these classes in the following lessons.

>In the following lessons on Scala collections classes, whenever I use the word *immutable*, it’s safe to assume that the class is intended for use in a *functional programming* (FP) style.








