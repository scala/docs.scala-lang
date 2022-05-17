---
title: Toplevel Definitions
type: section
description: This page provides an introduction to top-level definitions in Scala 3
num: 15
previous-page: taste-contextual-abstractions
next-page: taste-summary
---


在 Scala 3 中，各种定义都可以在源代码文件的 “顶层” 编写。
例如，您可以创建一个名为 _MyCoolApp.scala_ 的文件，并将以下内容放入其中：

```scala
import scala.collection.mutable.ArrayBuffer

enum Topping:
  case Cheese, Pepperoni, Mushrooms

import Topping.*
class Pizza:
  val toppings = ArrayBuffer[Topping]()

val p = Pizza()

extension (s: String)
  def capitalizeAllWords = s.split(" ").map(_.capitalize).mkString(" ")

val hwUpper = "hello, world".capitalizeAllWords

type Money = BigDecimal

// more definitions here as desired ...

@main def myApp =
  p.toppings += Cheese
  println("show me the code".capitalizeAllWords)
```

如代码中展示的，无需将这些定义放在 `package`, `class` 或其他构造中。

## 替换包对象

如果你熟悉Scala 2，这种方法可以取代 _包对象_。
但是，虽然更易于使用，但它们的工作方式类似：当您将定义放在名为 _foo_ 的包中时，您可以在 _foo_ 包内的所有其他包内访问该定义，例如在此示例中的 _foo.bar_ 包中：

```scala
package foo {
  def double(i: Int) = i * 2
}

package foo {
  package bar {
    @main def fooBarMain =
      println(s"${double(1)}")   // this works
  }
}
```

本示例中使用大括号来强调包嵌套。

这种方法的好处是，您可以将定义放在名为 _com.acme.myapp_ 的包下，然后可以在 _com.acme.myapp.model_、_com.acme.myapp.controller_ 等中引用这些定义。
