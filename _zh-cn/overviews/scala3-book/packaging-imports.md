---
title: 打包和导入
type: chapter
description: A discussion of using packages and imports to organize your code, build related modules of code, control scope, and help prevent namespace collisions.
language: zh-cn
num: 36
previous-page: fun-summary
next-page: collections-intro

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 使用 *包* 创建命名空间，让您可以模块化程序并帮助防止命名空间冲突。
Scala 支持 Java 使用的包命名样式，也支持 C++ 和 C# 等语言使用的“花括号”命名空间表示法。

Scala 导入成员的方法也类似于 Java，并且更灵活。
使用 Scala，您可以：

- 导入包、类、对象、traits 和方法
- 将导入语句放在任何地方
- 导入成员时隐藏和重命名成员

这些特性在以下示例中进行了演示。

## 创建一个包

通过在 Scala 文件的顶部声明一个或多个包名称来创建包。
例如，当您的域名是 _acme.com_ 并且您正在使用名为 _myapp_ 的应用程序中的 _model_ 包中工作时，您的包声明如下所示：

{% tabs packaging-imports-0 %}
{% tab 'Scala 2 and 3' %}
```scala
package com.acme.myapp.model

class Person ...
```
{% endtab %}
{% endtabs %}

按照约定，包名应全部小写，正式命名约定为 *\<top-level-domain>.\<domain-name>.\<project-name>.\<module-name>*。

虽然不是必需的，但包名称通常遵循目录结构名称，因此如果您遵循此约定，则此项目中的 `Person` 类将在 *MyApp/src/main/scala/com/acme/myapp/model/Person.scala* 文件中找到。

### 在同一个文件中使用多个包

上面显示的语法适用于整个源文件：文件中的所有定义
`Person.scala` 属于 `com.acme.myapp.model` 包，根据包子句
在文件的开头。

或者，可以编写仅适用于定义的包子句
他们包含：

{% tabs packaging-imports-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}```scala
package users {

  package administrators {  // the full name of this package is users.administrators
    class AdminUser        // the full name of this class users.administrators.AdminUser
  }
  package normalusers {     // the full name of this package is users.normalusers
    class NormalUser       // the full name of this class is users.normalusers.NormalUser
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-1 %}

```scala
package users:

  package administrators:  // the full name of this package is users.administrators
    class AdminUser        // the full name of this class is users.administrators.AdminUser

  package normalusers:     // the full name of this package is users.normalusers
    class NormalUser       // the full name of this class is users.normalusers.NormalUser
```
{% endtab %}
{% endtabs %}

请注意，包名称后跟一个冒号，并且其中的定义
一个包是缩进的。

这种方法的优点是它允许包嵌套，并提供更明显的范围和封装控制，尤其是在同一个文件中。

## 导入语句，第 1 部分

导入语句用于访问其他包中的实体。
导入语句分为两大类：

- 导入类、trait、对象、函数和方法
- 导入 `given` 子句

如果您习惯于 Java 之类的语言，则第一类 import 语句与 Java 使用的类似，只是语法略有不同，因此具有更大的灵活性。
这些示例展示了其中的一些灵活性：

{% tabs packaging-imports-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import users._                            // import everything from the `users` package
import users.User                         // import only the `User` class
import users.{User, UserPreferences}      // import only two selected members
import users.{UserPreferences as UPrefs}  // rename a member as you import it
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-2 %}

```scala
import users.*                            // import everything from the `users` package
import users.User                         // import only the `User` class
import users.{User, UserPreferences}      // import only two selected members
import users.{UserPreferences as UPrefs}  // rename a member as you import it
```

{% endtab %}
{% endtabs %}

这些示例旨在让您了解第一类 `import` 语句的工作原理。
在接下来的小节中对它们进行了更多解释。

导入语句还用于将 `given` 实例导入本范围。
这些将在本章末尾讨论。

继续之前的注意事项：

> 访问同一包的成员不需要导入子句。

### 导入一个或多个成员

在 Scala 中，您可以从包中导入一个成员，如下所示：

{% tabs packaging-imports-3 %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.concurrent.Future
```
{% endtab %}
{% endtabs %}

