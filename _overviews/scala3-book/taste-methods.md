---
title: Methods
type: section
description: This section provides an introduction to defining and using methods in Scala 3.
languages: [zh-cn]
num: 10
previous-page: taste-modeling
next-page: taste-functions
---


## Scala methods

Scala classes, case classes, traits, enums, and objects can all contain methods.
The syntax of a simple method looks like this:

{% tabs method_1 %}
{% tab 'Scala 2 and 3' for=method_1 %}
```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
```
{% endtab %}
{% endtabs %}

Here are a few examples:

{% tabs method_2 %}
{% tab 'Scala 2 and 3' for=method_2 %}
```scala
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
```
{% endtab %}
{% endtabs %}

You don’t have to declare a method’s return type, so you can write those methods like this, if you prefer:

{% tabs method_3 %}
{% tab 'Scala 2 and 3' for=method_3 %}
```scala
def sum(a: Int, b: Int) = a + b
def concatenate(s1: String, s2: String) = s1 + s2
```
{% endtab %}
{% endtabs %}

This is how you call those methods:

{% tabs method_4 %}
{% tab 'Scala 2 and 3' for=method_4 %}
```scala
val x = sum(1, 2)
val y = concatenate("foo", "bar")
```
{% endtab %}
{% endtabs %}

Here’s an example of a multiline method:

{% tabs method_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_5 %}
```scala
def getStackTraceAsString(t: Throwable): String = {
  val sw = new StringWriter
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
}
```
{% endtab %}

{% tab 'Scala 3' for=method_5 %}
```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = new StringWriter
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
```
{% endtab %}
{% endtabs %}

Method parameters can also have default values.
In this example, the `timeout` parameter has a default value of `5000`:

{% tabs method_6 %}
{% tab 'Scala 2 and 3' for=method_6 %}
```scala
def makeConnection(url: String, timeout: Int = 5000): Unit =
  println(s"url=$url, timeout=$timeout")
```
{% endtab %}
{% endtabs %}

Because a default `timeout` value is supplied in the method declaration, the method can be called in these two ways:

{% tabs method_7 %}
{% tab 'Scala 2 and 3' for=method_7 %}
```scala
makeConnection("https://localhost")         // url=http://localhost, timeout=5000
makeConnection("https://localhost", 2500)   // url=http://localhost, timeout=2500
```
{% endtab %}
{% endtabs %}

Scala also supports the use of _named parameters_ when calling a method, so you can also call that method like this, if you prefer:

{% tabs method_8 %}
{% tab 'Scala 2 and 3' for=method_8 %}
```scala
makeConnection(
  url = "https://localhost",
  timeout = 2500
)
```
{% endtab %}
{% endtabs %}

Named parameters are particularly useful when multiple method parameters have the same type.
At a glance, with this method you may wonder which parameters are set to `true` or `false`:

{% tabs method_9 %}
{% tab 'Scala 2 and 3' for=method_9 %}

```scala
engage(true, true, true, false)
```

{% endtab %}
{% endtabs %}

The `extension` keyword declares that you’re about to define one or more extension methods on the parameter that’s put in parentheses.
As shown with this example, the parameter `s` of type `String` can then be used in the body of your extension methods.

This next example shows how to add a `makeInt` method to the `String` class.
Here, `makeInt` takes a parameter named `radix`.
The code doesn’t account for possible string-to-integer conversion errors, but skipping that detail, the examples show how it works:

{% tabs extension %}
{% tab 'Scala 3 Only' %}

```scala
extension (s: String)
  def makeInt(radix: Int): Int = Integer.parseInt(s, radix)

"1".makeInt(2)      // Int = 1
"10".makeInt(2)     // Int = 2
"100".makeInt(2)    // Int = 4
```

{% endtab %}
{% endtabs %}

## See also

Scala Methods can be much more powerful: they can take type parameters and context parameters.
They are covered in detail in the [Domain Modeling][data-1] section.

[data-1]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
