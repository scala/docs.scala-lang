---
layout: singlepage-overview
title: Getting Started with Scala 3
---



This page describes how to get started with Scala 3. There are two main approaches, depending on your needs.

1. If you want to experiment with Scala 3 right away, you can [run it in your browser](#run-in-browser).
1. If you want to build a Scala 3 project on your computer, you just need to [set up Scala 3 on your computer](#install-tools). After that you can start creating projects, such as [creating a “Hello, world” project with sbt](#hello-world-example).

The sections below take you through the necessary steps.



## <a name="run-in-browser"></a>Run Scala in your browser

To start experimenting with Scala 3 right away, use <a href="https://scastie.scala-lang.org/?target=dotty" target="_blank">the “Scastie” web application in your browser</a>. Scastie is an online “playground” where you can experiment with Scala examples to see how things work.

<!-- TODO: provide some examples here? or, it would be nice if we could preload a Scastie session with some examples. -->



## <a name="install-tools"></a>Set up Scala 3 on your computer

[sbt](https://www.scala-sbt.org) is a commonly-used Scala build tool. To use it to create a Scala 3 project on your computer, you just need to install:

- The Java 8 or newer
- sbt 1.4 or newer

Once you have those two tools installed, you can jump right to the [“Creating a ‘Hello, world’ project”](#hello-world-example) section of this page.


### If you don’t have those tools installed

If you don’t already have Java and sbt installed on your system, and you’d like a simple way to install them — along with other popular tools in the Scala ecosystem — a great approach is to use a tool named [Coursier](https://get-coursier.io/docs/cli-overview).

Coursier is an “artifact-fetching” tool written in Scala. It’s designed to automatically fetch dependencies for you and works in parallel, so the artifacts you need are downloaded as rapidly as possible.

### Installing Coursier

The <a href="https://get-coursier.io/docs/cli-installation" target="_blank">Coursier installation page</a> shows how to install Coursier and its `cs` command on macOS, Windows, and Linux systems. See that page for how to install Coursier, and then come back to this page.


### Run the Coursier setup command

<!-- TODO: need to be more clear about what JDK is installed -->
With Coursier’s `cs` command-line tool installed, run this `cs setup` command to install a JDK, sbt, and the other tools mentioned above:

```sh
$ cs setup
```
<!-- TODO: show the Coursier output here -->

>If you prefer more control on what `cs` does, see [its “setup” command page](https://get-coursier.io/docs/cli-setup) for more configuration options.

After that command runs, you can verify that the tools you need are installed on your system and in your `PATH` with these commands:

```sh
$ java -version
$ sbt --script-version
```

The output of those commands should show that you now have Java 11 and sbt 1.4.4 or newer installed. Assuming that worked, you’re now ready to create a “Hello, world” project with Scala 3 and sbt.
<!-- TODO: verify that it installs Java 11 -->


### What Coursier installs

<!-- TODO: be more clear about “if it’s not already installed” -->
That command installs all of the following software, if it’s not already installed:

- A JDK
- The [sbt](https://www.scala-sbt.org) and [mill](https://www.lihaoyi.com/mill) build tools
- [Ammonite](https://ammonite.io), an enhanced REPL
- [scalafmt](https://scalameta.org/scalafmt), the Scala formatter
- The [Coursier CLI](https://get-coursier.io/docs/cli-overview), to install further Scala-based applications
- The `scala` and `scalac` command-line tools
<!-- TODO: be more clear about what JDK is installed -->

Later, when you want to update your tools, use this command to update the installation:

```sh
cs update
```

## <a name="hello-world-example"></a>Create a “Hello, world” example with sbt

Like Ant, Maven, and Gradle, sbt is a build tool that you use to build real-world applications. Like Maven, sbt uses “convention over configuration,” so you can create a “Hello, world” project in just a few steps. We’ll do that manually at first so you can see how sbt works, and then show a more automated way to do a similar thing.

### Create an sbt project

To create a “Hello, world” project using sbt, first create a *HelloWorld* directory, and then move into that directory:

```sh
$ mkdir HelloWorld
$ cd HelloWorld
```

Next, sbt’s main configuration file is named *build.sbt*, so create that file in this directory, and put these contents in it:

```scala
name := "HelloWorld"
version := "0.1"
scalaVersion := "{{ site.scala-3-version }}"
```

Using sbt with the milestone releases of Scala 3 in December, 2020, currently requires a “helper” configuration file in a directory named *project*, so create that directory:

```sh
$ mkdir project
```

Then create a file named *project/plugins.sbt*, and put this configuration line in that file:

```scala
addSbtPlugin("ch.epfl.lamp" % "sbt-dotty" % "{{ site.scala-3-plugin-version }}")
```


### Create and run your code

Now you’re ready to create your “Hello, world” code. In the root directory of your project — right next to the *build.sbt* file — create a new file named *Hello.scala*, and put these contents in that file:

```scala
@main def hello = println("Hello, world")
```

This is the simplest way to create a “Hello, world” application with Scala 3.

Now all the pieces are in place, so you can compile and run that code with this `sbt` command:

```sh
$ sbt run
```

When that command runs, you should see output similar to this:

```
$ sbt run
[info] welcome to sbt 1.4.4 (AdoptOpenJDK Java 11.0.9)
[info] loading settings for project HelloWorld-build from plugins.sbt ...
[info] loading project definition from project
[info] loading settings for project HelloWorld from build.sbt ...
[info] set current project to HelloWorld
[info] compiling 1 Scala source to target/scala-3.0.0-M2/classes ...
[info] running hello
Hello, world
[success] Total time: 1 s
```

Assuming that worked — congratulations, you just compiled and ran a Scala 3 application with sbt.

<!-- TODO: another possible way to do this is to let readers clone a Github repo; but i think this step-by-step process has its own merits. -->



### Discussion

When you create a small application with sbt like this, you can put your source code file in the project’s root directory like we just did. However, in the real world you’ll generally have many source code files, and you’ll want to organize them. By convention, you put your Scala application files under this directory:

```sh
src/main/scala
```

And your test files go under this directory:

```sh
src/test/scala
```

For instance, if you’re working on an application named “Hello” for a company with the domain name *acme.com*, you’ll typically put your files under a directory structure like this:

```sh
# source code
src/main/scala/com/acme/hello/Hello.scala

# test code
src/test/scala/com/acme/hello/HelloTests.scala
```

<!--
#### Initial sbt directory structure

Furthermore, when you first create an sbt directory structure to support Scala and Java source code files and test files, along with other resources, your complete initial sbt directory structure looks like this:

....
.
|-- build.sbt
|-- project
|   `-- build.properties
|   `-- plugins.sbt
`-- src
    |-- main
    |   |-- java
    |   |-- resources
    |   `-- scala
    `-- test
        |-- java
        |-- resources
        `-- scala
....
-->


### More sbt information

While these commands show how to *manually* create an sbt project, you can use other commands to automate this initial setup process. Those commands are demonstrated in the [Scala Tools chapter](/scala3/book/scala-tools.html) of the [Scala 3 Book](/scala3/book/introduction.html).

<!-- TODO: we could show how to use `sbt new` here -->



## Next steps

Now that you’ve created a first “Hello, world” example with Scala 3, you’re ready for some next steps. Consider checking out:

<!-- TODO: it would be nice to have a slightly larger application to go to that shows more about sbt, testing, and how a project is organized. like a Pizza Store application, or something more useful. -->

- [The Scala 3 Book](/scala3/book/introduction.html), which provides a set of short lessons introducing Scala’s main features
- [The migration guide](https://scalacenter.github.io/scala-3-migration-guide/) helps you to migrate your existing Scala 2 code base to Scala 3.

When you want to connect with other Scala users, there are several mailing lists and real-time chat rooms available. Check out our [Scala community page](https://scala-lang.org/community/) for a list of these resources, and for where to reach out for help.
