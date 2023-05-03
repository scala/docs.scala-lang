---
title: Scala 3 特性
type: chapter
description: This page discusses the main features of the Scala 3 programming language.
language: zh-cn
num: 2
previous-page: introduction
next-page: why-scala-3

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


_Scala_ 这个名字来源于 _scalable_ 一词。正如其名，Scala 语言被用于支撑高流量网站以及分析庞大的数据集。
本节介绍了使 Scala 成为一门可扩展语言的特性。
这些特性分为三个部分：

- 高级语言特性
- 底层语言特性
- Scala 生态系统特性

{% comment %}
I think of this section as being like an “elevator pitch.”
{% endcomment %}

## 高级特性

从宏观视角来看 Scala，您可以对它做出以下陈述：

- 它是一种高级编程语言
- 它具有简明易读的语法
- 它是静态类型的（但使人感觉是动态的）
- 它有一个表达力强大的类型系统
- 它是一种函数式编程（FP）语言
- 它是一种面向对象的编程（OOP）语言
- 它支持 FP 与 OOP 的融合
- 上下文抽象提供了一种清晰的方式来实现 _表达式推断_ 
- 它在 JVM（和浏览器）上运行
- 它与 Java 代码无缝交互
- 它可被用于服务器端应用（包括微服务）、大数据应用，也可以在浏览器中与 Scala.js 共同使用

以下部分将对这些特性进行简要介绍。

### 一门高级语言

Scala 至少在两个方面被认为是一门高级语言。
首先，像 Java 和许多其他现代语言一样，您不需要与指针和内存管理等底层概念打交道。

其次，通过使用 lambda 与高阶函数，您可以在非常高的层次上编写代码。
正如函数式编程的说法，在 Scala 中，您编写您想要 _“什么”_，而不是 _“如何”_ 去实现它。
也就是说，我们不会像这样编写命令式代码：

{% tabs scala-features-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=scala-features-1 %}
```scala
import scala.collection.mutable.ListBuffer

def double(ints: List[Int]): List[Int] = {
  val buffer = new ListBuffer[Int]()
  for (i <- ints) {
    buffer += i * 2
  }
  buffer.toList
}

val oldNumbers = List(1, 2, 3)
val newNumbers = double(oldNumbers)
```
{% endtab %}
{% tab 'Scala 3' for=scala-features-1 %}
```scala
import scala.collection.mutable.ListBuffer

def double(ints: List[Int]): List[Int] =
  val buffer = new ListBuffer[Int]()
  for i <- ints do
    buffer += i * 2
  buffer.toList

val oldNumbers = List(1, 2, 3)
val newNumbers = double(oldNumbers)
```
{% endtab %}
{% endtabs %}

这段代码指示编译器逐步执行特定操作。
相反，我们使用像这样的高阶函数与 lambda 来编写高层次的函数式代码以计算出相同的结果：

{% tabs scala-features-2 %}
{% tab 'Scala 2 and 3' for=scala-features-2 %}
```scala
val newNumbers = oldNumbers.map(_ * 2)
```
{% endtab %}
{% endtabs %}

如您所见，该代码更简洁、更容易阅读且更易于维护。

### 简明的语法

Scala 具有简明易读的语法。例如，变量的创建十分简洁，其类型也很明确。

{% tabs scala-features-3 %}
{% tab 'Scala 2 and 3' for=scala-features-3 %}
```scala
val nums = List(1,2,3)
val p = Person("Martin", "Odersky")
```
{% endtab %}
{% endtabs %}

高阶函数与 lambda 使代码简明易读：

{% tabs scala-features-4 %}
{% tab 'Scala 2 and 3' for=scala-features-4 %}
```scala
nums.map(i => i * 2)   // long form
nums.map(_ * 2)        // short form

nums.filter(i => i > 1)
nums.filter(_ > 1)
```
{% endtab %}
{% endtabs %}

特质（Traits）、类（Class）和方法（Method）都是用简洁、轻巧的语法定义的。

{% tabs scala-features-5 class=tabs-scala-version %}
{% tab 'Scala 2' for=scala-features-5 %}
```scala mdoc
trait Animal {
  def speak(): Unit
}

trait HasTail {
  def wagTail(): Unit
}

class Dog extends Animal with HasTail {
  def speak(): Unit = println("Woof")
  def wagTail(): Unit = println("⎞⎜⎛  ⎞⎜⎛")
}
```
{% endtab %}
{% tab 'Scala 3' for=scala-features-5 %}
```scala
trait Animal:
  def speak(): Unit

trait HasTail:
  def wagTail(): Unit

class Dog extends Animal, HasTail:
  def speak(): Unit = println("Woof")
  def wagTail(): Unit = println("⎞⎜⎛  ⎞⎜⎛")
```
{% endtab %}
{% endtabs %}

