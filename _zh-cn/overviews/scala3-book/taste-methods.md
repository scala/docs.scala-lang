---
title: 方法
type: section
description: This section provides an introduction to defining and using methods in Scala 3.
language: zh-cn
num: 10
previous-page: taste-modeling
next-page: taste-functions

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


## Scala 方法

Scala 类、样例类、traits、枚举和对象都可以包含方法。
简单方法的语法如下所示：

{% tabs method_1 %}
{% tab 'Scala 2 and 3' for=method_1 %}

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
```

{% endtab %}
{% endtabs %}

这有一些例子：

{% tabs method_2 %}
{% tab 'Scala 2 and 3' for=method_2 %}

```scala
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
```

{% endtab %}
{% endtabs %}

您不必声明方法的返回类型，因此如果您愿意，可以像这样编写这些方法：

{% tabs method_3 %}
{% tab 'Scala 2 and 3' for=method_3 %}

```scala
def sum(a: Int, b: Int) = a + b
def concatenate(s1: String, s2: String) = s1 + s2
```

{% endtab %}
{% endtabs %}

这是你如何调用这些方法：

{% tabs method_4 %}
{% tab 'Scala 2 and 3' for=method_4 %}

```scala
val x = sum(1, 2)
val y = concatenate("foo", "bar")
```

{% endtab %}
{% endtabs %}

这是一个多行的方法：

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

方法参数也可以具有默认值。
在此示例中，`timeout` 参数的默认值为 `5000`：

{% tabs method_6 %}
{% tab 'Scala 2 and 3' for=method_6 %}

```scala
def makeConnection(url: String, timeout: Int = 5000): Unit =
  println(s"url=$url, timeout=$timeout")
```

{% endtab %}
{% endtabs %}

由于方法声明中提供了默认的 `超时` 值，因此可以通过以下两种方式调用该方法：

{% tabs method_7 %}
{% tab 'Scala 2 and 3' for=method_7 %}

```scala
makeConnection("https://localhost")         // url=http://localhost, timeout=5000
makeConnection("https://localhost", 2500)   // url=http://localhost, timeout=2500
```

{% endtab %}
{% endtabs %}

Scala 还支持在调用方法时使用 _命名参数_，因此如果您愿意，也可以像这样调用该方法：

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

当多个方法参数具有相同的类型时，命名参数特别有用。
乍一看，使用此方法，您可能想知道哪些参数设置为 `true` 或 `false`：

{% tabs method_9 %}
{% tab 'Scala 2 and 3' for=method_9 %}

```scala
engage(true, true, true, false)
```

{% endtab %}
{% endtabs %}

如果没有IDE的帮助，那段代码可能很难阅读，但这个代码要明显得多：

{% tabs method_10 %}
{% tab 'Scala 2 and 3' for=method_10 %}

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```
{% endtab %}
{% endtabs %}

## 扩展方法

_扩展方法_ 允许您向封闭类添加新方法。
例如，如果要将两个名为 `hello` 和 `aloha` 的方法添加到 `String` 类中，请将它们声明为扩展方法：

{% tabs extension0 %}
{% tab 'Scala 3 Only' %}

```scala
extension (s: String)
  def hello: String = s"Hello, ${s.capitalize}!"
  def aloha: String = s"Aloha, ${s.capitalize}!"

"world".hello    // "Hello, World!"
"friend".aloha   // "Aloha, Friend!"
```

{% endtab %}
{% endtabs %}

`extension` 关键字声明了括号内的参数将定义一个或多个扩展方法。
如此示例所示，可以在扩展方法体中使用 `String` 类型的参数 `s`。

下一个示例演示如何将 `makeInt` 方法添加到 `String` 类。
在这里，`makeInt` 采用一个名为 `radix` 的参数。
该代码不考虑可能的字符串到整数转换错误，但跳过细节，示例显示了它的工作原理：

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

## 参见

Scala方法可以更强大：它们可以采用类型参数和上下文参数。
它们在[领域建模][data-1]一节中有详细介绍。

[data-1]: {% link _zh-cn/overviews/scala3-book/domain-modeling-tools.md %}
