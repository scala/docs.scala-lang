---
title: worksheet
type: section
description: This section looks at worksheets, an alternative to Scala projects.
languages:[en]
num: 71
previous-page: tools-sbt
next-page: interacting-with-java

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


工作表是在保存时评估的 Scala 文件，并把每个表达式的结果
显示在程序右侧的列中。工作表就像是加了激素的[REPL 会话][REPL session]，并且
享受一流的编辑器支持：自动补全、超链接、交互式错误输入等。
工作表使用扩展名 `.worksheet.sc` 。

下面，我们将展示如何在 IntelliJ 和 VS Code（带有 Metals 扩展）中使用工作表。

1. 打开一个 Scala 项目，或者创建一个。
   - 要在 IntelliJ 中创建项目，选择“File”->“New”->“Project...”， 在左侧栏中选择“Scala”，
     单击“下一步”设置项目名称和位置。
   - 要在 VS Code 中创建项目，请运行命令“Metals: New Scala project”，选择
     种子 `scala/scala3.g8`，设置项目位置，在新的 VS Code 窗口中打开它，然后
     导入其构建。
1. 在 `src/main/scala/` 目录下创建一个名为 `hello.worksheet.sc` 的文件。
   - 在 IntelliJ 中，右键单击目录 `src/main/scala/`，然后选择“New”，然后
     是“文件”。
   - 在 VS Code 中，右键单击目录`src/main/scala/`，然后选择“New File”。
1. 在编辑器中粘贴以下内容：
   ~~~
   println("Hello, world!")
   
   val x = 1
   x + x
   ~~~

1. 评估工作表。
   - 在 IntelliJ 中，单击编辑器顶部的绿色箭头以评估工作表。
   - 在 VS Code 中，保存文件。
   
   您应该在右侧面板 (IntelliJ) 上看到每一行的评估结果，或者
   作为注释（VS Code）。

![]({{ site.baseurl }}/resources/images/scala3-book/intellij-worksheet.png)

在 IntelliJ 中评估的工作表。

![]({{ site.baseurl }}/resources/images/scala3-book/metals-worksheet.png)

在 VS Code 中评估的工作表（带有 Metals 扩展）。

请注意，工作表将使用项目定义的 Scala 版本（通常在文件`build.sbt`中，
设置 `scalaVersion` 键）。

另请注意，工作表没有 [程序入口点][program entry point]。作为替代，顶级语句和表达式
从上到下进行评估。


[REPL session]: {% link _zh-cn/overviews/scala3-book/taste-repl.md %}
[program entry point]: {% link _zh-cn/overviews/scala3-book/methods-main-methods.md %}
