---
title: The REPL
type: section
description: This section provides an introduction to the Scala REPL.
num: 6
previous-page: taste-hello-world
next-page: taste-vars-data-types
---


Scala REPL（“Read-Evaluate-Print-Loop”）是一个命令行解释器，您可以将其用作“游乐场”区域来测试 Scala 代码。
你可以通过运行 `scala` 或 `scala3` 命令来启动一个 REPL 会话，具体取决于您在操作系统命令行中的安装，您将看到如下所示的“欢迎”提示：

```bash
$ scala
Welcome to Scala 3.0.0 (OpenJDK 64-Bit Server VM, Java 11.0.9).
Type in expressions for evaluation.
Or try :help.

scala> _
```

REPL 是一个命令行解释器，所以它就在那里等着你输入一些东西。
现在您可以输入 Scala 表达式来查看它们是如何工作的：

````
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
````

如输出所示，如果您不为表达式的结果分配变量，REPL 会为您创建名为 `res0`、`res1` 等的变量。
您可以在后续表达式中使用这些变量名称：

````
scala> val x = res0 * 10
val x: Int = 20
````

请注意，REPL 输出还显示了表达式的结果。

您可以在 REPL 中运行各种实验。
这个例子展示了如何创建然后调用一个 `sum` 方法：

````
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
````

如果您更喜欢基于浏览器的游乐场环境，也可以使用 [scastie.scala-lang.org](https://scastie.scala-lang.org)。

如果您更喜欢在文本编辑器中而不是在控制台提示符中编写代码，您可以使用 [worksheet]。

[worksheet]: {% link _overviews/scala3-book/tools-worksheets.md %}
