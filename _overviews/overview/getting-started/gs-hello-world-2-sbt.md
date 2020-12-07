---
title: Create a “Hello, World” Project
description: This page shows how to create and run a “Hello, world” project using Scala 3 and sbt
---


This page shows how to create a Scala 3 “Hello, world” example with [sbt](https://www.scala-sbt.org/).

Like Ant, Maven, and Gradle, [sbt](https://www.scala-sbt.org) is a build tool you use to build real-world applications. Like Maven, sbt uses “convention over configuration,” so you can create a “Hello, world” project in just a few steps. We’ll do that manually at first so you can see how sbt works, and then show an automated way to do a similar thing.



## Create an sbt project

To create a “Hello, world” project using sbt, first create a *HelloWorld* directory, and then move into that directory:

```sh
$ mkdir HelloWorld
$ cd HelloWorld
```

Next, sbt’s main configuration file is named *build.sbt*, so create that file in this directory, and put these contents in it:

```scala
name := "HelloWorld"
version := "0.1"
scalaVersion := "3.0.0-M2"
```

With the current Scala 3 “milestone” releases, using Scala 3 with sbt currently requires a “helper” file in a directory named *project*, so create that directory:

```sh
$ mkdir project
```

Then create a file named *project/plugins.sbt*, and put this configuration line in that file:

```scala
addSbtPlugin("ch.epfl.lamp" % "sbt-dotty" % "0.4.6")
```

<!-- TODO: update this when it’s no longer needed -->
>This configuration step will eventually go away, but it’s currently required in early December, 2020.

For a simple project like this, that’s all you have to do to configure an sbt build.



## Create and run your code

Now you’re ready to create your “Hello, world” code. In the root directory of your project — right next to the *build.sbt* file — create a new file named *Hello.scala*, and put these contents in that file:

```scala
@main def hello = println("Hello, world")
```

Now all of the pieces are in place, so you can compile and run that code with this `sbt` command:

```sh
$ sbt run
```

When that command runs, you should see output like this:

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

<!-- TODO: another possible way to do this is to let readers clone a Github repo; but i think this step-by-step process has its own merits -->



## Discussion

When you create a small application with sbt like this, you can put your source code file in the project’s root directory as we just did. However, in the real world you’ll generally have many source code files, so by convention, you put your Scala files under this directory:

```sh
src/main/scala
```

Then you put your test files under this directory:

```sh
src/test/scala
```

For instance, if you’re working on an application named “Hello” for a company with the domain name *acme.com*, you’ll typically organize your source code and test code files like this:

```sh
# source code
src/main/scala/com/acme/hello/Hello.scala

# test code
src/test/scala/com/acme/hello/HelloTests.scala
```


### Initial sbt directory structure

Furthermore, when you first create an sbt directory structure to support Scala and Java source code files and test files, along with other resources, your complete initial sbt directory structure looks like this:

<!-- TODO: plugins.sbt will not be needed later -->
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



## More sbt information

While these commands show how to *manually* create an sbt project, you can use other commands to automate this initial setup process. Those commands are demonstrated in the [Scala Tools chapter](scala-tools.md).







