---
title: Contextual Abstractions
type: section
description: This section provides an introduction to Contextual Abstractions in Scala 3.
language: zh-cn
num: 14
previous-page: taste-collections
next-page: taste-toplevel-definitions

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


{% comment %}
TODO: Now that this is a separate section, it needs a little more content.
{% endcomment %}

在某些情况下，可以省略在方法调用中你认为是重复的的某些参数。

这些参数之所以称为 _上下文参数_，是因为它们是由编译器从方法调用周围的上下文中推断出来的。

例如，考虑一个程序，该程序按两个条件对地址列表进行排序：城市名称，然后是街道名称。

{% tabs contextual_1 %}
{% tab 'Scala 2 and 3' for=contextual_1 %}

```scala
val addresses: List[Address] = ...

addresses.sortBy(address => (address.city, address.street))
```
{% endtab %}
{% endtabs %}

`sortBy` 方法调用一个函数，该函数为每个地址返回值，这个值会用来与其他地址比较。
在本例中，我们传递一个函数，该函数返回一对，该对包含城市名称和街道名称。

请注意，我们只指示 _怎么_ 比较的，而不是 _如何_ 来执行比较。
排序算法如何知道如何比较 `String` 对的？

实际上，`sortBy` 方法采用第二个参数---一个上下文参数---该参数由编译器推断。
它不会出现在上面的示例中，因为它是由编译器提供的。

第二个参数实现 _如何_ 进行比较。
省略它很方便，因为我们知道 `String` 通常使用词典顺序进行比较。

但是，也可以显式传递它：

{% tabs contextual_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=contextual_2 %}

```scala
addresses.sortBy(address => (address.city, address.street))(Ordering.Tuple2(Ordering.String, Ordering.String))
```

{% endtab %}
{% tab 'Scala 3' for=contextual_2 %}

```scala
addresses.sortBy(address => (address.city, address.street))(using Ordering.Tuple2(Ordering.String, Ordering.String))
```
{% endtab %}
{% endtabs %}

在本例中，`Ordering.Tuple2(Ordering.String, Ordering.String)`  实例正是编译器以其他方式推断的实例。
换句话说，这两个示例生成相同的程序。

_上下文抽象_ 用于避免重复代码。
它们帮助开发人员编写可扩展且同时简洁的代码段。

有关更多详细信息，请参阅本书的[上下文抽象章节][contextual]，以及[参考文档][reference]。

[contextual]: {% link _zh-cn/overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[reference]: {{ site.scala3ref }}/overview.html
