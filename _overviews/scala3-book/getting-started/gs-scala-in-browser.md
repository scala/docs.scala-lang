---
title: Using Scala 3 in a Browser
description: This section describes how to start using Scala 3 in your browser with Scastie.
---

To start experimenting with Scala 3 right away, use <a href="https://scastie.scala-lang.org/?target=dotty" target="_blank">the “Scastie” web application in your browser</a>. Scastie is an online “playground” where you can experiment with Scala examples to see how things work.

<!--
TODO: it would be nice to have a default session to share, pre-loaded with a few examples
 -->

Scastie lets you:

- Edit and run code in your browser
- See the results of your expressions right next to your code
- Use different Scala versions
- Include Scala libraries into your code
- Save and share code fragments

You can go right to <a href="https://scastie.scala-lang.org/?target=dotty" target="_blank">the “Scastie” website</a>, but if you’d like a few ideas of what to test, here are some examples you can try:

```scala
// [1] Create a List and use higher-order functions with it
val nums = List.range(0, 5)
nums.map(_ * 2)
nums.filter(_ < 4)
nums.takeWhile(_ < 4)
nums.dropWhile(_ < 4)

// pass a method into `map`
def double(i: Int) = i * 2
nums.map(double)


// [2] define and use extension methods on String
// define extension methods
extension (s: String):
  def increment: String = s.map(c => (c + 1).toChar)
  def hideAll: String = s.replaceAll(".", "*")
  def asBoolean = s match
    case "0" | "zero" | "" | " " => false
    case _ => true

// use extension methods
// TODO: without @main this doesn’t work; with it,
// it doesn’t show the types
// ERROR: "Expected a toplevel definition"
@main def stringTests = 
  "HAL".increment      // IBM
  "password".hideAll   // ********
  "0".asBoolean        // Boolean = false
  "1".asBoolean        // Boolean = true


// [3] a method that returns a union
def randomUnion: Int | String | Double =
  val i = scala.util.Random.nextInt(3)
  i match 
    case 0 => 0
    case 1 => "1"
    case 2 => 2.0

@main def unions =
  for i <- 1 to 5 do println(randomUnion)
```




