---
title: Getting Started
type: Chapter
description: This page describes the high level architecture for the Scala 3 compiler.
num: 2
previous-page: contribution-intro
next-page: procedures-intro
---

## First Steps

### Required Tools

#### Essential

- [git] is essential for managing the Scala 3 code, and contributing to GitHub, where the code is hosted.

- The following dependencies can be installed with [Coursier] CLI by running `cs setup`, (see
  [Single command Scala setup][cs-setup-blog]) including:
  - A Java Virtual Machine (JDK 8 or higher), required for running the build tool. Verify that JVM is
    installed by running the following command in a terminal: `java -version`.
  - [sbt], the build tool required to build the Scala 3 compiler and libraries.

#### Nice To Have

An IDE, such as [Metals] will help you develop in Scala 3 with features such as goto-definition,
and with the [VS Code][vs-code] text editor you can even create interactive worksheets for an
iterative workflow.

### Clone the Code
The code of Scala 3 is hosted on GitHub at [lampepfl/dotty].

Download the code with the following commands (shown using a `bash` compatible shell):

```bash
$ cd workspace # or, replace `workspace` with any other directory you prefer
$ git clone https://github.com/lampepfl/dotty.git
$ cd dotty
```

## Verify your installation

To verify that we can build the code, we will use `scala3/scalac` and `scala3/scala` to build
and run a test case:
```bash
$ sbt
sbt:scala3> scala3/scalac tests/pos/HelloWorld.scala
sbt:scala3> scala3/scala HelloWorld
hello world
```


[git]: https://git-scm.com
[cs-setup-blog]: https://alexarchambault.github.io/posts/2020-09-21-cs-setup.html
[sbt]: https://www.scala-sbt.org/
[Metals]: https://scalameta.org/metals/
[Coursier]: https://get-coursier.io/docs/cli-installation
[vs-code]: https://code.visualstudio.com
[lampepfl/dotty]: https://github.com/lampepfl/dotty
