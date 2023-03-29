---
title: 集合
type: section
description: This page provides a high-level overview of the main features of the Scala 3 programming language.
language: zh-cn
num: 13
previous-page: taste-objects
next-page: taste-contextual-abstractions

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 库具有一组丰富的集合类，这些类具有一组丰富的方法。
集合类有不可变和可变两种形式。

## 创建列表

为了让您了解这些类的工作原理，下面是一些使用 `List` 类的示例，该类是不可变的链接列表类。
这些示例显示了创建填充的 `List` 的不同方法：

{% tabs collection_1 %}
{% tab 'Scala 2 and 3' for=collection_1 %}

```scala
val a = List(1, 2, 3)           // a: List[Int] = List(1, 2, 3)

// Range methods
val b = (1 to 5).toList         // b: List[Int] = List(1, 2, 3, 4, 5)
val c = (1 to 10 by 2).toList   // c: List[Int] = List(1, 3, 5, 7, 9)
val e = (1 until 5).toList      // e: List[Int] = List(1, 2, 3, 4)
val f = List.range(1, 5)        // f: List[Int] = List(1, 2, 3, 4)
val g = List.range(1, 10, 3)    // g: List[Int] = List(1, 4, 7)
```

{% endtab %}
{% endtabs %}

## `List`方法

拥有填充的列表后，以下示例将显示可以对其调用的一些方法。
请注意，这些都是函数式方法，这意味着它们不会改变调用的集合，而是返回包含更新元素的新集合。
每个表达式返回的结果显示在每行的注释中：

{% tabs collection_2 %}
{% tab 'Scala 2 and 3' for=collection_2 %}

```scala
// a sample list
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.drop(2)                             // List(30, 40, 10)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeWhile(_ < 30)                   // List(10, 20)

// flatten
val a = List(List(1,2), List(3,4))
a.flatten                             // List(1, 2, 3, 4)

// map, flatMap
val nums = List("one", "two")
nums.map(_.toUpperCase)               // List("ONE", "TWO")
nums.flatMap(_.toUpperCase)           // List('O', 'N', 'E', 'T', 'W', 'O')
```

{% endtab %}
{% endtabs %}

这些示例显示了如何使用 `foldLeft` 和 `reduceLeft` 方法来对整数序列中的值求和：

{% tabs collection_3 %}
{% tab 'Scala 2 and 3' for=collection_3 %}

```scala
val firstTen = (1 to 10).toList            // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

firstTen.reduceLeft(_ + _)                 // 55
firstTen.foldLeft(100)(_ + _)              // 155 (100 is a “seed” value)
```

{% endtab %}
{% endtabs %}

Scala 集合类还有更多可用的方法，它们在[集合章节][collections]和 [API 文档][api]中进行了演示。

## 元组

Scala _元组_ 是一种类型，可让您轻松地将不同类型的集合放在同一个容器中。
例如，给定以下 `Person` 样例类：

{% tabs collection_4 %}
{% tab 'Scala 2 and 3' for=collection_4 %}

```scala
case class Person(name: String)
```

{% endtab %}
{% endtabs %}

这是演示你如创建一个元组，这个元组包含 `Int`, `String`, 和定制的 `Person` 值：

{% tabs collection_5 %}
{% tab 'Scala 2 and 3' for=collection_5 %}

```scala
val t = (11, "eleven", Person("Eleven"))
```

{% endtab %}
{% endtabs %}

有元组后，可以通过将其值绑定到变量来访问，也可以通过数字访问它们：

{% tabs collection_6 %}
{% tab 'Scala 2 and 3' for=collection_6 %}

```scala
t(0)   // 11
t(1)   // "eleven"
t(2)   // Person("Eleven")
```

{% endtab %}
{% endtabs %}

您还可以使用以下 _解构_ 的办法将元组字段分配变量名：

{% tabs collection_7 %}
{% tab 'Scala 2 and 3' for=collection_7 %}

```scala
val (num, str, person) = t

// result:
// val num: Int = 11
// val str: String = eleven
// val person: Person = Person(Eleven)
```

{% endtab %}
{% endtabs %}

有些情况更适合使用元组， 那就是当你想要将异构类型的集合放在一个小的类似集合的结构中。
有关更多元组详细信息，请参阅 [参考文档][reference]。

[collections]: {% link _zh-cn/overviews/scala3-book/collections-intro.md %}
[api]: https://scala-lang.org/api/3.x/
[reference]: {{ site.scala3ref }}/overview.html
