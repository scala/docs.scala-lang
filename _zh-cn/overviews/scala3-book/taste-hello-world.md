---
title: Hello, World!
type: section
description: This section demonstrates a Scala 3 'Hello, World!' example.
language: zh-cn
num: 5
previous-page: taste-intro
next-page: taste-repl

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


> **提示**：在以下示例中，尝试选择您喜欢的 Scala 版本。
> <noscript>><span style="font-weight: bold;">信息</span>：JavaScript 当前已禁用，代码选项卡仍将正常工作，但首选项不会被记住。</noscript>

## 你的第一个 Scala 程序

Scala “Hello, world!” 例子展示如下。
首先，把以下代码写入 _Hello.scala_:

<!-- Display Hello World for each Scala Version -->
{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}
```scala
object hello {
  def main(args: Array[String]) = {
    println("Hello, World!")
  }
}
```
> 代码中，在名为 `hello` 的 Scala `object` 中，我们定义了一个名称为 `main` 的方法。
> 在 Scala 中 `object` 类似 `class`，但定义了一个可以传递的单例实例。
> `main` 用名为 `args` 的输入参数，该参数必须是 `Array[String]` 类型（暂时忽略 `args`）。

{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}
```scala
@main def hello() = println("Hello, World!")
```
> 代码中， `hello` 是方法。
> 它使用 `def` 定义，并用 `@main` 注释的手段把它声明为“main”方法。
> 使用 `println` 方法，它在标准输出 （STDOUT）中打印了 `"Hello, world!"` 字符串。

{% endtab %}

{% endtabs %}
<!-- End tabs -->

下一步，用 `scalac` 编译代码：

```bash
$ scalac Hello.scala
```

如果你是从 Java 转到 Scala，`scalac` 就像 `javac`，所以该命令会创建几个文件：

<!-- Display Hello World compiled outputs for each Scala Version -->
{% tabs hello-world-outputs class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-outputs %}
```bash
$ ls -1
hello$.class
hello.class
hello.scala
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-outputs %}
```bash
$ ls -1
hello$package$.class
hello$package.class
hello$package.tasty
hello.scala
hello.class
hello.tasty
```
{% endtab %}

{% endtabs %}
<!-- End tabs -->

与 Java 一样，_.class_ 文件是字节码文件，它们已准备好在 JVM 中运行。

现在您可以使用 `scala` 命令运行 `hello` 方法：

```bash
$ scala hello
Hello, world!
```

假设它运行成功，那么恭喜，您刚刚编译并运行了您的第一个 Scala 应用程序。

> 在 [Scala 工具][scala_tools] 章节中可以找到 sbt 和其他使 Scala 开发更容易的工具相关的更多信息。

## 要求用户输入

在下一个示例中，让我们在问候用户之前询问用户名！

有几种方法可以从命令行读取输入，但一种简单的方法是使用
_scala.io.StdIn_ 对象中的 `readline` 方法。要使用它，您需要先导入它，如下所示：

{% tabs import-readline %}
{% tab 'Scala 2 and 3' for=import-readline %}
```scala
import scala.io.StdIn.readLine
```
{% endtab %}
{% endtabs %}

为了演示其工作原理，让我们创建一个小示例。将此源代码放在名为 _helloInteractive.scala_ 的文件里：

<!-- Display interactive Hello World application for each Scala Version -->
{% tabs hello-world-interactive class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-interactive %}
```scala
import scala.io.StdIn.readLine

object helloInteractive {

  def main(args: Array[String]) = {
    println("Please enter your name:")
    val name = readLine()

    println("Hello, " + name + "!")
  }

}
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-interactive %}
```scala
import scala.io.StdIn.readLine

@main def helloInteractive() =
  println("Please enter your name:")
  val name = readLine()

  println("Hello, " + name + "!")
```
{% endtab %}

{% endtabs %}
<!-- End tabs -->

在此代码中，我们将 `readLine` 的结果保存到一个名为 `name` 的变量中，然后
使用字符串上的 `+` 运算符将 `“Hello， ”` 与 `name` 和 `"!"` 连接起来，生成单一字符串值。

> 您可以通过阅读[变量和数据类型]（/zh-cn/scala3/book/taste-vars-data-types.html）来了解有关使用 `val` 的更多信息。

然后使用 `scalac` 编译代码：

```bash
$ scalac helloInteractive.scala
```

然后用 `scala helloInteractive` 运行它，这次程序将在询问您的名字后暂停并等待，
直到您键入一个名称，然后按键盘上的回车键，如下所示：

```bash
$ scala helloInteractive
Please enter your name:
▌
```

当您在提示符下输入您的姓名时，最终的交互应如下所示：

```bash
$ scala helloInteractive
Please enter your name:
Alvin Alexander
Hello, Alvin Alexander!
```

### 关于导入的说明

正如您在此应用程序中看到的，有时某些方法或我们稍后将看到的其他类型的定义不可用，
除非您使用如下所示的 `导入` 子句：

{% tabs import-readline-2 %}
{% tab 'Scala 2 and 3' for=import-readline-2 %}
```scala
import scala.io.StdIn.readLine
```
{% endtab %}
{% endtabs %}

导入可通过多种方式帮助您编写代码：
  - 您可以将代码放在多个文件中，以帮助避免混乱，并帮助导航大型项目。
  - 您可以使用包含有用功能的代码库，该库可能是由其他人编写
  - 您可以知道某个定义的来源（特别是如果它没有写入当前文件）。

[scala_tools]: {% link _zh-cn/overviews/scala3-book/scala-tools.md %}
