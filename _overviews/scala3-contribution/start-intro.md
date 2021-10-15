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
- A Java Virtual Machine (JDK 8 or higher), required for running the build tool.
  - download Java from [Oracle Java 8][java8], [Oracle Java 11][java11],
   or [AdoptOpenJDK 8/11][adopt]. Refer to [JDK Compatibility][compat] for Scala/Java compatibility detail.
  - Verify that the JVM is installed by running the following command in a terminal: `java -version`.
- [sbt][sbt-download], the build tool required to build the Scala 3 compiler and libraries.

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

To verify that you can build the code, you can use `scala3/scalac` and `scala3/scala` to build
and run a test case, as shown in the next snippet:
```bash
$ sbt
sbt:scala3> scala3/scalac tests/pos/HelloWorld.scala
sbt:scala3> scala3/scala HelloWorld
hello world
```


[git]: https://git-scm.com
[Metals]: https://scalameta.org/metals/
[vs-code]: https://code.visualstudio.com
[lampepfl/dotty]: https://github.com/lampepfl/dotty
[sbt-download]: https://www.scala-sbt.org/download.html
[java8]: https://www.oracle.com/java/technologies/javase-jdk8-downloads.html
[java11]: https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
[adopt]: https://adoptopenjdk.net/
[compat]: /overviews/jdk-compatibility/overview.html
