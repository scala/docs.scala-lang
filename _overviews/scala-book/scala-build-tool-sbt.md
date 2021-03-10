---
type: section
layout: multipage-overview
title: The most used scala build tool (sbt)
description: This page provides an introduction to the Scala Build Tool, sbt, including a simple 'Hello, world' project.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 41
outof: 54
previous-page: sbt-scalatest-intro
next-page: sbt-scalatest-tdd
---



You can use several different tools to build your Scala projects, including Ant, Maven, Gradle, and more. But a tool named [sbt](http://www.scala-sbt.org) was the first build tool that was specifically created for Scala, and these days it’s supported by [Lightbend](https://www.lightbend.com), the company that was co-founded by Scala creator Martin Odersky that also maintains Akka, the Play web framework, and more.

>If you haven’t already installed sbt, here’s a link to [its download page](http://www.scala-sbt.org/download.html).



## The sbt directory structure

Like Maven, sbt uses a standard project directory structure. If you use that standard directory structure you’ll find that it’s relatively simple to build your first projects.

The first thing to know is that underneath your main project directory, sbt expects a directory structure that looks like this:

```bash
build.sbt
project/
src/
-- main/
   |-- java/
   |-- resources/
   |-- scala/
|-- test/
   |-- java/
   |-- resources/
   |-- scala/
target/
```


## Creating a “Hello, world” sbt project directory structure

Creating this directory structure is pretty simple, and you can use a shell script like [sbtmkdirs](https://alvinalexander.com/sbtmkdirs) to create new projects. But you don’t have to use that script; assuming that you’re using a Unix/Linux system, you can just use these commands to create your first sbt project directory structure:

```bash
mkdir HelloWorld
cd HelloWorld
mkdir -p src/{main,test}/{java,resources,scala}
mkdir project target
```

If you run a `find .` command after running those commands, you should see this result:

```bash
$ find .
.
./project
./src
./src/main
./src/main/java
./src/main/resources
./src/main/scala
./src/test
./src/test/java
./src/test/resources
./src/test/scala
./target
```

If you see that, you’re in great shape for the next step.

>There are other ways to create the files and directories for an sbt project. One way is to use the `sbt new` command, [which is documented here on scala-sbt.org](http://www.scala-sbt.org/1.x/docs/Hello.html). That approach isn’t shown here because some of the files it creates are more complicated than necessary for an introduction like this.



## Creating a first *build.sbt* file

At this point you only need two more things to run a “Hello, world” project:

- A *build.sbt* file
- A *HelloWorld.scala* file

For a little project like this, the *build.sbt* file only needs to contain a few lines, like this:

```scala
name := "HelloWorld"
version := "1.0"
scalaVersion := "{{ site.scala-version }}"
```

Because sbt projects use a standard directory structure, sbt already knows everything else it needs to know.

Now you just need to add a little “Hello, world” program.



## A “Hello, world” program

In large projects, all of your Scala source code files will go under the *src/main/scala* and *src/test/scala* directories, but for a little sample project like this, you can put your source code file in the root directory of your project. Therefore, create a file named *HelloWorld.scala* in the root directory with these contents:

```scala
object HelloWorld extends App {
    println("Hello, world")
}
```

Now you can use sbt to compile your project, where in this example, your project consists of that one file. Use the `sbt run` command to compile and run your project. When you do so, you’ll see output that looks like this:

````
$ sbt run

Updated file /Users/al/Projects/Scala/Hello/project/build.properties setting sbt.version to: 0.13.15
[warn] Executing in batch mode.
[warn]   For better performance, hit [ENTER] to switch to interactive mode, or
[warn]   consider launching sbt without any commands, or explicitly passing 'shell'
[info] Loading project definition from /Users/al/Projects/Scala/Hello/project
[info] Updating {file:/Users/al/Projects/Scala/Hello/project/}hello-build...
[info] Resolving org.fusesource.jansi#jansi;1.4 ...
[info] Done updating.
[info] Set current project to Hello (in build file:/Users/al/Projects/Scala/Hello/)
[info] Updating {file:/Users/al/Projects/Scala/Hello/}hello...
[info] Resolving jline#jline;2.14.5 ...
[info] Done updating.
[info] Compiling 1 Scala source to /Users/al/Projects/Scala/Hello/target/scala-2.12/classes...
[info] Running HelloWorld 
Hello, world
[success] Total time: 4 s
````

The first time you run `sbt` it needs to download some things and can take a while to run, but after that it gets much faster. As the first comment in that output shows, it’s also faster to run sbt interactively. To do that, first run the `sbt` command by itself:

````
> sbt
[info] Loading project definition from /Users/al/Projects/Scala/Hello/project
[info] Set current project to Hello (in build file:/Users/al/Projects/Scala/Hello/)
````

The execute its `run` command like this:

````
> run
[info] Running HelloWorld 
Hello, world
[success] Total time: 0 s
````

There, that’s much faster.

If you type `help` at the sbt command prompt you’ll see a bunch of other commands you can run. But for now, just type `exit` to leave the sbt shell. You can also press `CTRL-D` instead of typing `exit`.



## See also

Here’s a list of other build tools you can use to build Scala projects are:

- [Ant](http://ant.apache.org/)
- [Gradle](https://gradle.org/)
- [Maven](https://maven.apache.org/)
- [Fury](https://propensive.com/opensource/fury)
- [Mill](https://com-lihaoyi.github.io/mill/)









