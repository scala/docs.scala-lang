---
title: Given 导入
type: section
description: This page demonstrates how 'given' import statements work in Scala 3.
languages:[en]
num: 62
previous-page: ca-context-bounds
next-page: ca-extension-methods

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


为了更清楚地说明当前作用域中的 given 来自何处，我们使用一种特殊形式的 `import` 语句来导入 `given` 实例。
此示例中显示了基本形式：

```scala
object A:
  class TC
  given tc: TC = ???
  def f(using TC) = ???

object B:
  import A.*       // import all non-given members
  import A.given   // import the given instance
```

在此代码中，对象 `B` 的 `import A.*` 子句导入 `A` 的所有成员*除了* `given` 实例 `tc`。
相反，第二个导入 `import A.given` *仅*导入 `given` 实例。
两个 `import` 子句也可以合并为一个：

```scala
object B:
  import A.{given, *}
```

## 讨论

通配符选择器 `*` 将除 given 或扩展之外的所有定义都导入作用域，而 `given` 选择器将所有 *given* 定义---包括由扩展而来的定义---导入作用域。

这些规则有两个主要优点：

- 更清楚当前作用域内 given 的来源。
  特别是，在一长串其他通配符导入中无法隐藏导入的 given 。
- 它可以导入所有 given ，而无需导入任何其他内容。
  这很重要，因为 given 是可以匿名的，因此通常使用命名导入是不切实际的。

“导入 given”语法的更多示例见 [package 和 import 章节][imports]。


[imports]: {% link _zh-cn/overviews/scala3-book/packaging-imports.md %}
