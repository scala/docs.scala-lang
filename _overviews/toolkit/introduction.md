---
title: Introduction
type: chapter
description: Introducing the Scala Toolkit tutorials
num: 1
previous-page: 
next-page: munit-intro
---

## What is the Scala Toolkit?

The Scala Toolkit is a set of libraries designed to make common programming tasks simpler and more efficient. It includes such functionalities as working with files and processes, parsing JSON, sending HTTP requests and unit-testing.

Whether you're working on a script or an application, the Toolkit adapts to your environment, allowing you to write code in Scala 2 or Scala 3 that run seamlessly in the different platforms: the JVM, Scala.js and Scala Native.
You can use this versatile tool in a wide range of applications, including but not limited to:
- backend scripts that run on JVM, to scrape a website, to collect and transform data, or to fetch and process some files,
- frontend scripts that run on the browser and power your websites,
- command-line tools, packaged as native binaries, that start up immediately on all of the most commonly used operating systems.

This series of tutorials focuses on short code examples, to help you get started quickly and be more productive.
Overall, it is an essential resource for any Scala developer looking to simplify their daily programming tasks.

## How to run the code?

You can follow the tutorials regardless of how you choose to run your
Scala code. The tutorials focus on the code itself, not on the process
of running it.

Ways to run Scala code include:
* in your **browser** with [Scastie](https://scastie.scala-lang.org)
    * pros: zero installation, online sharing
    * cons: single-file only, online-only
* interactively in the Scala **REPL** (Read/Eval/Print Loop)
    * pros: interactive exploration in the terminal
    * cons: doesn't save your code anywhere
* interactively in a **worksheet** in your IDE such as [IntelliJ](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html) or [Metals](http://scalameta.org/metals/)
    * pros: interactive exploration in a GUI
    * cons: requires worksheet environment to run
* in **scripts**, using [Scala CLI](https://scala-cli.virtuslab.com)
    * pros: terminal-based workflow with little setup
    * cons: may not be suitable for large projects
* using a **build tool** (such as [sbt](https://www.scala-sbt.org) or [mill](https://com-lihaoyi.github.io/mill/))
    * pros: terminal-based workflow for projects of any size
    * cons: requires some additional setup and learning
* using an **IDE** such as [IntelliJ](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html) or [Metals](http://scalameta.org/metals/)
    * pros: GUI based workflow for projects of any size
    * cons: requires some additional setup and learning

These choices, with their pros and cons, are common to most programing
languages.
Feel free to use whichever option you're most comfortable with.
