---
title: 函数是值
type: section
description: This section looks at the use of functions as values in functional programming.
language: zh-cn
num: 45
previous-page: fp-pure-functions
next-page: fp-functional-error-handling

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


虽然曾经创建的每种编程语言都可能允许您编写纯函数，但 Scala FP 的第二个重要特性是*您可以将函数创建为值*，就像您创建 `String` 和 `Int` 值一样。

这个特性有很多好处，其中最常见的是（a）您可以定义方法来接受函数参数，以及（b）您可以将函数作为参数传递给方法。
你已经在本书的多个地方看到了这一点，每当演示像 `map` 和 `filter` 这样的方法时：

{% tabs fp-function-as-values-anonymous %}
{% tab 'Scala 2 and 3' %}
```scala
val nums = (1 to 10).toList

val doubles = nums.map(_ * 2)           // double each value
val lessThanFive = nums.filter(_ < 5)   // List(1,2,3,4)
```
{% endtab %}
{% endtabs %}

在这些示例中，匿名函数被传递到 `map` 和 `filter` 中。

> 匿名函数也称为 *lambdas*。

除了将匿名函数传递给 `filter` 和 `map` 之外，您还可以为它们提供 *方法*：

{% tabs fp-function-as-values-defined %}
{% tab 'Scala 2 and 3' %}
```scala
// two methods
def double(i: Int): Int = i * 2
def underFive(i: Int): Boolean = i < 5

// pass those methods into filter and map
val doubles = nums.filter(underFive).map(double)
```
{% endtab %}
{% endtabs %}

这种将方法和函数视为值的能力是函数式编程语言提供的强大特性。

> 从技术上讲，将另一个函数作为输入参数的函数称为 *高阶函数*。
> （如果你喜欢幽默，就像有人曾经写过的那样，这就像说一个将另一个类的实例作为构造函数参数的类是一个高阶类。）

## 函数、匿名函数和方法

正如您在这些示例中看到的，这是一个匿名函数：

{% tabs fp-anonymous-function-short %}
{% tab 'Scala 2 and 3' %}
```scala
_ * 2
```
{% endtab %}
{% endtabs %}

如 [高阶函数][hofs] 讨论中所示，上面的写法是下面语法的简写版本：

{% tabs fp-anonymous-function-full %}
{% tab 'Scala 2 and 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

像这样的函数被称为“匿名”，因为它们没有名字。
如果你想给一个名字，只需将它分配给一个变量：

{% tabs fp-function-assignement %}
{% tab 'Scala 2 and 3' %}
```scala
val double = (i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

现在你有了一个命名函数，一个分配给变量的函数。
您可以像使用方法一样使用此函数：

{% tabs fp-function-used-like-method %}
{% tab 'Scala 2 and 3' %}
```scala
double(2)   // 4
```
{% endtab %}
{% endtabs %}

在大多数情况下，`double` 是函数还是方法并不重要。 Scala 允许您以同样的方式对待它们。
在幕后，让您像对待函数一样对待方法的 Scala 技术被称为 [Eta 表达式][eta]。

这种将函数作为变量无缝传递的能力是 Scala 等函数式编程语言的一个显着特征。
正如您在本书中的 `map` 和 `filter` 示例中所见，将函数传递给其他函数的能力有助于您创建简洁且仍然可读的代码---*富有表现力*。

如果您对将函数作为参数传递给其他函数的过程不适应，可以尝试以下几个示例：

{% tabs fp-function-as-values-example %}
{% tab 'Scala 2 and 3' %}
```scala
List("bob", "joe").map(_.toUpperCase)   // List(BOB, JOE)
List("bob", "joe").map(_.capitalize)    // List(Bob, Joe)
List("plum", "banana").map(_.length)    // List(4, 6)

val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)       // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)   // List(A, P, P, L, E, P, E, A, R)

val nums = List(5, 1, 3, 11, 7)
nums.map(_ * 2)         // List(10, 2, 6, 22, 14)
nums.filter(_ > 3)      // List(5, 11, 7)
nums.takeWhile(_ < 6)   // List(5, 1, 3)
nums.sortWith(_ < _)    // List(1, 3, 5, 7, 11)
nums.sortWith(_ > _)    // List(11, 7, 5, 3, 1)

nums.takeWhile(_ < 6).sortWith(_ < _)   // List(1, 3, 5)
```
{% endtab %}
{% endtabs %}

[hofs]: {% link _zh-cn/overviews/scala3-book/fun-hofs.md %}
[eta]: {% link _zh-cn/overviews/scala3-book/fun-eta-expansion.md %}
