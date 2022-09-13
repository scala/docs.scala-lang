---
title: Hello, World!
type: section
description: This section demonstrates a Scala 3 'Hello, World!' example.
num: 5
previous-page: taste-intro
next-page: taste-repl
---


Scala 3 “Hello, world!” 例子展示如下。
首先，把以下代码写入 _Hello.scala_:

```scala
@main def hello() = println("Hello, world!")
```

代码中， `hello` 是方法。
它使用 `def` 定义，并用 `@main` 注释的手段把它声明为“main”方法。
使用 `println` 方法，它在标准输出 （STDOUT）中打印了 `"Hello, world!"` 字符串。

下一步，用 `scalac` 编译代码：

```bash
$ scalac Hello.scala
```

如果你是从 Java 转到 Scala，`scalac` 就像 `javac`，所以该命令会创建几个文件：

```bash
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

与 Java 一样，_.class_ 文件是字节码文件，它们已准备好在 JVM 中运行。

现在您可以使用 `scala` 命令运行 `hello` 方法：

```bash
$ scala hello
Hello, world!
```

假设它运行成功，那么恭喜，您刚刚编译并运行了您的第一个 Scala 应用程序。

> 在 [Scala 工具][scala_tools] 章节中可以找到 sbt 和其他使 Scala 开发更容易的工具相关的更多信息。

[scala_tools]: {% link _overviews/scala3-book/scala-tools.md %}