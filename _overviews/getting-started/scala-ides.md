---
layout: singlepage-overview
title: Scala IDEs

partof: scala-ides

permalink: /tutorials/:title.html

keywords:
- Scala
- IDE
- JetBrains
- IntelliJ
- VSCode
- Metals
---

By Maciej Gorywoda

## Introduction

Theoretically, you can write Scala code even in a notepad and compile and run the code from the terminal. When you do it, the compiler will tell you if it encounters any problems and suggest changes. You can apply that feedback in the notepad and try again.

However, this way of software development will quickly prove to be unusable when you start coding anything more complicated than simple exercises. For larger projects, we highly recommend that you use one of the following IDEs (Integrated Development Environments):

# IntelliJ IDEA + Scala Plugin

[https://jetbrains.com/scala](https://jetbrains.com/scala)

![](../../resources/images/getting-started/IntelliJScala.png)

IntelliJ IDEA is a cross-platform IDE developed by JetBrains that provides a consistent experience for a wide range of programming languages and technologies. It also supports Scala through the IntelliJ Scala Plugin, which is being developed at JetBrains. First, install IntelliJ IDEA Community Edition (unless you don't already use the Ultimate edition) and then add the IntelliJ Scala Plugin.

IntelliJ IDEA and Scala Plugin will assist you in virtually every part of a Scala software developer's work. Use it if you like a solid integrated experience, sane default settings, and tested solutions.

For more information, check out our tutorial [Getting Started with Scala in IntelliJ](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)

# Visual Studio Code + Metals

[https://scalameta.org/metals](https://scalameta.org/metals)

![](../../resources/images/getting-started/VSCodeMetals.png)

Visual Studio Code, commonly called VS Code, is a source code editor developed by Microsoft. Similar to how IntelliJ IDEA requires IntelliJ Scala Plugin to support Scala, you can get support for Scala in VS Code by installing an extension: Metals by Scalameta. In contrast to IntelliJ IDEA + Scala Plugin, VS Code + Metals is aimed at people who like to tinker with settings and try out experimental Scala features. Besides, Metals - the extension - is also available for a variety of other source-code editors, such as Vim, Sublime Text, and Emacs, which means that you will get a similar experience in any of them.