研究表明，开发人员花在 _阅读_ 代码和 _编写_ 代码上的时间比例至少为 10:1。因此，编写简洁 _并_ 易读的代码非常重要。

### 动态感受

Scala 是一种静态类型的语言，但由于其类型推断能力，它使人感觉是动态的。所有这些表达式看起来都像 Python 或 Ruby 这样的动态类型语言代码，但其实它们都是 Scala 代码：

{% tabs scala-features-6 class=tabs-scala-version %}
{% tab 'Scala 2' for=scala-features-6 %}
```scala
val s = "Hello"
val p = Person("Al", "Pacino")
val sum = nums.reduceLeft(_ + _)
val y = for (i <- nums) yield i * 2
val z = nums
  .filter(_ > 100)
  .filter(_ < 10_000)
  .map(_ * 2)
```
{% endtab %}
{% tab 'Scala 3' for=scala-features-6 %}
```scala
val s = "Hello"
val p = Person("Al", "Pacino")
val sum = nums.reduceLeft(_ + _)
val y = for i <- nums yield i * 2
val z = nums
  .filter(_ > 100)
  .filter(_ < 10_000)
  .map(_ * 2)
```
{% endtab %}
{% endtabs %}

正如 Heather Miller 所说，Scala 被认为是一种[强静态类型语言](https://heather.miller.am/blog/types-in-scala.html)。您可以获得静态类型的全部益处：

- 正确性：您可以在编译时捕获大多数错误
- 强大的 IDE 支持
    - 可靠的代码补全
    - 在编译时捕获错误意味着在您打字时捕获错误
    - 简单而可靠的重构
- 您可以自信地重构您的代码
- 方法类型声明告诉读者该方法的作用，并作为文档提供帮助
- 可扩展性与可维护性：类型有助于在任意大小的应用程序与开发团队中确保正确性
- 强类型结合优秀的推断能力可实现[上下文抽象]({{ site.scala3ref }}/contextual)等机制，这允许您省略样板代码。通常，这些样板代码可由编译器根据类型定义及给定的上下文推断出来。

{% comment %}
In that list:
- 'Correctness' and 'Scalability' come from Heather Miller’s page
- the IDE-related quotes in this section come from the Scala.js website:
  - catch most errors in the IDE
  - Easy and reliable refactoring
  - Reliable code completion
{% endcomment %}

### 富有表现力的类型系统

{% comment %}
- this text comes from the current [ScalaTour](https://docs.scala-lang.org/tour/tour-of-scala.html).
- TODO: all of the URLs will have to be updated

- i removed these items until we can replace them:
* [Compound types](/tour/compound-types.html)
* [conversions](/tour/implicit-conversions.html)
* [Explicitly typed self references](/tour/self-types.html)
{% endcomment %}

Scala 的类型系统在编译时强制要求以安全与连贯的方式使用抽象概念。特别是，该类型系统支持：

- [推断类型]({% link _zh-cn/overviews/scala3-book/types-inferred.md %})
- [泛型类]({% link _zh-cn/overviews/scala3-book/types-generics.md %})
- [型变]({% link _zh-cn/overviews/scala3-book/types-variance.md %})
- [类型上界](/tour/upper-type-bounds.html) 与 [类型下界](/tour/lower-type-bounds.html)
- [多态方法](/tour/polymorphic-methods.html)
- [交叉类型]({% link _zh-cn/overviews/scala3-book/types-intersection.md %})
- [联合类型]({% link _zh-cn/overviews/scala3-book/types-union.md %})
- [类型 Lambda]({{ site.scala3ref }}/new-types/type-lambdas.html)
- [`given` 实例与 `using` 子句]({% link _zh-cn/overviews/scala3-book/ca-context-parameters.md %})
- [扩展方法]({% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %})
- [类型类]({% link _zh-cn/overviews/scala3-book/ca-type-classes.md %})
- [多元相等]({% link _zh-cn/overviews/scala3-book/ca-multiversal-equality.md %})
- [不透明类型别名]({% link _zh-cn/overviews/scala3-book/types-opaque-types.md %})
- [开放类]({{ site.scala3ref }}/other-new-features/open-classes.html)
- [匹配类型]({{ site.scala3ref }}/new-types/match-types.html)
- [依赖函数类型]({{ site.scala3ref }}/new-types/dependent-function-types.html)
- [多态函数类型]({{ site.scala3ref }}/new-types/polymorphic-function-types.html)
- [上下文边界]({{ site.scala3ref }}/contextual/context-bounds.html)
- [上下文函数]({{ site.scala3ref }}/contextual/context-functions.html)
- 作为对象成员的[内部类](/tour/inner-classes.html) 与 [抽象类型](/tour/abstract-type-members.html)

通过结合使用，这些特性为编程抽象的安全重用及软件的类型安全扩展提供了强大的基础。

### 一门函数式编程语言

Scala 是一门函数式编程（FP）语言，也就是说：

- 函数是值，可以像任何其他值一样被传递
- 直接支持高阶函数
- 原生地支持 Lambda
- Scala 中的一切都是会返回值的表达式
- 从语法上来说，使用不可变变量很容易并且此行为被鼓励
- 在标准库中有大量的不可变集合类
- 这些集合类带有许多函数式方法：它们不改变集合本身，而是返回数据的更新副本

### 一门面向对象语言

Scala 是一门面向对象编程（OOP）语言。
每个值都是一个类的实例，每个“运算符”都是一个方法。

在 Scala 中，所有类型都继承自顶层类 `Any`，其直接子类是 `AnyVal`（_值类型_，例如 `Int` 与 `Boolean`）和 `AnyRef`（_引用类型_，与 Java 中相同）。
这意味着 Scala 中不存在 Java 中原始类型和包装类型的区别（例如 `int` 与 `Integer`）。
装箱与拆箱对用户来说是完全透明的。

{% comment %}
- AnyRef above is wrong in case of strict null checking, no? On the other hand, maybe too much information to state this here
- probably not worth to mention (too advanced at this point) there is AnyKind
- Add the “types hierarchy” image here?
{% endcomment %}

### 支持 FP 与 OOP 融合

{% comment %}
NOTE: This text in the first line comes from this slide: https://twitter.com/alexelcu/status/996408359514525696
{% endcomment %}

Scala 的本质是函数式编程和面向对象编程的融合：

- 函数用于代表逻辑
- 对象用于模块化

正如 [Martin Odersky 所说](https://jaxenter.com/current-state-scala-odersky-interview-129495.html)，“Scala 旨在表明函数式编程与面向对象编程的融合是切实可行的。”

### 表达式推断，更加清晰

继 Haskell 之后，Scala 是第二种具有某种形式的 _隐式_ 的流行语言。
在 Scala 3 中，这些概念经过了重新考虑并更清晰地实现。

其核心思想是 _表达式推断_：给定一个类型，编译器会合成一个具有该类型的“规范”表达式。
在 Scala 中，一个上下文参数直接导致一个被推断出的参数项的出现。该参数项也可以被显式地写出来。

此概念的用例包括实现[类型类]({% link _overviews/scala3-book/ca-type-classes.md %})、建立上下文、依赖注入、表达能力、计算新类型以及证明它们之间的关系。

Scala 3 使此过程比以往任何时候都更加清晰。
请在[参考文档]({{ site.scala3ref }}/contextual)中阅读关于上下文抽象的内容。

### 客户端与服务器

Scala 代码在 Java 虚拟机（JVM）上运行，因此您可以获得它的全部益处：

- 安全性
- 性能
- 内存管理
- 可移植性与平台独立性
- 能够使用大量的现有 Java 和 JVM 库

除了在 JVM 上运行外，Scala 还可以通过 Scala.js （以及开源的第三方工具以集成流行的 JavaScript 库）在浏览器中运行，并且可以使用Scala Native 与 GraalVM 构建原生可执行文件。

### 与 Java 无缝交互

您可以在 Scala 应用程序中使用 Java 类和库，也可以在 Java 应用程序中使用 Scala 代码。
对于第二点来说，诸如 [Akka](https://akka.io) 和 [Play Framework](https://www.playframework.com) 之类的大型库是用 Scala 编写的，并且它们可以在 Java 应用程序中使用。

对于第一点来说，Scala 应用程序中每天都会用到 Java 类和库。
例如，在 Scala 中，您可以使用 Java 的 `BufferedReader` 和 `FileReader` 来读取文件：

{% tabs scala-features-7 %}
{% tab 'Scala 2 and 3' for=scala-features-7 %}
```scala
import java.io.*
val br = BufferedReader(FileReader(filename))
// read the file with `br` ...
```
{% endtab %}
{% endtabs %}

在 Scala 中使用 Java 代码通常是无缝衔接的。

Java 集合也可以在 Scala 中使用， 如果您想将 Scala 丰富的集合类方法与其一起使用，只需几行代码即可转换它们：

{% tabs scala-features-8 %}
{% tab 'Scala 2 and 3' for=scala-features-8 %}
```scala
import scala.jdk.CollectionConverters.*
val scalaList: Seq[Integer] = JavaClass.getJavaList().asScala.toSeq
```
{% endtab %}
{% endtabs %}

### 丰富的库

正如您将在本页的第三部分中所看到的那样，已经有诸如此类的 Scala 库和框架被编写出来用于支撑高流量网站以及分析庞大的数据集：

1. [Play Framework](https://www.playframework.com) 是一种用于创建高度可扩展应用程序的轻量级、无状态、对开发者及Web友好的架构
2. [Lagom](https://www.lagomframework.com) 是一种微服务框架，可帮助您分解遗留的单体应用并构建、测试和部署整个响应式微服务系统
3. [Apache Spark](https://spark.apache.org) 是一种面向大规模数据处理的统一分析引擎，内置流、SQL、机器学习和图形处理等模块

[Awesome Scala 列表](https://github.com/lauris/awesome-scala)展示了开发人员为构建 Scala 应用程序而创建的许多其他开源工具。

除了服务器端编程之外，[Scala.js](https://www.scala-js.org) 是一款用于编写 JavaScript 应用的强类型替代方案。其开源的第三方库包含支持与 Facebook 的 React、jQuery 及其他库等集成的工具。

{% comment %}
The Lower-Level Features section is like the second part of an elevator pitch.
Assuming you told someone about the previous high-level features and then they say, “Tell me more,” this is what you might tell them.
{% endcomment %}

## 底层语言特性

上一节介绍了 Scala 3 的高级特性，有趣的是，您可以从高层次上对 Scala 2 和 Scala 3 作出相同的表述。
十年前，Scala 就为各种理想特性打下了坚实基础，正如您在本节中即将看到的那样，这些效益在 Scala 3 中得到了提高。

以小见大，从程序员日常使用的语言特性来看，Scala 3 比 Scala 2 具有显著优势： 

- 可以用枚举更简洁地创建代数数据类型（ADT）
- 更简明易读的语法：
  - “干净”的控制结构语法更容易阅读
  - 可选的大括号
    - 代码中包含更少的符号，因此会产生更少的视觉噪音，使其更容易阅读
  - 创建类实例时一般不再需要 `new` 关键字
  - 弃用了包对象，转而使用更简单的“顶层”定义
- 更清晰的语法：
  - 移除了 `implicit` 关键字的多种不同用法，这些用法被更显而易见的关键字所取代，如 `given`、 `using`、和 `extension`，以此将关注重点放在意图而不是机制上（详见 [Givens][givens] 部分）
  - [扩展方法][extension]通过更加清晰简单的机制取代了隐式类
  - 为类添加了 `open` 修饰符，使开发者能够有意识地声明一个类是可以被修改的，从而限制对代码库的临时扩展
  - [多元相等][multiversal]排除了用 `==` 和 `!=` 进行无意义的比较（即试图将 `Person` 与 `Planet` 进行比较）
  - 宏的实现变得更加容易
  - 联合与交叉提供了一种灵活的方式以建模类型
  - 特质参数取代并简化了早期初始化器
  - [不透明类型别名][opaque_types]取代了值类的大多数用途，并确保不进行装箱
  - 导出子句提供了一种简单而通用的方式来表现聚合，它可以取代之前继承自类的包对象的外观模式
  - 删除了过程语法并更改了可变参数语法，这增加了语言一致性
  - `@infix` 注解使得您想让一个方法被如何应用更加显而易见
  - [`@targetName`]({{ site.scala3ref }}/other-new-features/targetName.html) 方法注解为方法定义了一个候补名称。这提高了与 Java 的互操作性，并允许您为符号运算符提供别名

在这里演示所有这些特性会占用太多空间，请通过上述内容中的链接来查看这些特性的实际效果。
所有这些特性都在[概述文档][reference]的*新特性*、*变更的特性*、与*删除的特性*等页面中进行了详细讨论。

{% comment %}
CHECKLIST OF ALL ADDED, UPDATED, AND REMOVED FEATURES
=====================================================

New Features
------------
- trait parameters
- super traits
- creator applications
- export clauses
- opaque type aliases
- open classes
- parameter untupling
- kind polymorphism
- tupled function
- threadUnsafe annotation
- new control syntax
- optional braces (experimental)
- explicit nulls
- safe initialization

CHANGED FEATURES
----------------
- numeric literals
- structural types
- operators
- wildcard types
- type checking
- type inference
- implicit resolution
- implicit conversions
- overload resolution
- match expressions
- vararg patterns
- pattern bindings
- pattern matching
- eta expansion
- compiler plugins
- lazy vals initialization
- main functions

DROPPED FEATURES
----------------
- DelayedInit
- macros
- existential types
- type projection
- do/while syntax
- procedure syntax
- package objects
- early initializers
- class shadowing
- limit 22
- XML literals
- symbol literals
- auto-application
- weak conformance
- nonlocal returns
- [this] qualifier
    - private[this] and protected[this] access modifiers are deprecated
      and will be phased out
{% endcomment %}

## Scala 生态系统

Scala 拥有一个充满活力的生态系统，有满足各种需求的库和框架。
[Awesome Scala 列表](https://github.com/lauris/awesome-scala)提供了数百个可供 Scala 开发者使用的开源项目，[Scaladex](https://index.scala-lang.org) 则提供了 Scala 库的可搜索索引。
以下列出了一些比较著名的库：

### Web 开发

- [Play Framework](https://www.playframework.com) 遵循 Ruby on Rails 模型，是一种用于高度可扩展应用程序的轻量级、无状态、对开发者及Web友好的架构
- [Scalatra](https://scalatra.org) 是一个小型的、高性能的、异步的网络框架，其灵感来自于 Sinatra
- [Finatra](https://twitter.github.io/finatra) 是基于 TwitterServer 和 Finagle 构建的 Scala 服务
- [Scala.js](https://www.scala-js.org) 是 JavaScript 的强类型替代品，它提供了一种更安全的方式以构建稳健的前端 Web 应用程序
- [ScalaJs-React](https://github.com/japgolly/scalajs-react) 将 Facebook 的 React 库整合至 Scala.js，并努力使其尽可能类型安全和 Scala 友好
- [Lagom](https://www.lagomframework.com) 是一种微服务框架，可帮助您分解遗留的单体应用并构建、测试和部署整个响应式微服务系统

HTTP(S) 库：

- [Akka-http](https://akka.io)
- [Finch](https://github.com/finagle/finch)
- [Http4s](https://github.com/http4s/http4s)
- [Sttp](https://github.com/softwaremill/sttp)

JSON 库：

- [Argonaut](https://github.com/argonaut-io/argonaut)
- [Circe](https://github.com/circe/circe)
- [Json4s](https://github.com/json4s/json4s)
- [Play-JSON](https://github.com/playframework/play-json)

序列化：

- [ScalaPB](https://github.com/scalapb/ScalaPB)

### 科学和数据分析

- [Algebird](https://github.com/twitter/algebird)
- [Spire](https://github.com/typelevel/spire)
- [Squants](https://github.com/typelevel/squants)

### 大数据

- [Apache Spark](https://github.com/apache/spark)
- [Apache Flink](https://github.com/apache/flink)

### 人工智能，机器学习

- [BigDL](https://github.com/intel-analytics/BigDL) （用于 Apache Spark 的分布式深度学习框架）
- [TensorFlow Scala](https://github.com/eaplatanios/tensorflow_scala)

### 函数式编程 &amp; 函数式响应式编程

函数式编程：

- [Cats](https://github.com/typelevel/cats)
- [Zio](https://github.com/zio/zio)

函数式响应式编程（FRP）

- [fs2](https://github.com/typelevel/fs2)
- [monix](https://github.com/monix/monix)

### 构建工具

- [sbt](https://www.scala-sbt.org)
- [Gradle](https://gradle.org)
- [Mill](https://github.com/lihaoyi/mill)

## 总结

如此页所示，Scala 在高层、日常编程层面以及贯穿开发者生态系统都具有许多出色的编程语言特性。


[reference]: {{ site.scala3ref }}/overview.html
[multiversal]: {% link _zh-cn/overviews/scala3-book/ca-multiversal-equality.md %}
[extension]: {% link _zh-cn/overviews/scala3-book/ca-extension-methods.md %}
[givens]: {% link _zh-cn/overviews/scala3-book/ca-context-parameters.md %}
[opaque_types]: {% link _zh-cn/overviews/scala3-book/types-opaque-types.md %}
