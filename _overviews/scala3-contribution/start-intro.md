---
title: Getting Started
type: Chapter
description: This page describes the high level architecture for the Scala 3 compiler.
num: 2
previous-page: contribution-intro
next-page: procedures-intro
---

## First Steps

### Scala CLA

Sometime before submitting your pull request you'll want to make sure you have
signed the [Scala CLA][scala-cla]. You can read more about why we require a CLA
and what exactly is included in it [here][scala-cla].

### Making sure the team is aware

Before digging into an issue or starting on a new feature it's a good idea to
make sure an [issue][dotty-issue] or a [discussion][dotty-discussion] has been
created outlining what you plan to work on. This is both for your and the team's
benefit. It ensures you get the help you need, and also gives the compiler team
a heads-up that someone is working on an issue.

For some small changes like documentation, this isn't always necessary, but it's
never a bad idea to check.

### Required Tools

#### Essential

- [git] is essential for managing the Scala 3 code, and contributing to GitHub,
  where the code is hosted.
- A Java Virtual Machine (JDK 8 or higher), required for running the build tool.
  - download Java from [Oracle Java 8][java8], [Oracle Java 11][java11],
   or [AdoptOpenJDK 8/11][adopt]. Refer to [JDK Compatibility][compat] for Scala/Java compatibility detail.
  - Verify that the JVM is installed by running the following command in a terminal: `java -version`.
- [sbt][sbt-download], the build tool required to build the Scala 3 compiler and libraries.

#### Nice To Have

An IDE, such as [Metals] will help you develop in Scala 3 with features such as autocompletion or goto-definition,
and with the [VS Code][vs-code] text editor you can even use the Scala debugger, or create interactive worksheets for an
iterative workflow.

### Clone the Code

The code of Scala 3 is hosted on GitHub at [lampepfl/dotty]. It's best practice
to [fork] the repo you want to work on, and then send in pull requests from your
fork.

Once you've forked the repo you'll want to clone the code with the following
commands (shown using a `bash` compatible shell):

```bash
$ git clone https://github.com/<your-user-name-on-github>/dotty.git
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

There are also bash scripts that can be used in the same way. Assuming that you have cloned the Dotty repo locally, append
the following line on your `.bash_profile`:

```shell
$ export PATH=$HOME/dotty/bin:$PATH
```

and you will be able to run the corresponding commands directly from your console:

```shell
# Compile code using Dotty
$ scalac tests/pos/HelloWorld.scala

# Run it with the proper classpath
$ scala HelloWorld
```


## Starting a REPL

```bash
$ sbt
> repl
Welcome to Scala.next (pre-alpha)  (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_101).
Type in expressions to have them evaluated.
Type :help for more information.
scala>
```

or via bash:

```bash
$ scala
```
## Publish to local repository

To test our cloned compiler on local projects:

```bash
$ sbt publishLocal
```
Then in the `build.sbt` file of a test project:

```bash
ThisBuild / scalaVersion := "<dotty-version>-bin-SNAPSHOT"
```
where `dotty-version` can be found in the file `project/Build.scala`, like `3.0.0-M2`


## Generating Documentation

To generate this page and other static page docs, run
```bash
$ sbt
> scaladoc/generateScalaDocumentation
```
For more information, see `scaladoc/README.md`.


[git]: https://git-scm.com
[Metals]: https://scalameta.org/metals/
[vs-code]: https://code.visualstudio.com
[lampepfl/dotty]: https://github.com/lampepfl/dotty
[sbt-download]: https://www.scala-sbt.org/download.html
[java8]: https://www.oracle.com/java/technologies/javase-jdk8-downloads.html
[java11]: https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
[adopt]: https://adoptopenjdk.net/
[compat]: /overviews/jdk-compatibility/overview.html
[scala-cla]: https://www.lightbend.com/contribute/cla/scala
[dotty-issue]: https://github.com/lampepfl/dotty/issues
[dotty-discussion]: https://github.com/lampepfl/dotty/discussions
[fork]: https://docs.github.com/en/get-started/quickstart/fork-a-repo
