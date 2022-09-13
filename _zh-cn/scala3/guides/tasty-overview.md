---
layout: singlepage-overview
title: TASTy 概览
---
假定你创建了一个 Scala 3 源代码文件叫 _Hello.scala_:

```scala
@main def hello = println("Hello, world")
```

然后用 `scalac` 编译了该文件：

```bash
$ scalac Hello.scala
```

你会发现在 `scalac` 生成的其它文件结果中，有些文件是以 _.tasty_ 为扩展名：

```bash
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

这自然地会引出一个问题，“什么是 tasty？”

## 什么是 TASTy?

TASTy 是从 _Typed Abstract Syntax Trees_ 这个术语的首字母缩写来的。它是 Scala 3 的高级交换格式，在本文档中，我们将它称为 _Tasty_ 。

首先要知道的是，Tasty 文件是由 `scalac` 编译器生成的，并且包含 _所有_ 有关源代码的信息，这些信息包括程序的语法结构，以及有关类型，位置甚至文档的 _所有_ 信息。Tasty 文件包含的信息比 _.class_ 文件多得多，后者是为在 JVM 上运行而生成的。（后面有详细介绍）。

在 Scala 3 中，编译流程像这样：

```text
         +-------------+    +-------------+    +-------------+
$ scalac | Hello.scala | -> | Hello.tasty | -> | Hello.class |
         +-------------+    +-------------+    +-------------+
                ^                  ^                  ^
                |                  |                  |
            你的代码          TASTy 文件          Class 文件
                              用于 scalac          用于 JVM
                            （包括完整信息）     （不完整信息）
```

您可以通过使用 `-print-tasty` 标志在 _.tasty_ 文件上运行编译器，以人类可读的形式查看 _.tasty_ 文件的内容。
您还可以使用 `-decompile` 标志以类似于 Scala 源代码的形式查看反编译的内容。

```bash
$ scalac -print-tasty hello.tasty
$ scalac -decompile hello.tasty
```

### The issue with _.class_ files

由于象 [类型擦除][erasure] 等问题，_.class_ 文件实际上是代码的不完整表示形式。
演示这一点的一种简单方法是使用 `List` 示例。

_类型擦除_ 意味着当你编写这样的Scala代码，并假定它是在JVM上运行时：

```scala
val xs: List[Int] = List(1, 2, 3)
```

该代码被编译为需要与 JVM 兼容的 _.class_ 文件。由于该兼容性要求，该类文件中的代码 --- 您可以使用 `javap` 命令看到它，--- 最终看起来像这样：

```java
public scala.collection.immutable.List<java.lang.Object> xs();
```

该 `javap` 命令输出显示了类文件中包含的内容，该内容是 Java 的表示形式。请注意，在此输出中，`xs` _不是_ 定义为 `List[Int]` ；它真正表示的是 `List[java.lang.Object]` 。为了使您的 Scala 代码与 JVM 配合使用，`Int` 类型已被擦除。

稍后，当您在 Scala 代码中访问 `List[Int]` 的元素时，像这样：

```scala
val x = xs(0)
```

生成的类文件对此行代码进行强制转换操作，您可以将其想象成：

```
int x = (Int) xs.get(0)               // Java-ish
val x = xs.get(0).asInstanceOf[Int]   // more Scala-like
```

同样，这样做是为了兼容性，因此您的 Scala 代码可以在 JVM 上运行。但是，我们已经有的整数列表的信息在类文件中丢失了。
当尝试使用已编译的库来编译 Scala 程序时，会带来问题。为此，我们需要的信息比类文件中通常可用的信息更多。

此讨论仅涵盖类型擦除的主题。对于 JVM 没有意识到的所有其他 Scala 结构，也存在类似的问题，包括 unions, intersections, 带有参数的 traits 以及更多 Scala 3 特性。

### TASTy to the Rescue

因此，TASTy 格式不是像 _.class_ 文件那样没有原始类型的信息，或者只有公共 API（如Scala 2.13 “Pickle” 格式），而是在类型检查后存储完整的抽象语法树（AST）。存储整个 AST 有很多优点：它支持单独编译，针对不同的 JVM 版本重新编译，程序的静态分析等等。

### 重点

因此，这是本节的第一个要点：您在 Scala 代码中指定的类型在 _.class_ 文件中没有完全准确地表示。

第二个关键点是要了解 _编译时_ 和 _运行时_ 提供的信息之间存在差异：

- 在**编译时**，当 `scalac` 读取和分析你的代码时，它知道 `xs` 是一个 `List[Int]`
- 当编译器将你的代码写入类文件时，它会写 `xs` 是 `List[Object]` ，并在访问 `xs` 的任何地方添加转换信息
- 然后在**运行时** --- 你的代码在 JVM 中运行，--- JVM 不知道你的列表是一个 `List[Int]`

对于 Scala 3 和 Tasty，这里有一个关于编译时的重要说明：

- 当您编写使用其他 Scala 3 库的 Scala 3 代码时，`scalac` 不必再读取其 _.class_ 文件;它可以读取其 _.tasty_ 文件，如前所述，这些文件是代码的 _准确_ 表示形式。这对于在 Scala 2.13 和 Scala 3 之间实现单独编译和兼容性非常重要。

## Tasty 的好处

可以想象，拥有代码的完整表示形式具有[许多好处][benefits]：

- 编译器使用它来支持单独的编译。
- Scala 基于 _Language Server Protocol_ 的语言服务器使用它来支持超链接、命令补全、文档以及全局操作，如查找引用和重命名。
- Tasty 为新一代[基于反射的宏][macros]奠定了良好的基础。
- 优化器和分析器可以使用它进行深度代码分析和高级代码生成。

在相关的说明中，Scala 2.13.6 有一个 TASTy 读取器，Scala 3 编译器也可以读取2.13“Pickle”格式。Scala 3 迁移指南中的 [类路径兼容性页面][compatibility-ref] 解释了此交叉编译功能的好处。

## 更多信息

总之，Tasty 是 Scala 3 的高级交换格式，_.tasty_ 文件包含源代码的完整表示形式，从而带来了上一节中概述的好处。

有关更多详细信息，请参阅以下资源：

- 在 [此视频](https://www.youtube.com/watch?v=YQmVrUdx8TU) 中，Scala 中心的Jamie Thompson 对 Tasty 的工作原理及其优势进行了详尽的讨论
- [库作者的二进制兼容性][binary] 讨论二进制兼容性、源代码兼容性和 JVM 执行模型
- [Scala 3 Transition 的前向兼容性](https://www.scala-lang.org/blog/2020/11/19/scala-3-forward-compat.html) 演示了在同一项目中使用 Scala 2.13 和 Scala 3 的技术

这些文章提供了有关 Scala 3 宏的更多信息：

- [Scala 宏库](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html)
- [宏：Scala 3 的计划](https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html)
- [Quotes Reflect 的参考文档][quotes-reflect]
- [宏的参考文档][macros]

[benefits]: https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html
[erasure]: https://www.scala-lang.org/files/archive/spec/2.13/03-types.html#type-erasure
[binary]: {% link _overviews/tutorials/binary-compatibility-for-library-authors.md %}
[compatibility-ref]: {% link _overviews/scala3-migration/compatibility-classpath.md %}
[quotes-reflect]: {{ site.scala3ref }}/metaprogramming/reflection.html
[macros]: {{ site.scala3ref }}/metaprogramming/macros.html
