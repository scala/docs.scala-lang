---
title: Methods
type: section
description: This section provides an introduction to defining and using methods in Scala 3.
num: 10
previous-page: taste-modeling
next-page: taste-functions
---


## Scala methods

Scala classes, case classes, traits, enums, and objects can all contain methods.
The syntax of a simple method looks like this:

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
```

Here are a few examples:

```scala
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
```

You don’t have to declare a method’s return type, so you can write those methods like this, if you prefer:

```scala
def sum(a: Int, b: Int) = a + b
def concatenate(s1: String, s2: String) = s1 + s2
```

This is how you call those methods:

```scala
val x = sum(1, 2)
val y = concatenate("foo", "bar")
```

Here’s an example of a multiline method:

```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = new StringWriter
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
```

Method parameters can also have default values.
In this example, the `timeout` parameter has a default value of `5000`:

```scala
def makeConnection(url: String, timeout: Int = 5000): Unit =
  println(s"url=$url, timeout=$timeout")
```

Because a default `timeout` value is supplied in the method declaration, the method can be called in these two ways:

```scala
makeConnection("https://localhost")         // url=http://localhost, timeout=5000
makeConnection("https://localhost", 2500)   // url=http://localhost, timeout=2500
```

Scala also supports the use of _named parameters_ when calling a method, so you can also call that method like this, if you prefer:

```scala
makeConnection(
  url = "https://localhost",
  timeout = 2500
)
```

Named parameters are particularly useful when multiple method parameters have the same type.
At a glance, with this method you may wonder which parameters are set to `true` or `false`:

```scala
engage(true, true, true, false)
```

Without help from an IDE that code can be hard to read, but this code is much more obvious:

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```



## Extension methods

_Extension methods_ let you add new methods to closed classes.
For instance, if you want to add two methods named `hello` and `aloha` to the `String` class, declare them as extension methods:

```scala
extension (s: String)
  def hello: String = s"Hello, ${s.capitalize}!"
  def aloha: String = s"Aloha, ${s.capitalize}!"

"world".hello    // "Hello, World!"
"friend".aloha   // "Aloha, Friend!"
```

The `extension` keyword declares that you’re about to define one or more extension methods on the parameter that’s put in parentheses.
As shown with this example, the parameter `s` of type `String` can then be used in the body of your extension methods.

This next example shows how to add a `makeInt` method to the `String` class.
Here, `makeInt` takes a parameter named `radix`.
The code doesn’t account for possible string-to-integer conversion errors, but skipping that detail, the examples show how it works:

```scala
extension (s: String)
  def makeInt(radix: Int): Int = Integer.parseInt(s, radix)

"1".makeInt(2)      // Int = 1
"10".makeInt(2)     // Int = 2
"100".makeInt(2)    // Int = 4
```



## See also

Scala Methods can be much more powerful: they can take type parameters and context parameters.
They are covered in detail in the [Data Modeling][data-1] section.



[data-1]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