和这样的多个成员：

{% tabs packaging-imports-4 %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.concurrent.Future
import scala.concurrent.Promise
import scala.concurrent.blocking
```
{% endtab %}
{% endtabs %}

导入多个成员时，您可以像这样更简洁地导入它们：

{% tabs packaging-imports-5 %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.concurrent.{Future, Promise, blocking}
```
{% endtab %}
{% endtabs %}

当您想从 *scala.concurrent* 包中导入所有内容时，请使用以下语法：

{% tabs packaging-imports-6 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import scala.concurrent._
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-6 %}

```scala
import scala.concurrent.*
```
{% endtab %}
{% endtabs %}

### 在导入时重命名成员

有时，在导入实体时重命名实体会有所帮助，以避免名称冲突。
例如，如果您想同时使用 Scala `List` 类和 *java.util.List* 类，可以在导入时重命名 *java.util.List* 类：

{% tabs packaging-imports-7 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{List => JavaList}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-7 %}

```scala
import java.util.{List as JavaList}
```
{% endtab %}
{% endtabs %}

现在您使用名称 `JavaList` 来引用该类，并使用 `List` 来引用 Scala 列表类。

您还可以使用以下语法一次重命名多个成员：

{% tabs packaging-imports-8 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{Date => JDate, HashMap => JHashMap, _}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-8 %}

```scala
import java.util.{Date as JDate, HashMap as JHashMap, *}
```

{% endtab %}
{% endtabs %}

那行代码说，“重命名 `Date` 和 `HashMap` 类，如图所示，并导入 _java.util_ 包中的所有其他内容，而不重命名任何其他成员。”

### 在导入时隐藏成员

您还可以在导入过程中*隐藏*成员。
这个 `import` 语句隐藏了 *java.util.Random* 类，同时导入 *java.util 中的所有其他内容* 包裹：

{% tabs packaging-imports-9 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{Random => _, _}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-9 %}

```scala
import java.util.{Random as _, *}
```
{% endtab %}
{% endtabs %}

如果您尝试访问 `Random` 类，它将无法正常工作，但您可以访问该包中的所有其他成员：

{% tabs packaging-imports-10 %}
{% tab 'Scala 2 and 3' %}
```scala
val r = new Random   // won’t compile
new ArrayList        // works
```
{% endtab %}
{% endtabs %}

#### 隐藏多个成员

要在导入过程中隐藏多个成员，请在使用最终通配符导入之前列出它们：

{% tabs packaging-imports-11 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
scala> import java.util.{List => _, Map => _, Set => _, _}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-11 %}

```scala
scala> import java.util.{List as _, Map as _, Set as _, *}
```
{% endtab %}
{% endtabs %}

这些类再次被隐藏，但您可以使用 *java.util* 中的所有其他类：

{% tabs packaging-imports-12 %}
{% tab 'Scala 2 and 3' %}
```scala
scala> new ArrayList[String]
val res0: java.util.ArrayList[String] = []
```
{% endtab %}
{% endtabs %}

因为这些 Java 类是隐藏的，所以您也可以使用 Scala 的 `List`、`Set` 和 `Map` 类而不会发生命名冲突：

{% tabs packaging-imports-13 %}
{% tab 'Scala 2 and 3' %}
```scala
scala> val a = List(1, 2, 3)
val a: List[Int] = List(1, 2, 3)

scala> val b = Set(1, 2, 3)
val b: Set[Int] = Set(1, 2, 3)

scala> val c = Map(1 -> 1, 2 -> 2)
val c: Map[Int, Int] = Map(1 -> 1, 2 -> 2)
```
{% endtab %}
{% endtabs %}

### 在任何地方使用导入

在 Scala 中，`import` 语句可以在任何地方。
它们可以在源代码文件的顶部使用：

{% tabs packaging-imports-14 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package foo

import scala.util.Random

class ClassA {
  def printRandom(): Unit = {
    val r = new Random   // use the imported class
    // more code here...
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-14 %}

```scala
package foo

import scala.util.Random

class ClassA:
  def printRandom:
    val r = new Random   // use the imported class
    // more code here...
```
{% endtab %}
{% endtabs %}

如果您愿意，您还可以使用更接近需要它们的点的 `import` 语句：

{% tabs packaging-imports-15 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package foo

class ClassA {
  import scala.util.Random   // inside ClassA
  def printRandom(): Unit = {
    val r = new Random
    // more code here...
  }
}

class ClassB {
  // the Random class is not visible here
  val r = new Random   // this code will not compile
}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-15 %}

```scala
package foo

class ClassA:
  import scala.util.Random   // inside ClassA
  def printRandom {
    val r = new Random
    // more code here...

class ClassB:
  // the Random class is not visible here
  val r = new Random   // this code will not compile
```

{% endtab %}
{% endtabs %}

### “静态”导入

当您想以类似于 Java “静态导入”方法的方式导入成员时——因此您可以直接引用成员名称，而不必在它们前面加上类名——使用以下方法。

使用此语法导入 Java `Math` 类的所有静态成员：

{% tabs packaging-imports-16 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.lang.Math._
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-16 %}

```scala
import java.lang.Math.*
```
{% endtab %}
{% endtabs %}

现在您可以访问静态的 `Math` 类方法，例如 `sin` 和 `cos`，而不必在它们前面加上类名：

{% tabs packaging-imports-17 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.lang.Math._

val a = sin(0)    // 0.0
val b = cos(PI)   // -1.0
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-17 %}

```scala
import java.lang.Math.*

val a = sin(0)    // 0.0
val b = cos(PI)   // -1.0
```
{% endtab %}
{% endtabs %}

### 默认导入的包

两个包被隐式导入到所有源代码文件的范围内：

- java.lang.*
- scala.*

Scala 对象 `Predef` 的成员也是默认导入的。

> 如果您想知道为什么可以使用 `List`、`Vector`、`Map` 等类，而无需导入它们，它们是可用的，因为 `Predef` 对象中的定义。

### 处理命名冲突

在极少数情况下会出现命名冲突，您需要从项目的根目录导入一些东西，在包名前加上 `_root_`：

{% tabs packaging-imports-18 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package accounts

import _root_.accounts._
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-18 %}

```scala
package accounts

import _root_.accounts.*
```
{% endtab %}
{% endtabs %}

## 导入 `given` 实例

正如您将在 [上下文抽象][contextual] 一章中看到的，`import` 语句的一种特殊形式用于导入 `given` 实例。
基本形式如本例所示：

{% tabs packaging-imports-19 %}
{% tab 'Scala 3 only' %}
```scala
object A:
  class TC
  given tc: TC
  def f(using TC) = ???

object B:
  import A.*       // import all non-given members
  import A.given   // import the given instance
```
{% endtab %}
{% endtabs %}

在此代码中，对象 `B` 的 `import A.*` 子句导入了 `A` 的所有成员 *除了* `given` 实例 `tc`。
相反，第二个导入，`import A.given`，*仅*导入那个 `given` 实例。
两个 `import` 子句也可以合并为一个：

{% tabs packaging-imports-20 %}
{% tab 'Scala 3 only' %}
```scala
object B:
  import A.{given, *}
```
{% endtab %}
{% endtabs %}

### 讨论

通配符选择器 `*` 将除给定或扩展之外的所有定义带入范围，而 `given` 选择器将所有*给定*——包括那些由扩展产生的定义——带入范围。

这些规则有两个主要好处：

- 范围内的给定来自哪里更清楚。
  特别是，不可能在一长串其他通配符导入中隐藏导入的给定。
- 它可以在不导入任何其他内容的情况下导入所有给定。
  这一点特别重要，因为给定可以是匿名的，所以通常使用命名导入是不切实际的。

### 按类型导入

由于给定可以是匿名的，因此按名称导入它们并不总是可行的，通常使用通配符导入。
*按类型导入* 为通配符导入提供了更具体的替代方案，这使得导入的内容更加清晰：

{% tabs packaging-imports-21 %}
{% tab 'Scala 3 only' %}
```scala
import A.{given TC}
```
{% endtab %}
{% endtabs %}

这会在 `A` 中导入任何具有符合 `TC` 的类型的 `given`。
导入多种类型的给定 `T1,...,Tn` 由多个 `given` 选择器表示：

{% tabs packaging-imports-22 %}
{% tab 'Scala 3 only' %}
```scala
import A.{given T1, ..., given Tn}
```
{% endtab %}
{% endtabs %}

导入参数化类型的所有 `given` 实例由通配符参数表示。
例如，当你有这个 `object` 时：

{% tabs packaging-imports-23 %}
{% tab 'Scala 3 only' %}
```scala
object Instances:
  given intOrd: Ordering[Int]
  given listOrd[T: Ordering]: Ordering[List[T]]
  given ec: ExecutionContext = ...
  given im: Monoid[Int]
```
{% endtab %}
{% endtabs %}

此导入语句导入 `intOrd`、`listOrd` 和 `ec` 实例，但省略了 `im` 实例，因为它不符合任何指定的边界：

{% tabs packaging-imports-24 %}
{% tab 'Scala 3 only' %}
```scala
import Instances.{given Ordering[?], given ExecutionContext}
```
{% endtab %}
{% endtabs %}

按类型导入可以与按名称导入混合。
如果两者都存在于导入子句中，则按类型导入排在最后。
例如，这个 import 子句导入了 `im`、`intOrd` 和 `listOrd`，但省略了 `ec`：

{% tabs packaging-imports-25 %}
{% tab 'Scala 3 only' %}
```scala
import Instances.{im, given Ordering[?]}
```
{% endtab %}
{% endtabs %}

### 一个例子

作为一个具体的例子，假设你有这个 `MonthConversions` 对象，它包含两个 `given` 定义：

{% tabs packaging-imports-26 %}
{% tab 'Scala 3 only' %}

```scala
object MonthConversions:
  trait MonthConverter[A]:
    def convert(a: A): String

  given intMonthConverter: MonthConverter[Int] with
    def convert(i: Int): String =
      i match
        case 1 =>  "January"
        case 2 =>  "February"
        // more cases here ...

  given stringMonthConverter: MonthConverter[String] with
    def convert(s: String): String =
      s match
        case "jan" => "January"
        case "feb" => "February"
        // more cases here ...
```
{% endtab %}
{% endtabs %}

要将这些给定导入当前范围，请使用以下两个 `import` 语句：

{% tabs packaging-imports-27 %}
{% tab 'Scala 3 only' %}

```scala
import MonthConversions.*
import MonthConversions.{given MonthConverter[?]}
```
{% endtab %}
{% endtabs %}

现在您可以创建一个使用这些 `given` 实例的方法：

{% tabs packaging-imports-28 %}
{% tab 'Scala 3 only' %}

```scala
def genericMonthConverter[A](a: A)(using monthConverter: MonthConverter[A]): String =
  monthConverter.convert(a)
```
{% endtab %}
{% endtabs %}

然后您可以在您的应用程序中使用该方法：

{% tabs packaging-imports-29 %}
{% tab 'Scala 3 only' %}

```scala
@main def main =
  println(genericMonthConverter(1))       // January
  println(genericMonthConverter("jan"))   // January
```
{% endtab %}
{% endtabs %}

如前所述， `import given` 语法的主要设计优势之一是明确范围内的给定来自何处，并且在这些 `import` 语句中，很清楚地表明给定是来自 `MonthConversions` 对象。

[contextual]: {% link _zh-cn/overviews/scala3-book/ca-contextual-abstractions-intro.md %}
